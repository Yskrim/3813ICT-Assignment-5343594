const request = require('supertest');
const assert = require('assert');
const app = require('../server');

const { seedDB } = require('../seed');
const { closeDB } = require('../db');

before(async () => await seedDB());
after(async () => await closeDB());

// auth ---
describe('POST /api/auth/login', () => {
	it('logs in with correct username + password, no password in answer', async () => {
		const res = await request(app).post('/api/auth/login').send({ username: 'korton', password: '123' });

		assert.strictEqual(res.status, 201);
		assert.strictEqual(res.body.username, 'korton');
		assert.strictEqual(res.body.password, undefined);
	});

	it('rejects wrong password with 401', async () => {
		const res = await request(app).post('/api/auth/login').send({ username: 'korton', password: 'wrong' });

		assert.strictEqual(res.status, 401);
	});

	it('rejects missing username with 400', async () => {
		const res = await request(app).post('/api/auth/login').send({ password: '123' });

		assert.strictEqual(res.status, 400);
	});
});

// users ---
describe('GET /api/users/:id', () => {
	it('returns user without password', async () => {
		const res = await request(app).get('/api/users/1');

		assert.strictEqual(res.status, 200);
		assert.strictEqual(res.body.id, '1');
		assert.strictEqual(res.body.password, undefined);
	});

	it('returns 404 for unknown id', async () => {
		const res = await request(app).get('/api/users/999');
		assert.strictEqual(res.status, 404);
	});
});

// groups ---
describe('GET /api/groups', () => {
	it('returns only groups where user is member or admin', async () => {
		const res = await request(app).get('/api/groups').query({ userId: '1' });

		assert.strictEqual(res.status, 200);
		assert.ok(Array.isArray(res.body));
		for (const g of res.body) {
			assert.ok(g.memberIds.includes('1') || g.adminIds.includes('1'));
		}
	});

	it('returns 404 for unknown group', async () => {
		const res = await request(app).get('/api/groups/999');
		assert.strictEqual(res.status, 404);
	});

	it('rejects new group with empty name (400)', async () => {
		const res = await request(app).post('/api/groups').send({ name: '   ' });
		assert.strictEqual(res.status, 400);
	});
});

// channels ---
describe('GET /api/channels', () => {
	it('returns channels of a group for its member', async () => {
		const res = await request(app).get('/api/channels').query({ userId: '1', groupId: '1' });

		assert.strictEqual(res.status, 200);
		assert.ok(res.body.every((c) => c.groupId === '1'));
	});

	it('requires groupId (400)', async () => {
		const res = await request(app).get('/api/channels').query({ userId: '1' });
		assert.strictEqual(res.status, 400);
	});

	it('returns 404 for unknown channel', async () => {
		const res = await request(app).get('/api/channels/999');
		assert.strictEqual(res.status, 404);
	});
});

// users write ---
describe('PATCH /api/users/:id', () => {
	it('updates only given fields, no password in answer', async () => {
		const res = await request(app).patch('/api/users/3').send({ displayName: 'Bobby' });

		assert.strictEqual(res.status, 200);
		assert.strictEqual(res.body.displayName, 'Bobby');
		assert.strictEqual(res.body.username, '@bob'); // untouched
		assert.strictEqual(res.body.password, undefined);
	});

	it('rejects empty update (400)', async () => {
		const res = await request(app).patch('/api/users/3').send({ displayName: '  ' });
		assert.strictEqual(res.status, 400);
	});
});

describe('DELETE /api/users/:id', () => {
	it('deletes user and removes them from all groups', async () => {
		const res = await request(app).delete('/api/users/3');
		assert.strictEqual(res.status, 204);

		const gone = await request(app).get('/api/users/3');
		assert.strictEqual(gone.status, 404);

		const groups = await request(app).get('/api/groups');
		for (const g of groups.body) {
			assert.ok(!g.memberIds.includes('3'));
			assert.ok(!g.adminIds.includes('3'));
		}
	});

	it('returns 404 for unknown user', async () => {
		const res = await request(app).delete('/api/users/999');
		assert.strictEqual(res.status, 404);
	});
});

// groups write ---
describe('POST /api/groups', () => {
	it('creates group and it can be read back', async () => {
		const res = await request(app)
			.post('/api/groups')
			.send({ name: '  New Group ', adminIds: ['1'], memberIds: ['1'] });

		assert.strictEqual(res.status, 201);
		assert.strictEqual(res.body.name, 'New Group');
		assert.strictEqual(res.body._id, undefined);

		const back = await request(app).get(`/api/groups/${res.body.id}`);
		assert.strictEqual(back.status, 200);
		assert.strictEqual(back.body.name, 'New Group');
	});
});

// channels write ---
describe('POST /api/channels', () => {
	it('creates channel with group members by default', async () => {
		const res = await request(app).post('/api/channels').send({ name: 'random', groupId: '1' });

		assert.strictEqual(res.status, 201);
		assert.strictEqual(res.body.groupId, '1');
		assert.ok(res.body.memberIds.length > 0);
	});

	it('returns 404 for unknown group', async () => {
		const res = await request(app).post('/api/channels').send({ name: 'random', groupId: '999' });

		assert.strictEqual(res.status, 404);
	});
});

// admin requests ---
describe('admin requests', () => {
	it('creates request with only fields of its type', async () => {
		const res = await request(app).post('/api/admin-requests').send({
			type: 'createChannel',
			issuerId: '3',
			targetGroupId: '1',
			proposedChannelName: 'memes',
			extra: 'should be ignored',
		});

		assert.strictEqual(res.status, 201);
		assert.strictEqual(res.body.status, 'pending');
		assert.strictEqual(res.body.proposedChannelName, 'memes');
		assert.strictEqual(res.body.extra, undefined);
	});

	it('rejects request with missing fields (400)', async () => {
		const res = await request(app).post('/api/admin-requests').send({ type: 'kickUser', issuerId: '3', targetGroupId: '1' });

		assert.strictEqual(res.status, 400);
	});

	it('approves pending request once, second review is 409', async () => {
		const created = await request(app).post('/api/admin-requests').send({
			type: 'banUser',
			issuerId: '2',
			targetUserId: '4',
		});
		const id = created.body.id;

		const first = await request(app).patch(`/api/admin-requests/${id}`).send({ status: 'approved', reviewedBy: '1' });
		assert.strictEqual(first.status, 200);
		assert.strictEqual(first.body.status, 'approved');

		const second = await request(app).patch(`/api/admin-requests/${id}`).send({ status: 'rejected', reviewedBy: '1' });
		assert.strictEqual(second.status, 409);
	});

	it('rejects unknown status (400)', async () => {
		const res = await request(app).patch('/api/admin-requests/1').send({ status: 'maybe', reviewedBy: '1' });

		assert.strictEqual(res.status, 400);
	});
});

// register ---
describe('POST /api/users (register)', () => {
	it('creates plain user without password in answer, then can log in', async () => {
		const res = await request(app)
			.post('/api/users')
			.send({ username: 'newbie', displayName: 'New Bie', password: 'secret', role: 'superAdmin' });

		assert.strictEqual(res.status, 201);
		assert.strictEqual(res.body.role, 'user'); // role from body ignored
		assert.strictEqual(res.body.password, undefined);

		const login = await request(app).post('/api/auth/login').send({ username: 'newbie', password: 'secret' });
		assert.strictEqual(login.status, 201);
	});

	it('rejects taken username (409)', async () => {
		const res = await request(app).post('/api/users').send({ username: 'korton', displayName: 'Copy', password: 'secret' });
		assert.strictEqual(res.status, 409);
	});

	it('rejects invalid username (400)', async () => {
		const res = await request(app).post('/api/users').send({ username: 'a b', displayName: 'X', password: 'secret' });
		assert.strictEqual(res.status, 400);
	});
});

// group search + join ---
describe('GET /api/groups?q= (search)', () => {
	it('finds groups by part of name, case insensitive', async () => {
		const res = await request(app).get('/api/groups').query({ q: 'MUSIC' });
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(
			res.body.map((g) => g.id),
			['4'],
		);
	});

	it('treats regex chars as plain text', async () => {
		const res = await request(app).get('/api/groups').query({ q: '(' });
		assert.strictEqual(res.status, 200);
		assert.deepStrictEqual(res.body, []);
	});
});

describe('POST /api/groups/:id/join', () => {
	it('adds user to group once, then group channels are visible', async () => {
		const res = await request(app).post('/api/groups/4/join').send({ userId: '1' });
		assert.strictEqual(res.status, 200);

		// second join -> still one entry
		const again = await request(app).post('/api/groups/4/join').send({ userId: '1' });
		assert.strictEqual(again.body.memberIds.filter((m) => m === '1').length, 1);

		const mine = await request(app).get('/api/groups').query({ userId: '1' });
		assert.ok(mine.body.some((g) => g.id === '4'));

		const chans = await request(app).get('/api/channels').query({ groupId: '4', userId: '1' });
		assert.strictEqual(chans.status, 200);
	});

	it('returns 404 for unknown group', async () => {
		const res = await request(app).post('/api/groups/999/join').send({ userId: '1' });
		assert.strictEqual(res.status, 404);
	});

	it('requires userId (400)', async () => {
		const res = await request(app).post('/api/groups/4/join').send({});
		assert.strictEqual(res.status, 400);
	});
});
