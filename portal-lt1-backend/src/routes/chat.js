const express = require('express');
const chatStore = require('../chat/chatStore');
const { requireAuth } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();
const { connectMongo } = require('../chat/mongoClient');

// Vercel: nu tine o conexiune WebSocket persistenta si nu are acces la MongoDB-ul local.
// Chat-ul e dezactivat temporar pe acest mediu de gazduire.
const chatDisabled = Boolean(process.env.VERCEL);

if (chatDisabled) {
  router.use(function (req, res) {
    return res.status(503).json({ message: 'Chat-ul este temporar indisponibil pe acest mediu de gazduire.' });
  });
} else {
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
}

module.exports = router;
