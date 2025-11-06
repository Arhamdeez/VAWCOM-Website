'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Rocket, Users, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                VAWCOM
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We&apos;re passionate about automation-first solutions that connect web, voice, and automation to transform how businesses operate.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Story Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Our Journey</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    Every startup begins with a spark — ours was the frustration of watching great ideas slow down because of manual work.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    We&apos;re two friends who believed that technology should do the heavy lifting so people can focus on what really matters — creating, growing, and dreaming bigger. That&apos;s how VAWCOM was born.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    At VAWCOM, we&apos;re building an automation-first future — connecting web, mobile, voice, and AI technologies through smart workflows powered by n8n and cutting-edge automation tools.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    From scrappy startups to growing businesses, we help teams turn chaos into clarity by designing systems that talk to each other, automate the boring stuff, and scale effortlessly.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-slate-300 leading-relaxed"
                  >
                    We&apos;re not just building automations — we&apos;re building momentum. 🚀
                  </motion.p>
                </div>
              </motion.div>

              {/* Animated Stats Boxes */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-6"
              >
                {/* Box 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center mb-4"
                    >
                      <Zap className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-4xl font-bold text-emerald-400 mb-2"
                    >
                      100%
                    </motion.div>
                    <div className="text-slate-300 text-sm font-medium">Automation-First</div>
                    <div className="text-slate-400 text-xs mt-1">Every solution we build</div>
                  </div>
                </motion.div>

                {/* Box 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-6 border border-teal-500/30 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                  <div className="relative z-10">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      className="w-12 h-12 bg-teal-500/30 rounded-xl flex items-center justify-center mb-4"
                    >
                      <Rocket className="w-6 h-6 text-teal-400" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-4xl font-bold text-teal-400 mb-2"
                    >
                      24/7
                    </motion.div>
                    <div className="text-slate-300 text-sm font-medium">Always Running</div>
                    <div className="text-slate-400 text-xs mt-1">Your workflows never sleep</div>
                  </div>
                </motion.div>

                {/* Box 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-emerald-600/20 to-green-500/20 rounded-2xl p-6 border border-emerald-600/30 backdrop-blur-sm relative overflow-hidden group col-span-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-green-500/0 group-hover:from-emerald-600/10 group-hover:to-green-500/10 transition-all duration-300" />
                  <div className="relative z-10 flex items-center gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
                      className="w-16 h-16 bg-emerald-600/30 rounded-xl flex items-center justify-center flex-shrink-0"
                    >
                      <Users className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-3xl font-bold text-emerald-400 mb-1"
                      >
                        Infinite Scale
                      </motion.div>
                      <div className="text-slate-300 text-sm font-medium">From startups to enterprises</div>
                      <div className="text-slate-400 text-xs mt-1">Solutions that grow with your business</div>
                    </div>
                  </div>
                </motion.div>

                {/* Box 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden group col-span-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Powered by Innovation</div>
                        <div className="text-slate-400 text-xs">n8n • Vapi • OpenAI • Cutting-edge tools</div>
                      </div>
              </div>
                    <div className="flex gap-2">
                      {['n8n', 'Vapi', 'OpenAI', 'AI'].map((tech, idx) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
                          className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-medium"
                        >
                          {tech}
                        </motion.span>
                      ))}
                </div>
              </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-slate-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission & Values</h2>
              <p className="text-slate-300 text-lg">What drives us forward every day</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Automation First */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4"
                  >
                    <motion.svg
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">Automation First</h3>
                  <p className="text-slate-400">
                    Every solution we build prioritizes automation and seamless integration, connecting your tools so workflows run effortlessly.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Seamless Integrations */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                    className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4"
                  >
                    <motion.svg
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">Seamless Integrations</h3>
                <p className="text-slate-400">
                    We connect all your apps with n8n—Slack, Gmail, Notion, and more. Every workflow is designed to work together effortlessly.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Future-Ready */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-600/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-green-500/0 group-hover:from-emerald-600/10 group-hover:to-green-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4"
                  >
                    <motion.svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">Future-Ready</h3>
                <p className="text-slate-400">
                    Scalable, secure, and open-source powered. We build solutions that grow with your business and adapt to changing needs.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Meet Us</h2>
            <p className="text-slate-300 text-lg mb-12">
                The brilliant minds behind VAWCOM&apos;s automation-first solutions
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Arham Babar */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      AB
                    </motion.span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl font-semibold text-white mb-2"
                  >
                    Arham Babar
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-emerald-400 mb-4"
                  >
                    Co-Founder
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex justify-center gap-4"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="https://www.linkedin.com/in/arham-babar-a9510630a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                      >
                        <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="https://github.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                      >
                        <Github className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Shahbakht Khurram */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-teal-500/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
                    className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-teal-500/20"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                      className="text-2xl font-bold text-white"
                    >
                      SK
                    </motion.span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-xl font-semibold text-white mb-2"
                  >
                    Shahbakht Khurram
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-emerald-400 mb-4"
                  >
                    Co-Founder
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex justify-center gap-4"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="https://linkedin.com/in/shahbakhtkhurram"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                      >
                        <Linkedin className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="https://github.com/shahbakhtkhurram"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                      >
                        <Github className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
