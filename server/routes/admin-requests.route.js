const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods

const router = express.Router(); // new router

// GET all admin-requests -- ADMIN ALL REQUESTS
router.get('/admin-requests', async (req, res) => {
	try {
		const adminRequests = await readJson('admin-requests.json');
		res.status(200).json(adminRequests);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// GET specific admin-requests/:id -- ADMIN SEARCH FOR REQUEST
router.get('/admin-requests/:id', async (req, res) => {
	try {
		// read file
		const adminRequests = await readJson('admin-requests.json');

		const request = adminRequests.find((admReq) => admReq.id === req.params.id);
		if (!request) return res.status(404).json({ error: 'Not found' });

		// return json
		res.status(200).json(request);
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

// PATCH update existing record -- ADMIN APPROVE/DENY REQUEST
router.patch('/admin-requests/:id', async (req, res) => {
	const { reviewedBy, status } = req.body;

	try {
		// Get all adminRequests
		const adminRequests = await readJson('admin-requests.json');
		if (!adminRequests.some((r) => r.id === req.params.id)) return res.status(404).json({ error: 'Request not found' });

		// PERFORM THE HANDLER FOR ADMIN ACTION IF STATUS IS 'APPROVED' ---------------------------------------------------
		if (status === 'APPROVE') {
			// RUN THE COMMAND
			return;
		}

		// id comes last so the body can't overwrite it
		const newRequests = adminRequests.map((r) => {
			return r.id === req.params.id
				? {
						...r,
						status,
						reviewedBy,
						reviewedAt: String(new Date.now()),
					}
				: r;
		});

		// Write updated requests back to file
		await writeJson('admin-requests.json', newRequests);

		// Respond with the updated request
		res.status(200).json(newRequests.find((r) => r.id === req.params.id));
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
	deleteGroup: ['userId', 'targetGroupId'],
	deleteChannel: ['targetGroupId', 'targetChannelId'],

	banUser: ['targetUserId'],
	kickUser: ['targetGroupId', 'targetUserId'],

	giveAdmin: ['targetUserId', 'targetGroupId'],
	revokeAdmin: ['targetUserId', 'targetGroupId'],
};

// POST new request -- FOR USERS OTHER THAN SUPER ADMIN ---------------------------------------------------------------------------------------
router.post('/admin-requests', async (req, res) => {
	// take min data from the req body
	const { type, issuerId } = req.body;
	if (!type || !issuerId) return res.status(400).json({ error: 'type and issuerId are required' });

	// pick what do we need from the body for request
	const requiredFields = REQUIRED_FIELDS[type];
	if (!requiredFields) return res.status(400).json({ error: 'Unknown type' });

	// check if anything is missing
	const missing = requiredFields.filter((f) => !req.body[f]);
	if (missing.length) return res.status(400).json({ error: `Missing: ${missing.join(', ')}` });

	try {
		// compose a new request
		const newRequest = {
			type,
			issuerId,
			...requiredFields,
			note: note ?? '',
			id: String(Date.now()),
			status: 'pending',
			createdAt: new Date().toISOString(),
			reviewedBy: null,
			reviewedAt: null,
		};

		const adminRequests = await readJson('admin-requests.json'); // read current requests state
		adminRequests.push(newRequest); // update the stored file
		await writeJson('admin-requests.json', adminRequests);
		res.status(201).json(newRequest); // 201 == created, send the new request
	} catch (err) {
		res.status(500).json({ error: 'Storage error' });
	}
});

module.exports = router;
