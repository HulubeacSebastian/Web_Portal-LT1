import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearActivityMonitoring,
  getActivitySnapshot,
  getPreferences,
  getRecentActivityEvents,
  recordActivityEvent,
  savePreference,
  trackPageVisit
} from './activityCookies';

function clearAllCookies() {
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter(Boolean)
    .forEach((name) => {
      document.cookie = `${name}=; max-age=0; path=/`;
    });
}

describe('activityCookies', () => {
  beforeEach(() => {
    clearAllCookies();
  });

  it('tracks page visits and keeps recent paths', () => {
    const first = trackPageVisit('/documente');
    const second = trackPageVisit('/contact');

    expect(first.totalVisits).toBe(1);
    expect(second.totalVisits).toBe(2);
    expect(second.lastPath).toBe('/contact');
    expect(second.visitsByPath['/documente']).toBe(1);
    expect(second.visitsByPath['/contact']).toBe(1);
    expect(second.recentPaths[0]).toBe('/contact');
    expect(getActivitySnapshot().totalVisits).toBe(2);
  });

  it('stores preferences as cookie-backed key/value map', () => {
    savePreference('documentsViewMode', 'cards');
    const next = savePreference('documentsStatusFilter', 'Arhivat');

    expect(next.documentsViewMode).toBe('cards');
    expect(next.documentsStatusFilter).toBe('Arhivat');
    expect(getPreferences().documentsStatusFilter).toBe('Arhivat');
  });

  it('stores recent activity events in reverse chronological order', () => {
    recordActivityEvent('login_success');
    const events = recordActivityEvent('documents_view_mode_change', { to: 'cards' });

    expect(events[0].event).toBe('documents_view_mode_change');
    expect(events[0].payload.to).toBe('cards');
    expect(events[1].event).toBe('login_success');
    expect(getRecentActivityEvents().length).toBe(2);
  });

  it('clears all monitoring cookies', () => {
    trackPageVisit('/documente');
    savePreference('documentsViewMode', 'cards');
    recordActivityEvent('login_success');

    clearActivityMonitoring();

    expect(getActivitySnapshot().totalVisits).toBe(0);
    expect(getRecentActivityEvents()).toEqual([]);
    expect(getPreferences()).toEqual({});
  });
});

