const request = require('supertest');
const app = require('../../portal-lt1-backend/src/app');
const { resetExtraStores } = require('../../portal-lt1-backend/src/data/extraStores');
const { loginWithOtp } = require('./helpers/authLogin');

describe('Assignment 4 — 3-way auth and password recovery', () => {
  beforeEach(async () => {
    await resetExtraStores();
  });

  it('completes 3-step login for admin and user roles', async () => {
    const admin = await loginWithOtp(app, { email: 'admin@lt1.ro', password: 'admin123' });
    expect(admin.statusCode).toBe(200);
    expect(admin.body.token).toBeDefined();
    expect(admin.body.refreshToken).toBeDefined();
    expect(admin.body.user.role).toBe('admin');
    expect(admin.body.user.permissions).toContain('documents:create');

    const user = await loginWithOtp(app, { email: 'profesor@lt1.ro', password: 'profesor123' });
    expect(user.statusCode).toBe(200);
    expect(user.body.user.role).toBe('user');
    expect(user.body.user.permissions).toContain('chat:use');
    expect(user.body.user.permissions).not.toContain('documents:create');
  });

  it('refreshes access token and revokes session on logout', async () => {
    const login = await loginWithOtp(app, { email: 'admin@lt1.ro', password: 'admin123' });
    const refresh = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: login.body.refreshToken });
    expect(refresh.statusCode).toBe(200);
    expect(refresh.body.token).toBeDefined();

    const logout = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: login.body.refreshToken });
    expect(logout.statusCode).toBe(200);

    const refreshAgain = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: login.body.refreshToken });
    expect(refreshAgain.statusCode).toBe(401);
  });

  it('resets password via recovery token', async () => {
    const forgot = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'profesor@lt1.ro' });
    expect(forgot.statusCode).toBe(200);
    expect(forgot.body.devResetCode).toBeDefined();

    const reset = await request(app).post('/api/auth/reset-password').send({
      resetToken: forgot.body.resetToken,
      token: forgot.body.devResetCode,
      password: 'parolaNoua1'
    });
    expect(reset.statusCode).toBe(200);

    const oldLogin = await loginWithOtp(app, { email: 'profesor@lt1.ro', password: 'profesor123' });
    expect(oldLogin.statusCode).toBe(401);

    const newLogin = await loginWithOtp(app, { email: 'profesor@lt1.ro', password: 'parolaNoua1' });
    expect(newLogin.statusCode).toBe(200);
  });
});
