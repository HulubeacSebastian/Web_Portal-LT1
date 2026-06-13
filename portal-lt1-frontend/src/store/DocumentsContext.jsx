import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedDocuments } from '../data/seedDocuments';
import { apiRequest, getWsOrigin } from '../utils/apiClient';
import { getAuthToken } from '../utils/authSession';
import {
  attachFilesToDocuments,
  getDocumentFile,
  moveDocumentFile,
  removeDocumentFile,
  setDocumentFile
} from '../utils/documentFiles';
import { toApiDocumentPayload } from '../utils/documentPayload';
import {
  clearQueue,
  dequeueDocumentOps,
  enqueue,
  loadOfflineDocuments,
  loadQueue,
  replaceQueue,
  saveOfflineDocuments
} from '../utils/offlineQueue';

const DocumentsContext = createContext(null);

function requireAuthToken() {
  const token = getAuthToken();
  if (!token) {
    const error = new Error('Autentificare necesara pentru aceasta operatie.');
    error.status = 401;
    throw error;
  }
  return token;
}

async function fetchAllDocuments() {
  const first = await apiRequest('/api/documents?page=1&limit=100');
  return first.items || [];
}

export function DocumentsProvider({ children }) {
  const remoteEnabled = import.meta.env.MODE !== 'test';
  const [documents, setDocuments] = useState(() => {
    if (!remoteEnabled) return seedDocuments;
    const cached = loadOfflineDocuments();
    if (cached?.length) return attachFilesToDocuments(cached);
    return [];
  });
  const [documentsReady, setDocumentsReady] = useState(() => !remoteEnabled);
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

  const uploadDocumentFileToServer = async (docId, file) => {
    if (!file?.dataUrl) return null;
    return apiRequest(`/api/documents/${encodeURIComponent(docId)}/file`, {
      method: 'POST',
      body: {
        dataUrl: file.dataUrl,
        name: file.name,
        type: file.type
      }
    });
  };

  const refreshFromServer = async () => {
    const list = await fetchAllDocuments();
    persistLocal(attachFilesToDocuments(list));
    setDocumentsReady(true);
  };

  const refreshGeneratorStatus = async () => {
    if (!remoteEnabled) return;
    if (!navigator.onLine) return;
    try {
      requireAuthToken();
      const status = await apiRequest('/api/documents/generator/status', {
        method: 'GET'
      });
      if (status && typeof status === 'object') {
        setGenerator((prev) => ({ ...prev, ...status }));
      }
    } catch {
      // ignore; generator is optional for UI
    }
  };

  const startGenerator = async ({ batchSize = 5, intervalMs = 2000 } = {}) => {
    requireAuthToken();
    const status = await apiRequest('/api/documents/generator/start', {
      method: 'POST',
      body: { batchSize, intervalMs }
    });
    setGenerator((prev) => ({ ...prev, ...status }));
    return status;
  };

  const stopGenerator = async () => {
    requireAuthToken();
    const status = await apiRequest('/api/documents/generator/stop', {
      method: 'POST'
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
    if (!remoteEnabled) return new Map();
    if (syncingRef.current) return new Map();
    if (!navigator.onLine) return new Map();
    syncingRef.current = true;
    const idMap = new Map();
    try {
      requireAuthToken();
      let queue = loadQueue();
      if (queue.length === 0) return idMap;

      for (const op of queue) {
        if (op.type === 'create') {
          const response = await apiRequest('/api/documents', {
            method: 'POST',
            body: toApiDocumentPayload(op.payload)
          });
          if (op.tempId) {
            idMap.set(op.tempId, response.id);
            const pendingFile = getDocumentFile(op.tempId);
            if (pendingFile) {
              await uploadDocumentFileToServer(response.id, pendingFile);
              moveDocumentFile(op.tempId, response.id);
            }
          }
        } else if (op.type === 'update') {
          const id = idMap.get(op.id) || op.id;
          try {
            await apiRequest(`/api/documents/${encodeURIComponent(id)}`, {
              method: 'PUT',
              body: toApiDocumentPayload(op.payload)
            });
          } catch (error) {
            // If backend was restarted (RAM reset) the document may no longer exist.
            // Treat 404 as already-applied so we can drain the queue.
            if (error?.status !== 404) throw error;
          }
          const pendingFile = getDocumentFile(op.id);
          if (pendingFile) {
            await uploadDocumentFileToServer(id, pendingFile);
          }
        } else if (op.type === 'delete') {
          const id = idMap.get(op.id) || op.id;
          try {
            await apiRequest(`/api/documents/${id}`, {
              method: 'DELETE'
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
      return idMap;
    } catch (error) {
      if (error?.status === 401) {
        return idMap;
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
    return idMap;
  };

  const addDocument = async (payload) => {
    const { file, ...meta } = payload;

    if (!remoteEnabled) {
      const id = `DOC-${String(Date.now()).slice(-6)}`;
      const nextDoc = { ...meta, id, ...(file ? { file } : {}) };
      if (file) setDocumentFile(id, file);
      persistLocal((prev) => [nextDoc, ...prev]);
      return id;
    }

    if (navigator.onLine) {
      try {
        requireAuthToken();
        const created = await apiRequest('/api/documents', {
          method: 'POST',
          body: toApiDocumentPayload(meta)
        });
        let saved = created;
        if (file) {
          saved = (await uploadDocumentFileToServer(created.id, file)) || created;
          setDocumentFile(created.id, file);
        }
        persistLocal((prev) => [saved, ...prev.filter((doc) => !doc.id.startsWith('TMP-'))]);
        return saved.id;
      } catch (error) {
        if (error?.status) throw error;
      }
    }

    const tempId = `TMP-${String(Date.now())}`;
    if (file) setDocumentFile(tempId, file);
    const nextDoc = { ...meta, id: tempId, ...(file ? { file } : {}) };
    persistLocal((prev) => [nextDoc, ...prev]);
    enqueue({ type: 'create', tempId, payload: meta });
    if (navigator.onLine) {
      const idMap = await syncQueue();
      const realId = idMap.get(tempId);
      if (realId) return realId;
    }
    return tempId;
  };

  const updateDocument = async (id, payload) => {
    const { file, ...meta } = payload;
    if (file !== undefined) {
      setDocumentFile(id, file || null);
    }
    persistLocal((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...meta, ...(file !== undefined ? { file: file || null } : {}) } : doc))
    );

    if (!remoteEnabled) return;

    if (navigator.onLine) {
      try {
        requireAuthToken();
        let saved = await apiRequest(`/api/documents/${encodeURIComponent(id)}`, {
          method: 'PUT',
          body: toApiDocumentPayload(meta)
        });
        if (file) {
          saved = (await uploadDocumentFileToServer(id, file)) || saved;
        }
        dequeueDocumentOps(id, ['update']);
        const merged = file ? { ...saved, file } : saved;
        persistLocal((prev) => prev.map((doc) => (doc.id === id ? merged : doc)));
        await refreshFromServer();
        return;
      } catch (error) {
        if (error?.status) throw error;
      }
    }

    enqueue({ type: 'update', id, payload: meta });
    if (navigator.onLine) {
      await syncQueue();
    }
  };

  const deleteDocument = (id) => {
    removeDocumentFile(id);
    persistLocal((prev) => prev.filter((doc) => doc.id !== id));
    if (remoteEnabled) {
      enqueue({ type: 'delete', id });
      if (navigator.onLine) {
        syncQueue();
      }
    }
  };

  const getDocumentById = (id) => {
    const doc = documents.find((item) => item.id === id);
    if (!doc) return undefined;
    const file = doc.file || getDocumentFile(id);
    return file ? { ...doc, file } : doc;
  };

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
    if (!getAuthToken()) return;
    if (import.meta.env.VITE_USE_DEV_PROXY === 'true') return;

    let cancelled = false;
    let ws;

    try {
      ws = new WebSocket(getWsOrigin());
      wsRef.current = ws;
    } catch {
      return undefined;
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'documents_batch_added' || msg.type === 'document_changed') {
          refreshFromServer().catch(() => {});
        }
      } catch {
        // ignore
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {
      if (!cancelled) {
        wsRef.current = null;
      }
    };

    return () => {
      cancelled = true;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [isOffline]);

  const value = useMemo(
    () => ({
      documents,
      documentsReady,
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
    [documents, documentsReady, generator, isOffline]
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
