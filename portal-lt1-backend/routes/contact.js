const express = require('express');
const store = require('../data/extraStores');

const router = express.Router();

router.post('/', function (req, res) {
  const { sender_email, message } = req.body || {};
  if (!sender_email || !message) {
    return res.status(400).json({ message: 'sender_email si message sunt obligatorii.' });
  }

  const created = store.createContactMessage({
    sender_email: String(sender_email).trim(),
    message: String(message).trim()
  });

  return res.status(201).json(created);
});

module.exports = router;
