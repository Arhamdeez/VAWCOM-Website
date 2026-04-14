'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes (defer to avoid cascading renders in the effect body)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
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
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '/#services') {
      setTimeout(() => {
        const servicesElement = document.getElementById('services');
        if (servicesElement) {
          servicesElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleDesktopNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/#services' && pathname === '/') {
      e.preventDefault();
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const navLinkClass = (href: string) => {
    const active =
      pathname === href || (href === '/#services' && pathname === '/');
    return `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
      active
        ? 'text-emerald-400'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;
  };

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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-x-0 z-50 px-3 pb-2 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] transition-[padding] duration-300 ease-out sm:px-4 sm:pb-3 sm:pt-[calc(env(safe-area-inset-top,0px)+1rem)]"
      >
        <div className="container mx-auto max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
          {scrolled ? (
            <div className="rounded-2xl glass-nav px-4 py-2.5 sm:py-3">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-lg font-semibold tracking-tight bg-gradient-to-r from-emerald-300/95 to-teal-300/95 bg-clip-text text-transparent sm:text-xl md:text-2xl md:font-bold">
                  VAWCOM
                </Link>
                
                {desktopNav}

                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-slate-300 hover:text-white transition-colors z-50 relative"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between py-1 sm:py-1.5">
            <Link href="/" className="text-lg font-semibold tracking-tight bg-gradient-to-r from-emerald-400/95 to-teal-400/95 bg-clip-text text-transparent sm:text-xl md:text-2xl md:font-bold">
              VAWCOM
            </Link>
            
            {desktopNav}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white transition-colors z-50 relative"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-md md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass-drawer fixed top-0 right-0 z-40 h-full w-[min(18rem,calc(100vw-1.5rem))] rounded-l-2xl md:hidden"
            >
              <div className="flex h-full flex-col px-5 pt-[max(5rem,env(safe-area-inset-top,0px)+4rem)] pb-[env(safe-area-inset-bottom,0px)]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => handleMobileNavClick(item.href)}
                    className={`border-b border-slate-800/80 py-3.5 text-[15px] font-medium transition-colors sm:py-4 sm:text-base ${
                      pathname === item.href || (item.href === '/#services' && pathname === '/')
                        ? 'text-emerald-400'
                        : 'text-slate-300 hover:text-emerald-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
