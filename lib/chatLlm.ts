/**
 * Chat LLM provider: OpenRouter (prod / free) → Ollama (local) → throw for route fallbacks.
 * Intent / RAG / safety nets stay in chatKnowledge; this is generation only.
 */

import {
  ollamaChat,
  ollamaChatModel,
  warmOllama,
  type OllamaChatMessage,
  withTimeout,
} from '@/lib/ollama';

export type ChatMessage = OllamaChatMessage;

export function openRouterApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || '';
}

/** Prefer free-tier models (`:free`). Override with OPENROUTER_MODEL. */
export function openRouterModel() {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    // Auto-picks an available free model; override for a pinned id
    'openrouter/free'
  );
}

export function openRouterBaseUrl() {
  return (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
}

const FETCH_MS = () =>
  Number(process.env.OPENROUTER_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS) || 45000;

export type ChatProviderId = 'openrouter' | 'ollama';

export function activeChatProvider(): ChatProviderId {
  const forced = process.env.CHAT_PROVIDER?.trim().toLowerCase();
  if (forced === 'ollama') return 'ollama';
  if (forced === 'openrouter') return 'openrouter';
  // Prefer OpenRouter when keyed (Vercel / free); else local Ollama for dev
  if (openRouterApiKey()) return 'openrouter';
  return 'ollama';
}

export function activeChatModel(): string {
  return activeChatProvider() === 'openrouter' ? openRouterModel() : ollamaChatModel();
}

async function openRouterChat(messages: ChatMessage[]): Promise<string> {
  const key = openRouterApiKey();
  if (!key) throw new Error('OPENROUTER_API_KEY missing');

  const res = await withTimeout(
    fetch(`${openRouterBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL?.trim() || 'https://vawcom.com',
        'X-Title': process.env.OPENROUTER_APP_NAME?.trim() || 'VAWCOM Chat',
      },
      body: JSON.stringify({
        model: openRouterModel(),
        messages,
        temperature: 0.2,
        max_tokens: 120,
      }),
    }),
    FETCH_MS(),
    'OpenRouter chat'
  );

  const data = await res.json().catch(() => ({}));
  const text = data?.choices?.[0]?.message?.content;
  if (!res.ok || typeof text !== 'string' || !text.trim()) {
    const err =
      data?.error?.message ||
      data?.error ||
      (typeof data?.message === 'string' ? data.message : null) ||
      `OpenRouter HTTP ${res.status}`;
    throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
  }
  return text.trim();
}

/** Generate a reply via OpenRouter if keyed, else Ollama. */
export async function generateChatReply(params: {
  messages: ChatMessage[];
}): Promise<{ text: string; provider: ChatProviderId; model: string }> {
  const provider = activeChatProvider();
  if (provider === 'openrouter') {
    if (!openRouterApiKey()) {
      throw new Error('CHAT_PROVIDER=openrouter but OPENROUTER_API_KEY is missing');
    }
    const text = await openRouterChat(params.messages);
    return { text, provider: 'openrouter', model: openRouterModel() };
  }
  const text = await ollamaChat({ messages: params.messages });
  return { text, provider: 'ollama', model: ollamaChatModel() };
}

/** Warm path: no-op success for OpenRouter; preload Ollama when that’s the provider. */
export async function warmChat(): Promise<
  { ok: true; provider: ChatProviderId; model: string; ms: number } | { ok: false; error: string }
> {
  const provider = activeChatProvider();
  if (provider === 'openrouter') {
    if (!openRouterApiKey()) {
      return { ok: false, error: 'OPENROUTER_API_KEY missing' };
    }
    return { ok: true, provider: 'openrouter', model: openRouterModel(), ms: 0 };
  }
  const result = await warmOllama();
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, provider: 'ollama', model: ollamaChatModel(), ms: result.ms };
}
