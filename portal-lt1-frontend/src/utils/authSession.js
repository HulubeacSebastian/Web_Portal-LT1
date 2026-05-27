import { clearAuthActivity, touchAuthActivity } from './sessionIdle';

export const AUTH_TOKEN_KEY = 'portal_jwt';
export const REFRESH_TOKEN_KEY = 'portal_refresh';
const USER_KEY = 'portal_user_profile';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasAuthSession() {
  return Boolean(getAuthToken() && loadAuthSession());
}

export function saveAuthSession({ token, refreshToken, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  touchAuthActivity();
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearAuthActivity();
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

/** Nickname in header; falls back to full name, then email local-part. */
export function getDisplayName(session) {
  if (!session) return '';
  const nickname = typeof session.nickname === 'string' ? session.nickname.trim() : '';
  if (nickname) return nickname;
  const fullName = typeof session.fullName === 'string' ? session.fullName.trim() : '';
  if (fullName) return fullName;
  const email = typeof session.email === 'string' ? session.email.trim() : '';
  if (email.includes('@')) return email.split('@')[0];
  return email || 'Utilizator';
}

export function mergeAuthUser(updates) {
  const current = loadAuthSession();
  if (!current) return null;
  const merged = { ...current, ...updates };
  saveAuthSession({ user: merged });
  return merged;
}
