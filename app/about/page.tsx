'use client';

import { motion } from 'framer-motion';
import { Zap, Link2, Layers, Linkedin, Github, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PremiumPageBackdrop from '@/components/PremiumPageBackdrop';
import { easeSnappy, ui } from '@/lib/motion';

const pillars = [
  {
    icon: Zap,
    title: 'Product & delivery',
    line: 'We own outcomes: UX, engineering, and launch—not just scripts or one-off tools.',
  },
  {
    icon: Link2,
    title: 'Integrations & APIs',
    line: 'Connect Slack, CRMs, payments, and data pipelines when your product needs to talk to the rest of the stack.',
  },
  {
    icon: Layers,
    title: 'Built to last',
    line: 'Clear architecture and maintainable code so what we ship can grow with you.',
  },
];

const team = [
  {
    initials: 'AB',
    name: 'Arham Babar',
    role: 'Co-founder',
    gradient: 'from-emerald-500 to-teal-600',
    linkedin: 'https://www.linkedin.com/in/arham-babar-a9510630a/',
    github: 'https://github.com/Arhamdeez',
  },
  {
    initials: 'SK',
    name: 'Shahbakht Khurram',
    role: 'Co-founder',
    gradient: 'from-teal-500 to-cyan-600',
    linkedin: 'https://www.linkedin.com/in/shahbakht-khurram-b322a8329',
    github: 'https://github.com/shahbakht11',
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumPageBackdrop />
      <div className="relative z-10">
      <section className="pb-12 pt-[max(7rem,env(safe-area-inset-top,0px)+5.5rem)] md:pb-16">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/18 bg-slate-950/35 px-3 py-1.5 text-xs text-emerald-200/90 backdrop-blur-sm sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
              <span>About</span>
            </div>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-balance text-white sm:mb-5 sm:text-4xl md:text-5xl">
              A full-service{' '}
              <span className="bg-gradient-to-r from-emerald-400/95 to-teal-400/95 bg-clip-text text-transparent">
                digital studio
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
              Web and mobile apps, voice experiences, AI assistants, and integrations—designed and built as one coherent service.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: ui.reveal, ease: easeSnappy }}
            className="max-w-2xl mx-auto rounded-2xl glass px-6 py-8 md:px-10 md:py-10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Why we exist</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Teams need a partner who can ship whole products—not only point tools. VAWCOM exists to take ideas
              from concept through production: interfaces, backends, voice and chat surfaces, and the glue between systems.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We use modern web and mobile stacks, voice platforms like Vapi, AI where it fits, and tools like n8n when
              orchestration is part of the solution—always in service of the product, not the other way around.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-emerald-500/[0.08] pb-20">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider mb-10">
              How we work
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {pillars.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.24, delay: i * 0.04, ease: easeSnappy }}
                  className="rounded-xl glass-sm px-5 py-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.line}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-2xl font-bold text-white mb-2">Founders</h2>
            <p className="text-center text-slate-500 text-sm mb-10">People behind VAWCOM</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {team.map((person) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.26, ease: easeSnappy }}
                  className="rounded-xl glass-sm p-6 flex flex-col items-center text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${person.gradient} flex items-center justify-center text-lg font-bold text-white mb-4 shadow-lg`}
                  >
                    {person.initials}
                  </div>
                  <h3 className="text-white font-semibold">{person.name}</h3>
                  <p className="text-emerald-400/90 text-sm mb-5">{person.role}</p>
                  <div className="flex gap-3">
                    <Link
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors duration-150"
                      aria-label={`${person.name} on LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link
                      href={person.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors duration-150"
                      aria-label={`${person.name} on GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-center mt-12">
              <Link
                href="/contact"
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
              >
                Work with us →
              </Link>
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
