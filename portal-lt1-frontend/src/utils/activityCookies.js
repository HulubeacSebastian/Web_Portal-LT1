import { deleteCookie, getCookie, setCookie } from './cookies';

const ACTIVITY_COOKIE = 'portal_activity';
const PREFERENCES_COOKIE = 'portal_preferences';
const EVENTS_COOKIE = 'portal_recent_events';
const MAX_RECENT_PATHS = 8;
const MAX_EVENTS = 12;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function decodeCookieValue(value) {
  if (!value) {
    return '';
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readJsonCookie(name, fallback) {
  const raw = decodeCookieValue(getCookie(name));
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonCookie(name, value) {
  setCookie(name, JSON.stringify(value), { maxAge: COOKIE_MAX_AGE });
}

export function getActivitySnapshot() {
  return readJsonCookie(ACTIVITY_COOKIE, {
    totalVisits: 0,
    lastPath: '/',
    visitsByPath: {},
    recentPaths: []
  });
}

export function trackPageVisit(pathname) {
  const current = getActivitySnapshot();
  const visitsByPath = { ...current.visitsByPath };
  visitsByPath[pathname] = (visitsByPath[pathname] || 0) + 1;

  const recentPaths = [pathname, ...current.recentPaths.filter((path) => path !== pathname)].slice(0, MAX_RECENT_PATHS);

  const next = {
    totalVisits: current.totalVisits + 1,
    lastPath: pathname,
    visitsByPath,
    recentPaths
  };

  writeJsonCookie(ACTIVITY_COOKIE, next);
  return next;
}

export function getPreferences() {
  return readJsonCookie(PREFERENCES_COOKIE, {});
}

export function savePreference(key, value) {
  const current = getPreferences();
  const next = { ...current, [key]: value };
  writeJsonCookie(PREFERENCES_COOKIE, next);
  return next;
}

export function recordActivityEvent(event, payload = {}) {
  const current = readJsonCookie(EVENTS_COOKIE, []);
  const next = [
    {
      event,
      payload,
      at: new Date().toISOString()
    },
    ...current
  ].slice(0, MAX_EVENTS);

  writeJsonCookie(EVENTS_COOKIE, next);
  return next;
}

export function getRecentActivityEvents() {
  return readJsonCookie(EVENTS_COOKIE, []);
}

export function clearActivityMonitoring() {
  deleteCookie(ACTIVITY_COOKIE);
  deleteCookie(PREFERENCES_COOKIE);
  deleteCookie(EVENTS_COOKIE);
}

