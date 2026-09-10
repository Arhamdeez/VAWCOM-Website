'use client';

import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

function sdRoundRect(px: number, py: number, hw: number, hh: number, r: number) {
  const dx = Math.abs(px) - (hw - r);
  const dy = Math.abs(py) - (hh - r);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.min(Math.max(dx, dy), 0) + Math.hypot(ax, ay) - r;
}

/** Convex bezel map: warp lives on the rim (Apple-style), center stays clear. */
function makeBezelMap(width: number, height: number, radius: number, bezel: number) {
  const max = 280;
  const s = Math.min(1, max / Math.max(width, height, 1));
  const W = Math.max(2, Math.round(width * s));
  const H = Math.max(2, Math.round(height * s));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const data = img.data;
  const hw = W / 2;
  const hh = H / 2;
  const rad = Math.min(radius * s, hw - 1, hh - 1);
  const bz = bezel * s;
  const e = 0.8;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const sd = sdRoundRect(px, py, hw, hh, rad);
      const inside = Math.max(0, -sd);
      let mag = 0;
      if (inside > 0 && inside < bz) {
        const t = inside / bz;
        mag = Math.pow(1 - t, 1.15);
      }
      const nx =
        sdRoundRect(px + e, py, hw, hh, rad) - sdRoundRect(px - e, py, hw, hh, rad);
      const ny =
        sdRoundRect(px, py + e, hw, hh, rad) - sdRoundRect(px, py - e, hw, hh, rad);
      const nl = Math.hypot(nx, ny) || 1;
      const i = (y * W + x) * 4;
      data[i] = Math.round(128 - (nx / nl) * mag * 127);
      data[i + 1] = Math.round(128 - (ny / nl) * mag * 127);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

/** Chromium yes; Safari/WebKit no — url() backdrop filters are unsupported there. */
export function supportsSvgBackdrop() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|CriOS|EdgiOS/i.test(ua)) {
    return false;
  }
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return (
    CSS.supports('backdrop-filter', 'url(#a)') ||
    CSS.supports('-webkit-backdrop-filter', 'url(#a)')
  );
}

export default function LiquidLens({ active = true }: { active?: boolean }) {
  const rawId = useId();
  const fid = `vawlg${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, r: 38 });
  const [svgWarp, setSvgWarp] = useState(false);

  useLayoutEffect(() => {
    setSvgWarp(supportsSvgBackdrop());
  }, []);

  useLayoutEffect(() => {
    if (!svgWarp) return;
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => {
      const { width, height } = el.getBoundingClientRect();
      const r = parseFloat(getComputedStyle(el).borderRadius) || 38;
      const w = Math.round(width);
      const h = Math.round(height);
      setBox((prev) =>
        prev.w === w && prev.h === h && prev.r === r ? prev : { w, h, r },
      );
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [svgWarp]);

  useLayoutEffect(() => {
    if (!active || !svgWarp) return;
    const node = turbRef.current;
    if (!node) return;
    let t = 0;
    let raf = 0;
    const tick = () => {
      t += 0.012;
      node.setAttribute(
        'baseFrequency',
        `${(0.011 + Math.sin(t) * 0.005).toFixed(4)} ${(0.02 + Math.cos(t * 0.85) * 0.007).toFixed(4)}`,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, svgWarp, box.w]);

  const map = useMemo(() => {
    if (!svgWarp || box.w < 2 || box.h < 2) return '';
    return makeBezelMap(box.w, box.h, box.r, 26);
  }, [box, svgWarp]);

  return (
    <div
      ref={wrapRef}
      className={`vaw-liquid-lens${svgWarp ? '' : ' is-css'}`}
      style={
        active && svgWarp
          ? {
              backdropFilter: `url(#${fid})`,
              WebkitBackdropFilter: `url(#${fid})`,
            }
          : undefined
      }
      aria-hidden
    >
      {svgWarp && map ? (
        <svg width="0" height="0" className="absolute overflow-hidden">
          <filter
            id={fid}
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={map}
              xlinkHref={map}
              x="0"
              y="0"
              width={box.w}
              height={box.h}
              preserveAspectRatio="none"
              result="bezel"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="bezel"
              scale="56"
              xChannelSelector="R"
              yChannelSelector="G"
              result="lens"
            />
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="3"
              seed="2"
              result="waves"
            />
            <feDisplacementMap
              in="lens"
              in2="waves"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feColorMatrix in="rippled" type="saturate" values="1.55" />
          </filter>
        </svg>
      ) : null}
    </div>
  );
}
