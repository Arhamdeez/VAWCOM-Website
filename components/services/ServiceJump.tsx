'use client';

import Link from 'next/link';
import { ChevronRight, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SERVICES } from '@/lib/services';

type Props = {
  active: string;
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  /** Desktop Jump shown. Default true (detail pages). Hub sets false until past the deck. */
  visible?: boolean;
  /** Link to `/services/[id]` instead of in-page scroll. */
  link?: boolean;
  onPick?: (id: string) => void;
  /** Hide mobile chips until visible (hub). Detail pages keep chips always. */
  mobileWhenVisible?: boolean;
};

export default function ServiceJump({
  active,
  open,
  setOpen,
  visible = true,
  link = false,
  onPick,
  mobileWhenVisible = false,
}: Props) {
  const showMobile = mobileWhenVisible ? visible : true;
  const href = (id: string) => `/services/${id}`;

  return (
    <>
      {showMobile ? (
        <div className="sticky top-[4.75rem] z-40 bg-[#f5f3ee]/92 backdrop-blur-md lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-6 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SERVICES.map((s) => {
              const className = `flex-none rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                active === s.id
                  ? 'bg-[#0cb78b] text-[#f5f3ee]'
                  : 'bg-black/[0.04] text-[#5c5a56]'
              }`;
              if (link) {
                return (
                  <Link key={s.id} href={href(s.id)} className={className}>
                    {s.nav}
                  </Link>
                );
              }
              return (
                <button key={s.id} type="button" onClick={() => onPick?.(s.id)} className={className}>
                  {s.nav}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-8 left-4 top-28 z-30 hidden lg:flex">
        <AnimatePresence>
          {visible ? (
            <motion.div
              key="service-jump"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex max-h-[min(70vh,32rem)] overflow-hidden rounded-2xl bg-[#fbf6ec]/95 shadow-[0_12px_40px_rgba(22,22,21,0.1)] backdrop-blur-md transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? 'w-[11.5rem]' : 'w-11'
              }`}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-label={open ? 'Collapse service guide' : 'Open service guide'}
                onClick={() => setOpen((v) => !v)}
                className="flex w-11 flex-none flex-col items-center gap-2 py-3 text-[#5c5a56] hover:text-[#0cb78b]"
              >
                <List className="h-4 w-4" strokeWidth={2} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Jump
                </span>
                <ChevronRight
                  className={`mt-auto h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
              <nav
                aria-label="Jump to service"
                className={`min-w-0 flex-1 overflow-y-auto py-3 pr-2 transition-opacity duration-200 ${
                  open ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a8882]">
                  Services
                </p>
                <ul className="space-y-0.5">
                  {SERVICES.map((s) => {
                    const itemClass = `block w-full rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors ${
                      active === s.id
                        ? 'bg-[#0cb78b]/12 font-medium text-[#0cb78b]'
                        : 'text-[#5c5a56] hover:bg-black/[0.04] hover:text-[#161615]'
                    }`;
                    return (
                      <li key={s.id}>
                        {link ? (
                          <Link
                            href={href(s.id)}
                            className={itemClass}
                            onClick={() => setOpen(false)}
                          >
                            {s.nav}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onPick?.(s.id)}
                            className={itemClass}
                          >
                            {s.nav}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
