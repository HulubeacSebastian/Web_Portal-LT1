const { getChatCollection } = require('./mongoClient');

const DEFAULT_ROOM = 'general';
const HISTORY_LIMIT = 80;

async function saveMessage(payload) {
  const collection = await getChatCollection();
  const document = {
    room: payload.room || DEFAULT_ROOM,
    userId: payload.userId,
    displayName: payload.displayName,
    role: payload.role || 'user',
    text: payload.text,
    sentAt: new Date()
  };

  const result = await collection.insertOne(document);

  return {
    id: String(result.insertedId),
    room: document.room,
    userId: document.userId,
    displayName: document.displayName,
    role: document.role,
    text: document.text,
    sentAt: document.sentAt.toISOString()
  };
}

async function listRecentMessages(room = DEFAULT_ROOM, limit = HISTORY_LIMIT) {
  const collection = await getChatCollection();
  const rows = await collection
    .find({ room })
    .sort({ sentAt: -1 })
    .limit(limit)
    .toArray();

  return rows
    .reverse()
    .map((row) => ({
      id: String(row._id),
      room: row.room,
      userId: row.userId,
      displayName: row.displayName,
      role: row.role,
      text: row.text,
      sentAt: row.sentAt.toISOString()
    }));
}

module.exports = {
  DEFAULT_ROOM,
  HISTORY_LIMIT,
  saveMessage,
  listRecentMessages
};
