const request = require('supertest');
const app = require('../app');
const store = require('../data/documentStore');
const extraStore = require('../data/extraStores');

describe('Documents REST API', () => {
  beforeEach(() => {
    store.resetStore();
    extraStore.resetExtraStores();
  });

  async function loginAndGetToken() {
    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@lt1.ro',
      password: 'admin123'
    });
    return response.body.token;
  }

  it('returns paginated documents list', async () => {
    const response = await request(app).get('/api/documents?page=1&limit=5');

    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(5);
    expect(response.body.pagination.totalItems).toBe(12);
    expect(response.body.pagination.totalPages).toBe(3);
  });

  it('returns validation error for invalid pagination', async () => {
    const response = await request(app).get('/api/documents?page=0&limit=500');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors.page).toBeDefined();
    expect(response.body.errors.limit).toBeDefined();
  });

  it('creates document with valid payload', async () => {
    const token = await loginAndGetToken();
    const payload = {
      title: 'Procedura test laborator',
      category: 'Procedura',
      issuer: 'Comisia de testare',
      issuedAt: '2026-04-01',
      status: 'Activ',
      description: 'Document de test pentru validarea endpoint-ului de creare.'
    };

    const response = await request(app).post('/api/documents').set('Authorization', `Bearer ${token}`).send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toMatch(/^DOC-/);
    expect(response.body.title).toBe(payload.title);
  });

  it('rejects create when payload is invalid', async () => {
    const token = await loginAndGetToken();
    const response = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors.title).toBeDefined();
    expect(response.body.errors.category).toBeDefined();
  });

  it('updates and deletes a document', async () => {
    const token = await loginAndGetToken();
    const updatePayload = {
      title: 'Titlu actualizat document',
      category: 'Regulament',
      issuer: 'Secretariat',
      issuedAt: '2026-04-05',
      status: 'Revizie',
      description: 'Descriere suficient de lunga pentru a valida actualizarea documentului.'
    };

    const updateResponse = await request(app)
      .put('/api/documents/DOC-001')
      .set('Authorization', `Bearer ${token}`)
      .send(updatePayload);
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.status).toBe('Revizie');

    const deleteResponse = await request(app).delete('/api/documents/DOC-001').set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.statusCode).toBe(204);

    const getDeletedResponse = await request(app).get('/api/documents/DOC-001');
    expect(getDeletedResponse.statusCode).toBe(404);
  });

  it('returns statistics for documents', async () => {
    const response = await request(app).get('/api/statistics/documents');

    expect(response.statusCode).toBe(200);
    expect(response.body.totalDocuments).toBe(12);
    expect(response.body.byStatus.Activ).toBeGreaterThan(0);
    expect(response.body.byCategory.Regulament).toBeGreaterThan(0);
  });

  it('implements auth, profile, posts and contact routes from project API', async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'admin@lt1.ro',
      password: 'admin123'
    });
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    const token = loginResponse.body.token;

    const profileResponse = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${token}`);
    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.role).toBe('admin');

    const createPostResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Anunt nou',
        content: 'Continut de test pentru anunt.',
        category_id: 'administrativ',
        image_url: ''
      });
    expect(createPostResponse.statusCode).toBe(201);
    const createdPostId = createPostResponse.body.id;

    const updatePostResponse = await request(app)
      .put(`/api/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Anunt nou (actualizat)',
        content: 'Continut actualizat pentru anunt, suficient de lung.',
        category_id: 'administrativ',
        image_url: ''
      });
    expect(updatePostResponse.statusCode).toBe(200);
    expect(updatePostResponse.body.title).toContain('actualizat');

    const listPostsResponse = await request(app).get('/api/posts');
    expect(listPostsResponse.statusCode).toBe(200);
    expect(Array.isArray(listPostsResponse.body)).toBe(true);
    expect(listPostsResponse.body.some((post) => post.id === createdPostId)).toBe(true);

    const deletePostResponse = await request(app)
      .delete(`/api/posts/${createdPostId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deletePostResponse.statusCode).toBe(204);

    const uploadResponse = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        file: 'burse-2026.pdf',
        title: 'Burse 2026',
        category: 'Financiar'
      });
    expect(uploadResponse.statusCode).toBe(201);
    expect(uploadResponse.body.file_path).toContain('.pdf');

    const contactResponse = await request(app).post('/api/contact').send({
      sender_email: 'parinte@example.com',
      message: 'Buna ziua, unde gasesc orarul?'
    });
    expect(contactResponse.statusCode).toBe(201);
  });

  it('validates auth, posts, upload and contact inputs server-side', async () => {
    const badLogin = await request(app).post('/api/auth/login').send({ email: 'bad', password: '1' });
    expect(badLogin.statusCode).toBe(400);
    expect(badLogin.body.errors.email).toBeDefined();
    expect(badLogin.body.errors.password).toBeDefined();

    const goodLogin = await request(app).post('/api/auth/login').send({ email: 'admin@lt1.ro', password: 'admin123' });
    const token = goodLogin.body.token;

    const badPost = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x', content: 'y', category_id: '' });
    expect(badPost.statusCode).toBe(400);
    expect(badPost.body.errors.title).toBeDefined();
    expect(badPost.body.errors.content).toBeDefined();
    expect(badPost.body.errors.category_id).toBeDefined();

    const badUpload = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ file: 'not-a-pdf.txt', title: 'x', category: '' });
    expect(badUpload.statusCode).toBe(400);
    expect(badUpload.body.errors.file).toBeDefined();
    expect(badUpload.body.errors.title).toBeDefined();
    expect(badUpload.body.errors.category).toBeDefined();

    const badContact = await request(app).post('/api/contact').send({ sender_email: 'bad', message: 'scurt' });
    expect(badContact.statusCode).toBe(400);
    expect(badContact.body.errors.sender_email).toBeDefined();
    expect(badContact.body.errors.message).toBeDefined();
  });

  it('starts and stops the server-side document generator and receives websocket-ready batch additions', async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'admin@lt1.ro',
      password: 'admin123'
    });
    const token = loginResponse.body.token;

    const startResponse = await request(app)
      .post('/api/documents/generator/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ batchSize: 2, intervalMs: 300 });
    expect(startResponse.statusCode).toBe(200);
    expect(startResponse.body.running).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const statsResponse = await request(app).get('/api/statistics/documents');
    expect(statsResponse.statusCode).toBe(200);
    expect(statsResponse.body.totalDocuments).toBeGreaterThan(12);

    const stopResponse = await request(app)
      .post('/api/documents/generator/stop')
      .set('Authorization', `Bearer ${token}`);
    expect(stopResponse.statusCode).toBe(200);
    expect(stopResponse.body.running).toBe(false);
  });
});
