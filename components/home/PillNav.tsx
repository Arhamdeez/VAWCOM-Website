'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { servicesInNavOrder } from '@/lib/services';
import { SHOW_GALLERY } from '@/lib/site';
import { EASE, DUR } from '@/lib/motion';

export type NavOpen = 'full' | 'half' | 'compact';

type Props = {
  /** Home: animate the link strip open/closed/halfway. */
  collapsible?: boolean;
  /** Prefer `open`. Kept for CreamPage (true = full, false = compact). */
  expanded?: boolean;
  /** full = edge-to-edge, half = pill with links, compact = logo + CTA. */
  open?: NavOpen;
  active?: 'home' | 'contact' | 'services' | 'gallery' | 'about' | 'partners';
  /** Parent owns fixed positioning (home chrome). */
  embedded?: boolean;
  /** Light link colors when the bar sits over a dark page band. */
  onDark?: boolean;
};

const ease = EASE;
const morph = { duration: DUR.morph, ease };

function MobileNav({
  active,
  onDark,
  embedded,
}: {
  active: NonNullable<Props['active']>;
  onDark: boolean;
  embedded: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(active === 'services');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const ink = onDark ? 'text-white' : 'text-[#161615]';

  const sheet =
    mounted
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                key="mobile-menu"
                id="vaw-mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.std }}
                className="fixed inset-0 z-[100] bg-[#f5f3ee]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.std, delay: 0.05, ease }}
                  className="flex h-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#8a8882]">
                      Menu
                    </p>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border border-black/10 bg-white text-[#161615] shadow-[0_4px_16px_rgba(22,22,21,0.08)]"
                    >
                      <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </div>

                  <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto">
                    <div className="rounded-2xl bg-white p-2 shadow-[0_8px_24px_rgba(22,22,21,0.06)]">
                      <button
                        type="button"
                        aria-expanded={svcOpen}
                        onClick={() => setSvcOpen((v) => !v)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[17px] ${
                          active === 'services'
                            ? 'font-medium text-[#0cb78b]'
                            : 'font-medium text-[#161615]'
                        }`}
                      >
                        Services
                        <ChevronDown
                          className={`h-4 w-4 text-[#8a8882] transition-transform ${svcOpen ? 'rotate-180' : ''}`}
                          strokeWidth={2.25}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {svcOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: DUR.std, ease }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-0.5 px-1 pb-2">
                              <Link
                                href="/services"
                                className="rounded-xl px-4 py-2.5 text-[14.5px] font-medium text-[#0cb78b]"
                                onClick={() => setOpen(false)}
                              >
                                All services
                              </Link>
                              {servicesInNavOrder().map((s) => (
                                <Link
                                  key={s.id}
                                  href={`/services/${s.id}`}
                                  className="rounded-xl px-4 py-2.5 text-[14.5px] text-[#5c5a56] hover:bg-[#f5f3ee] hover:text-[#161615]"
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="font-medium text-[#161615]">{s.nav}</span>
                                  <span className="mt-0.5 block text-[12.5px] text-[#8a8882]">
                                    {s.title}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    {(
                      [
                        ...(SHOW_GALLERY
                          ? [{ href: '/gallery', label: 'Gallery', key: 'gallery' as const }]
                          : []),
                        { href: '/about', label: 'About', key: 'about' as const },
                        { href: '/partners', label: 'Partners', key: 'partners' as const },
                        { href: '/contact', label: 'Contact', key: 'contact' as const },
                      ] as const
                    ).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch
                        onClick={() => setOpen(false)}
                        className={`rounded-2xl px-4 py-3.5 text-[17px] ${
                          active === item.key
                            ? 'bg-white font-medium text-[#0cb78b] shadow-[0_8px_24px_rgba(22,22,21,0.06)]'
                            : 'font-medium text-[#161615]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <Link
                    href="/contact"
                    prefetch
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0cb78b] px-6 text-[15px] font-medium text-[#0b0d0c]"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={`vaw-nav-glass w-full max-w-none overflow-visible rounded-[1.25rem] transition-[background,border-color,box-shadow] duration-std ${
          onDark ? 'vaw-nav-glass-on-dark' : ''
        } ${embedded ? 'relative' : 'fixed left-0 right-0 top-4 z-[60]'} mx-auto px-3 py-2`}
      >
        <div className="vaw-nav-glass-inner justify-between gap-3">
          <Link
            href="/"
            prefetch
            className="flex flex-none items-center text-inherit"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo-mark.png"
              alt="VAWCOM"
              width={69}
              height={37}
              className="h-6 w-auto"
              priority
            />
          </Link>
          <div className="flex flex-none items-center gap-2">
            {active === 'contact' ? (
              <span className="rounded-full bg-[#0cb78b] px-3.5 py-2 text-[13px] font-medium text-[#0b0d0c]">
                Contact
              </span>
            ) : (
              <Link
                href="/contact"
                prefetch
                className="rounded-full bg-[#0cb78b] px-3.5 py-2 text-[13px] font-medium text-[#0b0d0c] hover:bg-[#0cb78b]/85"
              >
                Get Started
              </Link>
            )}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="vaw-mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                onDark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-black/10 text-[#161615] hover:bg-black/[0.04]'
              } ${ink}`}
            >
              {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
      {sheet}
    </>
  );
}

export default function PillNav(props: Props) {
  return (
    <>
      <div className="w-full lg:hidden">
        <MobileNav
          active={props.active ?? 'home'}
          onDark={props.onDark ?? false}
          embedded={props.embedded ?? false}
        />
      </div>
      <div className="hidden w-full justify-center lg:flex">
        <DesktopNav {...props} />
      </div>
    </>
  );
}

function DesktopNav({
  collapsible = false,
  expanded = false,
  open,
  active = 'home',
  embedded = false,
  onDark = false,
}: Props) {
  const mode: NavOpen = open ?? (expanded ? 'full' : 'compact');
  const showLinks = mode !== 'compact';
  const full = mode === 'full';
  const showContact = active === 'home' && full;

  const link = onDark
    ? 'text-white/72 hover:text-[#2dd4a8]'
    : 'text-[#5c5a56] hover:text-[#0cb78b]';
  const primary = onDark
    ? 'font-medium text-white hover:text-[#2dd4a8]'
    : 'font-medium text-[#161615] hover:text-[#0cb78b]';
  const on = onDark ? 'font-medium text-[#2dd4a8]' : 'font-medium text-[#0cb78b]';
  const cta =
    'flex-none rounded-full bg-[#0cb78b] px-[18px] py-2.5 text-[14.5px] font-medium text-[#0b0d0c] hover:bg-[#0cb78b]/85 hover:text-[#0b0d0c]';

  const linkMax = !collapsible ? undefined : full ? 760 : showLinks ? 420 : 0;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        borderRadius: full ? 20 : 9999,
      }}
      transition={{
        layout: morph,
        borderRadius: morph,
      }}
      className={`vaw-nav-glass overflow-visible transition-[background,border-color,box-shadow] duration-std ${
        onDark ? 'vaw-nav-glass-on-dark' : ''
      } ${embedded ? 'relative' : 'fixed left-0 right-0 top-5 z-[60]'} mx-auto px-4 py-2.5 pl-4 ${
        full ? 'w-full max-w-none sm:px-5' : 'w-max max-w-[calc(100vw-32px)]'
      }`}
    >
      <div
        className={`vaw-nav-glass-inner ${
          full ? 'justify-between gap-4 sm:gap-6' : 'gap-[22px]'
        }`}
      >
        <Link href="/" prefetch className="flex flex-none items-center gap-2.5 text-inherit">
          <Image
            src="/logo-mark.png"
            alt="VAWCOM"
            width={69}
            height={37}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <motion.div
          initial={false}
          animate={
            collapsible
              ? {
                  maxWidth: linkMax,
                  opacity: showLinks ? 1 : 0,
                }
              : undefined
          }
          transition={{
            maxWidth: morph,
            opacity: { duration: DUR.enter, ease: 'linear' },
          }}
          className={`flex items-center gap-8 whitespace-nowrap text-[14.5px] ${
            collapsible && !showLinks ? 'overflow-hidden' : 'overflow-visible'
          } ${full ? 'min-w-0 flex-1 justify-center' : ''}`}
          style={
            collapsible
              ? {
                  pointerEvents: showLinks ? 'auto' : 'none',
                  overflow: showLinks ? 'visible' : 'hidden',
                }
              : undefined
          }
        >
          <div className="group/svc relative">
            <div className="inline-flex items-center gap-0.5">
              <Link
                href="/services"
                prefetch
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
              className="invisible absolute left-0 top-full z-[70] -translate-y-1 pt-2 opacity-0 transition-[opacity,transform,visibility] delay-150 duration-std group-focus-within/svc:visible group-focus-within/svc:translate-y-0 group-focus-within/svc:opacity-100 group-focus-within/svc:delay-0 group-hover/svc:visible group-hover/svc:translate-y-0 group-hover/svc:opacity-100 group-hover/svc:delay-0"
            >
              <div className="w-[min(17.5rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/50 bg-white/90 p-2 shadow-[0_20px_50px_rgba(22,22,21,0.12)]">
                <Link
                  href="/services"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[#0cb78b] hover:bg-[#0cb78b]/10"
                >
                  All services
                </Link>
                {servicesInNavOrder().map((s) => (
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
          {SHOW_GALLERY ? (
            <Link href="/gallery" prefetch className={active === 'gallery' ? on : link}>
              Gallery
            </Link>
          ) : null}
          <Link href="/about" prefetch className={active === 'about' ? on : link}>
            About
          </Link>
          <Link href="/partners" prefetch className={active === 'partners' ? on : link}>
            Partners
          </Link>
          {active === 'home' ? (
            <motion.div
              initial={false}
              animate={{
                maxWidth: showContact ? 88 : 0,
                opacity: showContact ? 1 : 0,
                marginLeft: showContact ? 0 : -32,
              }}
              transition={morph}
              className="overflow-hidden"
              style={{ pointerEvents: showContact ? 'auto' : 'none' }}
            >
              <Link href="/contact" prefetch className={link}>
                Contact
              </Link>
            </motion.div>
          ) : null}
        </motion.div>
        {active === 'contact' ? (
          <span className={cta}>Contact</span>
        ) : (
          <Link href="/contact" prefetch className={cta}>
            Get Started
          </Link>
        )}
      </div>
    </motion.div>
  );
}
