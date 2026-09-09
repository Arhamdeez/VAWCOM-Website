'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Send, X } from 'lucide-react';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export type ChatMsg = { role: 'user' | 'ai'; text: string };

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
};

const ChatContext = createContext<ChatContextValue | null>(null);

const GREETING: ChatMsg = {
  role: 'ai',
  text: 'Ask what we do, or describe an idea. I’ll guide you to the relevant service.',
};

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function ChatRichText({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const label = m[1];
    const href = m[2];
    const internal = href.startsWith('/') || href.startsWith('#');
    const cls = 'font-medium text-[#0cb78b] underline decoration-[#0cb78b]/70 underline-offset-[3px] hover:text-[#0a9d77]';
    nodes.push(
      internal ? (
        <Link key={i} href={href} onClick={onNavigate} className={cls}>
          {label}
        </Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {label}
        </a>
      ),
    );
    i += 1;
    last = idx + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <span className="whitespace-pre-wrap">{nodes}</span>;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [closed, setClosed] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [forceDock, setForceDock] = useState(false);

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
      const text = (q ?? draft).trim();
      if (!text || typing) return;
      setDraft('');
      setClosed(false);
      if (docked) setDockOpen(true);
      const nextHistory = [...messages, { role: 'user' as const, text }];
      setMessages(nextHistory);
      setTyping(true);
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: nextHistory.slice(-8).map((m) => ({
              role: m.role === 'ai' ? 'assistant' : 'user',
              text: m.text,
            })),
          }),
        });
        const data = await res.json();
        setMessages((m) => [
          ...m,
          { role: 'ai', text: data.response || 'Something went wrong. Try again.' },
        ]);
      } catch {
        setMessages((m) => [...m, { role: 'ai', text: 'Couldn’t reach the assistant. Try again.' }]);
      } finally {
        setTyping(false);
      }
    },
    [draft, typing, docked, messages],
  );

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
      reopen: () => {
        setClosed(false);
        setDockOpen(true);
      },
      dockNow: () => {
        setForceDock(true);
        setDockOpen(true);
      },
    }),
    [messages, draft, typing, closed, docked, dockOpen, ask],
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
  const { messages, draft, setDraft, typing, ask, close, dockOpen, setDockOpen, dockNow } =
    useSiteChat();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = placement === 'hero' || dockOpen;
  const hasThread = messages.length > 1;

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, active]);

  if (placement === 'dock' && !dockOpen) {
    return (
      <motion.button
        type="button"
        onClick={() => setDockOpen(true)}
        aria-label="Open chat"
        className="relative block h-[4.75rem] w-[4.75rem] cursor-pointer bg-transparent p-0"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/bothead.png"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(22,22,21,0.18)]"
          priority
        />
      </motion.button>
    );
  }

  return (
    <div
      className={`flex flex-col overflow-hidden border border-black/[0.08] bg-[#fffcf7] shadow-[0_12px_40px_rgba(22,22,21,0.1)] ${jakarta.className} ${
        placement === 'hero'
          ? 'w-[min(36rem,calc(100vw-2rem))] rounded-[28px]'
          : 'w-[min(22.5rem,calc(100vw-2rem))] rounded-[24px]'
      }`}
    >
      {placement === 'dock' || hasThread || typing ? (
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-4 py-2.5">
          <p className="text-[13px] font-medium text-[#161615]">
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
            placement === 'hero' ? 'max-h-[min(32vh,16rem)]' : 'max-h-[min(50vh,22rem)]'
          }`}
        >
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.text.slice(0, 16)}`}
              className={`max-w-[90%] rounded-2xl px-3.5 py-2 text-[14.5px] leading-snug ${
                m.role === 'user'
                  ? 'self-end bg-[#0cb78b] text-[#f5f3ee]'
                  : 'self-start bg-[#f0eee8] text-[#161615]'
              }`}
            >
              {m.role === 'ai' ? <ChatRichText text={m.text} onNavigate={dockNow} /> : m.text}
            </div>
          ))}
          {typing ? (
            <div className="self-start rounded-2xl bg-[#f0eee8] px-3.5 py-2 text-[14.5px] text-[#8a8882]">
              …
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
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask what we do, or describe an idea…"
          disabled={typing}
          className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[15px] text-[#161615] outline-none placeholder:text-[#8a8882]"
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

export function DockedChat() {
  const { docked, closed, reopen } = useSiteChat();

  return (
    <AnimatePresence>
      {closed ? (
        <motion.button
          key="launcher"
          type="button"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, y: [0, -7, 0] }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{
            opacity: { duration: 0.25 },
            scale: { duration: 0.25 },
            y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
          }}
          onClick={reopen}
          aria-label="Open chat"
          className="fixed bottom-5 right-5 z-[70] block h-[4.75rem] w-[4.75rem] cursor-pointer bg-transparent p-0"
        >
          <Image
            src="/bothead.png"
            alt=""
            width={160}
            height={160}
            className="pointer-events-none h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(22,22,21,0.18)]"
            priority
          />
        </motion.button>
      ) : docked ? (
        <div key="dock" className="fixed bottom-5 right-5 z-[70]">
          <ChatPanel placement="dock" />
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export const CHAT_PROMPTS = ['What do you offer?', 'I have an idea'] as const;
