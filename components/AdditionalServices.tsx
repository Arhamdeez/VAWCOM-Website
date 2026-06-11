'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code, Smartphone, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { spring, tEnter, tReveal, tStagger } from '@/lib/motion';
import { SiteContainer } from './SiteContainer';

const additionalServices = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Smartphone,
    title: 'App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'E-commerce Solutions',
    description: 'Complete online stores with payment integration and inventory management',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Code,
    title: 'Website Maintenance',
    description: 'Keep your website running smoothly with regular updates and monitoring',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Shield,
    title: 'Bug Fixing',
    description: 'Quick resolution of technical issues and performance problems',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Code,
    title: 'Code Cleanup',
    description: 'Fix messy code, improve performance, and clean up technical debt',
    gradient: 'from-yellow-500 to-orange-500'
  }
];

export default function AdditionalServices() {
  return (
    <section
      id="more"
      className="relative scroll-mt-28 overflow-hidden py-12 [content-visibility:auto] [contain-intrinsic-size:auto_720px] md:py-20 lg:py-24"
    >
      {/* Reference #050a14: one soft top glow + bottom vignette; grid reads in lower half */}
      <div className="pointer-events-none absolute inset-0 bg-[#050a14]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_75%_at_50%_-5%,rgba(45,212,191,0.065)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_115%,rgba(2,6,14,0.65)_0%,transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-site-zone-grid"
        aria-hidden
      />

      <SiteContainer>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={tReveal()}
          className="mb-8 text-center md:mb-11"
        >
          <div className="glass-pill mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-emerald-200/95 sm:mb-5 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
            <span>And much more</span>
          </div>

          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:mb-4 md:text-4xl">
            Seamless{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Integrations & Workflows
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-[17px]">
            Alongside product and integration work, we cover the full lifecycle: e-commerce, maintenance, fixes, and refactors—so what we ship stays fast and reliable.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={tStagger(index)}
              className="group"
            >
              <div className="glass-sm relative rounded-2xl p-4 text-center transition-[border-color,box-shadow] duration-300 ease-smooth hover:border-teal-400/30 sm:p-5 sm:text-left md:p-6">
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 blur-xl transition-opacity duration-300 ease-smooth group-hover:opacity-[0.14] md:group-hover:opacity-[0.22]`} />
                
                <div className="relative flex flex-col items-center sm:items-start">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} transition-transform duration-300 ease-smooth sm:mb-4 sm:h-12 sm:w-12 md:group-hover:scale-[1.04]`}>
                    <service.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                  </div>
                  
                  <h3 className="mb-1.5 text-sm font-semibold text-white/95 sm:mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed text-slate-500 sm:text-[13px] sm:leading-relaxed sm:text-slate-400">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={tEnter(0.12)}
          className="mt-10 text-center sm:mt-12"
        >
          <p className="mb-6 text-sm text-slate-400 sm:mb-8 sm:text-base">
            Have a project in mind? Tell us what you’re building—we’ll help you scope it and get to launch.
          </p>
          
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring.hover} className="w-full max-w-xs sm:w-auto sm:max-w-none">
              <Link href="/contact" className="block w-full sm:inline-block sm:w-auto">
                <Button
                  size="lg"
                  variant="solidEmerald"
                  className="w-full rounded-full border-0 bg-gradient-to-r from-teal-600 to-cyan-500 font-semibold text-white shadow-lg shadow-teal-950/40 transition-[filter,transform] hover:from-teal-500 hover:to-cyan-400 hover:shadow-teal-900/50 focus-visible:ring-cyan-400/80 sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </SiteContainer>
    </section>
  );
}
