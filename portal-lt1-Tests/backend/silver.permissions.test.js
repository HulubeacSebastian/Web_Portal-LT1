const request = require('supertest');
const app = require('../../portal-lt1-backend/src/app');
const store = require('../../portal-lt1-backend/src/data/documentStore');
const { loginWithOtp } = require('./helpers/authLogin');

describe('Silver — roles and permissions', () => {
  beforeEach(async () => {
    await store.resetStore();
  });

  async function login(email, password) {
    return loginWithOtp(app, { email, password });
  }

  it('returns role permissions matrix from database', async () => {
    const response = await request(app).get('/api/roles');
    expect(response.statusCode).toBe(200);

    const admin = response.body.find((role) => role.name === 'admin');
    const user = response.body.find((role) => role.name === 'user');

    expect(admin.permissions.length).toBeGreaterThan(user.permissions.length);
    expect(admin.permissions.some((item) => item.code === 'documents:create')).toBe(true);
    expect(user.permissions.some((item) => item.code === 'documents:read')).toBe(true);
    expect(user.permissions.some((item) => item.code === 'documents:create')).toBe(false);
  });

  it('admin can create documents, normal user receives 403', async () => {
    const adminLogin = await login('admin@lt1.ro', 'admin123');
    expect(adminLogin.statusCode).toBe(200);
    expect(adminLogin.body.user.permissions).toContain('documents:create');

    const adminCreate = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${adminLogin.body.token}`)
      .send({
        title: 'Document admin silver',
        category: 'Procedura',
        issuer: 'Admin',
        issuedAt: '2026-05-20',
        status: 'Activ',
        description: 'Document creat de admin pentru testul de permisiuni Silver.'
      });
    expect(adminCreate.statusCode).toBe(201);

    const userLogin = await login('profesor@lt1.ro', 'profesor123');
    expect(userLogin.statusCode).toBe(200);
    expect(userLogin.body.user.role).toBe('user');
    expect(userLogin.body.user.permissions).not.toContain('documents:create');

    const userCreate = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${userLogin.body.token}`)
      .send({
        title: 'Document user blocat',
        category: 'Procedura',
        issuer: 'User',
        issuedAt: '2026-05-20',
        status: 'Activ',
        description: 'Acest request trebuie respins pentru utilizatorul standard.'
      });

    expect(userCreate.statusCode).toBe(403);
    expect(userCreate.body.required).toBe('documents:create');
  });

  it('normal user cannot control the document generator', async () => {
    const userLogin = await login('profesor@lt1.ro', 'profesor123');
    const response = await request(app)
      .post('/api/documents/generator/start')
      .set('Authorization', `Bearer ${userLogin.body.token}`)
      .send({ batchSize: 1, intervalMs: 1000 });

    expect(response.statusCode).toBe(403);
    expect(response.body.required).toBe('generator:control');
  });
});
