const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// collection
const requests = () => getDB().collection('adminRequests');

const NO_ID = { projection: { _id: 0 } };
const REVIEW_STATUSES = ['approved', 'rejected'];

// GET all admin-requests -- ADMIN ALL REQUESTS
router.get('/admin-requests', async (req, res) => {
	try {
		res.json(await requests().find({}, NO_ID).toArray());
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// GET specific admin-requests/:id -- ADMIN SEARCH FOR REQUEST
router.get('/admin-requests/:id', async (req, res) => {
	try {
		const request = await requests().findOne({ id: req.params.id }, NO_ID);
		if (!request) return res.status(404).json({ error: 'Not found' });
		res.json(request);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// PATCH update existing record -- ADMIN APPROVE/DENY REQUEST
router.patch('/admin-requests/:id', async (req, res) => {
	const { reviewedBy, status } = req.body ?? {};
	if (!REVIEW_STATUSES.includes(status)) {
		return res.status(400).json({ error: 'status must be approved or rejected' });
	}

	try {
		// only pending can be reviewed, check\update in one step
		const updated = await requests().findOneAndUpdate(
			{ id: req.params.id, status: 'pending' },
			{ $set: { status, reviewedBy, reviewedAt: new Date().toISOString() } },
			{ returnDocument: 'after', ...NO_ID },
		);
		if (updated) return res.json(updated);

		// not updated: unknown id or already reviewed
		const exists = await requests().countDocuments({ id: req.params.id }, { limit: 1 });
		if (!exists) return res.status(404).json({ error: 'Request not found' });
		res.status(409).json({ error: 'Request already reviewed' });
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// POST THE REQUEST BASED ON ITS TYPE: ------------------------------------------------------------------------------------------------------
// 'banUser' | 'deleteGroup' | 'createGroup' | 'deleteChannel' | 'deleteAccount' | 'kickUser' | 'giveAdmin' | 'revokeAdmin' | 'createChannel'

// all possible fields for one type of request.
const REQUIRED_FIELDS = {
	createGroup: ['proposedGroupName'],
	createChannel: ['targetGroupId', 'proposedChannelName'],

	deleteAccount: ['targetUserId'],
	deleteGroup: ['targetGroupId'],
	deleteChannel: ['targetGroupId', 'targetChannelId'],

	banUser: ['targetUserId'],
	kickUser: ['targetGroupId', 'targetUserId'],

	giveAdmin: ['targetUserId', 'targetGroupId'],
	revokeAdmin: ['targetUserId', 'targetGroupId'],
};

// POST new request -- FOR USERS OTHER THAN SUPER ADMIN --------------------------------------------------------------------------------
router.post('/admin-requests', async (req, res) => {
	const { type, issuerId, note } = req.body ?? {};
	if (!type || !issuerId) {
		return res.status(400).json({ error: 'type and issuerId are required' });
	}

	const requiredFields = REQUIRED_FIELDS[type];
	if (!requiredFields) return res.status(400).json({ error: 'Unknown type' });

	// check if anything is missing
	const missing = requiredFields.filter((f) => !req.body[f]);
	if (missing.length) {
		return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });
	}

	// copy only required fields of this type from body
	const typeFields = Object.fromEntries(requiredFields.map((f) => [f, req.body[f]]));

	const newRequest = {
		id: String(Date.now()),
		type,
		issuerId,
		...typeFields,
		note: typeof note === 'string' ? note.trim() : '',
		status: 'pending',
		createdAt: new Date().toISOString(),
		reviewedBy: null,
		reviewedAt: null,
	};

	try {
		// insertOne adds _id to object -> insert a copy
		await requests().insertOne({ ...newRequest });
		res.status(201).json(newRequest);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

module.exports = router;
