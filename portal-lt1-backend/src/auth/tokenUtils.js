const crypto = require('crypto');

function hashSecret(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function generateId(prefix) {
  return `${prefix}-${crypto.randomBytes(12).toString('hex')}`;
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateResetToken() {
  return crypto.randomBytes(24).toString('hex');
}

function shouldExposeDevCodes() {
  return process.env.NODE_ENV === 'test' || process.env.AUTH_EXPOSE_DEV_CODES === 'true';
}

module.exports = {
  hashSecret,
  generateId,
  generateOtpCode,
  generateResetToken,
  shouldExposeDevCodes
};
