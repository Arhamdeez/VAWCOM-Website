'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, Send, CheckCircle2, Sparkles } from 'lucide-react';
import PremiumPageBackdrop from '@/components/PremiumPageBackdrop';
import { easeSnappy } from '@/lib/motion';
import { CONTACT_EMAIL, getGmailComposeUrl, SOCIAL } from '@/lib/site';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success - show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <PremiumPageBackdrop />

        <div className="relative z-10 flex min-h-screen items-center pb-16 pt-[max(6rem,env(safe-area-inset-top,0px)+5rem)]">
          <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: easeSnappy }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="glass-pill mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-emerald-200/95">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Thank you</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 380,
                  damping: 22,
                  delay: 0.08
                }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-emerald-500/50"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.14, type: "spring", stiffness: 380, damping: 24 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.26, ease: easeSnappy }}
                className="text-3xl md:text-4xl font-semibold text-white mb-4"
              >
                Thanks — we got it.
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.26, ease: easeSnappy }}
                className="text-slate-400 mb-10"
              >
                We&apos;ll reply within a business day.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.26, ease: easeSnappy }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      phone: '',
                      service: '',
                      message: ''
                    });
                  }}
                  className="btn-glass-primary rounded-xl px-8 py-4 text-[15px] font-semibold text-white"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="relative min-h-screen overflow-hidden">
      <PremiumPageBackdrop />

      {/* Hero Section */}
      <section className="relative z-10 pb-12 pt-[max(7rem,env(safe-area-inset-top,0px)+5.5rem)] md:pb-14">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easeSnappy }}
            className="mx-auto max-w-xl text-center"
          >
            <div className="glass-pill mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-emerald-200/95 sm:mb-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80 sm:h-4 sm:w-4" />
              <span>Contact</span>
            </div>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Let&apos;s talk
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 sm:text-[15px] md:text-base">
              Send a note—we&apos;ll get back shortly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-10 pb-20 pt-2">
        <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.24, ease: easeSnappy }}
                className="rounded-2xl glass-sm p-6 md:p-7"
              >
                <h2 className="text-lg font-medium text-white mb-2">Direct email</h2>
                <p className="text-slate-500 text-sm mb-6">Prefer email? Reach us here.</p>
                <a
                  href={getGmailComposeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-3 rounded-xl glass-field border border-white/12 text-emerald-400/90 hover:text-emerald-300 hover:border-emerald-500/25 transition-colors text-[15px] break-all"
                >
                  <Mail className="w-5 h-5 shrink-0 text-emerald-500/80" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-3 px-4 py-3 rounded-xl glass-field border border-white/12 text-emerald-400/90 hover:text-emerald-300 hover:border-emerald-500/25 transition-colors text-[15px]"
                >
                  <Instagram className="w-5 h-5 shrink-0 text-emerald-500/80" />
                  Instagram
                </a>
                <p className="text-slate-600 text-xs mt-6">Typical reply: within one business day.</p>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.24, ease: easeSnappy }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-cyan-500/8 rounded-2xl blur-2xl" />
                <div className="relative glass rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white mb-1">Message</h3>
                  <p className="text-slate-500 text-sm mb-6">Required fields marked *</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.26, delay: 0.04, ease: easeSnappy }}
                      >
                        <label htmlFor="name" className="block text-white font-medium mb-2">
                          Name <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-[border-color,box-shadow] duration-150"
                          placeholder="John Doe"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.26, delay: 0.08, ease: easeSnappy }}
                      >
                        <label htmlFor="email" className="block text-white font-medium mb-2">
                          Email <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-[border-color,box-shadow] duration-150"
                          placeholder="john@company.com"
                        />
                      </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.26, delay: 0.12, ease: easeSnappy }}
                      >
                        <label htmlFor="company" className="block text-white font-medium mb-2">Company</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-[border-color,box-shadow] duration-150"
                          placeholder="Company Inc."
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.26, delay: 0.16, ease: easeSnappy }}
                      >
                        <label htmlFor="phone" className="block text-white font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-[border-color,box-shadow] duration-150"
                          placeholder="+1 (555) 123-4567"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.26, delay: 0.2, ease: easeSnappy }}
                    >
                      <label htmlFor="service" className="block text-white font-medium mb-2">Service Interest</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-[border-color,box-shadow] duration-150"
                      >
                        <option value="">Select a service</option>
                        <option value="web-development">Web Development</option>
                        <option value="mobile-apps">Mobile Apps</option>
                        <option value="voice-solutions">Voice Solutions</option>
                        <option value="chatbots">Chatbots</option>
                        <option value="n8n-automations">n8n & integrations</option>
                        <option value="ai-integrations">AI Integrations</option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.26, delay: 0.24, ease: easeSnappy }}
                    >
                      <label htmlFor="message" className="block text-white font-medium mb-2">
                        Message <span className="text-emerald-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 glass-field rounded-xl border border-white/12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-[border-color,box-shadow] duration-150 resize-none"
                        placeholder="Briefly describe what you need…"
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="btn-glass-primary flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-[15px] font-semibold text-white disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
