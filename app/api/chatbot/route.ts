import { NextRequest, NextResponse } from 'next/server';
import {
  applySafetyNets,
  buildOllamaMessages,
  buildRagSystemPrompt,
  classifyIntent,
  localReplyForIntent,
  offlineFallbackForIntent,
  retrieveKnowledge,
  splitIntentAndReply,
} from '@/lib/chatKnowledge';
import { generateChatReply } from '@/lib/chatLlm';

export async function POST(request: NextRequest) {
  try {
    const { message, history, path } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const started = Date.now();
    const trimmed = message.trim();
    const pagePath = typeof path === 'string' ? path : '/';
    const retrieval = retrieveKnowledge(trimmed, pagePath);

    // Instant local short-circuits only (no model). Everything else = one LLM call.
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
      // Single pass: model classifies + replies in one completion (no second round-trip).
      const system = buildRagSystemPrompt(retrieval, {
        intent: heuristicIntent,
        message: trimmed,
        unified: true,
      });
      const messages = buildOllamaMessages(system, trimmed, history);
      const { text: raw, provider, model } = await generateChatReply({
        messages,
        maxTokens: 220,
      });
      const split = splitIntentAndReply(raw);
      const intent = split.intent ?? heuristicIntent;
      const intentSource = split.intent ? 'llm' : 'heuristic';
      const text = applySafetyNets(split.reply, intent, trimmed, retrieval, history);

      const ms = Date.now() - started;
      console.info(
        `[chatbot] ${provider}/${model} intent=${intent}(${intentSource}) page=${retrieval.page.path} primary=${retrieval.primaryService?.id ?? 'none'} ${ms}ms`
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
      { status: 500 }
    );
  }
}
