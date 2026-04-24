import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedDocuments } from '../data/seedDocuments';
import { apiRequest } from '../utils/apiClient';
import { clearQueue, enqueue, loadOfflineDocuments, loadQueue, replaceQueue, saveOfflineDocuments } from '../utils/offlineQueue';

const DocumentsContext = createContext(null);

const AUTH_TOKEN_KEY = 'portal_jwt';

async function ensureToken() {
  const existing = localStorage.getItem(AUTH_TOKEN_KEY);
  if (existing) return existing;
  const login = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@lt1.ro', password: 'admin123' }
  });
  localStorage.setItem(AUTH_TOKEN_KEY, login.token);
  return login.token;
}

async function fetchAllDocuments() {
  const first = await apiRequest('/api/documents?page=1&limit=100');
  return first.items || [];
}

export function DocumentsProvider({ children }) {
  const remoteEnabled = import.meta.env.MODE !== 'test';
  const [documents, setDocuments] = useState(() => (remoteEnabled ? loadOfflineDocuments() || seedDocuments : seedDocuments));
  const [isOffline, setIsOffline] = useState(() => (remoteEnabled ? !navigator.onLine : true));
  const [generator, setGenerator] = useState(() => ({
    running: false,
    intervalMs: 3000,
    batchSize: 1
  }));
  const wsRef = useRef(null);
  const syncingRef = useRef(false);
  const syncRetryRef = useRef({ timerId: null, attempt: 0 });

  const persistLocal = (next) => {
    setDocuments(next);
    if (remoteEnabled) {
      if (typeof next === 'function') {
        // no-op: persistence handled via the effect below for functional updates
      } else {
        saveOfflineDocuments(next);
      }
    }
  };

  useEffect(() => {
    if (!remoteEnabled) return;
    saveOfflineDocuments(documents);
  }, [documents, remoteEnabled]);

  const refreshFromServer = async () => {
    const list = await fetchAllDocuments();
    persistLocal(list);
  };

  const refreshGeneratorStatus = async () => {
    if (!remoteEnabled) return;
    if (!navigator.onLine) return;
    try {
      const token = await ensureToken();
      const status = await apiRequest('/api/documents/generator/status', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (status && typeof status === 'object') {
        setGenerator((prev) => ({ ...prev, ...status }));
      }
    } catch {
      // ignore; generator is optional for UI
    }
  };

  const startGenerator = async ({ batchSize = 5, intervalMs = 2000 } = {}) => {
    const token = await ensureToken();
    const status = await apiRequest('/api/documents/generator/start', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { batchSize, intervalMs }
    });
    setGenerator((prev) => ({ ...prev, ...status }));
    return status;
  };

  const stopGenerator = async () => {
    const token = await ensureToken();
    const status = await apiRequest('/api/documents/generator/stop', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    setGenerator((prev) => ({ ...prev, ...status }));
    return status;
  };

  const clearSyncRetry = () => {
    if (syncRetryRef.current.timerId) {
      window.clearTimeout(syncRetryRef.current.timerId);
    }
    syncRetryRef.current.timerId = null;
    syncRetryRef.current.attempt = 0;
  };

  const scheduleSyncRetry = () => {
    // Avoid infinite tight loops if the backend is unreachable or CORS blocks requests.
    if (syncRetryRef.current.timerId) return;

    const attempt = syncRetryRef.current.attempt;
    if (attempt >= 6) return; // ~1s..32s backoff, then stop

    const delayMs = Math.min(32000, 1000 * Math.pow(2, attempt));
    syncRetryRef.current.attempt += 1;
    syncRetryRef.current.timerId = window.setTimeout(() => {
      syncRetryRef.current.timerId = null;
      syncQueue({ didRefreshToken: true });
    }, delayMs);
  };

  const syncQueue = async (options = {}) => {
    if (!remoteEnabled) return;
    if (syncingRef.current) return;
    if (!navigator.onLine) return;
    syncingRef.current = true;
    try {
      const token = await ensureToken();
      let queue = loadQueue();
      if (queue.length === 0) return;

      const idMap = new Map();

      for (const op of queue) {
        if (op.type === 'create') {
          const response = await apiRequest('/api/documents', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: op.payload
          });
          if (op.tempId) {
            idMap.set(op.tempId, response.id);
          }
        } else if (op.type === 'update') {
          const id = idMap.get(op.id) || op.id;
          try {
            await apiRequest(`/api/documents/${id}`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` },
              body: op.payload
            });
          } catch (error) {
            // If backend was restarted (RAM reset) the document may no longer exist.
            // Treat 404 as already-applied so we can drain the queue.
            if (error?.status !== 404) throw error;
          }
        } else if (op.type === 'delete') {
          const id = idMap.get(op.id) || op.id;
          try {
            await apiRequest(`/api/documents/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            // DELETE should be idempotent for sync purposes.
            if (error?.status !== 404) throw error;
          }
        }
      }

      clearQueue();
      clearSyncRetry();

      await refreshFromServer();
      queue = [];
      replaceQueue(queue);
    } catch (error) {
      // If token is invalid/expired, clear it and retry once.
      if (error?.status === 401 && !options.didRefreshToken) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        scheduleSyncRetry();
        return;
      }

      // If the browser blocks the request (CORS/network), avoid hammering:
      // mark offline and retry with backoff.
      if (!error?.status) {
        setIsOffline(true);
      }
      scheduleSyncRetry();
    } finally {
      syncingRef.current = false;
    }
  };

  const addDocument = (payload) => {
    if (!remoteEnabled) {
      const id = `DOC-${String(Date.now()).slice(-6)}`;
      const nextDoc = { ...payload, id };
      persistLocal((prev) => [nextDoc, ...prev]);
      return id;
    }

    const tempId = `TMP-${String(Date.now())}`;
    const nextDoc = { ...payload, id: tempId };
    persistLocal((prev) => [nextDoc, ...prev]);
    enqueue({ type: 'create', tempId, payload });
    if (navigator.onLine) {
      syncQueue();
    }
    return tempId;
  };

  const updateDocument = (id, payload) => {
    persistLocal((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...payload } : doc)));
    if (remoteEnabled) {
      enqueue({ type: 'update', id, payload });
      if (navigator.onLine) {
        syncQueue();
      }
    }
  };

  const deleteDocument = (id) => {
    persistLocal((prev) => prev.filter((doc) => doc.id !== id));
    if (remoteEnabled) {
      enqueue({ type: 'delete', id });
      if (navigator.onLine) {
        syncQueue();
      }
    }
  };

  const getDocumentById = (id) => documents.find((doc) => doc.id === id);

  useEffect(() => {
    if (!remoteEnabled) return;
    const onOnline = () => {
      setIsOffline(false);
      syncQueue();
    };
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!remoteEnabled) return;
    if (isOffline) return;

    refreshFromServer().catch(() => {
      setIsOffline(true);
    });

    syncQueue();
    refreshGeneratorStatus();
  }, [isOffline]);

  useEffect(() => {
    if (!remoteEnabled) return;
    if (isOffline) return;

    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'documents_batch_added') {
          refreshFromServer().catch(() => {});
        }
      } catch {
        // ignore
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, [isOffline]);

  const value = useMemo(
    () => ({
      documents,
      isOffline,
      generator,
      syncQueue,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocumentById,
      startGenerator,
      stopGenerator,
      refreshGeneratorStatus
    }),
    [documents, generator, isOffline]
  );

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used inside DocumentsProvider');
  }
  return context;
}
