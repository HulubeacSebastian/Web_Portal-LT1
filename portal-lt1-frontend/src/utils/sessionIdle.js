const LAST_ACTIVITY_KEY = 'portal_last_activity';
const DEFAULT_IDLE_MS = 30 * 60 * 1000;

export function getSessionIdleMs() {
  const raw = import.meta.env.VITE_SESSION_IDLE_MS;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_IDLE_MS;
}

export function touchAuthActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function getLastActivityAt() {
  const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isSessionIdle() {
  const last = getLastActivityAt();
  if (!last) return false;
  return Date.now() - last >= getSessionIdleMs();
}

export function clearAuthActivity() {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function initSessionIdleWatch(onIdle) {
  const events = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'];
  let timerId = null;

  const scheduleCheck = () => {
    if (timerId) window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      if (isSessionIdle()) {
        onIdle();
        return;
      }
      scheduleCheck();
    }, 1000);
  };

  const onActivity = () => {
    touchAuthActivity();
    scheduleCheck();
  };

  for (const eventName of events) {
    window.addEventListener(eventName, onActivity, { passive: true });
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible' && isSessionIdle()) {
      onIdle();
      return;
    }
    scheduleCheck();
  };
  document.addEventListener('visibilitychange', onVisibility);

  scheduleCheck();

  return () => {
    if (timerId) window.clearTimeout(timerId);
    for (const eventName of events) {
      window.removeEventListener(eventName, onActivity);
    }
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
