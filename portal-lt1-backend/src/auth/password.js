const bcrypt = require('bcryptjs');

const ROUNDS = 10;

async function hashPassword(plain) {
  return bcrypt.hash(plain, ROUNDS);
}

async function verifyPassword(plain, hash) {
  if (!hash) return false;
  if (!hash.startsWith('$2')) {
    return plain === hash;
  }
  return bcrypt.compare(plain, hash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
