const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods
const { getDB } = require('../db');

const router = express.Router(); // new router

// users collection should be connected before any operation
const users = () => getDB().collection('users');

// AUTH
router.post('/auth/login', async (req, res) => {
	// read body
	const { username, password } = req.body;
	if (!username) return res.status(400).json({ error: 'Missing username' });
	if (!password) return res.status(400).json({ error: 'Missing password' });

	// trim strings
	const usrn = username.trim();
	const pwd = password.trim();

	// empty string check
	if (!usrn) return res.status(400).json({ error: 'Missing username' });
	if (!pwd) return res.status(400).json({ error: 'Missing password' });

	try {
        // db checks records, id and password never leave server
		const user = await users().findOne(
            { username: usrn, password: pwd },
            { projection: { _id:0, password:0 }},
        );

		// User not found
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });

		// FROM THE DATA RECORD: discard password and return the rest as authorisedUser for session storage
		const { password: _discarded, ...authorisedUser } = user;
		res.status(201).json(authorisedUser);
	} catch (err) {
		res.status(500).json({ error: 'Some err' });
	}
});

module.exports = router; // export endpoint
