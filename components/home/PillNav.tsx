'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { SERVICES } from '@/lib/services';

type Props = {
  /** Home: hide the link strip once the pill shrinks. */
  collapsible?: boolean;
  /** Full-width bar at top of home; shrinks to the pill after scroll. */
  expanded?: boolean;
  active?: 'home' | 'contact' | 'services' | 'gallery' | 'about';
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
  const link = 'text-[#5c5a56] hover:text-[#0cb78b]';
  const primary = 'font-medium text-[#161615] hover:text-[#0cb78b]';
  const on = 'font-medium text-[#0cb78b]';
  const cta =
    'flex-none rounded-full bg-[#0cb78b] px-[18px] py-2.5 text-[14.5px] font-medium text-[#0b0d0c] hover:bg-[#0cb78b]/85 hover:text-[#0b0d0c]';

  return (
    <motion.div
      initial={false}
      animate={{
        borderRadius: expanded ? 20 : 9999,
      }}
      transition={morph}
      className={`vaw-nav-glass overflow-visible ${embedded ? 'relative' : 'fixed left-0 right-0 top-5 z-[60]'} mx-auto px-4 py-2.5 pl-4 ${
        expanded
          ? 'w-full max-w-none sm:px-5'
          : 'w-max max-w-[calc(100vw-32px)]'
      }`}
    >
      <div
        className={`vaw-nav-glass-inner overflow-visible ${
          expanded ? 'justify-between gap-4 sm:gap-6' : 'gap-[22px]'
        }`}
      >
        <Link href="/" className="flex flex-none items-center gap-2.5 text-inherit">
          <Image
            src="/logo-mark.png"
            alt="VAWCOM"
            width={69}
            height={37}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <div
          className={`flex items-center gap-8 whitespace-nowrap text-[14.5px] ${
            collapsible && !expanded ? 'overflow-hidden' : 'overflow-visible'
          } ${expanded ? 'min-w-0 flex-1 justify-center' : ''}`}
          style={
            collapsible
              ? {
                  maxWidth: expanded ? 760 : 0,
                  opacity: expanded ? 1 : 0,
                  visibility: expanded ? 'visible' : 'hidden',
                  pointerEvents: expanded ? 'auto' : 'none',
                  transition:
                    'max-width 380ms cubic-bezier(.3,.9,.25,1), opacity 260ms linear',
                }
              : undefined
          }
        >
          <div className="group/svc relative">
            <div className="inline-flex items-center gap-0.5">
              <Link
                href="/services"
                className={`${active === 'services' ? on : primary} group-hover/svc:text-[#0cb78b]`}
              >
                Services
              </Link>
              <button
                type="button"
                aria-haspopup="menu"
                aria-label="Browse services"
                className={`inline-flex rounded-md p-0.5 ${active === 'services' ? on : primary} group-hover/svc:text-[#0cb78b]`}
              >
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform group-hover/svc:rotate-180 group-focus-within/svc:rotate-180"
                  strokeWidth={2.25}
                />
              </button>
            </div>
            <div
              role="menu"
              aria-label="Services"
              className="absolute left-0 top-full z-[70] hidden pt-2 group-hover/svc:block group-focus-within/svc:block"
            >
              <div className="w-[min(17.5rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/50 bg-white/90 p-2 shadow-[0_20px_50px_rgba(22,22,21,0.12)]">
                <Link
                  href="/services"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[#0cb78b] hover:bg-[#0cb78b]/10"
                >
                  All services
                </Link>
                {SERVICES.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${s.id}`}
                    role="menuitem"
                    className="block rounded-xl px-3 py-2.5 text-[13.5px] text-[#5c5a56] hover:bg-[#f5f3ee] hover:text-[#161615]"
                  >
                    <span className="font-medium text-[#161615]">{s.nav}</span>
                    <span className="mt-0.5 block text-[12px] text-[#8a8882]">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/gallery" className={active === 'gallery' ? on : link}>
            Gallery
          </Link>
          <Link href="/about" className={active === 'about' ? on : link}>
            About
          </Link>
          {active === 'home' ? (
            <Link href="/contact" className={link}>
              Contact
            </Link>
          ) : null}
        </div>
        {active === 'contact' ? (
          <span className={cta}>Contact</span>
        ) : (
          <Link href="/contact" className={cta}>
            Get Started
          </Link>
        )}
      </div>
    </motion.div>
  );
}
