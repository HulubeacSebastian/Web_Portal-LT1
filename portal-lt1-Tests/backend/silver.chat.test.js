const request = require('supertest');
const WebSocket = require('ws');
const app = require('../../portal-lt1-backend/src/app');
const store = require('../../portal-lt1-backend/src/data/documentStore');
const { startTestServer, stopTestServer } = require('./helpers/testServer');
const { loginWithOtp } = require('./helpers/authLogin');

function waitForMessage(ws, predicate, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout waiting for websocket message')), timeoutMs);

    ws.on('message', function onMessage(raw) {
      try {
        const payload = JSON.parse(raw);
        if (predicate(payload)) {
          clearTimeout(timer);
          ws.off('message', onMessage);
          resolve(payload);
        }
      } catch {
        // ignore
      }
    });
  });
}

describe('Silver — MongoDB chat over WebSocket', () => {
  beforeAll(async () => {
    await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  beforeEach(async () => {
    await store.resetStore();
  });

  it('stores and broadcasts chat messages between two users', async () => {
    const adminLogin = await loginWithOtp(app, {
      email: 'admin@lt1.ro',
      password: 'admin123'
    });
    const userLogin = await loginWithOtp(app, {
      email: 'profesor@lt1.ro',
      password: 'profesor123'
    });

    const port = process.env.PORT || 3000;
    const wsUrl = `ws://127.0.0.1:${port}`;

    const adminWs = new WebSocket(wsUrl);
    const userWs = new WebSocket(wsUrl);

    await Promise.all([
      new Promise((resolve) => adminWs.on('open', resolve)),
      new Promise((resolve) => userWs.on('open', resolve))
    ]);

    adminWs.send(
      JSON.stringify({
        type: 'chat_join',
        token: adminLogin.body.token,
        displayName: 'Administrator'
      })
    );
    userWs.send(
      JSON.stringify({
        type: 'chat_join',
        token: userLogin.body.token,
        displayName: 'Profesor'
      })
    );

    await waitForMessage(adminWs, (payload) => payload.type === 'chat_history');
    await waitForMessage(userWs, (payload) => payload.type === 'chat_history');

    adminWs.send(JSON.stringify({ type: 'chat_message', text: 'Salut din partea adminului.' }));

    const receivedOnUser = await waitForMessage(
      userWs,
      (payload) => payload.type === 'chat_message' && payload.message?.text?.includes('admin')
    );

    expect(receivedOnUser.message.displayName).toBe('Administrator');

    const history = await request(app)
      .get('/api/chat/messages')
      .set('Authorization', `Bearer ${userLogin.body.token}`);

    expect(history.statusCode).toBe(200);
    expect(history.body.some((item) => item.text.includes('admin'))).toBe(true);

    adminWs.close();
    userWs.close();
  });
});
