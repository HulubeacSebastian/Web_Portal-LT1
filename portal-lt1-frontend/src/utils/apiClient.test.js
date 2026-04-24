import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './apiClient';

describe('apiClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('sends JSON body and parses JSON response', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });

    const result = await apiRequest('/api/health', { method: 'POST', body: { a: 1 } });
    expect(result).toEqual({ ok: true });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = globalThis.fetch.mock.calls[0];
    expect(String(url)).toBe('http://localhost:3000/api/health');
    expect(init.method).toBe('POST');
    expect(init.headers.get('Content-Type')).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('returns text when response is not JSON', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response('OK', {
        status: 200,
        headers: { 'content-type': 'text/plain' }
      });
    });

    await expect(apiRequest('/health')).resolves.toBe('OK');
  });

  it('throws with status and payload when response is not ok', async () => {
    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ message: 'Bad request' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    });

    try {
      await apiRequest('/api/fail');
      throw new Error('expected to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Bad request');
      expect(error.status).toBe(400);
      expect(error.data).toEqual({ message: 'Bad request' });
    }
  });
});

