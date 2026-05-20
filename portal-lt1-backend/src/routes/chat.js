const express = require('express');
const chatStore = require('../chat/chatStore');
const { requireAuth } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');

const router = express.Router();

router.get('/messages', requireAuth, requirePermission('chat:use'), async function (req, res, next) {
  try {
    const messages = await chatStore.listRecentMessages();
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
