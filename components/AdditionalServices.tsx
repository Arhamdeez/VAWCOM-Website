'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code, Smartphone, Globe, Shield } from 'lucide-react';
import { Button } from './ui/button';

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
    <section className="relative overflow-hidden bg-[#030712] py-14 md:py-20">
      {/* Subtle grid — faint lines on very dark navy */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-90 md:bg-[size:4rem_4rem]" />
      
      <div className="container relative z-10 mx-auto max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 text-center md:mb-14"
        >
          <div className="glass-pill-teal mb-4 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-teal-300 sm:mb-5 sm:px-5 sm:py-2 sm:text-sm">
            <span>And Much More</span>
          </div>

          <h2 className="mb-3 text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:mb-4 md:text-4xl">
            Seamless{' '}
            <span className="text-teal-400">Integrations & Workflows</span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base md:max-w-3xl md:text-[17px]">
            Alongside product and integration work, we cover the full lifecycle: e-commerce, maintenance, fixes, and refactors—so what we ship stays fast and reliable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-6">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.24, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
              className="group"
            >
              <div className="glass-sm relative rounded-2xl p-4 transition-[border-color,box-shadow] duration-200 hover:border-teal-400/30 sm:p-5 md:p-6">
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 blur-xl transition-opacity duration-200 group-hover:opacity-[0.14] md:group-hover:opacity-[0.22]`} />
                
                <div className="relative">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} sm:mb-4 sm:h-12 sm:w-12 md:group-hover:scale-[1.04] md:group-hover:transition-transform`}>
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
          transition={{ duration: 0.36, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
          className="mt-10 text-center sm:mt-12"
        >
          <p className="mb-6 text-sm text-slate-400 sm:mb-8 sm:text-base">
            Have a project in mind? Tell us what you’re building—we’ll help you scope it and get to launch.
          </p>
          
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 450, damping: 30 }} className="w-full max-w-xs sm:w-auto sm:max-w-none">
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
      </div>
    </section>
  );
}
