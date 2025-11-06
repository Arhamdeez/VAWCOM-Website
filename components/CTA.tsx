'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);

  return (
    <section ref={containerRef} className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ scale, opacity, y }} className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-20 transition-opacity" />

            <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-emerald-500/20 rounded-3xl p-12 md:p-16 backdrop-blur-xl overflow-hidden">
              <motion.div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`, backgroundSize: '50px 50px' }}
                animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Let's Build Something Amazing</span>
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-white mb-6">
                  Ready to{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Automate</span>{' '}
                  Your Business?
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                  Let's discuss how we can connect your systems and automate your workflows. Get in touch with us today for a free consultation and see how your business can run on autopilot.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg shadow-emerald-500/20">
                      <Mail className="mr-2 w-5 h-5" />
                      Contact Us
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="border-emerald-500/30 text-white hover:bg-emerald-500/10 hover:border-emerald-500/50">Schedule a Demo</Button>
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /><span>Response within 24h</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" /><span>Free consultation</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span>No commitment required</span></div>
                </motion.div>
              </div>

              <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-3xl" />
              <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
