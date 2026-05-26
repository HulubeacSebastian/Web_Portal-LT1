import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { getDailyMotivation } from '../utils/dailyMotivation.js';

const MAX_PULL = 248;
const SNAP_OPEN = 108;
/** Ciucurelul dispare înainte ca headerul să ajungă la dimensiune minimă. */
const TASSEL_RETRACT_AT = 0.32;

function collapseRetractAmount(collapseProgress) {
  const t = Math.min(1, collapseProgress / TASSEL_RETRACT_AT);
  return t ** 1.28;
}

function TasselSvg() {
  const uid = useId().replace(/:/g, '');
  const cord = `htCord-${uid}`;
  const band = `htBand-${uid}`;
  const knot = `htKnot-${uid}`;
  const fringeA = `htFringeA-${uid}`;
  const fringeB = `htFringeB-${uid}`;
  const glow = `htGlow-${uid}`;

  return (
    <svg className="site-header-tassel-svg" viewBox="0 0 52 104" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
          <stop offset="1" stopColor="#2a1642" />
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
        <path
          d="M15.5 63.8 Q26 62.2 36.5 63.8"
          stroke="#b88928"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
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

function TasselHint() {
  return (
    <span className="site-header-tassel-hint" aria-hidden="true">
      <span className="site-header-tassel-hint-text">Trage</span>
      <svg className="site-header-tassel-hint-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M6 2.5v5.2M6 7.7l-2.2-2.2M6 7.7l2.2-2.2"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function HeaderTassel({ collapseProgress = 0 }) {
  const [pullPx, setPullPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pullPxRef = useRef(0);
  const dragRef = useRef({ active: false, startY: 0, startPull: 0 });
  const handleRef = useRef(null);

  const dailyMessage = useMemo(() => getDailyMotivation(), []);

  pullPxRef.current = pullPx;

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

  const endDrag = useCallback((snap = true) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    document.body.classList.remove('header-tassel-drag');

    if (snap) {
      setPullPx((prev) => (prev >= SNAP_OPEN ? MAX_PULL : 0));
    }
  }, []);

  const onPointerMove = useCallback((event) => {
    if (!dragRef.current.active) return;
    const dy = event.clientY - dragRef.current.startY;
    const next = Math.max(0, Math.min(MAX_PULL, dragRef.current.startPull + dy));
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

  const isOpen = displayPull >= SNAP_OPEN;
  const paperVisible = displayPull > 6;
  const collapsingHeader = collapseProgress > 0.02 && !isDragging;

  return (
    <div
      className={`site-header-tassel-widget${isDragging ? ' site-header-tassel-widget--dragging' : ''}${isOpen ? ' site-header-tassel-widget--open' : ''}${collapsingHeader ? ' site-header-tassel-widget--header-collapse' : ''}`}
      style={{
        opacity: widgetOpacity,
        transform: `translateY(100%) scale(${widgetScale})`,
        transformOrigin: 'top left',
        pointerEvents: retractAmount >= 0.98 ? 'none' : undefined
      }}
    >
      <div
        className="site-header-scroll-paper"
        style={{ height: `${displayPull}px` }}
        aria-hidden={!paperVisible}
      >
        <div className="site-header-scroll-roll" aria-hidden="true" />
        <div
          className="site-header-scroll-inner"
          style={{ opacity: paperVisible ? Math.min(1, (displayPull - 12) / 48) : 0 }}
        >
          <p className="site-header-scroll-greeting">Mesajul zilei</p>
          <p className="site-header-scroll-body">{dailyMessage.text}</p>
          <p className="site-header-scroll-quote">{dailyMessage.author}</p>
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
        {!isOpen && displayPull < 24 && retractAmount < 0.15 ? <TasselHint /> : null}
        <span className="site-header-tassel-visual">
          <TasselSvg />
        </span>
      </button>
    </div>
  );
}

export default HeaderTassel;
