const { MongoClient } = require('mongodb');

// connection
const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB ?? 'chat';
const client = new MongoClient(url);

let db = null;

// call on server start
async function connectDB() {
    if(db) return db;
    await client.connect();
    db = client.db(dbName);
    console.log('MongoDB connected: ', dbName);
    return db;
}

function getDB() {
    if(!db) throw new Error('DB not connected');
    return db;
}

async function closeDB(){
    await client.close();
    db = null;
}

module.exports = { connectDB, getDB, closeDB }