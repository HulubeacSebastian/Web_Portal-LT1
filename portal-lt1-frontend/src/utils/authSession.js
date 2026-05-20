import { AUTH_TOKEN_KEY } from './apiClient';

const USER_KEY = 'portal_user_profile';

export function saveAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function loadAuthSession() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function hasPermission(code) {
  const session = loadAuthSession();
  return Boolean(session?.permissions?.includes(code));
}

export function isAdmin() {
  const session = loadAuthSession();
  return session?.role === 'admin';
}
