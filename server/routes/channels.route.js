const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods

const router = express.Router(); // new router

// CHANNELS

// GET /channels?userId=1&groupId=2 — channels of a group visible to the user
router.get('/channels', async (req, res) => {
	const userId = (req.query.userId ?? '').trim();
	const groupId = (req.query.groupId ?? '').trim();
	if (!userId) return res.status(400).json({ error: 'User id missing' });
	if (!groupId) return res.status(400).json({ error: 'Group id missing' });

	try {
		const [channels, users, groups] = await Promise.all([
			readJson('channels.json'),
			readJson('users.json'),
			readJson('groups.json'),
		]);

		const user = users.find((u) => u.id === userId);
		if (!user) return res.status(404).json({ error: 'User not found' });

		const group = groups.find((g) => g.id === groupId);
		if (!group) return res.status(404).json({ error: 'Group not found' });

		const isMember = user.groupIds.includes(groupId) || group?.memberIds.includes(userId);
		if (!isMember) return res.status(403).json({ error: 'Not a member of this group' });

		// empty array is a valid answer: the group simply has no channels yet
		res.json(channels.filter((c) => c.groupId === groupId));
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// GET one channel by id
router.get('/channels/:id', async (req, res) => {
	try {
		const channels = await readJson('channels.json');
		const channel = channels.find((c) => c.id === req.params.id);
		if (!channel) return res.status(404).json({ error: 'Not found' });
		res.json(channel);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// POST create a channel (admin)
router.post('/channels', async (req, res) => {
	const { name, groupId, adminIds, memberIds } = req.body ?? {};
	const trimmedName = (name ?? '').trim();
	if (!trimmedName || !groupId) return res.status(400).json({ error: 'Name and GroupId are Required' });

	try {
		const [channels, groups] = await Promise.all([readJson('channels.json'), readJson('groups.json')]);

		const group = groups.find((g) => g.id === groupId);
		if (!group) return res.status(404).json({ error: 'Group not found' });

		// only whitelisted fields; admins/members default to the group's
		const newChannel = {
			id: String(Date.now()),
			name: trimmedName,
			groupId,
			adminIds: Array.isArray(adminIds) ? adminIds : [...group.adminIds],
			memberIds: Array.isArray(memberIds) ? memberIds : [...group.memberIds],
		};

		channels.push(newChannel);
		await writeJson('channels.json', channels);
		res.status(201).json(newChannel);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

module.exports = router; // export endpoint
