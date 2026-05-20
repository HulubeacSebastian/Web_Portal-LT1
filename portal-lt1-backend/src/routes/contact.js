const express = require('express');
const store = require('../data/extraStores');
const { validateContactMessage } = require('../validation/contactValidation');

const router = express.Router();

router.post('/', async function (req, res, next) {
  try {
    const { errors, sanitized } = validateContactMessage(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru contact.', errors });
    }

    const created = await store.createContactMessage(sanitized);

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
