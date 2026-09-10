'use client';

import { useEffect, useRef } from 'react';

const LIFE_MS = 320;

/** Soft brand glow trail while the pointer is held and dragged. */
export default function CursorGlow() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pts: { x: number; y: number; t: number }[] = [];
    let dragging = false;
    let raf = 0;

    const clear = () => {
      pts.length = 0;
      path.setAttribute('d', '');
      wrap.style.opacity = '0';
    };

    const tick = () => {
      raf = 0;
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE_MS) pts.shift();
      if (dragging && pts.length > 1) {
        let d = `M${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) d += ` L${pts[i].x} ${pts[i].y}`;
        path.setAttribute('d', d);
      } else if (!dragging) {
        path.setAttribute('d', '');
      }
      if (dragging || pts.length) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      pts.length = 0;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      wrap.style.opacity = '1';
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };

    const onUp = () => {
      dragging = false;
      clear();
    };

    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onUp);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener('mouseleave', onUp);
    };
  }, []);

  return (
    <svg
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9990] h-full w-full opacity-0 transition-opacity duration-200"
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="rgba(12,183,139,0.55)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'blur(10px)' }}
      />
    </svg>
  );
}
