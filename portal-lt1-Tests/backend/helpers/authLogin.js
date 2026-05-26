const request = require('supertest');

async function loginWithOtp(app, { email, password }) {
  const step1 = await request(app).post('/api/auth/login').send({ email, password });
  if (step1.statusCode !== 200) {
    return step1;
  }

  const code = step1.body.devCode;
  if (!code) {
    throw new Error('Lipseste devCode in raspunsul de login (NODE_ENV=test?).');
  }

  return request(app).post('/api/auth/verify-otp').send({
    challengeId: step1.body.challengeId,
    code
  });
}

module.exports = {
  loginWithOtp
};
