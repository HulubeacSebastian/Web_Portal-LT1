const jwt = require('jsonwebtoken');
const hub = require('../realtime/wsHub');
const chatStore = require('./chatStore');
const store = require('../data/extraStores');

const JWT_SECRET = process.env.JWT_SECRET || 'lt1-dev-secret';

function parseMessage(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function verifyClientToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    let permissions = payload.permissions || [];

    if (permissions.length === 0 && payload.sub) {
      const user = await store.getUserById(payload.sub);
      permissions = user?.permissions || [];
    }

    return {
      ...payload,
      permissions
    };
  } catch {
    return null;
  }
}

async function handleWsMessage(ws, raw) {
  const message = parseMessage(raw);
  if (!message || !message.type) return;

  if (message.type === 'chat_join') {
    const user = await verifyClientToken(message.token);
    if (!user || !(user.permissions || []).includes('chat:use')) {
      ws.send(JSON.stringify({ type: 'chat_error', message: 'Autentificare necesara pentru chat.' }));
      return;
    }

    ws.chatUser = {
      userId: user.sub,
      displayName: message.displayName || user.email,
      role: user.role
    };

    const history = await chatStore.listRecentMessages();
    ws.send(JSON.stringify({ type: 'chat_history', messages: history }));
    ws.send(JSON.stringify({ type: 'chat_join_ok' }));
    return;
  }

  if (message.type === 'chat_message') {
    if (!ws.chatUser) {
      ws.send(JSON.stringify({ type: 'chat_error', message: 'Trebuie sa te conectezi la chat (chat_join).' }));
      return;
    }

    const text = typeof message.text === 'string' ? message.text.trim() : '';
    if (!text || text.length > 500) {
      ws.send(JSON.stringify({ type: 'chat_error', message: 'Mesaj invalid (1-500 caractere).' }));
      return;
    }

    const saved = await chatStore.saveMessage({
      userId: ws.chatUser.userId,
      displayName: ws.chatUser.displayName,
      role: ws.chatUser.role,
      text
    });

    const payload = { type: 'chat_message', message: saved };
    try {
      ws.send(JSON.stringify(payload));
    } catch {
      // ignore send errors for this client
    }
    hub.broadcast(payload);
  }
}

module.exports = {
  handleWsMessage
};
