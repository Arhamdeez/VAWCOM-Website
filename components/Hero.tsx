'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/50 to-slate-950 pt-[max(5.5rem,env(safe-area-inset-top,0px))] pb-16 sm:pb-12">
      {/* Animated background — softer on small screens */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[18%] left-[8%] h-56 w-56 rounded-full bg-emerald-500/12 blur-3xl sm:h-72 sm:w-72 md:top-1/4 md:left-1/4 md:h-96 md:w-96 md:bg-emerald-500/16"
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 36, 0],
            y: [0, 22, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-[12%] right-[6%] h-56 w-56 rounded-full bg-teal-500/12 blur-3xl sm:h-72 sm:w-72 md:bottom-1/4 md:right-1/4 md:h-96 md:w-96 md:bg-teal-500/16"
          animate={{
            scale: [1, 1.14, 1],
            x: [0, -36, 0],
            y: [0, -22, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] text-center sm:max-w-4xl sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-slate-950/30 px-3 py-1.5 text-xs text-emerald-200/90 backdrop-blur-sm sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
          <span className="tracking-wide">Web · Mobile · Voice · AI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto mb-5 max-w-4xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl"
        >
          Transform Your Business with
          <span className="mt-1 block bg-gradient-to-r from-emerald-400/95 via-teal-400/95 to-emerald-500/90 bg-clip-text text-transparent sm:mt-2">
            AI-Powered Innovation
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto mb-8 max-w-xl text-pretty text-sm leading-relaxed text-slate-400 sm:mb-10 sm:max-w-2xl sm:text-base"
        >
          We’re a full-service digital studio: websites and apps, voice products, AI assistants, and the integrations
          that tie your stack together—from first sketch to production.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Link href="/contact" className="w-full sm:w-auto sm:min-w-0">
            <Button size="lg" variant="solidEmerald" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#services" className="w-full sm:w-auto sm:min-w-0">
            <Button size="lg" variant="solidWhite" className="w-full sm:w-auto">
              What we Offer
            </Button>
          </Link>
        </motion.div>

        {/* Floating particles — desktop only (reduces motion clutter on phones) */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400/25"
              style={{
                left: `${18 + i * 16}%`,
                top: `${28 + (i % 3) * 18}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                duration: 2.4 + i * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator — subtle; hidden on small phones */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:bottom-8 sm:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-9 w-5 justify-center rounded-full border border-emerald-400/35 pt-2">
          <motion.div className="h-1 w-1 rounded-full bg-emerald-400/70" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </div>
  );
}
