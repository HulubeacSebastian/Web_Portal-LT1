const clients = new Set();

function addClient(ws) {
  clients.add(ws);

  const cleanup = () => {
    clients.delete(ws);
  };

  ws.on('close', cleanup);
  ws.on('error', cleanup);
}

function broadcast(payload) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);

  for (const ws of clients) {
    if (ws.readyState !== 1) continue;
    try {
      ws.send(data);
    } catch {
      clients.delete(ws);
    }
  }
}

module.exports = {
  addClient,
  broadcast
};

