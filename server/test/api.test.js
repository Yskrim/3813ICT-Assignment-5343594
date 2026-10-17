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
      const res = await request(app)
        .post('/api/channels')
        .send({ name: 'random', groupId: '1' });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.groupId, '1');
      assert.ok(res.body.memberIds.length > 0);
    });

    it('returns 404 for unknown group', async () => {
      const res = await request(app)
        .post('/api/channels')
        .send({ name: 'random', groupId: '999' });

      assert.strictEqual(res.status, 404);
    });
  });