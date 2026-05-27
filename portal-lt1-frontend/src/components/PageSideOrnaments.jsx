/** Contur dințat pentru ornament (viewBox 64) */
function miniGearPath(cx, cy, teeth, pitchR, toothH) {
  const outerR = pitchR + toothH * 0.48;
  const innerR = pitchR - toothH * 0.52;
  const step = (Math.PI * 2) / teeth;
  const points = [];
  for (let t = 0; t < teeth; t += 1) {
    const base = t * step - Math.PI / 2;
    const toothHalf = step * 0.19;
    const valleyHalf = step * 0.31;
    points.push([cx + Math.cos(base - valleyHalf) * innerR, cy + Math.sin(base - valleyHalf) * innerR]);
    points.push([cx + Math.cos(base - toothHalf) * outerR, cy + Math.sin(base - toothHalf) * outerR]);
    points.push([cx + Math.cos(base + toothHalf) * outerR, cy + Math.sin(base + toothHalf) * outerR]);
    points.push([cx + Math.cos(base + valleyHalf) * innerR, cy + Math.sin(base + valleyHalf) * innerR]);
  }
  const [first, ...rest] = points;
  return `M ${first[0].toFixed(1)} ${first[1].toFixed(1)} ${rest.map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')} Z`;
}

const GEAR_SHAPE = miniGearPath(32, 32, 14, 21, 5.5);

/** Line-art tehnic — calificări și profil „Tehnologic” */
const ORNAMENTS = {
  gear: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path
        d={GEAR_SHAPE}
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle cx="32" cy="32" r="2" fill="currentColor" fillOpacity="0.25" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path
        d="M11 53 33 31"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M33 31 L51 13 M33 31 L51 49"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51 13 L57 19 M51 49 L57 43"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  screwdriver: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path
        d="M32 10v30"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M22 40h20l-4 14H26l-4-14Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M28 40h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </svg>
  ),  /* Electronică / IT */
  circuit: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <rect x="11" y="13" width="42" height="38" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M19 27h12l4 4h10M19 35h8l6-6h12M25 43h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="27" r="2.2" fill="currentColor" opacity="0.45" />
      <circle cx="45" cy="31" r="2.2" fill="currentColor" opacity="0.45" />
      <circle cx="39" cy="43" r="2.2" fill="currentColor" opacity="0.45" />
      <path d="M11 22h-4M53 22h4M11 42h-4M53 42h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  ),
  microchip: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <rect x="19" y="19" width="26" height="26" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <rect x="24" y="24" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path
        d="M19 26h-6M19 32h-6M19 38h-6M45 26h6M45 32h6M45 38h6M26 19v-6M32 19v-6M38 19v-6M26 45v6M32 45v6M38 45v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <rect x="12" y="16" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M18 26h28M18 32h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M8 44h48l-5 8H13l-5-8Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M26 44v8M38 44v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </svg>
  ),
  /* Desen tehnic / măsurători */
  compass: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <circle cx="32" cy="17" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M32 21v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M32 27 18 52M32 27 46 52"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 48h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
      <path d="M18 52 14 56M46 52 50 56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  ),
  caliper: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path d="M14 46h36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 46v-28M22 46V22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M38 46V18l8-6v34" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M18 38h20M18 34h14M18 30h18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M30 18v6M34 20v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  /* Științe / manual tehnic */
  atom: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="currentColor" strokeWidth="1.9" transform="rotate(28 32 32)" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="currentColor" strokeWidth="1.9" transform="rotate(-28 32 32)" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="32" r="1.8" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path
        d="M11 13c7-3 16-3 21 1v38c-5-3-14-3-21 0V13Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 14c5-4 14-4 21-1v38c-7-3-16-3-21-1V14Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M32 14v38" stroke="currentColor" strokeWidth="2" />
      <path
        d="M17 24h7M17 30h9M38 26h8M38 32h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M20 36h5M37 38h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="page-side-ornament-svg">
      <path d="M8 28 32 18l24 10-24 10-24-10Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M48 28v10c0 4-7 8-16 8s-16-4-16-8V28"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M52 30v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="52" cy="46" r="2.5" fill="currentColor" opacity="0.35" />
    </svg>
  )
};

const CONFETTI_COLORS = ['#6a57b8', '#e8c04a', '#4b2978', '#c9a032', '#5b8fd9', '#e86d8f', '#3d9b7a', '#f0a030'];
const CONFETTI_MOTIONS = ['confetti-drift-a', 'confetti-drift-b', 'confetti-drift-c'];

/** depth: focus | near | soft | back-mid | back-far */
function buildConfetti(side, seed = 0) {
  return Array.from({ length: 6 }, (_, index) => {
    const i = index + seed;
    const shape = i % 3;
    const size = 5 + (i % 3);
    return {
      id: `${side}-confetti-${index}`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: shape === 0 ? 'rect' : shape === 1 ? 'circle' : 'strip',
      top: `${5 + ((i * 23 + seed * 5) % 88)}%`,
      offset: `${4 + ((i * 29 + seed * 7) % 76)}%`,
      size,
      duration: `${11 + (i % 4) * 2}s`,
      delay: `${-(i * 2.1 + seed * 0.6)}s`,
      motion: CONFETTI_MOTIONS[i % CONFETTI_MOTIONS.length],
      opacity: 0.28 + (i % 3) * 0.06,
      distant: size <= 6
    };
  });
}

const LEFT_CONFETTI = buildConfetti('left', 0);
const RIGHT_CONFETTI = buildConfetti('right', 11);

/* Poziții intenționat asimetrice — fără oglindă stânga/dreapta */
const LEFT_BACK = [
  { id: 'lb-atom', type: 'atom', style: { top: '52%', right: '40%' }, tone: 'purple', depth: 'back-far', size: 108 },
  { id: 'lb-book', type: 'book', style: { top: '11%', right: '14%' }, tone: 'gold', depth: 'back-mid', size: 92 }
];

const RIGHT_BACK = [
  { id: 'rb-cap', type: 'cap', style: { top: '71%', left: '9%' }, tone: 'gold', depth: 'back-far', size: 104 },
  { id: 'rb-circuit', type: 'circuit', style: { top: '33%', left: '44%' }, tone: 'purple', depth: 'back-mid', size: 88 }
];

const LEFT = [
  { id: 'l-circuit', type: 'circuit', style: { top: '6%', right: '24%' }, tone: 'purple', motion: 'float-a', depth: 'soft', size: 50 },
  { id: 'l-book', type: 'book', style: { top: '21%', right: '3%' }, tone: 'gold', motion: 'drift-a', depth: 'focus', size: 68 },
  { id: 'l-atom', type: 'atom', style: { top: '43%', right: '32%' }, tone: 'purple', motion: 'float-b', depth: 'near', size: 58 },
  { id: 'l-gear', type: 'gear', style: { top: '69%', right: '7%' }, tone: 'gold', motion: 'static', depth: 'soft', size: 46 }
];

const RIGHT = [
  { id: 'r-laptop', type: 'laptop', style: { top: '9%', left: '5%' }, tone: 'gold', motion: 'static', depth: 'soft', size: 46 },
  { id: 'r-cap', type: 'cap', style: { top: '19%', left: '31%' }, tone: 'gold', motion: 'float-a', depth: 'focus', size: 64 },
  { id: 'r-atom', type: 'atom', style: { top: '37%', left: '4%' }, tone: 'purple', motion: 'float-b', depth: 'soft', size: 52 },
  { id: 'r-book', type: 'book', style: { top: '61%', left: '37%' }, tone: 'purple', motion: 'drift-b', depth: 'near', size: 56 }
];

function SideSpiral({ variant = 'a', mirror = false }) {
  const gradId = `spiral-${variant}-${mirror ? 'r' : 'l'}`;
  return (
    <div className={`page-side-spiral page-side-spiral--${variant}${mirror ? ' page-side-spiral--mirror' : ''}`}>
      <svg viewBox="0 0 48 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a57b8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e8c04a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#4b2978" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path
          d="M24 4 C38 48 8 92 24 136 C40 180 10 224 24 268 C38 312 12 340 24 356"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M24 20 C34 58 14 96 24 134 C34 172 14 210 24 248 C34 286 18 318 24 340"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

function ConfettiPiece({ piece, side }) {
  const posStyle =
    side === 'left'
      ? { top: piece.top, right: piece.offset }
      : { top: piece.top, left: piece.offset };

  return (
    <span
      className={[
        'page-side-confetti',
        `page-side-confetti--${piece.shape}`,
        `page-side-confetti--${piece.motion}`,
        piece.distant && 'page-side-confetti--distant'
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...posStyle,
        '--confetti-color': piece.color,
        '--confetti-size': `${piece.size}px`,
        '--confetti-dur': piece.duration,
        '--confetti-delay': piece.delay,
        opacity: piece.opacity
      }}
    />
  );
}

function SideItem({ item, mirror = false }) {
  const classes = [
    'page-side-ornament',
    `page-side-ornament--${item.tone}`,
    item.depth && `page-side-ornament--depth-${item.depth}`,
    item.motion && item.motion !== 'static' && `page-side-ornament--${item.motion}`,
    mirror && 'page-side-ornament--mirror'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        ...item.style,
        '--ornament-size': `${item.size}px`
      }}
    >
      {ORNAMENTS[item.type]}
    </div>
  );
}

function PageSideOrnaments() {
  return (
    <div className="page-side-ornaments" aria-hidden="true">
      <div className="page-side-ornaments__glow page-side-ornaments__glow--left" />
      <div className="page-side-ornaments__glow page-side-ornaments__glow--right" />

      <div className="page-side-ornaments__column page-side-ornaments__column--left">
        <div className="page-side-ornaments__layer page-side-ornaments__layer--back">
          {LEFT_BACK.map((item) => (
            <SideItem key={item.id} item={item} />
          ))}
        </div>
        <SideSpiral variant="a" />
        <SideSpiral variant="b" />
        <div className="page-side-ornaments__layer page-side-ornaments__layer--mid">
          {LEFT_CONFETTI.map((piece) => (
            <ConfettiPiece key={piece.id} piece={piece} side="left" />
          ))}
        </div>
        <div className="page-side-ornaments__layer page-side-ornaments__layer--front">
          {LEFT.map((item) => (
            <SideItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="page-side-ornaments__column page-side-ornaments__column--right">
        <div className="page-side-ornaments__layer page-side-ornaments__layer--back">
          {RIGHT_BACK.map((item) => (
            <SideItem key={item.id} item={item} mirror />
          ))}
        </div>
        <SideSpiral variant="a" mirror />
        <SideSpiral variant="b" mirror />
        <div className="page-side-ornaments__layer page-side-ornaments__layer--mid">
          {RIGHT_CONFETTI.map((piece) => (
            <ConfettiPiece key={piece.id} piece={piece} side="right" />
          ))}
        </div>
        <div className="page-side-ornaments__layer page-side-ornaments__layer--front">
          {RIGHT.map((item) => (
            <SideItem key={item.id} item={item} mirror />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageSideOrnaments;
