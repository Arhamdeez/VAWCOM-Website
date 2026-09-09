/**
 * Golden chatbot eval — deterministic, no Ollama required.
 *
 * Run: npm run test:chatbot
 *
 * When a live transcript breaks:
 * 1. Add a fixture below (message + optional history).
 * 2. Assert intent and/or reply shape (links, bans, length).
 * 3. Re-run until green. Prefer fixing classify/local/sanitize over new regex lists.
 */

import {
  applySafetyNets,
  classifyIntent,
  looksLikeInventedBrainstorm,
  looksLikeMetaNarration,
  offlineFallbackForIntent,
  planChatTurn,
  sanitizeAssistantReply,
  type ChatIntent,
} from '../lib/chatKnowledge';

type HistoryMsg = { role: 'user' | 'ai' | 'assistant'; text: string };

type Fixture = {
  name: string;
  message: string;
  history?: HistoryMsg[];
  expectIntent?: ChatIntent | ChatIntent[];
  /** Prefer local reply when true; otherwise use offline fallback (simulates no Ollama). */
  useLocalFirst?: boolean;
  assert?: (reply: string, intent: ChatIntent) => void;
};

const VENDOR_RE =
  /\b(etsy|shopify|wix|squarespace|fiverr|upwork|godaddy|bigcommerce|amazon|ebay)\b/i;

function sentenceCount(text: string): number {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean).length;
}

function assertNoVendors(reply: string) {
  if (VENDOR_RE.test(reply)) throw new Error(`vendor name in reply: ${reply}`);
}

function assertNoMeta(reply: string) {
  if (looksLikeMetaNarration(reply) || /i see a pattern/i.test(reply)) {
    throw new Error(`meta narration in reply: ${reply}`);
  }
}

function assertNoBrainstorm(reply: string) {
  if (looksLikeInventedBrainstorm(reply)) {
    throw new Error(`invented brainstorm in reply: ${reply}`);
  }
}

function assertShort(reply: string, max = 4) {
  const n = sentenceCount(reply);
  if (n > max) throw new Error(`too long (${n} sentences): ${reply}`);
}

function assertHas(reply: string, re: RegExp, label: string) {
  if (!re.test(reply)) throw new Error(`expected ${label}: ${reply}`);
}

function assertIntent(got: ChatIntent, want: ChatIntent | ChatIntent[]) {
  const ok = Array.isArray(want) ? want.includes(got) : got === want;
  if (!ok) throw new Error(`intent ${got} !== ${Array.isArray(want) ? want.join('|') : want}`);
}

const voicePitchHistory: HistoryMsg[] = [
  {
    role: 'ai',
    text: 'We can help with that — take a look at [Voice Agents](/services/voice) for details, or [Contact](/contact?service=Voice%20Agents).',
  },
];

const FIXTURES: Fixture[] = [
  {
    name: 'greeting / hii',
    message: 'hii',
    expectIntent: 'greeting',
    useLocalFirst: true,
    assert: (reply) => {
      assertShort(reply, 2);
      assertNoVendors(reply);
      assertNoMeta(reply);
    },
  },
  {
    name: 'isn’t it your job',
    message: "isn't it your job to build?",
    expectIntent: 'browse_services',
    assert: (reply) => {
      assertHas(reply, /\/services|what you want|project|launch/i, 'services link or ask');
      assertNoMeta(reply);
      assertNoBrainstorm(reply);
      assertShort(reply, 3);
    },
  },
  {
    name: 'candles + inventory → commerce',
    message: 'I sell candles and need inventory tracking',
    expectIntent: 'project_need',
    assert: (reply) => {
      assertHas(reply, /\/services\/commerce/, 'commerce redirect');
      assertHas(reply, /\/contact/, 'contact link');
      assertNoVendors(reply);
      assertShort(reply, 3);
    },
  },
  {
    name: 'need a website → web',
    message: 'I need a website for my business',
    expectIntent: 'project_need',
    assert: (reply) => {
      assertHas(reply, /\/services\/web/, 'web redirect');
      assertHas(reply, /\/contact/, 'contact link');
      assertNoVendors(reply);
    },
  },
  {
    name: 'make me rich → sideways',
    message: 'make me rich',
    expectIntent: 'sideways',
    assert: (reply) => {
      if (/\b(you'll be rich|make you rich|guaranteed (wealth|riches)|promise.*(rich|wealth))\b/i.test(reply)) {
        throw new Error(`wealth promise: ${reply}`);
      }
      assertNoVendors(reply);
      assertShort(reply, 3);
    },
  },
  {
    name: 'site that makes me rich → sideways',
    message: 'build me a site that makes me rich',
    expectIntent: 'sideways',
    assert: (reply) => {
      if (/\b(you'll be rich|make you rich|guaranteed (wealth|riches))\b/i.test(reply)) {
        throw new Error(`wealth promise: ${reply}`);
      }
      assertNoBrainstorm(reply);
    },
  },
  {
    name: 'not sure → browse',
    message: 'not sure',
    expectIntent: 'browse_services',
    assert: (reply) => {
      assertHas(reply, /\/services|site|app|store|goal/i, 'services or clarify');
      assertNoBrainstorm(reply);
      assertNoMeta(reply);
    },
  },
  {
    name: 'give me ideas → browse, no list',
    message: 'give me ideas',
    expectIntent: 'browse_services',
    assert: (reply) => {
      assertNoBrainstorm(reply);
      assertHas(reply, /\/services|problem|goal|launch|site|app|store/i, 'redirect or clarify');
      assertShort(reply, 3);
    },
  },
  {
    name: 'math homework → off_topic',
    message: 'help me solve this math homework: 2+2',
    expectIntent: 'off_topic',
    assert: (reply) => {
      if (/\b(equals|the answer is|4\b|step\s*1)\b/i.test(reply) && !/can'?t|not|outside|pass|lane|VAWCOM/i.test(reply)) {
        throw new Error(`solved homework: ${reply}`);
      }
      if (/\/services\/(care|ai|commerce|voice)/i.test(reply)) {
        throw new Error(`invented service pitch on off-topic: ${reply}`);
      }
      // Must not lecture about the subject name
      if (/\b(can'?t|cannot) (help with|cover|do) math\b/i.test(reply)) {
        throw new Error(`named-subject refuse: ${reply}`);
      }
      assertHas(reply, /services|VAWCOM|project|build|launch/i, 'redirect');
      assertNoVendors(reply);
    },
  },
  {
    name: 'sleepy chitchat steers to services',
    message: "im kinda sleepy",
    expectIntent: 'chitchat',
    assert: (reply) => {
      assertHas(reply, /\/services|build|launch|project/i, 'steer back');
      assertNoMeta(reply);
      assertShort(reply, 3);
    },
  },
  {
    name: 'knowledge ask without domain list (newton)',
    message: "ok whats newtons second law",
    expectIntent: 'off_topic',
    assert: (reply) => {
      if (/\b(f\s*=\s*ma|force equals|newton'?s second)\b/i.test(reply)) {
        throw new Error(`answered knowledge: ${reply}`);
      }
      if (/\bphysics\b/i.test(reply) && /\b(can'?t|cannot|not)\b/i.test(reply)) {
        throw new Error(`named physics refuse: ${reply}`);
      }
      assertHas(reply, /services|VAWCOM|build|launch|project/i, 'redirect');
    },
  },
  {
    name: 'why so formal → tone',
    message: 'why so formal',
    expectIntent: 'tone_feedback',
    assert: (reply) => {
      assertHas(reply, /casual|project|services|building|help/i, 'soften + steer');
      assertNoMeta(reply);
    },
  },
  {
    name: 'reject voice agent → services, not voice again',
    message: "I don't need a voice agent",
    history: voicePitchHistory,
    expectIntent: 'reject_suggestion',
    assert: (reply) => {
      assertHas(reply, /\/services(?!\/voice)/, 'catalog /services');
      if (/\/services\/voice/.test(reply)) throw new Error(`re-pitched voice: ${reply}`);
      assertNoMeta(reply);
    },
  },
  {
    name: 'how are you → chitchat (Ollama path; offline fallback in CI)',
    message: 'how are you?',
    expectIntent: 'chitchat',
    assert: (reply) => {
      assertShort(reply, 2);
      assertNoMeta(reply);
      assertNoBrainstorm(reply);
    },
  },
  {
    name: 'wanna chat → chitchat',
    message: 'wanna chat',
    expectIntent: 'chitchat',
    assert: (reply) => {
      assertShort(reply, 2);
      assertNoMeta(reply);
    },
  },
  {
    name: 'don’t have anything to sell → browse, not commerce',
    message: "i dont have anything to sell. thats the issue.",
    expectIntent: 'browse_services',
    assert: (reply) => {
      if (/\/services\/commerce/i.test(reply)) throw new Error(`commerce on no-product: ${reply}`);
      assertHas(reply, /\/services|site|app|goal|problem/i, 'clarify or services');
      assertNoBrainstorm(reply);
    },
  },
  {
    name: 'what do you offer → catalog',
    message: 'What do you offer?',
    expectIntent: 'browse_services',
    assert: (reply) => {
      assertHas(reply, /\/services\/web/, 'lists web');
      assertHas(reply, /\/services\/commerce/, 'lists commerce');
      assertNoBrainstorm(reply);
    },
  },
  {
    name: 'i dont really know → browse local',
    message: "i dont really know",
    expectIntent: 'browse_services',
    useLocalFirst: true,
    assert: (reply) => {
      assertHas(reply, /\/services|site|app|store|goal/i, 'services or clarify');
      assertNoMeta(reply);
      if (/the user (just )?said|they('re| are) unsure/i.test(reply)) {
        throw new Error(`CoT leak: ${reply}`);
      }
    },
  },
];

function resolveReply(f: Fixture) {
  const { retrieval, intent, localResponse } = planChatTurn(f.message, f.history);
  if (f.expectIntent) assertIntent(intent, f.expectIntent);

  if (f.useLocalFirst && localResponse) {
    return { intent, reply: localResponse };
  }

  // Deterministic path for generative intents (no Ollama in CI).
  return {
    intent,
    reply: offlineFallbackForIntent(intent, f.message, retrieval, f.history),
  };
}

function runSanitizerChecks() {
  const vendor = sanitizeAssistantReply(
    'You should try Shopify or Etsy for that store.',
    null,
    false
  );
  assertNoVendors(vendor);

  const meta = applySafetyNets(
    'I see a pattern here — you’re keeping me on my toes!',
    'general',
    "isn't it your job",
    { chunks: [], primaryService: null, secondaryService: null, primaryScore: 0, catalogAsk: false }
  );
  assertNoMeta(meta);
  assertNoBrainstorm(meta);

  const cot = applySafetyNets(
    'Okay, the user just said "i dont really know" twice. They\'re unsure about what they need, which is common for people exploring options.',
    'browse_services',
    "i dont really know",
    { chunks: [], primaryService: null, secondaryService: null, primaryScore: 0, catalogAsk: false }
  );
  assertNoMeta(cot);
  if (/the user (just )?said|they('re| are) unsure/i.test(cot)) {
    throw new Error(`CoT not stripped: ${cot}`);
  }

  const brainstorm = applySafetyNets(
    'Here are some ideas:\n- A blog to share tips\n- Community forum\n- Resource page\n- Showcase your personality',
    'browse_services',
    'give me ideas',
    { chunks: [], primaryService: null, secondaryService: null, primaryScore: 0, catalogAsk: false }
  );
  assertNoBrainstorm(brainstorm);
}

function main() {
  let failed = 0;
  const results: { name: string; ok: boolean; detail?: string }[] = [];

  try {
    runSanitizerChecks();
    results.push({ name: 'sanitize / safety nets', ok: true });
  } catch (e) {
    failed += 1;
    results.push({
      name: 'sanitize / safety nets',
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  for (const f of FIXTURES) {
    try {
      const { intent, reply } = resolveReply(f);
      // Re-check classify independently for clarity in failures
      const retrieval = planChatTurn(f.message, f.history).retrieval;
      const classified = classifyIntent(f.message, retrieval, f.history);
      if (classified !== intent) {
        throw new Error(`classify drift: ${classified} vs plan ${intent}`);
      }
      assertNoVendors(reply);
      assertNoMeta(reply);
      f.assert?.(reply, intent);
      results.push({ name: f.name, ok: true });
    } catch (e) {
      failed += 1;
      results.push({
        name: f.name,
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  for (const r of results) {
    const mark = r.ok ? 'ok' : 'FAIL';
    console.log(`${mark.padEnd(4)} ${r.name}${r.detail ? `\n     ${r.detail}` : ''}`);
  }

  console.log(
    failed === 0
      ? `\n${results.length} passed (no Ollama required)`
      : `\n${failed}/${results.length} failed`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main();
