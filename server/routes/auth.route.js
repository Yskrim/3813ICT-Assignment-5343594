const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods

const router = express.Router(); // new router

// AUTH
router.post('/auth/login', async (req, res) => {
	// read body
    const { username, password } = req.body;
    if (!username) res.status(400).json({ error: 'Missing username' });
	if (!password) res.status(400).json({ error: 'Missing password' });

    // trim strings
    const usrn = username.trim();
	const pwd = password.trim();

    // empty string check
	if (!usrn) res.status(400).json({ error: 'Missing username' });
	if (!pwd) res.status(400).json({ error: 'Missing password' });

	try {
		const users = await readJson('users.json');
		const user = users.find((u) => u.username === usrn && u.password === pwd);
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
