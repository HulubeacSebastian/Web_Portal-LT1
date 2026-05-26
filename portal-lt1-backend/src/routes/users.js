const express = require('express');
const store = require('../data/extraStores');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function toProfile(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    nickname: user.nickname,
    role: user.role,
    roleDescription: user.roleDescription,
    permissions: user.permissions
  };
}

function validateNickname(nickname) {
  const value = typeof nickname === 'string' ? nickname.trim() : '';
  const errors = {};

  if (!value) {
    return { errors, value: '' };
  }

  if (value.length < 2) {
    errors.nickname = 'Nickname-ul trebuie sa aiba minimum 2 caractere.';
  } else if (value.length > 32) {
    errors.nickname = 'Nickname-ul poate avea maximum 32 de caractere.';
  } else if (!/^[\p{L}\p{N}_.-]+$/u.test(value)) {
    errors.nickname = 'Nickname-ul poate contine doar litere, cifre, punct, cratima si underscore.';
  }

  return { errors, value };
}

router.get('/profile', requireAuth, async function (req, res, next) {
  try {
    const user = await store.getUserById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
    }

    return res.json(toProfile(user));
  } catch (error) {
    return next(error);
  }
});

router.patch('/profile', requireAuth, async function (req, res, next) {
  try {
    const nicknameCheck = validateNickname(req.body?.nickname);
    if (Object.keys(nicknameCheck.errors).length > 0) {
      return res.status(400).json({ message: 'Nickname invalid.', errors: nicknameCheck.errors });
    }

    const user = await store.updateUserProfile(req.user.sub, { nickname: nicknameCheck.value });
    return res.json(toProfile(user));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
