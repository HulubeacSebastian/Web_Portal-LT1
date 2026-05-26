const { MongoClient } = require('mongodb');

let client;
let db;

async function connectMongo() {
  if (db) return db;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB || 'portal_lt1_chat';

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

async function getChatCollection() {
  const database = await connectMongo();
  const collection = database.collection('messages');
  await collection.createIndex({ sentAt: -1 });
  return collection;
}

async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectMongo,
  getChatCollection,
  closeMongo
};
