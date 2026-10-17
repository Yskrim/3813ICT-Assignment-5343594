const { connectDB, closeDB } = require('./db');
const { readJson } = require('./utils');

// json to collection name
const COLLECTIONS = {
	'users.json': 'users',
	'groups.json': 'groups',
	'channels.json': 'channels',
	'admin-requests.json': 'adminRequests',
};

async function seedDB() {
	const db = await connectDB();

	for (const [file, name] of Object.entries(COLLECTIONS)) {
		const docs = await readJson(file);
		const col = db.collection(name);

		await col.deleteMany({});
		if (docs.length) {
			await col.insertMany(docs);
		}
		await col.createIndex({ id: 1 }, { unique: true });
	}
}

if (require.main === module) {
	seedDB()
		.then(() => console.log('seeding complete'))
		.catch((err) => console.error('seeding failed', err))
		.finally(() => closeDB());
}

module.exports = { seedDB }