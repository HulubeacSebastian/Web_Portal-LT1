import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, AUTH_EXPIRED_EVENT } from '@/utils/apiClient';
import { AUTH_TOKEN_KEY, clearAuthSession, saveAuthSession } from '@/utils/authSession';

describe('apiClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearAuthSession();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearAuthSession();
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

  it('attaches bearer token for protected routes', async () => {
    saveAuthSession({
      token: 'test-jwt',
      user: { id: 'USR-001', email: 'admin@lt1.ro', role: 'admin', permissions: [] }
    });

    globalThis.fetch = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });

    await apiRequest('/api/users/profile');

    const [, init] = globalThis.fetch.mock.calls[0];
    expect(init.headers.get('Authorization')).toBe('Bearer test-jwt');
  });

  it('does not attach bearer token on login and clears session on 401', async () => {
    saveAuthSession({
      token: 'expired-jwt',
      user: { id: 'USR-001', email: 'admin@lt1.ro', role: 'admin', permissions: [] }
    });

    const expiredHandler = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, expiredHandler);

    globalThis.fetch = vi.fn(async (_url, init) => {
      if (init?.method === 'POST') {
        return new Response(JSON.stringify({ token: 'new-token' }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ message: 'Token expirat sau invalid.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    });

    await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@lt1.ro', password: 'admin123' }
    });
    const [, loginInit] = globalThis.fetch.mock.calls[0];
    expect(loginInit.headers.get('Authorization')).toBeNull();

    await expect(apiRequest('/api/users/profile')).rejects.toMatchObject({ status: 401 });
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(expiredHandler).toHaveBeenCalledTimes(1);
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

