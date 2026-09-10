'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';

/** Exact path from https://skiper-ui.com/v1/skiper19 */
const SKIPER_D =
  'M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89';

const SKIPER_W = 1278;
const SKIPER_H = 2319;
const PEN_VH = 0.45;

type Pt = [number, number];

function n(v: number) {
  return (Math.round(v * 10) / 10).toFixed(1);
}

function scaleSkiper(sx: number, sy: number, ox: number, oy: number) {
  let i = 0;
  return SKIPER_D.replace(/([MC])|(-?\d+\.?\d*)/gi, (_raw, cmd: string, num: string) => {
    if (cmd) {
      i = 0;
      return cmd;
    }
    const v = parseFloat(num);
    const scaled = i % 2 === 0 ? v * sx + ox : v * sy + oy;
    i += 1;
    return n(scaled);
  });
}

function trimLastCommands(d: string, count: number) {
  const parts = d.split(/(?=[MC])/i).filter((p) => p.length > 0);
  return parts.slice(0, Math.max(1, parts.length - count)).join('');
}

function endPt(d: string): Pt {
  const nums = d.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) return [0, 0];
  return [parseFloat(nums[nums.length - 2]), parseFloat(nums[nums.length - 1])];
}

function endTan(d: string): Pt {
  const nums = d.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 6) return [0, 1];
  return [
    parseFloat(nums[nums.length - 2]) - parseFloat(nums[nums.length - 4]),
    parseFloat(nums[nums.length - 1]) - parseFloat(nums[nums.length - 3]),
  ];
}

function connect(from: Pt, tan: Pt, to: Pt): string {
  const len = Math.hypot(tan[0], tan[1]) || 1;
  const dist = Math.min(240, Math.hypot(to[0] - from[0], to[1] - from[1]) * 0.42);
  return `C${n(from[0] + (tan[0] / len) * dist)} ${n(from[1] + (tan[1] / len) * dist)} ${n(to[0])} ${n(to[1] - dist)} ${n(to[0])} ${n(to[1])}`;
}

function buildLut(path: SVGPathElement, samples = 256) {
  const total = path.getTotalLength();
  const t = new Float32Array(samples + 1);
  const y = new Float32Array(samples + 1);
  for (let i = 0; i <= samples; i++) {
    t[i] = i / samples;
    y[i] = path.getPointAtLength(t[i] * total).y;
  }
  return { t, y, n: samples };
}

function tAtY(lut: { t: Float32Array; y: Float32Array; n: number }, py: number) {
  if (py >= lut.y[lut.n]) return 1;
  let last = lut.t[0];
  for (let i = 1; i <= lut.n; i++) {
    const y0 = lut.y[i - 1];
    const y1 = lut.y[i];
    if (y1 >= y0 && y0 <= py && y1 >= py) {
      last = lut.t[i - 1] + ((py - y0) / (y1 - y0 || 1)) * (lut.t[i] - lut.t[i - 1]);
    }
  }
  return last;
}

type Props = {
  containerRef: RefObject<HTMLElement | null>;
  globeSlotRef: RefObject<HTMLElement | null>;
};

/** Scroll-drawn stroke that lands on the ASCII globe slot — no SVG wireframe globe. */
export default function HeroFollowLine({ containerRef, globeSlotRef }: Props) {
  const reduce = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const skiperPathRef = useRef<SVGPathElement>(null);
  const skiperLen = useMotionValue(0.38);
  const lutRef = useRef<ReturnType<typeof buildLut> | null>(null);
  const rootDocTopRef = useRef(0);
  const [frame, setFrame] = useState({
    skiper: SKIPER_D,
    w: SKIPER_W,
    h: SKIPER_H,
    stroke: 18,
  });

  useLayoutEffect(() => {
    const rootOf = () => overlayRef.current?.parentElement ?? containerRef.current;

    const measure = () => {
      const root = rootOf();
      if (!root) return;
      const slot = globeSlotRef.current ?? root.querySelector('[data-globe-slot]');
      if (!slot || !(slot instanceof HTMLElement)) return;
      const cr = root.getBoundingClientRect();
      const sr = slot.getBoundingClientRect();
      const w = cr.width;
      const h = cr.height;
      if (w < 8 || h < 8) return;

      rootDocTopRef.current = cr.top + window.scrollY;
      const globeTop = sr.top - cr.top;
      const scale = Math.min(w / SKIPER_W, Math.max(globeTop, 1) / SKIPER_H);
      const ox = (w - SKIPER_W * scale) / 2;
      const stroke = Math.max(13, Math.min(18, 18 * scale));

      // Join at the top of the ASCII pre (actual glyph disk), not the halo ring.
      const ascii = slot.querySelector('[data-ascii-globe]');
      let cx: number;
      let joinY: number;
      if (ascii instanceof HTMLElement && ascii.offsetWidth > 4) {
        const ar = ascii.getBoundingClientRect();
        cx = ar.left - cr.left + ar.width / 2;
        // Round caps extend ~half stroke past the tip — light pullback so it kisses the rim.
        joinY = ar.top - cr.top - stroke * 0.12;
      } else {
        // Fallback: AsciiGlobe sizes the pre to 72% of the slot, centered.
        const box = Math.min(sr.width, sr.height) * 0.72;
        cx = sr.left - cr.left + sr.width / 2;
        joinY = sr.top - cr.top + (sr.height - box) / 2 - stroke * 0.12;
      }
      const join: Pt = [cx, joinY];

      let skiper = trimLastCommands(scaleSkiper(scale, scale, ox, 0), 2);
      skiper += connect(endPt(skiper), endTan(skiper), join);
      setFrame((prev) =>
        prev.skiper === skiper && prev.w === w && prev.h === h ? prev : { skiper, w, h, stroke },
      );
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const root = rootOf();
    const ro = new ResizeObserver(measure);
    if (root) {
      ro.observe(root);
      const slot = globeSlotRef.current ?? root.querySelector('[data-globe-slot]');
      if (slot) {
        ro.observe(slot);
        const ascii = slot.querySelector('[data-ascii-globe]');
        if (ascii) ro.observe(ascii);
      }
    }
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, globeSlotRef]);

  useEffect(() => {
    if (reduce) {
      skiperLen.set(1);
      globeSlotRef.current?.setAttribute('data-line-ready', '');
      return;
    }
    lutRef.current = null;
    let raf = 0;

    const update = () => {
      raf = 0;
      const path = skiperPathRef.current;
      if (!path) return;
      if (!lutRef.current) lutRef.current = buildLut(path);
      const y = window.scrollY;
      const penY = window.innerHeight * PEN_VH - (rootDocTopRef.current - y);
      const target = Math.min(1, Math.max(0.38, tAtY(lutRef.current, penY)));
      const drawn = skiperLen.get();
      const blend = Math.min(1, 0.22 + Math.abs(target - drawn) * 1.8);
      const next = drawn + (target - drawn) * blend;
      if (Math.abs(next - drawn) > 0.0002) skiperLen.set(next);

      const slot = globeSlotRef.current;
      if (slot) {
        if (next >= 0.97) slot.setAttribute('data-line-ready', '');
        else slot.removeAttribute('data-line-ready');
      }

      if (Math.abs(target - next) > 0.0002) raf = requestAnimationFrame(update);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [frame.skiper, globeSlotRef, reduce, skiperLen]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
    >
      <svg
        width={frame.w}
        height={frame.h}
        viewBox={`0 0 ${frame.w} ${frame.h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <motion.path
          ref={skiperPathRef}
          d={frame.skiper}
          stroke="#0cb78b"
          strokeWidth={frame.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ pathLength: skiperLen, pathSpacing: 1 }}
        />
      </svg>
    </div>
  );
}
