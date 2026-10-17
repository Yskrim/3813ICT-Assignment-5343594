const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods
const { getDB } = require('../db');

const router = express.Router(); // new router
const groups = () => getDB().collection('groups');
const NO_ID = { projection: { _id: 0 } };
// GROUPS

// GET /groups — all groups (superAdmin)
// GET /groups?userId=1 — only groups where the user is a member or an admin
router.get('/groups', async (req, res) => {
	const userId = (req.query.userId ?? '').trim();

	const filter = userId ? { $or: [{ memberIds: userId }, { adminIds: userId }] } : {};
	try {
		const list = await groups().find(filter, NO_ID).toArray();
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

module.exports = router; // export endpoint
