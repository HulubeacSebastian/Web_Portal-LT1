const express = require('express');
const store = require('../data/extraStores');
const { buildToken } = require('../middleware/auth');
const { validateEmail } = require('../validation/commonValidation');

const router = express.Router();

router.post('/login', function (req, res) {
  const { email, password } = req.body || {};
  const emailCheck = validateEmail(email);
  const normalizedPassword = typeof password === 'string' ? password : '';
  const errors = {};

  if (emailCheck.errors.email) {
    errors.email = emailCheck.errors.email;
  }

  if (!normalizedPassword.trim()) {
    errors.password = 'Parola este obligatorie.';
  } else if (normalizedPassword.length < 6) {
    errors.password = 'Parola trebuie sa aiba minimum 6 caractere.';
  } else if (normalizedPassword.length > 80) {
    errors.password = 'Parola poate avea maximum 80 de caractere.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru login.', errors });
  }

  const user = store.getUserByEmail(emailCheck.value);
  if (!user || user.password !== normalizedPassword) {
    return res.status(401).json({ message: 'Credentiale invalide.' });
  }

  const token = buildToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
});

module.exports = router;
