// USERS
const express = require('express'); //express support
const { getDB } = require('../db');

const router = express.Router(); // new router

// COLLECITONS
const users = () => getDB().collection('users');
const groups = () => getDB().collection('groups');
const channels = () => getDB().collection('channels');
const messages = () => getDB().collection('messages');

// safe projection
const SAFE = { projection: { _id: 0, password: 0 } };

// GET all users (SUPERADMIN only) ---------------------------------------------------------------------------
router.get('/users', async (req, res) => {
	res.json(await users().find({}, SAFE).toArray());
});

// GET:id -- user by id (PUBLIC FOR GROUPS or SEARCH) --------------------------------------------------------
router.get('/users/:id', async (req, res) => {
	const user = await users().findOne({ id: req.params.id }, SAFE);
	if (!user) return res.status(404).json({ error: 'Not found' });
	res.json(user);
});

// DELETE user account (SAME USER ONLY) ----------------------------------------------------------------------
router.delete('/users/:id', async (req, res) => {
	const id = req.params.id;

	// DELETE USER FROM ALL THEIR GROUPS
	const { deletedCount } = await users().deleteOne({ id });
	if (deletedCount === 0) return res.status(404).json({ error: 'Not found' });

	// DELETE USER FROM ALL THEIR CHANNELS
	const pullUser = { $pull: { memberIds: id, adminIds: id } };
	await groups().updateMany({}, pullUser);
	await channels().updateMany({}, pullUser);

	// DELETE USER'S MESSAGES FROM ALL CHANNELS
	await messages().deleteMany({ senderId: id });

	res.status(204).send();
});

// PATCH update user (SAME USER ONLY) -----------------------------------------------------------------------
router.patch('/users/:id', async (req, res) => {
	const { displayName, avatarUrl, password } = req.body ?? {};

	// only fields that were sent and not empty
	const changes = {};
	if (typeof displayName === 'string' && displayName.trim()) changes.displayName = displayName.trim();
	if (typeof avatarUrl === 'string' && avatarUrl.trim()) changes.avatarUrl = avatarUrl.trim();
	if (typeof password === 'string' && password.trim()) changes.password = password.trim();

	if (!Object.keys(changes).length) return res.status(400).json({ error: 'No data provided' });

	// $set changes only given fields, returns doc after update
	const updatedUser = await users().findOneAndUpdate(
		{ id: req.params.id },
		{ $set: changes },
		{ returnDocument: 'after', ...SAFE },
	);
	if (!updatedUser) return res.status(404).json({ error: 'User not found' });

	res.json(updatedUser);
});

module.exports = router; // export endpoint
