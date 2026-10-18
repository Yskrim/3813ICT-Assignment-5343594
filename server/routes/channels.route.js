const express = require('express'); //express support
const { getDB } = require('../db');

const router = express.Router(); // new router

// collections
const channels = () => getDB().collection('channels');
const groups = () => getDB().collection('groups');
const users = () => getDB().collection('users');

const NO_ID = { projection: { _id: 0 } };

// CHANNELS

// GET — channels of a group visible to the user
router.get('/channels', async (req, res) => {
	const userId = (req.query.userId ?? '').trim();
	const groupId = (req.query.groupId ?? '').trim();
	if (!userId) return res.status(400).json({ error: 'User id missing' });
	if (!groupId) return res.status(400).json({ error: 'Group id missing' });

	try {
		// user + group in parallel
		const [user, group] = await Promise.all([
			users().findOne({ id: userId }, NO_ID),
			groups().findOne({ id: groupId }, NO_ID),
		]);

		if (!user) return res.status(404).json({ error: 'User not found' });
		if (!group) return res.status(404).json({ error: 'Group not found' });

		const isMember = user.groupIds.includes(groupId) || group.memberIds.includes(userId);
		if (!isMember) {
			return res.status(403).json({ error: 'Not a member of this group' });
		}

		// empty array is ok, group has no channels yet
		const list = await channels().find({ groupId }, NO_ID).toArray();
		res.json(list);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// GET one channel by id
router.get('/channels/:id', async (req, res) => {
	try {
		const channel = await channels().findOne({ id: req.params.id }, NO_ID);
		if (!channel) return res.status(404).json({ error: 'Not found' });
		res.json(channel);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// POST create a channel (admin)
router.post('/channels', async (req, res) => {
	const { name, groupId, adminIds, memberIds } = req.body ?? {};
	const trimmedName = typeof name === 'string' ? name.trim() : '';
	if (!trimmedName || !groupId) {
		return res.status(400).json({ error: 'Name and GroupId are Required' });
	}

	try {
		const group = await groups().findOne({ id: groupId }, NO_ID);
		if (!group) return res.status(404).json({ error: 'Group not found' });

		// admins/members default to the group's
		const newChannel = {
			id: String(Date.now()),
			name: trimmedName,
			groupId,
			adminIds: Array.isArray(adminIds) ? adminIds : [...group.adminIds],
			memberIds: Array.isArray(memberIds) ? memberIds : [...group.memberIds],
		};

		// insertOne adds _id to object -> insert a copy
		await channels().insertOne({ ...newChannel });
		res.status(201).json(newChannel);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

module.exports = router; // export endpoint
