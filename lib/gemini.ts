import { BlockReason, GoogleGenerativeAI } from '@google/generative-ai';

/** Default model — override with GEMINI_MODEL. Gemini 2.0 Flash is not available to new API keys (use 2.5+). */
const DEFAULT_MODEL = 'gemini-2.5-flash';

export type GeminiResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

/**
 * Server-side Gemini call for the marketing-site chatbot.
 * Requires GEMINI_API_KEY in the environment (set in Vercel / .env.local).
 */
export async function generateGeminiReply(params: {
  systemInstruction: string;
  userMessage: string;
}): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: 'GEMINI_API_KEY is not configured' };
  }

  const modelName = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: params.systemInstruction,
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 450,
      },
    });

    const result = await model.generateContent(params.userMessage);
    const response = result.response;

    const blockReason = response.promptFeedback?.blockReason;
    if (
      blockReason !== undefined &&
      blockReason !== BlockReason.BLOCKED_REASON_UNSPECIFIED
    ) {
      return {
        ok: false,
        error: `Prompt blocked (${blockReason}). Try rephrasing your message.`,
      };
    }

    const text = response.text();
    if (!text?.trim()) {
      const finish = response.candidates?.[0]?.finishReason;
      return {
        ok: false,
        error: finish
          ? `No text returned (finish: ${finish}).`
          : 'Empty response from the model.',
      };
    }

    return { ok: true, text: text.trim() };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown Gemini error';
    return { ok: false, error: message };
  }
}
