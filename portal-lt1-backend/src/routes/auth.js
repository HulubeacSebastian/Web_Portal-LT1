const express = require('express');
const store = require('../data/extraStores');
const { buildAccessToken } = require('../middleware/auth');
const { validateEmail } = require('../validation/commonValidation');
const { verifyPassword, hashPassword } = require('../auth/password');
const sessionService = require('../auth/sessionService');

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
    nickname: user.nickname,
    role: user.role,
    roleDescription: user.roleDescription,
    permissions: user.permissions
  };
}

async function issueSessionTokens(user) {
  const token = buildAccessToken(user);
  const session = await sessionService.createUserSession(user.id);
  return {
    token,
    refreshToken: session.refreshToken,
    expiresIn: sessionService.REFRESH_TTL_MS,
    user: toPublicUser(user)
  };
}

/** Step 1/3 — parola (ce stii) */
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
    if (!user || !(await verifyPassword(passwordCheck.value, user.password))) {
      return res.status(401).json({ message: 'Parola sau email invalid.' });
    }

    if (!user.emailVerifiedAt) {
      const verification = await sessionService.createEmailVerificationChallenge(user.id, user.email);
      if (verification.error) {
        return res.status(503).json({ message: verification.error });
      }

      return res.status(403).json({
        message: 'Contul nu este activat. Introdu codul trimis pe email.',
        needsEmailVerification: true,
        step: 2,
        challengeId: verification.challengeId,
        expiresInSeconds: verification.expiresInSeconds,
        devCode: verification.devCode
      });
    }

    const challenge = await sessionService.createLoginChallenge(user.id, user.email);
    if (challenge.error) {
      return res.status(503).json({ message: challenge.error });
    }

    return res.json({
      step: 2,
      challengeId: challenge.challengeId,
      message: challenge.message,
      expiresInSeconds: challenge.expiresInSeconds,
      devCode: challenge.devCode
    });
  } catch (error) {
    return next(error);
  }
});

/** Step 2/3 — OTP (ce ai primit) */
router.post('/verify-otp', async function (req, res, next) {
  try {
    const { challengeId, code } = req.body || {};
    if (!challengeId || !code) {
      return res.status(400).json({ message: 'Codul si identificatorul provocarii sunt obligatorii.' });
    }

    const result = await sessionService.verifyLoginChallenge(challengeId, String(code).trim());
    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    const user = await store.getUserById(result.userId);
    if (!user) {
      return res.status(401).json({ message: 'Utilizator inexistent.' });
    }

    const tokens = await issueSessionTokens(user);
    return res.json({
      step: 3,
      ...tokens,
      message: 'Autentificare completa. Sesiune activa.'
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
    if (existing?.emailVerifiedAt) {
      return res.status(409).json({ message: 'Exista deja un cont cu acest email.' });
    }

    let user;
    if (existing && !existing.emailVerifiedAt) {
      user = await store.updatePendingRegistration(existing.id, {
        password: passwordCheck.value,
        fullName: nameCheck.value
      });
    } else {
      user = await store.createUser({
        email: emailCheck.value,
        password: passwordCheck.value,
        fullName: nameCheck.value,
        roleName: 'user'
      });
    }

    const verification = await sessionService.createEmailVerificationChallenge(user.id, user.email);
    if (verification.error) {
      return res.status(503).json({ message: verification.error });
    }

    return res.status(201).json({
      step: 2,
      challengeId: verification.challengeId,
      message: verification.message,
      expiresInSeconds: verification.expiresInSeconds,
      devCode: verification.devCode
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Exista deja un cont cu acest email.' });
    }
    return next(error);
  }
});

router.post('/register/verify-email', async function (req, res, next) {
  try {
    const { challengeId, code } = req.body || {};
    if (!challengeId || !code) {
      return res.status(400).json({ message: 'Codul si identificatorul provocarii sunt obligatorii.' });
    }

    const result = await sessionService.verifyEmailChallenge(challengeId, String(code).trim());
    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    const user = await store.getUserById(result.userId);
    if (!user) {
      return res.status(401).json({ message: 'Utilizator inexistent.' });
    }

    const tokens = await issueSessionTokens(user);
    return res.json({
      step: 3,
      ...tokens,
      message: 'Cont activat. Autentificare reusita.'
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/refresh', async function (req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token lipsa.' });
    }

    const session = await sessionService.findValidSession(refreshToken);
    if (!session) {
      return res.status(401).json({ message: 'Sesiune expirata sau invalida.' });
    }

    await sessionService.touchSession(session.id);
    const user = await store.getUserById(session.userId);
    if (!user) {
      return res.status(401).json({ message: 'Utilizator inexistent.' });
    }

    return res.json({
      token: buildAccessToken(user),
      user: toPublicUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', async function (req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken;
    if (refreshToken) {
      await sessionService.revokeSession(refreshToken);
    }
    return res.json({ message: 'Delogat cu succes.' });
  } catch (error) {
    return next(error);
  }
});

router.post('/forgot-password', async function (req, res, next) {
  try {
    const emailCheck = validateEmail(req.body?.email);
    if (emailCheck.errors.email) {
      return res.status(400).json({ message: 'Email invalid.', errors: emailCheck.errors });
    }

    const user = await store.getUserByEmail(emailCheck.value);
    if (!user) {
      return res.status(404).json({
        message: 'Nu exista un cont cu acest email.'
      });
    }

    const reset = await sessionService.createPasswordResetChallenge(user.id, user.email);
    if (reset.error) {
      return res.status(503).json({ message: reset.error });
    }

    const body = { message: reset.message };
    if (reset.resetToken) body.resetToken = reset.resetToken;
    if (reset.expiresInSeconds) body.expiresInSeconds = reset.expiresInSeconds;
    if (reset.devResetCode) body.devResetCode = reset.devResetCode;
    return res.json(body);
  } catch (error) {
    return next(error);
  }
});

router.post('/reset-password', async function (req, res, next) {
  try {
    const { resetToken, token, password } = req.body || {};
    const passwordCheck = validatePassword(password, 'password');

    if (!resetToken || !token) {
      return res.status(400).json({ message: 'Tokenul de resetare este obligatoriu.' });
    }

    if (Object.keys(passwordCheck.errors).length > 0) {
      return res.status(400).json({ message: 'Parola invalida.', errors: passwordCheck.errors });
    }

    const result = await sessionService.verifyPasswordReset(
      resetToken,
      String(token).trim(),
      passwordCheck.value
    );

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json({ message: 'Parola a fost actualizata. Te poti autentifica.' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
