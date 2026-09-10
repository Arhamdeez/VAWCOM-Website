import { NextRequest, NextResponse } from 'next/server';
import {
  applySafetyNets,
  buildOllamaMessages,
  buildRagSystemPrompt,
  offlineFallbackForIntent,
  planChatTurn,
} from '@/lib/chatKnowledge';
import { generateChatReply } from '@/lib/chatLlm';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const started = Date.now();
    const { trimmed, retrieval, intent, localResponse } = planChatTurn(message, history);

    if (localResponse) {
      return NextResponse.json({
        response: localResponse,
        meta: {
          provider: 'local',
          model: intent,
          intent,
          primary: retrieval.primaryService?.id ?? null,
          chunks: retrieval.chunks.map((c) => c.id),
          ms: Date.now() - started,
        },
      });
    }

    try {
      const system = buildRagSystemPrompt(retrieval, { intent });
      const messages = buildOllamaMessages(system, trimmed, history);
      const { text: raw, provider, model } = await generateChatReply({ messages });
      const text = applySafetyNets(raw, intent, trimmed, retrieval, history);

      const ms = Date.now() - started;
      console.info(
        `[chatbot] ${provider}/${model} intent=${intent} primary=${retrieval.primaryService?.id ?? 'none'} ${ms}ms`
      );

      return NextResponse.json({
        response: text,
        meta: {
          provider,
          model,
          intent,
          primary: retrieval.primaryService?.id ?? null,
          chunks: retrieval.chunks.map((c) => c.id),
          ms,
        },
      });
    } catch (e) {
      const detail = e instanceof Error ? e.message : 'Unknown chat provider error';
      console.error('[chatbot] generate failed:', detail);

      return NextResponse.json({
        response: offlineFallbackForIntent(intent, trimmed, retrieval, history),
        meta: {
          provider: 'local',
          model: `${intent}-fallback`,
          intent,
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
