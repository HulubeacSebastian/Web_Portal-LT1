const express = require('express');
const chatStore = require('../chat/chatStore');
const { requireAuth } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();
const { connectMongo } = require('../chat/mongoClient');

router.get('/health', async function (req, res, next) {
  try {
    await connectMongo();
    return res.json({ status: 'ok', storage: 'mongodb' });
  } catch (error) {
    return res.status(503).json({ status: 'error', message: error.message });
  }
});

router.get('/messages', requireAuth, requirePermission('chat:use'), async function (req, res, next) {
  try {
    const messages = await chatStore.listRecentMessages();
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
