const stroke = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

export function IconStudents() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <circle cx="18" cy="14" r="5" {...stroke} />
      <circle cx="32" cy="16" r="4.5" {...stroke} />
      <path d="M8 38c2-8 8-12 10-12s8 4 10 12" {...stroke} />
      <path d="M26 36c1.5-6 6-9 8-9s6.5 3 8 9" {...stroke} />
      <path d="M24 22v6M21 25h6" {...stroke} />
    </svg>
  );
}

export function IconClassrooms() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <rect x="8" y="12" width="32" height="26" rx="3" {...stroke} />
      <path d="M8 20h32M16 12V8h16v4" {...stroke} />
      <path d="M14 28h8M26 28h8M14 34h20" {...stroke} />
      <circle cx="36" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconLabs() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <path d="M16 10h16l-4 22H20L16 10z" {...stroke} />
      <path d="M14 32h20" {...stroke} />
      <circle cx="24" cy="36" r="3" {...stroke} />
      <path d="M22 18h4M21 24h6" {...stroke} />
      <path d="M30 8l4 4" {...stroke} />
    </svg>
  );
}

export function IconStaff() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <circle cx="24" cy="14" r="6" {...stroke} />
      <path d="M10 40c2-10 8-14 14-14s12 4 14 14" {...stroke} />
      <rect x="30" y="22" width="10" height="14" rx="2" {...stroke} />
      <path d="M33 28h4M33 32h4" {...stroke} />
    </svg>
  );
}

const offerSvg = 'home2-icon-svg home2-icon-svg--offer';
const strokeBold = { ...stroke, strokeWidth: 2 };

export function IconTourism() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={offerSvg}>
      <circle cx="24" cy="25" r="12" {...stroke} />
      <path d="M24 13v2.5M24 34.5v2.5M12 25h2.5M33.5 25h2.5" {...stroke} />
      <path d="M16 18l1.8 1.8M32 32l1.8 1.8M32 18l-1.8 1.8M16 32l-1.8 1.8" {...stroke} />
      <path d="M24 25V17" {...strokeBold} />
      <path d="M24 25l4.5 3.5" {...stroke} />
      <path d="M24 17l-1.2 3.2h2.4L24 17z" fill="currentColor" opacity="0.5" />
      <path d="M29 11c1.8.8 2.8 2.2 3 4" {...stroke} />
      <circle cx="31" cy="10" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function IconMechanic() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={offerSvg}>
      <path
        d="M24 12.5l2.1 4.3 4.8.7-3.5 3.4.8 4.7-4.3-2.3-4.3 2.3.8-4.7-3.5-3.4 4.8-.7 2.1-4.3z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M24 14.5l1.7 3.5 3.9.6-2.8 2.7.7 3.8-3.5-1.8-3.5 1.8.7-3.8-2.8-2.7 3.9-.6 1.7-3.5z"
        {...stroke}
      />
      <circle cx="24" cy="23.5" r="4.5" {...stroke} />
      <path d="M30 29.5l9.5 7.5" {...strokeBold} />
      <path d="M37.5 35l3.5-2-2-3.5-3.5 2 2 3.5z" fill="currentColor" opacity="0.38" {...stroke} />
      <rect x="8" y="27" width="8" height="7" rx="1.2" {...stroke} />
      <path d="M10 30.5h4" {...stroke} />
    </svg>
  );
}

export function IconHospitality() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={offerSvg}>
      <path d="M15 21c0-6.5 4-10.5 9-10.5s9 4 9 10.5c0 1.8-.4 3.2-1.2 4.2" {...stroke} />
      <path d="M13.5 25.5c1.4 5.5 5.5 8.5 10.5 8.5s9.1-3 10.5-8.5" {...stroke} />
      <path d="M14 26h20" {...stroke} />
      <path d="M17 17.5c1.8-1.8 4.5-2.5 7-2.5s5.2.7 7 2.5" {...stroke} />
      <path d="M19 14.5c1.2-1 3-1.5 5-1.5s3.8.5 5 1.5" {...stroke} />
      <path d="M21 12c.8-.7 2-1 3-1s2.2.3 3 1" {...stroke} />
      <path d="M20 31h8v2.5c0 1.8-1.8 2.5-4 2.5s-4-.7-4-2.5V31z" fill="currentColor" opacity="0.2" />
      <path d="M20 31h8v2.5c0 1.8-1.8 2.5-4 2.5s-4-.7-4-2.5V31z" {...stroke} />
      <path d="M30 33h4v3h-4zM14 33h4v3h-4z" {...stroke} />
    </svg>
  );
}

export function IconDual() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={offerSvg}>
      <rect x="7" y="17" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="7" y="17" width="13" height="17" rx="2" {...stroke} />
      <path d="M7 23h13M10 17v-4h7v4" {...stroke} />
      <rect x="28" y="20" width="13" height="17" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="28" y="20" width="13" height="17" rx="2" {...stroke} />
      <path d="M31 25h7M31 29h7M31 33h5" {...stroke} />
      <path d="M20 27h8" {...strokeBold} />
      <path d="M17.5 27.5c2-3 4.5-4.5 6.5-4.5S27 24.5 28.5 27.5" {...stroke} />
      <path d="M30.5 27.5c-2-3-4.5-4.5-6.5-4.5S21 24.5 19.5 27.5" {...stroke} />
      <circle cx="24" cy="28" r="2.5" {...stroke} />
    </svg>
  );
}

export function IconConstruction() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={offerSvg}>
      <path d="M7 38h34" {...strokeBold} />
      <path d="M13 38V23l11-8 11 8v15" fill="currentColor" opacity="0.12" />
      <path d="M13 38V23l11-8 11 8v15" {...stroke} />
      <path d="M19 38V29h10v9" {...stroke} />
      <path d="M29 38V25h7v13" {...stroke} />
      <path d="M21.5 15l2.5-8 2.5 8" {...stroke} />
      <path d="M9 31l4.5-3.5L18 31" {...stroke} />
      <path d="M31 13l7 4.5v5L31 27l-7-4.5v-5L31 13z" fill="currentColor" opacity="0.18" />
      <path d="M31 13l7 4.5v5L31 27l-7-4.5v-5L31 13z" {...stroke} />
      <path d="M31 17.5v5.5M28 20.5h6" {...stroke} />
      <path d="M33.5 34.5l6.5 5" {...strokeBold} />
      <path d="M38 37.5l2.5-2.5-2.5-2.5-2.5 2.5 2.5 2.5z" fill="currentColor" opacity="0.4" {...stroke} />
    </svg>
  );
}

const offerIconMap = {
  tourism: IconTourism,
  mechanic: IconMechanic,
  hospitality: IconHospitality,
  dual: IconDual,
  construction: IconConstruction
};

export function OfferIcon({ type }) {
  const Cmp = offerIconMap[type] || IconTourism;
  return <Cmp />;
}

const statIconMap = {
  elevi: IconStudents,
  'săli de clasă': IconClassrooms,
  'laboratoare și ateliere': IconLabs,
  angajați: IconStaff
};

export function StatIcon({ label }) {
  const Cmp = statIconMap[label] || IconStudents;
  return <Cmp />;
}

export function IconGraduation() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg home2-icon-svg--sm">
      <path d="M8 20l16-8 16 8-16 8-16-8z" {...stroke} />
      <path d="M40 20v10M24 28v8" {...stroke} />
      <path d="M14 24v8c0 4 4 6 10 6s10-2 10-6v-8" {...stroke} />
    </svg>
  );
}

export function IconBackpack() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg home2-icon-svg--sm">
      <rect x="14" y="16" width="20" height="24" rx="4" {...stroke} />
      <path d="M18 16v-4c0-3 3-6 6-6s6 3 6 6v4" {...stroke} />
      <path d="M20 26h8" {...stroke} />
    </svg>
  );
}

export function IconBooks() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg home2-icon-svg--sm">
      <path d="M10 12h12v28H10zM26 12h12v28H26z" {...stroke} />
      <path d="M16 12V8M32 12V8" {...stroke} />
      <path d="M14 20h4M30 20h4" {...stroke} />
    </svg>
  );
}

export function IconTeacher() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg home2-icon-svg--sm">
      <circle cx="24" cy="14" r="5" {...stroke} />
      <path d="M12 38c2-8 6-12 12-12s10 4 12 12" {...stroke} />
      <rect x="28" y="26" width="12" height="10" rx="2" {...stroke} />
      <path d="M30 30h8" {...stroke} />
    </svg>
  );
}

export function IconAuxStaff() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg home2-icon-svg--sm">
      <circle cx="20" cy="14" r="5" {...stroke} />
      <path d="M8 38c2-7 6-11 12-11s10 4 12 11" {...stroke} />
      <path d="M32 18h8v20h-8z" {...stroke} />
    </svg>
  );
}

const breakdownIconMap = {
  graduation: IconGraduation,
  backpack: IconBackpack,
  classroom: IconClassrooms,
  lab: IconLabs,
  teacher: IconTeacher,
  auxiliary: IconAuxStaff,
  students: IconStudents,
  rooms: IconClassrooms,
  staff: IconStaff
};

export function BreakdownIcon({ type }) {
  const Cmp = breakdownIconMap[type] || IconStudents;
  return <Cmp />;
}

export function ErasmusLogo() {
  return (
    <svg
      viewBox="0 0 108 36"
      width="108"
      height="36"
      aria-hidden="true"
      className="home2-partner-logo"
      overflow="visible"
    >
      <circle cx="18" cy="18" r="13" fill="#003399" />
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x = 18 + 7.5 * Math.cos(a);
        const y = 18 + 7.5 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="1.25" fill="#FFCC00" />;
      })}
      <text x="38" y="22" fill="currentColor" fontSize="12" fontWeight="800" fontFamily="system-ui,sans-serif">
        ERASMUS+
      </text>
    </svg>
  );
}

export function CseLogo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="home2-cse-logo">
      <circle cx="32" cy="32" r="28" fill="rgba(74,44,164,0.12)" stroke="currentColor" strokeWidth="2" />
      <text x="32" y="28" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="900" fontFamily="system-ui,sans-serif">
        CȘE
      </text>
      <text x="32" y="42" textAnchor="middle" fill="currentColor" fontSize="7" fontWeight="700" fontFamily="system-ui,sans-serif">
        Consiliul Școlar
      </text>
    </svg>
  );
}
