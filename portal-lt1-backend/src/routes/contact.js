const express = require('express');
const store = require('../data/extraStores');
const { validateContactMessage } = require('../validation/contactValidation');
const { isContactMailConfigured, sendContactMessageEmail } = require('../services/mailService');

const router = express.Router();

router.post('/', async function (req, res, next) {
  try {
    const { errors, sanitized } = validateContactMessage(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru contact.', errors });
    }

    const created = await store.createContactMessage(sanitized);

    let emailSent = false;
    if (isContactMailConfigured()) {
      await sendContactMessageEmail({
        fromEmail: sanitized.sender_email,
        fromName: sanitized.sender_name,
        message: sanitized.message,
        messageId: created.id,
        sentAt: created.sent_at
      });
      emailSent = true;
    }

    return res.status(201).json({ ...created, email_sent: emailSent });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
