const request = require('supertest');
const app = require('../../portal-lt1-backend/src/app');
const { resetExtraStores } = require('../../portal-lt1-backend/src/data/extraStores');
const { loginWithOtp, registerWithEmailVerification } = require('./helpers/authLogin');

describe('Auth API', () => {
  beforeEach(async () => {
    await resetExtraStores();
  });

  it('registers a new user after email verification and returns tokens', async () => {
    const registerStep = await request(app).post('/api/auth/register').send({
      fullName: 'Elev Nou',
      email: 'elevnou@test.ro',
      password: 'parola123'
    });

    expect(registerStep.statusCode).toBe(201);
    expect(registerStep.body.step).toBe(2);
    expect(registerStep.body.challengeId).toBeDefined();
    expect(registerStep.body.devCode).toBeDefined();
    expect(registerStep.body.token).toBeUndefined();

    const verifyStep = await request(app).post('/api/auth/register/verify-email').send({
      challengeId: registerStep.body.challengeId,
      code: registerStep.body.devCode
    });

    expect(verifyStep.statusCode).toBe(200);
    expect(verifyStep.body.token).toBeDefined();
    expect(verifyStep.body.refreshToken).toBeDefined();
    expect(verifyStep.body.user.role).toBe('user');
    expect(verifyStep.body.user.permissions).toEqual(
      expect.arrayContaining(['documents:read', 'chat:use'])
    );
    expect(verifyStep.body.user.permissions).not.toContain('documents:create');

    const loginResponse = await loginWithOtp(app, {
      email: 'elevnou@test.ro',
      password: 'parola123'
    });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.email).toBe('elevnou@test.ro');
  });

  it('blocks login until email is verified and allows activation via login flow', async () => {
    const registerStep = await request(app).post('/api/auth/register').send({
      fullName: 'Elev Pending',
      email: 'pending@test.ro',
      password: 'parola123'
    });
    expect(registerStep.statusCode).toBe(201);

    const blockedLogin = await request(app).post('/api/auth/login').send({
      email: 'pending@test.ro',
      password: 'parola123'
    });
    expect(blockedLogin.statusCode).toBe(403);
    expect(blockedLogin.body.needsEmailVerification).toBe(true);
    expect(blockedLogin.body.devCode).toBeDefined();

    const activated = await request(app).post('/api/auth/register/verify-email').send({
      challengeId: blockedLogin.body.challengeId,
      code: blockedLogin.body.devCode
    });
    expect(activated.statusCode).toBe(200);
    expect(activated.body.token).toBeDefined();
  });

  it('rejects duplicate registration and invalid payloads', async () => {
    const first = await registerWithEmailVerification(app, {
      fullName: 'Elev Nou',
      email: 'elevnou@test.ro',
      password: 'parola123'
    });
    expect(first.statusCode).toBe(200);

    const duplicate = await request(app).post('/api/auth/register').send({
      fullName: 'Alt Nume',
      email: 'elevnou@test.ro',
      password: 'parola456'
    });
    expect(duplicate.statusCode).toBe(409);

    const invalid = await request(app).post('/api/auth/register').send({
      fullName: 'A',
      email: 'bad',
      password: '1'
    });
    expect(invalid.statusCode).toBe(400);
    expect(invalid.body.errors.email).toBeDefined();
    expect(invalid.body.errors.name).toBeDefined();
    expect(invalid.body.errors.password).toBeDefined();
  });

  it('logs in seeded users and rejects invalid credentials', async () => {
    const loginResponse = await loginWithOtp(app, {
      email: 'profesor@lt1.ro',
      password: 'profesor123'
    });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.role).toBe('user');

    const badCredentials = await request(app).post('/api/auth/login').send({
      email: 'profesor@lt1.ro',
      password: 'gresit'
    });
    expect(badCredentials.statusCode).toBe(401);
  });
});
