const jwt = require('jsonwebtoken');
const hub = require('../realtime/wsHub');
const chatStore = require('./chatStore');

const JWT_SECRET = process.env.JWT_SECRET || 'lt1-dev-secret';

function parseMessage(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function verifyClientToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function handleWsMessage(ws, raw) {
  const message = parseMessage(raw);
  if (!message || !message.type) return;

  if (message.type === 'chat_join') {
    const user = verifyClientToken(message.token);
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

    hub.broadcast({ type: 'chat_message', message: saved });
  }
}

module.exports = {
  handleWsMessage
};
