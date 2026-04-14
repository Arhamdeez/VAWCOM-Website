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

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-[max(1rem,env(safe-area-inset-left,0px))] pb-20 pt-[max(7rem,env(safe-area-inset-top,0px)+5.5rem)] pr-[max(1rem,env(safe-area-inset-right,0px))]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeSnappy }}
            className="mx-auto max-w-md text-center"
          >
            <div className="glass-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-emerald-200/95 sm:text-sm">
              <Sparkles className="h-4 w-4 shrink-0 opacity-90" />
              <span>Thank you</span>
            </div>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">Thanks — we got it.</h1>
            <p className="mt-3 text-sm text-slate-500">We&apos;ll reply within a business day.</p>
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
                  message: '',
                });
              }}
              className="mt-10 inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-200 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/15"
            >
              Send another message
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const fieldClass =
    'w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-left text-[15px] text-white placeholder:text-slate-600 transition-[border-color,box-shadow] duration-150 focus:border-emerald-500/45 focus:outline-none focus:ring-1 focus:ring-emerald-500/25';
  const labelClass = 'mb-1.5 block text-center text-xs font-medium uppercase tracking-[0.1em] text-slate-500';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumPageBackdrop />

      <div className="relative z-10">
        <section className="pb-8 pt-[max(7rem,env(safe-area-inset-top,0px)+5.5rem)] md:pb-10">
          <div className="container mx-auto flex max-w-7xl justify-center px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeSnappy }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="glass-pill mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-emerald-200/95 sm:text-sm">
                <Sparkles className="h-4 w-4 shrink-0 opacity-90" />
                <span>Contact</span>
              </div>
              <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Let&apos;s{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  talk
                </span>
              </h1>
              <p className="mx-auto max-w-lg text-base text-slate-400 md:text-[17px]">
                Send the form first, or use email below—we usually reply within a business day.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container mx-auto flex max-w-7xl justify-center px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
            <div className="w-full max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, ease: easeSnappy }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/85">Send a message</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white md:text-2xl">Project details</h2>
                <p className="mt-1 text-sm text-slate-500">Asterisk (*) marks required fields.</p>

                <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-6 text-center">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name <span className="text-emerald-500/90">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={fieldClass}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email <span className="text-emerald-500/90">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={fieldClass}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="company" className={labelClass}>
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={fieldClass}
                        placeholder="Company Inc."
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={fieldClass}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className={labelClass}>
                      Service interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={`${fieldClass} cursor-pointer bg-[#070d18]`}
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
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message <span className="text-emerald-500/90">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className={`${fieldClass} resize-none`}
                      placeholder="Briefly describe what you need…"
                    />
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="btn-glass-primary flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white disabled:cursor-not-allowed sm:w-auto sm:max-w-none sm:min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                            className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                          />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: 0.05, ease: easeSnappy }}
                className="mt-14 border-t border-white/[0.08] pt-12"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/85">Other ways</p>
                <div className="mx-auto mt-5 max-w-md divide-y divide-white/[0.06] border-y border-white/[0.06]">
                  <a
                    href={getGmailComposeUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 py-4 text-center text-[15px] text-emerald-400/95 transition-colors hover:text-emerald-300 sm:flex-row sm:gap-3"
                  >
                    <Mail className="h-5 w-5 shrink-0 text-emerald-500/75" strokeWidth={1.75} />
                    <span className="min-w-0 break-all font-medium">{CONTACT_EMAIL}</span>
                  </a>
                  <a
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 py-4 text-[15px] text-emerald-400/95 transition-colors hover:text-emerald-300"
                  >
                    <Instagram className="h-5 w-5 shrink-0 text-emerald-500/75" strokeWidth={1.75} />
                    <span className="font-medium">Instagram</span>
                  </a>
                </div>
                <p className="mt-4 text-center text-xs text-slate-600">Prefer async—same reply window as the form.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
