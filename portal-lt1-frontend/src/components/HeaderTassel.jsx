import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { getDailyMotivation } from '../utils/dailyMotivation.js';

const ROLL_HEIGHT_PX = 26;
const PAPER_EXTRA_PX = 8;
const MAX_OPEN_CAP_PX = 340;
const TASSEL_RETRACT_AT = 0.32;

function collapseRetractAmount(collapseProgress) {
  const t = Math.min(1, collapseProgress / TASSEL_RETRACT_AT);
  return t ** 1.28;
}

function formatMessageDate(date = new Date()) {
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' });
}

function TasselSvg({ compact = false }) {
  const uid = useId().replace(/:/g, '');
  const cord = `htCord-${uid}`;
  const band = `htBand-${uid}`;
  const knot = `htKnot-${uid}`;
  const fringeA = `htFringeA-${uid}`;
  const fringeB = `htFringeB-${uid}`;
  const glow = `htGlow-${uid}`;

  return (
    <svg
      className={`site-header-tassel-svg${compact ? ' site-header-tassel-svg--compact' : ''}`}
      viewBox="0 0 52 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={cord} x1="26" y1="0" x2="26" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9a8bd8" />
          <stop offset="0.4" stopColor="#6a57b8" />
          <stop offset="0.75" stopColor="#4b2978" />
          <stop offset="1" stopColor="#e8c04a" />
        </linearGradient>
        <linearGradient id={band} x1="12" y1="48" x2="40" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff8dc" />
          <stop offset="0.5" stopColor="#e8c04a" />
          <stop offset="1" stopColor="#a88432" />
        </linearGradient>
        <radialGradient id={knot} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26 58.5) scale(8.5 5.5)">
          <stop stopColor="#8a78c8" />
          <stop offset="0.5" stopColor="#4b2978" />
          <stop offset="1" stopColor="#2a1648" />
        </radialGradient>
        <linearGradient id={fringeA} x1="26" y1="64" x2="26" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2dc7a" />
          <stop offset="0.5" stopColor="#e8c04a" />
          <stop offset="1" stopColor="#7d6bc4" />
        </linearGradient>
        <linearGradient id={fringeB} x1="26" y1="66" x2="26" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0b84a" />
          <stop offset="1" stopColor="#5c4898" />
        </linearGradient>
        <filter id={glow} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#4b2978" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter={`url(#${glow})`}>
        <circle cx="26" cy="2.5" r="2.2" fill={`url(#${cord})`} />
        <path d="M26 4.5v42.5" stroke={`url(#${cord})`} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M27.2 7v38" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.28" />
        <rect x="12.5" y="46.5" width="27" height="6.5" rx="3.25" fill={`url(#${band})`} stroke="#c9a032" strokeWidth="0.6" />
        <rect x="14" y="47.8" width="24" height="1.6" rx="0.8" fill="#fff" opacity="0.5" />
        <ellipse cx="26" cy="58.5" rx="8.2" ry="5" fill={`url(#${knot})`} />
        <ellipse cx="24.5" cy="57.2" rx="2.8" ry="1.4" fill="#fff" opacity="0.22" />
        <path d="M15.5 63.8 Q26 62.2 36.5 63.8" stroke="#b88928" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <g strokeLinecap="round">
          <path d="M26 64.5 Q25.2 80 26 97" stroke={`url(#${fringeA})`} strokeWidth="2.3" />
          <path d="M22.5 65 Q21.5 80.5 23 94.5" stroke={`url(#${fringeB})`} strokeWidth="1.95" />
          <path d="M29.5 65 Q30.5 80.5 29 94.5" stroke={`url(#${fringeB})`} strokeWidth="1.95" />
          <path d="M19 66 Q17 81 19.5 92" stroke={`url(#${fringeA})`} strokeWidth="1.65" opacity="0.92" />
          <path d="M33 66 Q35 81 32.5 92" stroke={`url(#${fringeA})`} strokeWidth="1.65" opacity="0.92" />
          <path d="M15.5 67.5 Q13 82 16 89" stroke="#e8c04a" strokeWidth="1.35" opacity="0.88" />
          <path d="M36.5 67.5 Q39 82 36 89" stroke="#e8c04a" strokeWidth="1.35" opacity="0.88" />
          <path d="M12 69.5 Q9.5 83 12.5 86.5" stroke="#d4b04a" strokeWidth="1.15" opacity="0.8" />
          <path d="M40 69.5 Q42.5 83 39.5 86.5" stroke="#d4b04a" strokeWidth="1.15" opacity="0.8" />
          <path d="M19 96.2 Q26 98.5 33 96.2" stroke="#6a57b8" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>
      </g>
    </svg>
  );
}

function TasselClosedTab() {
  return (
    <span className="site-header-tassel-tab" aria-hidden="true">
      <span className="site-header-tassel-tab-mark" aria-hidden="true">
        ✦
      </span>
      <span className="site-header-tassel-tab-text">Mesajul zilei</span>
      <svg className="site-header-tassel-tab-chevron" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M5 2v4.2M5 6.2l-1.6-1.6M5 6.2l1.6-1.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function HeaderTassel({ collapseProgress = 0, autoCloseOnScroll = false }) {
  const [pullPx, setPullPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unfoldPulse, setUnfoldPulse] = useState(false);
  const [textHeightPx, setTextHeightPx] = useState(72);
  const wasOpenRef = useRef(false);
  const pullPxRef = useRef(0);
  const dragRef = useRef({ active: false, startY: 0, startPull: 0 });
  const handleRef = useRef(null);
  const measureRef = useRef(null);
  const metricsRef = useRef({ fullOpen: 120, snapOpen: 56 });

  const dailyMessage = useMemo(() => getDailyMotivation(), []);
  const messageDate = useMemo(() => formatMessageDate(), []);

  const fullOpenHeight = Math.max(
    88,
    Math.min(MAX_OPEN_CAP_PX, ROLL_HEIGHT_PX + textHeightPx + PAPER_EXTRA_PX),
  );
  const snapOpen = Math.max(52, Math.min(96, Math.round(fullOpenHeight * 0.38)));

  metricsRef.current = { fullOpen: fullOpenHeight, snapOpen };

  pullPxRef.current = pullPx;

  useEffect(() => {
    const node = measureRef.current;
    if (!node) return undefined;

    const measure = () => {
      setTextHeightPx(node.scrollHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [dailyMessage.text]);

  const retractAmount = collapseRetractAmount(collapseProgress);
  const displayPull = pullPx * (1 - retractAmount);
  const widgetOpacity = 1 - retractAmount * 0.92;
  const widgetScale = 1 - retractAmount * 0.18;

  useEffect(() => {
    if (isDragging || dragRef.current.active) return;
    if (collapseProgress >= 0.98) {
      setPullPx(0);
    }
  }, [collapseProgress, isDragging]);

  useEffect(() => {
    if (!autoCloseOnScroll) return undefined;

    const closeIfOpen = () => {
      if (dragRef.current.active) return;
      if (pullPxRef.current < 12) return;
      setPullPx(0);
    };

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 0.5) return;
      closeIfOpen();
    };

    window.addEventListener('scroll', closeIfOpen, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', closeIfOpen);
      window.removeEventListener('wheel', onWheel);
    };
  }, [autoCloseOnScroll]);

  const endDrag = useCallback((snap = true) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    document.body.classList.remove('header-tassel-drag');

    if (snap) {
      const { fullOpen, snapOpen: snapAt } = metricsRef.current;
      setPullPx((prev) => (prev >= snapAt ? fullOpen : 0));
    }
  }, []);

  const onPointerMove = useCallback((event) => {
    if (!dragRef.current.active) return;
    const dy = event.clientY - dragRef.current.startY;
    const max = metricsRef.current.fullOpen;
    const next = Math.max(0, Math.min(max, dragRef.current.startPull + dy));
    setPullPx(next);
  }, []);

  const onPointerUp = useCallback(
    (event) => {
      if (!dragRef.current.active) return;
      handleRef.current?.releasePointerCapture?.(event.pointerId);
      endDrag(true);
    },
    [endDrag],
  );

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.body.classList.remove('header-tassel-drag');
    };
  }, [onPointerMove, onPointerUp]);

  const onPointerDown = (event) => {
    if (retractAmount >= 0.98) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = { active: true, startY: event.clientY, startPull: pullPxRef.current };
    setIsDragging(true);
    document.body.classList.add('header-tassel-drag');
    handleRef.current?.setPointerCapture?.(event.pointerId);
  };

  const isOpen = displayPull >= snapOpen;
  const isClosed = !isOpen && displayPull < 8 && !isDragging;
  const isAnchored = isClosed;
  const isExtended = !isAnchored;
  const paperVisible = displayPull > 6;
  const collapsingHeader = collapseProgress > 0.02 && !isDragging;
  const openProgress =
    fullOpenHeight > 0 ? Math.min(1, Math.max(0, displayPull / fullOpenHeight)) : 0;

  useEffect(() => {
    const root = document.documentElement;
    if (!isOpen || isDragging) {
      root.style.removeProperty('--tassel-content-offset');
      root.classList.remove('tassel-scroll-open');
      return undefined;
    }
    const overhang = Math.max(0, Math.round(fullOpenHeight - ROLL_HEIGHT_PX));
    root.style.setProperty('--tassel-content-offset', `${overhang}px`);
    root.classList.add('tassel-scroll-open');
    return () => {
      root.style.removeProperty('--tassel-content-offset');
      root.classList.remove('tassel-scroll-open');
    };
  }, [isOpen, isDragging, fullOpenHeight]);

  useEffect(() => {
    if (isOpen && !isDragging && !wasOpenRef.current) {
      setUnfoldPulse(true);
      const timer = window.setTimeout(() => setUnfoldPulse(false), 880);
      return () => window.clearTimeout(timer);
    }
    wasOpenRef.current = isOpen;
    return undefined;
  }, [isOpen, isDragging]);

  return (
    <div
      className={[
        'site-header-tassel-widget',
        isDragging && 'site-header-tassel-widget--dragging',
        isOpen && 'site-header-tassel-widget--open',
        isClosed && 'site-header-tassel-widget--closed',
        isAnchored && 'site-header-tassel-widget--anchored',
        isExtended && 'site-header-tassel-widget--extended',
        unfoldPulse && 'site-header-tassel-widget--unfold',
        collapsingHeader && 'site-header-tassel-widget--header-collapse'
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        opacity: widgetOpacity,
        transform: isExtended ? `translateY(100%) scale(${widgetScale})` : `scale(${widgetScale})`,
        transformOrigin: 'top right',
        pointerEvents: retractAmount >= 0.98 ? 'none' : undefined
      }}
    >
      <div className="site-header-scroll-measure" aria-hidden="true">
        <div ref={measureRef} className="site-header-scroll-inner site-header-scroll-inner--measure">
          <p className="site-header-scroll-greeting">Mesajul zilei</p>
          <p className="site-header-scroll-body">{dailyMessage.text}</p>
          <p className="site-header-scroll-date">{messageDate}</p>
        </div>
      </div>

      <div
        className="site-header-scroll-paper"
        style={{
          height: paperVisible ? `${displayPull}px` : '0px',
          '--paper-progress': openProgress
        }}
        aria-hidden={!paperVisible}
      >
        <div className="site-header-scroll-roll" aria-hidden="true" />
        <div className="site-header-scroll-shine" aria-hidden="true" />
        <div className="site-header-scroll-inner">
          <p className="site-header-scroll-greeting">Mesajul zilei</p>
          <p className="site-header-scroll-body">{dailyMessage.text}</p>
          <p className="site-header-scroll-date">{messageDate}</p>
        </div>
      </div>

      <button
        ref={handleRef}
        type="button"
        className="site-header-tassel-handle"
        aria-label={isOpen ? 'Trage în sus pentru a înfășura mesajul' : 'Trage în jos pentru mesajul zilei'}
        aria-expanded={isOpen}
        onPointerDown={onPointerDown}
        onDragStart={(e) => e.preventDefault()}
      >
        {isAnchored ? <TasselClosedTab /> : null}
        {isExtended ? (
          <span className="site-header-tassel-visual">
            <TasselSvg compact={isClosed && displayPull < 24} />
          </span>
        ) : null}
      </button>
    </div>
  );
}

export default HeaderTassel;
