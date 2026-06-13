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

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Nu ai permisiunea necesara pentru aceasta actiune.' });
  }
  return next();
}

const ALLOWED_ROLES = new Set(['elev', 'profesor', 'admin']);

function validateRoleName(input) {
  const value = typeof input === 'string' ? input.trim().toLowerCase() : '';
  if (!ALLOWED_ROLES.has(value)) {
    return { error: 'Rol invalid. Rolurile permise: elev, profesor, admin.' };
  }
  return { value };
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

router.get('/', requireAuth, requireAdmin, async function (req, res, next) {
  try {
    const users = await store.listUsersWithLastLogin();
    return res.json(
      users.map((user) => ({
        ...toProfile(user),
        last_login_at: user.last_login_at || null
      }))
    );
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', requireAuth, requireAdmin, async function (req, res, next) {
  try {
    const user = await store.getUserAdminDetails(String(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
    }
    return res.json({
      ...toProfile(user),
      last_login_at: user.last_login_at || null
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/role', requireAuth, requireAdmin, async function (req, res, next) {
  try {
    const check = validateRoleName(req.body?.role);
    if (check.error) {
      return res.status(400).json({ message: check.error });
    }
    const updated = await store.setUserRole(String(req.params.id), check.value);
    if (!updated) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
    }
    return res.json(toProfile(updated));
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
