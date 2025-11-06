'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GooeyNav from './GooeyNav';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Determine active index based on current pathname
  const getActiveIndex = () => {
    if (pathname === '/about') return 1;
    if (pathname === '/contact') return 2;
    return -1; // No active state for homepage or other routes
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-950/90 backdrop-blur-md shadow-lg py-2 border-b border-slate-800' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            VAWCOM
          </Link>
          
          <div className="hidden md:block">
            <GooeyNav
              items={navItems}
              particleCount={8}
              particleDistances={[60, 6]}
              particleR={60}
              initialActiveIndex={-1}
              animationTime={800}
              timeVariance={150}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          <button className="md:hidden text-slate-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
