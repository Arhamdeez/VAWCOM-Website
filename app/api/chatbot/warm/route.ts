import { NextResponse } from 'next/server';
import { warmChat } from '@/lib/chatLlm';

/** Warm OpenRouter (no-op) or preload Ollama so the first chat isn’t cold. */
export async function POST() {
  const result = await warmChat();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }
  console.info(`[chatbot] warm ${result.provider}/${result.model} ${result.ms}ms`);
  return NextResponse.json({
    ok: true,
    provider: result.provider,
    model: result.model,
    ms: result.ms,
  });
}

export async function GET() {
  return POST();
}
