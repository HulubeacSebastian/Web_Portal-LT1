import {
  AUTH_TOKEN_KEY,
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  saveAuthSession
} from './authSession';

export { AUTH_TOKEN_KEY };
export const AUTH_CHANGED_EVENT = 'portal-auth-changed';
export const AUTH_EXPIRED_EVENT = 'portal-auth-expired';

const PUBLIC_AUTH_PATHS = [
  '/api/auth/login',
  '/api/auth/verify-otp',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password'
];

function useDevProxy() {
  return import.meta.env.DEV && import.meta.env.VITE_USE_DEV_PROXY === 'true';
}

export function getApiOrigin() {
  if (useDevProxy() && typeof window !== 'undefined') {
    return window.location.origin;
  }

  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3000`;
  }

  return 'http://localhost:3000';
}

export function getWsOrigin() {
  if (useDevProxy()) {
    const serverIp = import.meta.env.VITE_SERVER_IP || '127.0.0.1';
    return `ws://${serverIp}:3000`;
  }

  const base = new URL(getApiOrigin());
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
  return base.origin;
}

function resolveUrl(path) {
  const origin = getApiOrigin();
  if (typeof path !== 'string') return origin;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

function normalizePath(path) {
  const origin = getApiOrigin();
  if (typeof path !== 'string') return '';
  try {
    const url =
      path.startsWith('http://') || path.startsWith('https://') ? new URL(path) : new URL(path, origin);
    return url.pathname;
  } catch {
    return path.split('?')[0];
  }
}

function isPublicAuthPath(path) {
  return PUBLIC_AUTH_PATHS.includes(normalizePath(path));
}

function notifyAuthExpired() {
  clearAuthSession();
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${getApiOrigin()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data.token) return false;

    saveAuthSession({
      token: data.token,
      refreshToken,
      user: data.user || undefined
    });
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest(path, options = {}) {
  const url = resolveUrl(path);
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});
  const useAuth = options.auth !== false && !isPublicAuthPath(path);
  const token = useAuth ? getAuthToken() : null;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const init = { method, headers };

  if (options.body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch {
    const error = new Error(
      useDevProxy()
        ? 'Nu se poate contacta serverul. Verifica ca backend-ul ruleaza (npm start in portal-lt1-backend).'
        : `Nu se poate contacta serverul (${getApiOrigin()}/health). Porneste backend-ul sau activeaza proxy-ul Vite (VITE_USE_DEV_PROXY).`
    );
    error.status = 0;
    throw error;
  }
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 401 && useAuth && !options._retried) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return apiRequest(path, { ...options, _retried: true });
    }
    notifyAuthExpired();
  }

  let data;
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => undefined);
  } else {
    data = await response.text().catch(() => '');
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && String(data.message)) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function logoutOnServer() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
      body: { refreshToken },
      auth: false
    });
  } catch {
    // ignore — client session cleared anyway
  }
}
