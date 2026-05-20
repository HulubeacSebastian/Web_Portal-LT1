const express = require('express');
const store = require('../data/extraStores');
const { buildToken } = require('../middleware/auth');
const { validateEmail } = require('../validation/commonValidation');

const router = express.Router();

function validatePassword(password, fieldName) {
  const normalizedPassword = typeof password === 'string' ? password : '';
  const errors = {};

  if (!normalizedPassword.trim()) {
    errors[fieldName] = 'Parola este obligatorie.';
  } else if (normalizedPassword.length < 6) {
    errors[fieldName] = 'Parola trebuie sa aiba minimum 6 caractere.';
  } else if (normalizedPassword.length > 80) {
    errors[fieldName] = 'Parola poate avea maximum 80 de caractere.';
  }

  return { errors, value: normalizedPassword };
}

function validateFullName(fullName) {
  const value = typeof fullName === 'string' ? fullName.trim() : '';
  const errors = {};

  if (!value) {
    errors.name = 'Numele este obligatoriu.';
  } else if (value.length < 3) {
    errors.name = 'Numele trebuie sa aiba minimum 3 caractere.';
  } else if (value.length > 80) {
    errors.name = 'Numele poate avea maximum 80 de caractere.';
  }

  return { errors, value };
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    permissions: user.permissions
  };
}

router.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body || {};
    const emailCheck = validateEmail(email);
    const passwordCheck = validatePassword(password, 'password');
    const errors = {
      ...emailCheck.errors,
      ...passwordCheck.errors
    };

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru login.', errors });
    }

    const user = await store.getUserByEmail(emailCheck.value);
    if (!user || user.password !== passwordCheck.value) {
      return res.status(401).json({ message: 'Credentiale invalide.' });
    }

    const token = buildToken(user);
    return res.json({
      token,
      user: toPublicUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async function (req, res, next) {
  try {
    const { email, password, fullName, name } = req.body || {};
    const emailCheck = validateEmail(email);
    const nameCheck = validateFullName(fullName || name);
    const passwordCheck = validatePassword(password, 'password');
    const errors = {
      ...emailCheck.errors,
      ...nameCheck.errors,
      ...passwordCheck.errors
    };

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru inregistrare.', errors });
    }

    const existing = await store.getUserByEmail(emailCheck.value);
    if (existing) {
      return res.status(409).json({ message: 'Exista deja un cont cu acest email.' });
    }

    const user = await store.createUser({
      email: emailCheck.value,
      password: passwordCheck.value,
      fullName: nameCheck.value,
      roleName: 'user'
    });

    const token = buildToken(user);
    return res.status(201).json({
      token,
      user: toPublicUser(user)
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Exista deja un cont cu acest email.' });
    }
    return next(error);
  }
});

module.exports = router;
