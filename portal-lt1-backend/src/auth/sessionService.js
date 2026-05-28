const { prisma } = require('../db/prisma');
const { hashPassword, verifyPassword } = require('./password');
const { isMailConfigured, sendLoginOtpEmail, sendEmailVerificationEmail, sendPasswordResetEmail } = require('../services/mailService');
const {
  generateId,
  generateOtpCode,
  generateResetToken,
  hashSecret,
  shouldExposeDevCodes
} = require('./tokenUtils');

const OTP_TTL_MS = 10 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function updateUserPassword(userId, plainPassword) {
  const password = await hashPassword(plainPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password }
  });
}

async function createLoginChallenge(userId, email) {
  const code = generateOtpCode();
  const id = generateId('CHL');
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const expiresMinutes = Math.floor(OTP_TTL_MS / 60000);

  await prisma.authChallenge.create({
    data: {
      id,
      userId,
      purpose: 'login_otp',
      codeHash: hashSecret(code),
      expiresAt
    }
  });

  const payload = {
    challengeId: id,
    message: 'Cod de verificare trimis pe email. Introdu codul din 6 cifre.',
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000)
  };

  if (isMailConfigured() && email) {
    try {
      await sendLoginOtpEmail({ to: email, code, expiresMinutes });
      if (shouldExposeDevCodes()) {
        payload.devCode = code;
      }
      return payload;
    } catch (error) {
      console.error('[auth] Eroare trimitere email OTP:', error.message);
      return { error: 'Nu am putut trimite codul pe email. Incearca mai tarziu.' };
    }
  }

  if (shouldExposeDevCodes()) {
    payload.devCode = code;
    payload.message = 'Cod de verificare (dev). Introdu codul din 6 cifre.';
    return payload;
  }

  console.error('[auth] SMTP neconfigurat — OTP nu poate fi trimis pe email.');
  return { error: 'Trimiterea codului pe email nu este configurata pe server.' };
}

async function createEmailVerificationChallenge(userId, email) {
  const code = generateOtpCode();
  const id = generateId('CHL');
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const expiresMinutes = Math.floor(OTP_TTL_MS / 60000);

  await prisma.authChallenge.create({
    data: {
      id,
      userId,
      purpose: 'email_verify',
      codeHash: hashSecret(code),
      expiresAt
    }
  });

  const payload = {
    challengeId: id,
    message: 'Cod de activare trimis pe email. Introdu codul din 6 cifre (verifica si Spam).',
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000)
  };

  if (isMailConfigured() && email) {
    try {
      await sendEmailVerificationEmail({ to: email, code, expiresMinutes });
      if (shouldExposeDevCodes()) {
        payload.devCode = code;
      }
      return payload;
    } catch (error) {
      console.error('[auth] Eroare trimitere email activare:', error.message);
      return { error: 'Nu am putut trimite codul de activare. Incearca mai tarziu.' };
    }
  }

  if (shouldExposeDevCodes()) {
    payload.devCode = code;
    payload.message = 'Cod de activare (dev). Introdu codul din 6 cifre.';
    return payload;
  }

  console.error('[auth] SMTP neconfigurat — cod activare netrimis.');
  return { error: 'Trimiterea codului pe email nu este configurata pe server.' };
}

async function verifyEmailChallenge(challengeId, code) {
  const challenge = await prisma.authChallenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge || challenge.purpose !== 'email_verify' || challenge.usedAt) {
    return { error: 'Cod invalid sau expirat.' };
  }

  if (challenge.expiresAt < new Date()) {
    return { error: 'Codul a expirat. Reincearca inregistrarea.' };
  }

  if (hashSecret(code) !== challenge.codeHash) {
    return { error: 'Cod de activare incorect.' };
  }

  await prisma.$transaction([
    prisma.authChallenge.update({
      where: { id: challengeId },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: challenge.userId },
      data: { emailVerifiedAt: new Date() }
    })
  ]);

  return { userId: challenge.userId };
}

async function verifyLoginChallenge(challengeId, code) {
  const challenge = await prisma.authChallenge.findUnique({
    where: { id: challengeId }
  });

  if (!challenge || challenge.purpose !== 'login_otp' || challenge.usedAt) {
    return { error: 'Cod invalid sau expirat.' };
  }

  if (challenge.expiresAt < new Date()) {
    return { error: 'Codul a expirat. Reincearca autentificarea.' };
  }

  if (hashSecret(code) !== challenge.codeHash) {
    return { error: 'Cod de verificare incorect.' };
  }

  await prisma.authChallenge.update({
    where: { id: challengeId },
    data: { usedAt: new Date() }
  });

  return { userId: challenge.userId };
}

async function createPasswordResetChallenge(userId, email) {
  const token = generateResetToken();
  const id = generateId('RST');
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);
  const expiresMinutes = Math.floor(RESET_TTL_MS / 60000);

  await prisma.authChallenge.create({
    data: {
      id,
      userId,
      purpose: 'password_reset',
      codeHash: hashSecret(token),
      expiresAt
    }
  });

  const message = 'Email de resetare a fost trimis (verifica si folderul Spam).';
  const appBase = (process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetUrl = `${appBase}/reset-password?resetToken=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;

  if (isMailConfigured() && email) {
    try {
      await sendPasswordResetEmail({ to: email, resetUrl, expiresMinutes });
      return { message };
    } catch (error) {
      console.error('[auth] Eroare trimitere email reset:', error.message);
      return { error: 'Nu am putut trimite emailul. Incearca mai tarziu.' };
    }
  }

  if (shouldExposeDevCodes()) {
    return {
      message,
      resetToken: id,
      expiresInSeconds: Math.floor(RESET_TTL_MS / 1000),
      devResetCode: token
    };
  }

  console.log(`[auth] Reset parola user ${userId}, link: ${resetUrl}`);
  return { message };
}

async function verifyPasswordReset(resetTokenId, token, newPassword) {
  const challenge = await prisma.authChallenge.findUnique({
    where: { id: resetTokenId }
  });

  if (!challenge || challenge.purpose !== 'password_reset' || challenge.usedAt) {
    return { error: 'Link de resetare invalid sau deja folosit.' };
  }

  if (challenge.expiresAt < new Date()) {
    return { error: 'Linkul de resetare a expirat.' };
  }

  if (hashSecret(token) !== challenge.codeHash) {
    return { error: 'Token de resetare invalid.' };
  }

  await prisma.authChallenge.update({
    where: { id: resetTokenId },
    data: { usedAt: new Date() }
  });

  await updateUserPassword(challenge.userId, newPassword);
  await revokeAllUserSessions(challenge.userId);

  return { userId: challenge.userId };
}

async function createUserSession(userId) {
  const refreshToken = generateResetToken() + generateResetToken();
  const id = generateId('SES');
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await prisma.userSession.create({
    data: {
      id,
      userId,
      refreshTokenHash: hashSecret(refreshToken),
      expiresAt,
      lastUsedAt: new Date()
    }
  });

  return { sessionId: id, refreshToken, expiresAt };
}

async function findValidSession(refreshToken) {
  const hash = hashSecret(refreshToken);
  const session = await prisma.userSession.findFirst({
    where: {
      refreshTokenHash: hash,
      revokedAt: null,
      expiresAt: { gt: new Date() }
    }
  });
  return session;
}

async function touchSession(sessionId) {
  await prisma.userSession.update({
    where: { id: sessionId },
    data: { lastUsedAt: new Date() }
  });
}

async function revokeSession(refreshToken) {
  const session = await findValidSession(refreshToken);
  if (!session) return false;

  await prisma.userSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() }
  });
  return true;
}

async function revokeAllUserSessions(userId) {
  await prisma.userSession.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

module.exports = {
  verifyPassword,
  hashPassword,
  updateUserPassword,
  createLoginChallenge,
  createEmailVerificationChallenge,
  verifyLoginChallenge,
  verifyEmailChallenge,
  createPasswordResetChallenge,
  verifyPasswordReset,
  createUserSession,
  findValidSession,
  touchSession,
  revokeSession,
  revokeAllUserSessions,
  REFRESH_TTL_MS
};
