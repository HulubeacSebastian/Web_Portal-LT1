const express = require('express');
const store = require('../data/extraStores');
const { validateContactMessage } = require('../validation/contactValidation');

const router = express.Router();

router.post('/', function (req, res) {
  const { errors, sanitized } = validateContactMessage(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru contact.', errors });
  }

  const created = store.createContactMessage(sanitized);

  return res.status(201).json(created);
});

module.exports = router;
