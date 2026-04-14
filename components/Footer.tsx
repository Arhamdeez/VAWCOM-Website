import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { getGmailComposeUrl, SOCIAL } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="glass-footer py-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:py-12">
      <div className="container mx-auto max-w-7xl px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-2">
            <h3 className="mb-3 text-base font-semibold tracking-tight text-white sm:mb-4 sm:text-lg">VAWCOM</h3>
            <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px] sm:text-slate-400">
              Web, mobile, voice, and AI—end-to-end delivery from product thinking to launch. A full-service partner for digital builds and integrations.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500 sm:mb-4">Quick links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#services" className="text-slate-400 transition-colors hover:text-emerald-400/90">
                  Services
                </Link>
              </li>
              <li><Link href="/about" className="text-slate-400 transition-colors hover:text-emerald-400/90">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-400 transition-colors hover:text-emerald-400/90">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500 sm:mb-4">Connect</h4>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-800/90 text-slate-400 transition-colors hover:bg-emerald-600/90 hover:text-white"
                aria-label="VAWCOM on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-800/90 text-slate-400 transition-colors hover:bg-emerald-600/90 hover:text-white"
                aria-label="VAWCOM on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-800/90 text-slate-400 transition-colors hover:bg-emerald-600/90 hover:text-white"
                aria-label="VAWCOM on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={getGmailComposeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-800/90 text-slate-400 transition-colors hover:bg-emerald-600/90 hover:text-white"
                aria-label="Email VAWCOM in Gmail"
                title="Opens Gmail compose"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-6 text-center text-xs text-slate-500 sm:pt-8 sm:text-sm sm:text-slate-400">
          <p>© {new Date().getFullYear()} VAWCOM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
