const OFFLINE_DOCS_KEY = 'portal_offline_documents';
const OFFLINE_QUEUE_KEY = 'portal_offline_queue';

export function loadOfflineDocuments() {
  try {
    const raw = localStorage.getItem(OFFLINE_DOCS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveOfflineDocuments(documents) {
  try {
    localStorage.setItem(OFFLINE_DOCS_KEY, JSON.stringify(documents));
  } catch {
    // ignore quota / serialization errors
  }
}

export function loadQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore quota / serialization errors
  }
}

export function enqueue(operation) {
  const queue = loadQueue();
  queue.push(operation);
  saveQueue(queue);
  return queue;
}

export function replaceQueue(nextQueue) {
  saveQueue(Array.isArray(nextQueue) ? nextQueue : []);
}

export function clearQueue() {
  replaceQueue([]);
}

/** Scoate din coada operatiile deja aplicate pe server pentru un document. */
export function dequeueDocumentOps(docId, types = ['update', 'delete']) {
  const allowed = new Set(types);
  replaceQueue(
    loadQueue().filter((op) => {
      if (!allowed.has(op.type)) return true;
      if (op.type === 'update' || op.type === 'delete') return op.id !== docId;
      return true;
    })
  );
}

