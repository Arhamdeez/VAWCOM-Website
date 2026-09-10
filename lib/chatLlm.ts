/**
 * Chat LLM: OpenRouter (prod / free) → Ollama (local) → throw for route fallbacks.
 * Intent / RAG / safety nets stay in chatKnowledge; this is generation only.
 */

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const FREE_ROUTER = 'openrouter/free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1';
const FETCH_MS = () =>
  Number(process.env.OPENROUTER_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS) || 45000;

export function openRouterApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() || '';
}

/** Paid slugs become `:free`; empty / router stay on the live free pool. */
export function asFreeModel(id: string): string {
  const m = id.trim();
  if (!m || m === FREE_ROUTER) return FREE_ROUTER;
  return m.endsWith(':free') ? m : `${m}:free`;
}

/** Preferred free slug, then the free router so a vanished `:free` model is not a hard fail. */
export function openRouterFreeModelChain(pinned = process.env.OPENROUTER_MODEL): string[] {
  const primary = asFreeModel(pinned?.trim() || FREE_ROUTER);
  return primary === FREE_ROUTER ? [primary] : [primary, FREE_ROUTER];
}

export function openRouterModel() {
  return openRouterFreeModelChain()[0];
}

export type ChatProviderId = 'openrouter' | 'ollama';

export function activeChatProvider(): ChatProviderId {
  const forced = process.env.CHAT_PROVIDER?.trim().toLowerCase();
  if (forced === 'ollama') return 'ollama';
  if (forced === 'openrouter') return 'openrouter';
  if (openRouterApiKey()) return 'openrouter';
  return 'ollama';
}

function ollamaBaseUrl() {
  return (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
}

function ollamaChatModel() {
  return (process.env.OLLAMA_MODEL || 'llama3.2').trim();
}

async function timedFetch(url: string, init: RequestInit, label: string): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_MS()) });
  } catch (e) {
    if (e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
      throw new Error(`${label} timed out after ${FETCH_MS()}ms`);
    }
    throw e;
  }
}

function openRouterError(data: unknown, status: number): string {
  const rec = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const nested = rec.error;
  const nestedMsg =
    nested && typeof nested === 'object' && nested !== null && 'message' in nested
      ? (nested as { message?: unknown }).message
      : nested;
  const err = nestedMsg || (typeof rec.message === 'string' ? rec.message : null) || `OpenRouter HTTP ${status}`;
  return typeof err === 'string' ? err : JSON.stringify(err);
}

async function openRouterChatOnce(messages: ChatMessage[], model: string): Promise<string> {
  const key = openRouterApiKey();
  if (!key) throw new Error('OPENROUTER_API_KEY missing');

  const res = await timedFetch(
    `${OPENROUTER_URL}/chat/completions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vawcom.com',
        'X-Title': 'VAWCOM Chat',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 120,
        provider: { max_price: { prompt: 0, completion: 0 } },
      }),
    },
    'OpenRouter chat'
  );

  const data = await res.json().catch(() => ({}));
  const text = data?.choices?.[0]?.message?.content;
  if (!res.ok || typeof text !== 'string' || !text.trim()) {
    throw new Error(openRouterError(data, res.status));
  }
  return text.trim();
}

async function openRouterChat(messages: ChatMessage[]): Promise<{ text: string; model: string }> {
  const chain = openRouterFreeModelChain();
  let lastErr: unknown;
  for (const model of chain) {
    try {
      const text = await openRouterChatOnce(messages, model);
      return { text, model };
    } catch (e) {
      lastErr = e;
      const detail = e instanceof Error ? e.message : String(e);
      console.warn(`[chatbot] free model ${model} failed: ${detail}`);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('OpenRouter free models unavailable');
}

async function ollamaChat(messages: ChatMessage[]): Promise<string> {
  const res = await timedFetch(
    `${ollamaBaseUrl()}/api/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaChatModel(),
        stream: false,
        keep_alive: '60m',
        messages,
        options: { temperature: 0.15, num_predict: 55, num_ctx: 4096 },
      }),
    },
    'Ollama chat'
  );

  const data = await res.json();
  const text = data.message?.content;
  if (!res.ok || typeof text !== 'string' || !text.trim()) {
    throw new Error(data.error || `Ollama chat HTTP ${res.status}`);
  }
  return text.trim();
}

export async function generateChatReply(params: {
  messages: ChatMessage[];
}): Promise<{ text: string; provider: ChatProviderId; model: string }> {
  const provider = activeChatProvider();
  if (provider === 'openrouter') {
    if (!openRouterApiKey()) {
      throw new Error('CHAT_PROVIDER=openrouter but OPENROUTER_API_KEY is missing');
    }
    const { text, model } = await openRouterChat(params.messages);
    return { text, provider: 'openrouter', model };
  }
  const text = await ollamaChat(params.messages);
  return { text, provider: 'ollama', model: ollamaChatModel() };
}

export async function warmChat(): Promise<
  { ok: true; provider: ChatProviderId; model: string; ms: number } | { ok: false; error: string }
> {
  if (activeChatProvider() === 'openrouter') {
    if (!openRouterApiKey()) return { ok: false, error: 'OPENROUTER_API_KEY missing' };
    return { ok: true, provider: 'openrouter', model: openRouterModel(), ms: 0 };
  }

  const started = Date.now();
  try {
    const res = await timedFetch(
      `${ollamaBaseUrl()}/api/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaChatModel(),
          stream: false,
          keep_alive: '60m',
          messages: [{ role: 'user', content: 'ping' }],
          options: { num_predict: 1, temperature: 0, num_ctx: 512 },
        }),
      },
      'Ollama warm'
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: (data as { error?: string }).error || `HTTP ${res.status}` };
    }
    return { ok: true, provider: 'ollama', model: ollamaChatModel(), ms: Date.now() - started };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Warm failed' };
  }
}
