import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDailyMotivation } from '../utils/dailyMotivation.js';

const ROLL_HEIGHT_PX = 0;
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

function DailyMessagePanel({ messageDate, text, measure = false }) {
  const innerClass = [
    'site-header-scroll-inner',
    measure ? 'site-header-scroll-inner--measure' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={innerClass}>
      <header className="site-header-daily-head">
        <span className="site-header-daily-badge">Mesajul zilei</span>
        <time className="site-header-scroll-date" dateTime={messageDate}>
          {messageDate}
        </time>
      </header>
      <blockquote className="site-header-scroll-body">
        <span className="site-header-daily-quote" aria-hidden="true">
          “
        </span>
        {text}
      </blockquote>
    </div>
  );
}

function DailyMessageTab() {
  return (
    <span className="site-header-daily-tab" aria-hidden="true">
      <span className="site-header-daily-tab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <path
            d="M7 8.5h10M7 12h7M6 5.5h12a2 2 0 0 1 2 2v9.5l-3-2H6a2 2 0 0 1-2-2v-7.5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="site-header-daily-tab__label">Mesajul zilei</span>
      <svg className="site-header-daily-tab__chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function DailyMessagePullHandle({ isOpen }) {
  return (
    <span className="site-header-daily-pull" aria-hidden="true">
      <span className="site-header-daily-pull__grip" />
      <svg className="site-header-daily-pull__chevron" viewBox="0 0 12 12" fill="none">
        {isOpen ? (
          <path d="M3 8l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M3 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
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
        <div ref={measureRef}>
          <DailyMessagePanel messageDate={messageDate} text={dailyMessage.text} measure />
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
        <DailyMessagePanel messageDate={messageDate} text={dailyMessage.text} />
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
        {isAnchored ? <DailyMessageTab /> : null}
        {isExtended ? (
          <span className="site-header-daily-pull-wrap">
            <DailyMessagePullHandle isOpen={isOpen} />
          </span>
        ) : null}
      </button>
    </div>
  );
}

export default HeaderTassel;
