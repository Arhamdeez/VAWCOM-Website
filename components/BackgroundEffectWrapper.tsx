'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackgroundEffect = dynamic(() => import('@/components/BackgroundEffect'), {
  ssr: false,
  loading: () => null,
});

function shouldRunCanvas(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 767px)').matches) return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  return true;
}

/** Defer canvas until the browser is idle — keeps first scroll smooth. */
function scheduleIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(callback, 1500);
  return () => window.clearTimeout(t);
}

export default function BackgroundEffectWrapper() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!shouldRunCanvas()) return;
    return scheduleIdle(() => setEnabled(true));
  }, []);

  if (!enabled) return null;
  return <BackgroundEffect />;
}
