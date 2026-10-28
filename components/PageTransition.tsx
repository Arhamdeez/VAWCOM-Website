'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  cream?: boolean;
};

/**
 * A wash over the page, not a transform on it. The headline already has its own
 * entrance, and sliding the page as well made the type hitch. Height is the
 * dynamic viewport so the wash covers a phone browser chrome as it shows and hides.
 */
export default function PageTransition({ children, cream = true }: Props) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const skipFirst = useRef(true);
  const [wash, setWash] = useState<string | null>(null);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (reduce) return;
    setWash(pathname);
  }, [pathname, reduce]);

  return (
    <>
      <div className="w-full">{children}</div>
      {wash ? (
        <div
          key={wash}
          aria-hidden
          className={`vaw-route-wash pointer-events-none fixed left-0 top-0 z-[40] h-dvh w-full ${
            cream ? 'bg-[#f5f3ee]' : 'bg-[#050a14]'
          }`}
        />
      ) : null}
    </>
  );
}
