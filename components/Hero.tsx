'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToServicesSection } from '@/lib/navigation';
import { tAmbient, tEnter, ui } from '@/lib/motion';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteCenter, SiteContainer } from './SiteContainer';

export default function Hero() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(sectionRef, { amount: 0.05 });
  const pauseAmbient = reduceMotion || !heroInView;

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      scrollToServicesSection();
    }
  };

  return (
    <div ref={sectionRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950 pt-[max(6rem,calc(env(safe-area-inset-top,0px)+4.25rem))] pb-16 sm:pb-12">
      {/* Radial spotlight — bright mint/teal center, deep charcoal-green edges (reference look) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_38%,rgba(45,212,191,0.26)_0%,rgba(52,211,153,0.14)_28%,rgba(6,78,59,0.22)_52%,rgba(15,23,42,0.92)_78%,rgb(2,6,23)_100%)]"
        aria-hidden
      />
      {/* Soft secondary glow for depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(167,243,208,0.08)_0%,transparent_65%)]"
        aria-hidden
      />
      {/* Subtle particle “dust” */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(rgba(204,251,241,0.14)_1px,transparent_1px)] [background-size:22px_22px] sm:opacity-[0.38]"
        aria-hidden
      />
      {/* Edge vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_105%_105%_at_50%_50%,transparent_32%,rgba(2,6,23,0.55)_100%)]"
        aria-hidden
      />

      {/* Gentle animated washes — corners only so center spotlight stays dominant */}
      <div className="absolute inset-0 overflow-hidden">
        {pauseAmbient ? (
          <>
            <div className="absolute top-[14%] left-[6%] h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl sm:h-64 sm:w-64" />
            <div className="absolute bottom-[10%] right-[8%] h-48 w-48 rounded-full bg-teal-400/10 blur-3xl sm:h-64 sm:w-64" />
          </>
        ) : (
          <>
        <motion.div
          className="absolute top-[14%] left-[6%] h-48 w-48 rounded-full bg-emerald-400/12 blur-3xl sm:h-64 sm:w-64 md:top-[18%] md:left-[10%] md:h-80 md:w-80 md:bg-emerald-400/15"
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 28, 0],
            y: [0, 18, 0],
          }}
          transition={tAmbient(12)}
        />
        <motion.div
          className="absolute bottom-[10%] right-[8%] h-48 w-48 rounded-full bg-teal-400/12 blur-3xl sm:h-64 sm:w-64 md:bottom-[14%] md:right-[10%] md:h-80 md:w-80 md:bg-teal-400/15"
          animate={{
            scale: [1, 1.14, 1],
            x: [0, -28, 0],
            y: [0, -18, 0],
          }}
          transition={tAmbient(14)}
        />
        <motion.div
          className="absolute left-1/2 top-[36%] h-[min(52vw,24rem)] w-[min(120vw,56rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/10 blur-[80px] md:top-[40%] md:bg-teal-200/12"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.03, 1] }}
          transition={tAmbient(9)}
        />
          </>
        )}
      </div>

      {/* Content */}
      <SiteContainer className="relative z-10">
        <SiteCenter max="4xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tEnter()}
          className="glass-pill mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-emerald-200/95 sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-300/90 sm:h-4 sm:w-4" />
          <span className="tracking-wide">Automation-First Digital Solutions</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tEnter(ui.stagger)}
          className="mx-auto mb-5 max-w-4xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl"
        >
          Transform Your Business with
          <span className="mt-1 block bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent sm:mt-2">
            AI-Powered Innovation
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tEnter(ui.stagger * 2)}
          className="mx-auto mb-8 max-w-xl text-pretty text-sm leading-relaxed text-slate-300 sm:mb-10 sm:max-w-2xl sm:text-base"
        >
          Voice. Automation. Web. Communication. We build web, mobile, voice, and automation experiences that talk to
          each other—powered by n8n and intelligent workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tEnter(ui.stagger * 3)}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Link href="/contact" className="w-full sm:w-auto sm:min-w-0">
            <Button size="lg" variant="solidEmerald" className="min-h-[44px] w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#services" onClick={scrollToServices} className="w-full sm:w-auto sm:min-w-0">
            <Button size="lg" variant="solidWhite" className="min-h-[44px] w-full sm:w-auto">
              What we offer
            </Button>
          </Link>
        </motion.div>

        {/* Floating sparkles — subtle on all sizes */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {!pauseAmbient &&
            [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-emerald-200/35 sm:h-1.5 sm:w-1.5 sm:bg-emerald-300/40"
              style={{
                left: `${18 + i * 16}%`,
                top: `${28 + (i % 3) * 18}%`,
              }}
              animate={{
                y: [0, -14, 0],
                opacity: [0.35, 0.75, 0.35],
              }}
              transition={tAmbient(3.2 + i * 0.4, i * 0.12)}
            />
          ))}
        </div>
        </SiteCenter>
      </SiteContainer>

      {/* Scroll indicator — subtle; hidden on small phones */}
      {!pauseAmbient && (
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:bottom-8 sm:flex"
        animate={{ y: [0, 6, 0] }}
        transition={tAmbient(2.2)}
      >
        <div className="flex h-9 w-5 justify-center rounded-full border border-emerald-400/35 pt-2">
          <div className="h-1 w-1 animate-smooth-bounce rounded-full bg-emerald-400/70" />
        </div>
      </motion.div>
      )}
    </div>
  );
}
