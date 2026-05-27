import { useEffect, useRef, useState } from 'react';

const MOBILE_HEADER_MQ = '(max-width: 700px)';
/** Mai mic = mai puțin scroll „consumat” înainte ca pagina să deruleze. */
const COLLAPSE_RANGE_RATIO = 0.88;
const WHEEL_DAMPING = 0.68;
const TOUCH_DAMPING = 1;
const MAX_WHEEL_STEP_PX = 42;
const MAX_TOUCH_STEP_PX = 110;
/** După acest progres, un swipe în jos închide header-ul instant. */
const SNAP_COLLAPSE_AT = 0.52;

function smoothstep(value) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function readPxVar(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  if (raw.endsWith('rem')) {
    const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return value * root;
  }
  if (raw.endsWith('vh') || raw.endsWith('dvh')) {
    return (window.innerHeight * value) / 100;
  }
  return value;
}

function measureLayoutCache() {
  const expandedPx = readPxVar('--header-mobile-expanded', window.innerHeight * 0.3);
  const compactPx = readPxVar('--header-mobile-compact', 101);
  const gapPx = readPxVar('--header-content-gap', 12);
  const tasselPx = readPxVar('--header-tassel-hang', 26);
  const travel = Math.max(0, expandedPx - compactPx);
  return {
    expandedPx,
    compactPx,
    gapPx,
    tasselPx,
    collapseRangePx: Math.max(110, travel * COLLAPSE_RANGE_RATIO),
  };
}

function applyHeaderProgress(progressRef, progress, layout) {
  const clamped = Math.min(1, Math.max(0, progress));
  progressRef.current = clamped;

  const eased = smoothstep(clamped);
  const visualHeightPx = layout.compactPx + (layout.expandedPx - layout.compactPx) * (1 - eased);
  const layoutOffsetPx = visualHeightPx + layout.gapPx + layout.tasselPx;

  document.documentElement.style.setProperty('--header-collapse-progress', String(eased));
  document.documentElement.style.setProperty('--header-visual-height', `${visualHeightPx}px`);
  document.documentElement.style.setProperty('--layout-header-offset', `${layoutOffsetPx}px`);

  const media = window.matchMedia(MOBILE_HEADER_MQ);
  const lockScroll = media.matches && window.scrollY <= 0 && clamped < 1;
  document.body.classList.toggle('header-scroll-lock', lockScroll);

  return clamped;
}

export function useMobileHeaderCollapse(resetKey) {
  const [collapseProgress, setCollapseProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_HEADER_MQ).matches;
  });
  const progressRef = useRef(0);
  const layoutRef = useRef(measureLayoutCache());
  const rafRef = useRef(0);
  const pendingProgressRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_HEADER_MQ);

    const refreshLayout = () => {
      layoutRef.current = measureLayoutCache();
    };

    const dampenDelta = (deltaY, maxStep, damping) => {
      const scaled = deltaY * damping;
      if (Math.abs(scaled) <= maxStep) return scaled;
      return Math.sign(scaled) * maxStep;
    };

    const flushProgress = (value) => {
      const clamped = applyHeaderProgress(progressRef, value, layoutRef.current);
      setCollapseProgress(clamped);
    };

    const publish = (value) => {
      pendingProgressRef.current = value;
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        const next = pendingProgressRef.current;
        pendingProgressRef.current = null;
        if (next == null) return;
        flushProgress(next);
      });
    };

    const absorbDelta = (deltaY, maxStep, damping) => {
      if (!media.matches || window.scrollY > 0) return false;

      const range = layoutRef.current.collapseRangePx;
      const damped = dampenDelta(deltaY, maxStep, damping);
      let next = progressRef.current + damped / range;

      if (deltaY > 0 && next >= SNAP_COLLAPSE_AT) {
        next = 1;
      }

      if (next >= 1) {
        publish(1);
        return true;
      }

      if (next <= 0) {
        publish(0);
        return true;
      }

      publish(next);
      return true;
    };

    const onScroll = () => {
      if (!media.matches) {
        publish(1);
        return;
      }

      if (window.scrollY > 0) {
        publish(1);
        document.body.classList.remove('header-scroll-lock');
      } else if (progressRef.current >= 1) {
        document.body.classList.remove('header-scroll-lock');
      } else {
        applyHeaderProgress(progressRef, progressRef.current, layoutRef.current);
      }
    };

    const onWheel = (event) => {
      if (!media.matches || window.scrollY > 0) return;

      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;

      if ((progressRef.current < 1 && scrollingDown) || (progressRef.current > 0 && scrollingUp)) {
        event.preventDefault();
        absorbDelta(event.deltaY, MAX_WHEEL_STEP_PX, WHEEL_DAMPING);
      }
    };

    let touchStartY = 0;

    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event) => {
      if (document.body.classList.contains('header-tassel-drag')) return;
      if (!media.matches || window.scrollY > 0) return;

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      if (Math.abs(deltaY) < 0.5) return;

      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      if ((progressRef.current < 1 && scrollingDown) || (progressRef.current > 0 && scrollingUp)) {
        if (absorbDelta(deltaY, MAX_TOUCH_STEP_PX, TOUCH_DAMPING)) {
          event.preventDefault();
        }
      }
    };

    const onResize = () => {
      refreshLayout();
      publish(window.scrollY > 0 ? 1 : progressRef.current);
    };

    const onMediaChange = () => {
      setIsMobile(media.matches);
      refreshLayout();
      if (!media.matches) {
        publish(1);
        return;
      }
      publish(window.scrollY > 0 ? 1 : 0);
    };

    setIsMobile(media.matches);
    refreshLayout();
    window.scrollTo(0, 0);
    flushProgress(0);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', onResize);
    media.addEventListener('change', onMediaChange);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onMediaChange);
      document.body.classList.remove('header-scroll-lock');
      document.documentElement.style.removeProperty('--header-collapse-progress');
      document.documentElement.style.removeProperty('--header-visual-height');
      document.documentElement.style.removeProperty('--layout-header-offset');
    };
  }, [resetKey]);

  const isCompact = collapseProgress >= 0.998;

  return { collapseProgress, isCompact, isMobile };
}
