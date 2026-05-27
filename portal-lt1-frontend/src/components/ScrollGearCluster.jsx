import { useEffect, useMemo, useRef } from 'react';

function buildGearPath(cx, cy, teeth, pitchR, toothHeight, phase = 0) {
  const outerR = pitchR + toothHeight * 0.48;
  const innerR = pitchR - toothHeight * 0.52;
  const step = (Math.PI * 2) / teeth;
  const points = [];

  for (let t = 0; t < teeth; t += 1) {
    const base = t * step - Math.PI / 2 + phase;
    const toothHalf = step * 0.19;
    const valleyHalf = step * 0.31;
    points.push(polar(cx, cy, base - valleyHalf, innerR));
    points.push(polar(cx, cy, base - toothHalf, outerR));
    points.push(polar(cx, cy, base + toothHalf, outerR));
    points.push(polar(cx, cy, base + valleyHalf, innerR));
  }

  const [first, ...rest] = points;
  return `M ${fmt(first)} ${rest.map(fmt).join(' ')} Z`;
}

function polar(cx, cy, angle, radius) {
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

function fmt([x, y]) {
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

const GEARS = {
  a: {
    id: 'a',
    cx: 128,
    cy: 128,
    teeth: 20,
    pitchR: 40,
    toothH: 8,
    tone: 'gold',
    basePhase: 0
  },
  b: {
    id: 'b',
    cx: 58,
    cy: 128,
    teeth: 16,
    pitchR: 30,
    toothH: 7,
    tone: 'purple',
    basePhase: Math.PI / 16 - Math.PI / 20
  },
  c: {
    id: 'c',
    cx: 128,
    cy: 66,
    teeth: 12,
    pitchR: 22,
    toothH: 6,
    tone: 'purple',
    basePhase: Math.PI / 12 - Math.PI / 20
  }
};

const GEAR_A = GEARS.a;
const GEAR_B = GEARS.b;
const GEAR_C = GEARS.c;

const RATIO_BA = GEAR_A.teeth / GEAR_B.teeth;
const RATIO_CA = GEAR_A.teeth / GEAR_C.teeth;

function Gear({ gear, groupRef }) {
  const path = useMemo(
    () => buildGearPath(gear.cx, gear.cy, gear.teeth, gear.pitchR, gear.toothH, gear.basePhase),
    [gear]
  );

  const hubR = gear.pitchR * 0.2;
  const dashR = gear.pitchR * 0.72;

  return (
    <g ref={groupRef} className={`scroll-gear-cluster__wheel scroll-gear-cluster__wheel--${gear.tone}`}>
      <path
        d={path}
        className="scroll-gear-cluster__shape"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle
        cx={gear.cx}
        cy={gear.cy}
        r={dashR}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="4 6"
        opacity="0.35"
      />
      <circle
        cx={gear.cx}
        cy={gear.cy}
        r={hubR + 2.5}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx={gear.cx} cy={gear.cy} r={hubR} fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.6" />
    </g>
  );
}

function ScrollGearCluster() {
  const gearARef = useRef(null);
  const gearBRef = useRef(null);
  const gearCRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setRotation = (node, deg, gear) => {
      if (!node) return;
      node.setAttribute('transform', `rotate(${deg.toFixed(3)} ${gear.cx} ${gear.cy})`);
    };

    const apply = () => {
      const baseA = media.matches ? 0 : window.scrollY * 0.1;
      setRotation(gearARef.current, baseA, GEAR_A);
      setRotation(gearBRef.current, -baseA * RATIO_BA, GEAR_B);
      setRotation(gearCRef.current, -baseA * RATIO_CA, GEAR_C);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        apply();
      });
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    media.addEventListener('change', apply);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      media.removeEventListener('change', apply);
    };
  }, []);

  return (
    <div className="scroll-gear-cluster" aria-hidden="true">
      <div className="scroll-gear-cluster__halo" />
      <svg viewBox="0 0 184 184" className="scroll-gear-cluster__svg">
        <Gear gear={GEAR_B} groupRef={gearBRef} />
        <Gear gear={GEAR_C} groupRef={gearCRef} />
        <Gear gear={GEAR_A} groupRef={gearARef} />
      </svg>
    </div>
  );
}

export default ScrollGearCluster;
