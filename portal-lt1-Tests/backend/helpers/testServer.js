const http = require('http');
const WebSocket = require('ws');
const app = require('../../../portal-lt1-backend/src/app');
const hub = require('../../../portal-lt1-backend/src/realtime/wsHub');
const wsChat = require('../../../portal-lt1-backend/src/chat/wsChat');

let server;

function startTestServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function connection(ws) {
      hub.addClient(ws);
      ws.send(JSON.stringify({ type: 'connected' }));

      ws.on('message', function incoming(raw) {
        wsChat.handleWsMessage(ws, raw).catch(function (error) {
          console.error('WebSocket chat error:', error);
        });
      });
    });

    server.listen(0, function onListen() {
      process.env.PORT = String(server.address().port);
      resolve(server);
    });
  });
}

function stopTestServer() {
  return new Promise((resolve) => {
    if (!server) return resolve();
    server.close(resolve);
    server = null;
  });
}

module.exports = {
  startTestServer,
  stopTestServer
};
