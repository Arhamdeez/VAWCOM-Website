'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { isServicesHashLink, scrollToServicesSection } from '@/lib/navigation';
import { spring, tEnter, tExit } from '@/lib/motion';
import { SiteContainer } from '@/components/SiteContainer';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (isServicesHashLink(href)) {
      if (pathname === '/') {
        setTimeout(() => scrollToServicesSection(), 120);
      } else {
        router.push('/#services');
      }
    }
  };

  const handleDesktopNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isServicesHashLink(href) && pathname === '/') {
      e.preventDefault();
      scrollToServicesSection();
    }
  };

  const navLinkClass = (href: string) => {
    const active =
      pathname === href || (href === '/#services' && pathname === '/');
    return `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-smooth ${
      active
        ? 'text-emerald-400'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;
  };

  const logoClass = scrolled
    ? 'text-lg font-semibold tracking-tight bg-gradient-to-r from-emerald-300/95 to-teal-300/95 bg-clip-text text-transparent sm:text-xl md:text-2xl md:font-bold'
    : 'text-lg font-semibold tracking-tight bg-gradient-to-r from-emerald-400/95 to-teal-400/95 bg-clip-text text-transparent sm:text-xl md:text-2xl md:font-bold';

  const barClass = cn(
    'flex items-center justify-between gap-3 transition-[background-color,border-color,box-shadow,padding] duration-300 ease-smooth',
    // Phone: always the same frosted pill as desktop scrolled state
    'max-md:rounded-2xl max-md:glass-nav max-md:px-3 max-md:py-2.5 max-md:[transform:translateZ(0)]',
    scrolled
      ? 'rounded-2xl glass-nav px-3 py-2.5 sm:px-4 sm:py-3'
      : 'px-0 py-1 sm:py-1.5',
  );

  const desktopNav = (
    <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => handleDesktopNavClick(e, item.href)}
          className={navLinkClass(item.href)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={tEnter()}
        className="fixed inset-x-0 top-0 z-50 isolate pb-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] transition-[padding] duration-300 ease-smooth max-md:pb-2.5 sm:pb-3 sm:pt-[calc(env(safe-area-inset-top,0px)+1rem)]"
      >
        <SiteContainer>
          <div className={barClass}>
            <Link href="/" className={cn(logoClass, 'min-w-0 shrink-0')}>
              VAWCOM
            </Link>

            {desktopNav}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              className={cn(
                'relative z-[60] inline-flex h-10 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-xl border text-slate-200 transition-colors duration-300 ease-smooth md:hidden',
                mobileMenuOpen
                  ? 'border-emerald-500/35 bg-emerald-500/10 text-white'
                  : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-white/10 hover:text-white',
              )}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </SiteContainer>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={tExit}
              className="fixed inset-0 z-[55] bg-[#020508]/75 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={spring.drawer}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className="glass-drawer fixed top-0 right-0 z-[58] flex h-[100dvh] w-[min(17.5rem,calc(100vw-2.5rem))] flex-col rounded-l-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))]">
                <span className="text-sm font-semibold tracking-tight text-slate-400">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 text-slate-200 transition-colors hover:text-white"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav
                className="flex flex-1 flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-2"
                aria-label="Mobile"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleMobileNavClick(item.href)}
                    className={cn(
                      'flex min-h-[48px] touch-manipulation items-center rounded-xl px-3 text-[15px] font-medium transition-colors sm:min-h-[52px] sm:text-base',
                      pathname === item.href || (item.href === '/#services' && pathname === '/')
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-300 active:bg-white/5 hover:bg-white/5 hover:text-emerald-400',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
