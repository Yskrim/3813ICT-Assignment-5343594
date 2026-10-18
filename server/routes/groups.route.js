const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods
const { getDB } = require('../db');

const router = express.Router(); // new router
const groups = () => getDB().collection('groups');
const users = () => getDB().collection('users');
const channels = () => getDB().collection('channels');

const NO_ID = { projection: { _id: 0 } };

// user text goes into regex -> escape special chars wont break it
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /groups — all groups (superAdmin)
// GET /groups?userId=1 — only groups where the user is a member or an admin
router.get('/groups', async (req, res) => {
	const userId = (req.query.userId ?? '').trim();
	const query = (req.query.q ?? '').trim();

	let filter = {};
	if (userId) filter = { $or: [{ memberIds: userId }, { adminIds: userId }] };
	if (query) filter = { name: { $regex: escapeRegex(query), $options: 'i' } };

	try {
		// max 20 results for search, 0 = no limit
		const list = await groups()
			.find(filter, NO_ID)
			.limit(query ? 20 : 0)
			.toArray();
		res.json(list);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// GET one group by id
router.get('/groups/:id', async (req, res) => {
	try {
		const group = await groups().findOne({ id: req.params.id }, NO_ID);
		if (!group) return res.status(404).json({ error: 'Not found' });
		res.json(group);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// POST create a group
router.post('/groups', async (req, res) => {
	const { name, adminIds, memberIds } = req.body ?? {};
	const trimmedName = typeof name === 'string' ? name.trim() : '';

	if (!trimmedName) return res.status(400).json({ error: 'name is required' });

	const newGroup = {
		id: String(Date.now()),
		name: trimmedName,
		adminIds: Array.isArray(adminIds) ? adminIds : [],
		memberIds: Array.isArray(memberIds) ? memberIds : [],
	};

	try {
		// insertOne adds _id to object -> insert a copy
		await groups().insertOne({ ...newGroup });
		res.status(201).json(newGroup);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// POST join group as member (ANY USER, from search) ---
router.post('/groups/:id/join', async (req, res) => {
	const { userId } = req.body ?? {};
	const id = typeof userId === 'string' ? userId.trim() : '';
	if (!id) return res.status(400).json({ error: 'userId is required' });

	try {
		const user = await users().findOne({ id }, { projection: { _id: 1 } });
		if (!user) return res.status(404).json({ error: 'User not found' });

		// $addToSet -> no duplicate if already member, join twice is ok
		const group = await groups().findOneAndUpdate(
			{ id: req.params.id },
			{ $addToSet: { memberIds: id } },
			{ returnDocument: 'after', ...NO_ID },
		);
		if (!group) return res.status(404).json({ error: 'Group not found' });

		// keep both sides in sync: user.groupIds + members of group channels
		await users().updateOne({ id }, { $addToSet: { groupIds: group.id } });
		await channels().updateMany({ groupId: group.id }, { $addToSet: { memberIds: id } });

		res.json(group);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

module.exports = router; // export endpoint
