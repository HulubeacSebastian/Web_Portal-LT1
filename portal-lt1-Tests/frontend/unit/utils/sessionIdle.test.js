import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAuthActivity,
  getSessionIdleMs,
  initSessionIdleWatch,
  isSessionIdle,
  touchAuthActivity
} from '@/utils/sessionIdle';

describe('sessionIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearAuthActivity();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearAuthActivity();
  });

  it('uses default idle timeout of 30 minutes', () => {
    expect(getSessionIdleMs()).toBe(30 * 60 * 1000);
  });

  it('marks session idle after timeout without activity', () => {
    touchAuthActivity();
    vi.advanceTimersByTime(getSessionIdleMs() + 1);
    expect(isSessionIdle()).toBe(true);
  });

  it('calls onIdle when user stays inactive', () => {
    const onIdle = vi.fn();
    touchAuthActivity();
    initSessionIdleWatch(onIdle);
    vi.advanceTimersByTime(getSessionIdleMs() + 1500);
    expect(onIdle).toHaveBeenCalledTimes(1);
  });
});
