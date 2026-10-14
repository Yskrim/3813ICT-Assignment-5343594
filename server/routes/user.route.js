// USERS
const express = require('express'); //express support
const { readJson, writeJson } = require('../utils'); //r/w methods

const router = express.Router(); // new router

// GET all users (SUPERADMIN only) ---------------------------------------------------------------------------
router.get('/users', async (req, res) => {
	// VERIFY THE OWNER -- TODO

	const users = await readJson('users.json');
	const safeUsers = users.map((u) => {
		const { password: _discarded, ...safeUser } = u;
		return safeUser;
	});
	res.json(safeUsers);
});

// GET:id -- user by id (PUBLIC FOR GROUPS or SEARCH) --------------------------------------------------------
router.get('/users/:id', async (req, res) => {
	const users = await readJson('users.json');
	const user = users.find((u) => u.id === req.params.id);
	if (!user) return res.status(404).json({ error: 'Not found' });

	const { password: _discarded, ...safeUser } = user;
	res.json(safeUser);
});

// DELETE user account (SAME USER ONLY) ----------------------------------------------------------------------
router.delete('/users/:id', async (req, res) => {
	// VERIFY THE OWNER -- TODO

	const users = await readJson('users.json');

	const index = users.findIndex((u) => u.id === req.params.id);
	if (index === -1) return res.status(404).json({ error: 'Not found' });

	// DELETE USER FROM ALL THEIR GROUPS -- TODO
	// DELETE USER FROM ALL THEIR CHANNELS -- TODO
	// DELETE USER'S MESSAGES FROM ALL CHANNELS -- TODO

	// DELETE USER FROM USERS LIST
	users.splice(index, 1);
	await writeJson('users.json', users);

	res.status(204).send();
});

// PATCH update user (SAME USER ONLY) -----------------------------------------------------------------------
router.patch('/users/:id', async (req, res) => {
	// VERIFY THE OWNER -- TODO

	const id = req.params.id;
	const { displayName, avatarUrl, password } = req.body;

	const users = await readJson('users.json');
	const index = users.findIndex((u) => u.id === id);
	if (index === -1) return res.status(404).json({ error: 'User not found' });

	const user = users[index];
    user = { 
        ...user,
        displayName: displayName || user.displayName,
        avatarUrl: avatarUrl || user.avatarUrl,
        password: password || user.password,
    };
	await writeJson('users.json', users);

	const { password: _, ...safeUser } = users[index];
	res.json(safeUser);
});

module.exports = router; // export endpoint
