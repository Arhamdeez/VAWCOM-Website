/** Ollama chat for local RAG generation (retrieval is lexical — no embed model). */

export function ollamaBaseUrl() {
  return (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
}

/** Default llama3.2 (3B) for generative quality — override with OLLAMA_MODEL. */
export function ollamaChatModel() {
  return (process.env.OLLAMA_MODEL || 'llama3.2').trim();
}

export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

const FETCH_MS = () => Number(process.env.OLLAMA_TIMEOUT_MS) || 45000;

/** Keep the chat model resident in RAM (Ollama unloads idle models). */
const KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE?.trim() || '60m';

/**
 * Load the chat model into memory without a full reply.
 * Call on app boot so the first real chat isn't paying cold-start.
 */
export async function warmOllama(): Promise<{ ok: true; ms: number } | { ok: false; error: string }> {
  const base = ollamaBaseUrl();
  const model = ollamaChatModel();
  const started = Date.now();

  try {
    const res = await withTimeout(
      fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          keep_alive: KEEP_ALIVE,
          messages: [{ role: 'user', content: 'ping' }],
          options: { num_predict: 1, temperature: 0, num_ctx: 512 },
        }),
      }),
      FETCH_MS(),
      'Ollama warm'
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: (data as { error?: string }).error || `HTTP ${res.status}` };
    }
    return { ok: true, ms: Date.now() - started };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Warm failed' };
  }
}

export type OllamaChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function ollamaChat(params: {
  system?: string;
  user?: string;
  messages?: OllamaChatMessage[];
}): Promise<string> {
  const base = ollamaBaseUrl();
  const model = ollamaChatModel();

  const messages: OllamaChatMessage[] =
    params.messages ??
    [
      ...(params.system ? [{ role: 'system' as const, content: params.system }] : []),
      { role: 'user' as const, content: params.user || '' },
    ];

  const res = await withTimeout(
    fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        keep_alive: KEEP_ALIVE,
        messages,
        options: {
          temperature: 0.15,
          num_predict: 55,
          // Enough for system + ~8 turns; root issues were greeting miss + flat history, not tiny ctx
          num_ctx: 4096,
        },
      }),
    }),
    FETCH_MS(),
    'Ollama chat'
  );

  const data = await res.json();
  const text = data.message?.content;
  if (!res.ok || typeof text !== 'string' || !text.trim()) {
    throw new Error(data.error || `Ollama chat HTTP ${res.status}`);
  }
  return text.trim();
}
