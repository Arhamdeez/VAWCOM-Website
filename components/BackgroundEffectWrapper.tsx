'use client';

import dynamic from 'next/dynamic';

const BackgroundEffect = dynamic(() => import('@/components/BackgroundEffect'), {
  ssr: false,
  loading: () => null,
});

export default function BackgroundEffectWrapper() {
  return <BackgroundEffect />;
}

