import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearQueue,
  enqueue,
  loadOfflineDocuments,
  loadQueue,
  replaceQueue,
  saveOfflineDocuments
} from './offlineQueue';

describe('offlineQueue', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem(key) {
        const value = store.get(String(key));
        return value === undefined ? null : value;
      },
      setItem(key, value) {
        store.set(String(key), String(value));
      },
      removeItem(key) {
        store.delete(String(key));
      },
      clear() {
        store.clear();
      }
    };
  });

  it('stores and loads offline documents', () => {
    expect(loadOfflineDocuments()).toBeNull();

    saveOfflineDocuments([{ id: 'DOC-1' }]);
    expect(loadOfflineDocuments()).toEqual([{ id: 'DOC-1' }]);
  });

  it('enqueues operations and can clear/replace queue', () => {
    expect(loadQueue()).toEqual([]);

    enqueue({ type: 'create', payload: { id: 'TMP-1' } });
    enqueue({ type: 'delete', id: 'DOC-1' });
    expect(loadQueue().length).toBe(2);

    replaceQueue([{ type: 'update', id: 'DOC-2', payload: { title: 'x' } }]);
    expect(loadQueue()).toEqual([{ type: 'update', id: 'DOC-2', payload: { title: 'x' } }]);

    clearQueue();
    expect(loadQueue()).toEqual([]);
  });
});

