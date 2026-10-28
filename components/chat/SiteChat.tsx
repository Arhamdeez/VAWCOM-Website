'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { DUR } from '@/lib/motion';
import { isAllowedChatHref } from '@/lib/chatLinks';

type ChatMsg = { role: 'user' | 'ai'; text: string };

const MAX_DRAFT_CHARS = 800;

type ChatContextValue = {
  messages: ChatMsg[];
  draft: string;
  setDraft: (v: string) => void;
  typing: boolean;
  closed: boolean;
  docked: boolean;
  dockOpen: boolean;
  setDockOpen: (v: boolean) => void;
  ask: (q?: string) => Promise<void>;
  close: () => void;
  reopen: () => void;
  dockNow: () => void;
  openHref: (href: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

const GREETING: ChatMsg = {
  role: 'ai',
  text: 'Ask what we do, or describe an idea. I’ll guide you to the relevant service.',
};

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function ChatRichText({ text, onNavigate }: { text: string; onNavigate: (href: string) => void }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const label = m[1];
    const href = m[2];
    const cls = 'font-medium text-[#0cb78b] underline decoration-[#0cb78b]/70 underline-offset-[0.1875rem] hover:text-[#0a9d77]';
    if (!isAllowedChatHref(href)) {
      nodes.push(<span key={i}>{label}</span>);
    } else if (href.startsWith('/') || href.startsWith('#')) {
      nodes.push(
        <Link
          key={i}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(href);
          }}
          className={cls}
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {label}
        </a>,
      );
    }
    i += 1;
    last = idx + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <span className="whitespace-pre-wrap">{nodes}</span>;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [closed, setClosed] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [forceDock, setForceDock] = useState(false);
  const askAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (pathname !== '/') {
      setHeroInView(false);
      return;
    }
    const onScroll = () => {
      setHeroInView(window.scrollY < window.innerHeight * 0.38);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/' && window.scrollY < window.innerHeight * 0.38) {
      setForceDock(false);
    }
  }, [pathname]);

  // Preload Ollama during splash / idle so the first real reply isn't a cold model load
  useEffect(() => {
    const ctrl = new AbortController();
    void fetch('/api/chatbot/warm', { method: 'POST', signal: ctrl.signal }).catch(() => {});
    return () => ctrl.abort();
  }, []);

  const docked = pathname !== '/' || !heroInView || forceDock;

  // Docked copy starts collapsed. Hero slot stays in the page so layout does not jump.

  const ask = useCallback(
    async (q?: string) => {
      const text = (q ?? draft).trim().slice(0, MAX_DRAFT_CHARS);
      if (!text || typing) return;
      setDraft('');
      setClosed(false);
      const nextHistory = [...messages, { role: 'user' as const, text }];
      setMessages(nextHistory);
      setTyping(true);
      askAbort.current?.abort();
      const ctrl = new AbortController();
      askAbort.current = ctrl;
      try {
        // Prior turns only — server appends the current message (avoids duplicate user line).
        const prior = messages.slice(-4).map((m) => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          text: m.text,
        }));
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            message: text,
            path: pathname,
            history: prior,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (ctrl.signal.aborted) return;
        setMessages((m) => [
          ...m,
          {
            role: 'ai',
            text:
              (typeof data.response === 'string' && data.response) ||
              (res.status === 429
                ? 'Slow down a bit, then try again.'
                : 'Something went wrong. Try again.'),
          },
        ]);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setMessages((m) => [...m, { role: 'ai', text: 'Couldn’t reach VawBot. Try again.' }]);
      } finally {
        if (askAbort.current === ctrl) askAbort.current = null;
        setTyping(false);
      }
    },
    [draft, typing, messages, pathname],
  );

  const openHref = useCallback((href: string) => {
    setClosed(false);
    setDockOpen(true);
    router.push(href);
  }, [router]);

  const reopen = useCallback(() => {
    setClosed(false);
    setDockOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      const key = e.key;
      if (key == null || (key !== ' ' && key.length !== 1)) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (target?.closest('a, button, [role="button"]')) return;

      e.preventDefault();
      setClosed(false);
      if (docked) setDockOpen(true);
      setDraft((d) => d + key);
      requestAnimationFrame(() => {
        const el =
          document.querySelector<HTMLInputElement>('#vaw-chat-input-dock') ??
          document.querySelector<HTMLInputElement>('#vaw-chat-input-hero');
        el?.focus();
        el?.setSelectionRange(el.value.length, el.value.length);
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [docked]);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      draft,
      setDraft,
      typing,
      closed,
      docked,
      dockOpen,
      setDockOpen,
      ask,
      close: () => setClosed(true),
      reopen,
      dockNow: () => {
        setForceDock(true);
        setDockOpen(true);
      },
      openHref,
    }),
    [messages, draft, typing, closed, docked, dockOpen, ask, reopen, openHref],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
      <DockedChat />
    </ChatContext.Provider>
  );
}

export function useSiteChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useSiteChat must be used within ChatProvider');
  return ctx;
}

function ChatPanel({ placement }: { placement: 'hero' | 'dock' }) {
  const { messages, draft, setDraft, typing, ask, close, dockOpen, setDockOpen, openHref } =
    useSiteChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevTyping = useRef(typing);
  const active = placement === 'hero' || dockOpen;
  const hasThread = messages.length > 1;

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
    if (placement !== 'hero' || !active || (!hasThread && !typing)) return;
    // Chat grows downward in the hero; keep the reply + input on screen.
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      });
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [messages, typing, active, placement, hasThread]);

  useEffect(() => {
    const was = prevTyping.current;
    prevTyping.current = typing;
    if (was && !typing && active) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [typing, active]);

  useEffect(() => {
    if (placement === 'dock' && dockOpen) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [placement, dockOpen]);

  if (placement === 'dock' && !dockOpen) {
    return (
      <button
        type="button"
        onClick={() => setDockOpen(true)}
        aria-label="Open chat"
        className="vaw-chat-bob vaw-pop-in relative block h-[4.75rem] w-[4.75rem] cursor-pointer bg-transparent p-0"
      >
        <Image
          src="/bothead.png"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none h-full w-full object-contain drop-shadow-[0_0.5rem_1.125rem_rgba(22,22,21,0.18)]"
          priority
        />
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`flex flex-col overflow-hidden border border-black/[0.08] bg-[#fffcf7] text-left shadow-[0_0.75rem_2.5rem_rgba(22,22,21,0.1)] ${
        placement === 'dock' ? 'vaw-pop-in ' : ''
      }${
        placement === 'hero'
          ? 'w-[min(36rem,calc(100vw-2rem))] rounded-[1.75rem]'
          : 'w-[min(22.5rem,calc(100vw-2rem))] rounded-[1.5rem]'
      }`}
    >
      {placement === 'dock' || hasThread || typing ? (
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5">
          <p className="text-[0.8125rem] font-medium text-[#161615]">
            {placement === 'hero' ? 'VAWCOM' : 'Vawbot'}
          </p>
          <div className="flex items-center gap-1">
            {placement === 'dock' ? (
              <button
                type="button"
                onClick={() => setDockOpen(false)}
                className="rounded-full p-1.5 text-[#8a8882] hover:bg-black/[0.05] hover:text-[#161615]"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={close}
                className="rounded-full p-1.5 text-[#8a8882] hover:bg-black/[0.05] hover:text-[#161615]"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {hasThread || typing ? (
        <div
          ref={logRef}
          className={`flex flex-col gap-2 overflow-auto px-3 py-3 ${
            placement === 'hero'
              ? 'max-h-[min(32vh,16rem)]'
              : 'max-h-[min(50vh,22rem,calc(var(--vaw-chat-room,100vh)-7.5rem))]'
          }`}
        >
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.text.slice(0, 16)}`}
              className={`vaw-msg max-w-[90%] rounded-2xl px-3.5 py-2 text-[0.9063rem] leading-snug ${
                m.role === 'user'
                  ? 'self-end bg-[#0cb78b] text-[#f5f3ee]'
                  : 'self-start bg-[#f0eee8] text-[#161615]'
              }`}
            >
              {m.role === 'ai' ? <ChatRichText text={m.text} onNavigate={openHref} /> : m.text}
            </div>
          ))}
          {typing ? (
            <div
              className="vaw-msg self-start rounded-2xl bg-[#f0eee8] px-3.5 py-2 text-[0.9063rem] leading-snug"
              aria-label="Vawbot is typing"
            >
              <span className="inline-flex h-[1.25em] items-center gap-[0.3125rem]" aria-hidden>
                <span className="vaw-typing-dot h-1.5 w-1.5 rounded-full bg-[#8a8882]" />
                <span className="vaw-typing-dot vaw-typing-dot-2 h-1.5 w-1.5 rounded-full bg-[#8a8882]" />
                <span className="vaw-typing-dot vaw-typing-dot-3 h-1.5 w-1.5 rounded-full bg-[#8a8882]" />
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      <form
        className="flex items-center gap-2 px-2.5 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          void ask();
        }}
      >
        <label className="sr-only" htmlFor={`vaw-chat-input-${placement}`}>
          {placement === 'hero' ? 'Chat with Vawbot' : 'Ask VAWCOM'}
        </label>
        <input
          id={`vaw-chat-input-${placement}`}
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_DRAFT_CHARS))}
          maxLength={MAX_DRAFT_CHARS}
          placeholder="Ask what we do, or describe an idea…"
          className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[0.9375rem] text-[#161615] outline-none placeholder:text-[#8a8882]"
        />
        <button
          type="submit"
          disabled={typing || !draft.trim()}
          aria-label="Send"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#0cb78b] text-[#f5f3ee] hover:bg-[#0a9d77] disabled:opacity-35"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export function HeroChatSlot() {
  const { closed } = useSiteChat();
  if (closed) return null;
  return <ChatPanel placement="hero" />;
}

/**
 * iOS overlays the on-screen keyboard without resizing the layout viewport, so `fixed bottom-*`
 * stays under it. Returns how much of the bottom is covered, plus the visible height.
 */
function useKeyboardInset() {
  const [state, setState] = useState({ inset: 0, visible: 0 });
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      // Ignore toolbar-sized changes; only a keyboard covers this much.
      setState({ inset: inset > 80 ? inset : 0, visible: Math.round(vv.height) });
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
  return state;
}

function DockedChat() {
  const { docked, closed, reopen } = useSiteChat();
  const kb = useKeyboardInset();

  return (
    <AnimatePresence>
      {closed ? (
        <motion.button
          key="launcher"
          type="button"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{
            opacity: { duration: DUR.std },
            scale: { duration: DUR.std },
          }}
          onClick={reopen}
          aria-label="Open chat"
          className="vaw-chat-bob fixed bottom-5 right-5 z-[70] block h-[4.75rem] w-[4.75rem] cursor-pointer bg-transparent p-0"
        >
          <Image
            src="/bothead.png"
            alt=""
            width={160}
            height={160}
            className="pointer-events-none h-full w-full object-contain drop-shadow-[0_0.5rem_1.125rem_rgba(22,22,21,0.18)]"
            priority
          />
        </motion.button>
      ) : docked ? (
        <motion.div
          key="dock"
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: DUR.micro }}
          style={
            {
              transformOrigin: 'bottom right',
              ...(kb.inset ? { bottom: kb.inset + 8, '--vaw-chat-room': `${kb.visible - 16}px` } : null),
            } as CSSProperties
          }
          className="fixed bottom-5 right-5 z-[70]"
        >
          <ChatPanel placement="dock" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export const CHAT_PROMPTS = ['What do you offer?', 'I have an idea'] as const;
