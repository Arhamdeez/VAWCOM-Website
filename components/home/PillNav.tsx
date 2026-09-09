'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Props = {
  /** Collapsing link strip only on home (scroll-driven via data-nav). */
  collapsible?: boolean;
  /** Full-width bar at top of home; shrinks to the pill after scroll. */
  expanded?: boolean;
  active?: 'home' | 'contact' | 'services' | 'gallery';
  /** Parent owns fixed positioning (home chrome). */
  embedded?: boolean;
};

const morph = {
  duration: 0.52,
  ease: [0.3, 0.9, 0.25, 1] as const,
};

export default function PillNav({
  collapsible = false,
  expanded = false,
  active = 'home',
  embedded = false,
}: Props) {
  const link = 'text-[rgba(236,233,227,0.55)] hover:text-[#0cb78b]';
  const primary = 'font-medium text-[#ece9e3] hover:text-[#0cb78b]';
  const on = 'font-medium text-[#0cb78b]';
  const cta =
    'flex-none rounded-full bg-[#0cb78b] px-[18px] py-2.5 text-[14.5px] font-medium text-[#0b0d0c] hover:bg-[#0cb78b]/85 hover:text-[#0b0d0c]';

  return (
    <motion.div
      layout
      data-nav={collapsible ? '' : undefined}
      initial={false}
      animate={{
        borderRadius: expanded ? 20 : 9999,
      }}
      transition={morph}
      className={`${embedded ? 'relative' : 'fixed left-0 right-0 top-5 z-[60]'} mx-auto flex items-center border border-[rgba(236,233,227,0.16)] bg-black backdrop-blur-[10px] backdrop-saturate-[1.2] px-4 py-2.5 pl-4 ${
        expanded
          ? 'w-full max-w-none justify-between gap-4 sm:gap-6 sm:px-5'
          : 'w-max max-w-[calc(100vw-32px)] gap-[22px]'
      }`}
    >
      <Link href="/" className="flex flex-none items-center gap-2.5 text-inherit">
        <Image
          src="/vawcom-logo-3d.png"
          alt="VAWCOM"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          priority
        />
      </Link>
      <motion.div
        layout
        data-nav-links={collapsible ? '' : undefined}
        className={`flex items-center gap-8 overflow-hidden whitespace-nowrap text-[14.5px] ${
          expanded ? 'min-w-0 flex-1 justify-center' : ''
        }`}
        style={
          collapsible
            ? {
                maxWidth: 760,
                opacity: 1,
                transition:
                  'max-width 380ms cubic-bezier(.3,.9,.25,1), opacity 260ms linear',
              }
            : undefined
        }
        transition={morph}
      >
        <Link href="/services" className={active === 'services' ? on : primary}>
          Services
        </Link>
        <Link href="/gallery" className={active === 'gallery' ? on : link}>
          Gallery
        </Link>
        <Link href="/about" className={link}>
          About
        </Link>
        {active === 'home' ? (
          <Link href="/contact" className={link}>
            Contact
          </Link>
        ) : null}
      </motion.div>
      {active === 'contact' ? (
        <span className={cta}>Contact</span>
      ) : (
        <Link href="/contact" className={cta}>
          Get Started
        </Link>
      )}
    </motion.div>
  );
}
