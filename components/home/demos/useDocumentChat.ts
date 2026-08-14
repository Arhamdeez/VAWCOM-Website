'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ChatMsg = { role: 'user' | 'ai'; text: string };

export function useDocumentChat() {
  const [sessionId] = useState(
    () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: 'Upload a document, then ask in plain words. I answer and cite the source.',
    },
  ]);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const upload = useCallback(
    async (picked: File) => {
      setUploading(true);
      const form = new FormData();
      form.append('file', picked);
      form.append('sessionId', sessionId);
      try {
        const res = await fetch('/api/chatbot/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (res.ok) {
          setFile({ name: picked.name, size: picked.size });
          setMessages((m) => [
            ...m,
            {
              role: 'ai',
              text: `Document “${picked.name}” is ready. Ask me anything about it.`,
            },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            { role: 'ai', text: data.error || 'Failed to upload document.' },
          ]);
        }
      } catch {
        setMessages((m) => [
          ...m,
          { role: 'ai', text: 'Failed to upload document. Please try again.' },
        ]);
      } finally {
        setUploading(false);
      }
    },
    [sessionId]
  );

  const clearDoc = useCallback(async () => {
    try {
      await fetch('/api/chatbot/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      /* ignore */
    }
    setFile(null);
    setMessages([
      {
        role: 'ai',
        text: 'Document cleared. Upload a new one or ask me anything.',
      },
    ]);
  }, [sessionId]);

  const ask = useCallback(
    async (q?: string) => {
      const text = (q ?? draft).trim();
      if (!text || typing) return;
      setDraft('');
      setMessages((m) => [...m, { role: 'user', text }]);
      setTyping(true);
      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, sessionId }),
        });
        const data = await res.json();
        setMessages((m) => [
          ...m,
          { role: 'ai', text: data.response || 'Sorry, I encountered an error.' },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [draft, sessionId, typing]
  );

  return {
    logRef,
    draft,
    setDraft,
    messages,
    file,
    uploading,
    typing,
    upload,
    clearDoc,
    ask,
  };
}
