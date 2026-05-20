const request = require('supertest');
const app = require('../../portal-lt1-backend/src/app');
const { resetExtraStores } = require('../../portal-lt1-backend/src/data/extraStores');

describe('Auth API', () => {
  beforeEach(async () => {
    await resetExtraStores();
  });

  it('registers a new user with role user and returns a JWT', async () => {
    const response = await request(app).post('/api/auth/register').send({
      fullName: 'Elev Nou',
      email: 'elevnou@test.ro',
      password: 'parola123'
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe('user');
    expect(response.body.user.permissions).toEqual(
      expect.arrayContaining(['documents:read', 'chat:use'])
    );
    expect(response.body.user.permissions).not.toContain('documents:create');

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'elevnou@test.ro',
      password: 'parola123'
    });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.user.email).toBe('elevnou@test.ro');
  });

  it('rejects duplicate registration and invalid payloads', async () => {
    const first = await request(app).post('/api/auth/register').send({
      fullName: 'Elev Nou',
      email: 'elevnou@test.ro',
      password: 'parola123'
    });
    expect(first.statusCode).toBe(201);

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
    const loginResponse = await request(app).post('/api/auth/login').send({
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
