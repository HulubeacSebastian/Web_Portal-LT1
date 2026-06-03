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

export function IconTourism() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <circle cx="24" cy="24" r="14" {...stroke} />
      <polygon points="24,14 28,26 20,22 28,22 20,26" fill="currentColor" opacity="0.35" />
      <path d="M24 10v4M24 34v4M10 24h4M34 24h4" {...stroke} />
      <circle cx="24" cy="24" r="3" {...stroke} />
    </svg>
  );
}

export function IconMechanic() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <circle cx="24" cy="24" r="10" {...stroke} />
      <circle cx="24" cy="24" r="4" {...stroke} />
      {[0, 45, 90, 135].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="24"
          x2="24"
          y2="12"
          transform={`rotate(${deg} 24 24)`}
          {...stroke}
        />
      ))}
      <path d="M32 32l8 6M36 28l4-2" {...stroke} />
      <rect x="34" y="34" width="8" height="6" rx="1" {...stroke} />
    </svg>
  );
}

export function IconHospitality() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <path d="M14 20c0-6 4-10 10-10s10 4 10 10v4H14v-4z" {...stroke} />
      <ellipse cx="24" cy="20" rx="10" ry="4" {...stroke} />
      <path d="M12 24h24v4c0 8-6 12-12 12s-12-4-12-12v-4z" {...stroke} />
      <path d="M18 14l2-4h8l2 4" {...stroke} />
    </svg>
  );
}

export function IconDual() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <path d="M10 28c6-10 14-14 14-14s8 4 14 14" {...stroke} />
      <path d="M16 24h16M20 20l4 8 4-8" {...stroke} />
      <rect x="14" y="30" width="20" height="10" rx="3" {...stroke} />
      <path d="M18 34h12" {...stroke} />
    </svg>
  );
}

export function IconConstruction() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="home2-icon-svg">
      <path d="M8 36h32M12 36V20l12-8 12 8v16" {...stroke} />
      <path d="M20 28h8v8h-8zM28 20h6v16h-6z" {...stroke} />
      <path d="M22 12l2-6 2 6" {...stroke} />
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
    <svg viewBox="0 0 80 32" aria-hidden="true" className="home2-partner-logo">
      <circle cx="16" cy="16" r="12" fill="#003399" />
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x = 16 + 7 * Math.cos(a);
        const y = 16 + 7 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="1.2" fill="#FFCC00" />;
      })}
      <text x="34" y="20" fill="currentColor" fontSize="11" fontWeight="800" fontFamily="system-ui,sans-serif">
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
