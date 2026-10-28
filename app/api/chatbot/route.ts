import { NextRequest, NextResponse } from 'next/server';
import {
  applySafetyNets,
  buildOllamaMessages,
  buildRagSystemPrompt,
  classifyIntent,
  localReplyForIntent,
  offlineFallbackForIntent,
  retrieveKnowledge,
  sanitizeChatHistory,
  splitIntentAndReply,
} from '@/lib/chatKnowledge';
import { generateChatReply } from '@/lib/chatLlm';

const MAX_MESSAGE_CHARS = 800;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 24;

const rateHits = new Map<string, { n: number; t: number }>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const cur = rateHits.get(ip);
  if (!cur || now - cur.t > RATE_WINDOW_MS) {
    rateHits.set(ip, { n: 1, t: now });
    return true;
  }
  if (cur.n >= RATE_MAX) return false;
  cur.n += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    if (!allowRequest(clientIp(request))) {
      return NextResponse.json(
        { error: 'Too many requests', response: 'Slow down a bit, then try again.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message : '';
    const path = typeof body?.path === 'string' ? body.path : '/';
    const history = sanitizeChatHistory(body?.history, message);

    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmed = message.trim().slice(0, MAX_MESSAGE_CHARS);
    const started = Date.now();
    const pagePath = path;
    const retrieval = retrieveKnowledge(trimmed, pagePath);

    // Instant local short-circuits (most intents). Fuzzy “general” may still hit the LLM.
    const heuristicIntent = classifyIntent(trimmed, retrieval, history);
    const localResponse = localReplyForIntent(heuristicIntent, trimmed, retrieval, history);
    if (localResponse) {
      return NextResponse.json({
        response: localResponse,
        meta: {
          provider: 'local',
          model: heuristicIntent,
          intent: heuristicIntent,
          intentSource: 'heuristic',
          path: retrieval.page.path,
          primary: retrieval.primaryService?.id ?? null,
          chunks: retrieval.chunks.map((c) => c.id),
          ms: Date.now() - started,
        },
      });
    }

    try {
      const system = buildRagSystemPrompt(retrieval, {
        intent: heuristicIntent,
        message: trimmed,
        unified: true,
      });
      const messages = buildOllamaMessages(system, trimmed, history);
      const { text: raw, provider, model } = await generateChatReply({
        messages,
        maxTokens: 160,
      });
      const split = splitIntentAndReply(raw);
      const intent = split.intent ?? heuristicIntent;
      const intentSource = split.intent ? 'llm' : 'heuristic';
      const text = applySafetyNets(split.reply, intent, trimmed, retrieval, history);

      const ms = Date.now() - started;
      console.info(
        `[chatbot] ${provider}/${model} intent=${intent}(${intentSource}) page=${retrieval.page.path} primary=${retrieval.primaryService?.id ?? 'none'} ${ms}ms`,
      );

      return NextResponse.json({
        response: text,
        meta: {
          provider,
          model,
          intent,
          intentSource,
          path: retrieval.page.path,
          primary: retrieval.primaryService?.id ?? null,
          chunks: retrieval.chunks.map((c) => c.id),
          ms,
        },
      });
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'Unknown chat provider error';
      console.error('[chatbot] generate failed:', detail);

      return NextResponse.json({
        response: offlineFallbackForIntent(heuristicIntent, trimmed, retrieval, history),
        meta: {
          provider: 'local',
          model: `${heuristicIntent}-fallback`,
          intent: heuristicIntent,
          intentSource: 'heuristic',
          path: retrieval.page.path,
          ms: Date.now() - started,
        },
      });
    }
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', response: 'Something went wrong. Try again.' },
      { status: 500 },
    );
  }
}
