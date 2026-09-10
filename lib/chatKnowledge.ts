import { FOUNDERS } from '@/components/home/data';
import { SERVICES, SERVICE_FAQS, type Service } from '@/lib/services';
import { CHAT_SITE_LINKS } from '@/lib/site';
import { PROJECTS } from '@/lib/work';

export type KnowledgeChunk = {
  id: string;
  text: string;
  terms?: string[];
};

/**
 * Small intent set for routing. Heuristic/lexical for now —
 * ponytail: swap classifyIntent body for an LLM call when heuristics drift.
 */
export type ChatIntent =
  | 'greeting'
  | 'chitchat'
  | 'thanks'
  | 'correction'
  | 'tone_feedback'
  | 'reject_suggestion'
  | 'off_topic'
  | 'browse_services'
  | 'project_need'
  | 'sideways'
  | 'general';

const GREETING_RE =
  /^(h+i+y*a*|he+y+|hello+|howdy|yo+|sup|good\s*(morning|afternoon|evening))[\s!.?]*$/i;

const VAGUE_HELP_RE =
  /^(?:(?:hey|hi|yeah|yep|yes|ok|okay|so|well|um|uh)[,!.]?\s+)*((i\s+)?(need|want|could use)\s+(some\s+)?help|help(\s+me)?(\s+please)?|can you help(\s+me)?|please help|i'?m stuck|not sure where to start)[\s!.?]*$/i;

const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'for', 'is', 'are',
  'i', 'we', 'you', 'my', 'our', 'me', 'want', 'need', 'have', 'with', 'that', 'this',
  'it', 'be', 'can', 'do', 'does', 'what', 'how', 'about', 'from', 'as', 'at', 'like',
  'just', 'really', 'very', 'also', 'any', 'some', 'get', 'got', 'make', 'looking',
]);

const VENDOR_RE =
  /\b(etsy|shopify|wix|squarespace|wordpress\.com|woocommerce\.com|fiverr|upwork|godaddy|bigcommerce|amazon|ebay)\b/i;

/** Legacy keyword list — prefer looksLikeKnowledgeAsk; keep for weak signal only. */
const OFF_TOPIC_RE =
  /\b(homework|essay|poem|recipe|weather|riddle|translate|tutoring|who (?:won|is the president)|capital of|movie|netflix|spotify|dating|horoscope|cooking)\b/i;

const MATH_EXPR_RE = /\d\s*[\+\-\*\/×÷^=]\s*\d/;

/**
 * General-knowledge / homework-style asks — any subject.
 * Not a domain blocklist: “what is X / explain Y / 1+1” when not about VAWCOM.
 */
function looksLikeKnowledgeAsk(message: string): boolean {
  const t = message.trim();
  if (!t || SITE_RELEVANT_RE.test(t)) return false;
  if (MATH_EXPR_RE.test(t)) return true;
  if (
    /\b(what (is|are|was|were|=)|what'?s|who (is|are|was|were)|explain|define|tell me (what|how|why|about)|calculate|solve|how (do|does|did) .+ work)\b/i.test(
      t
    )
  ) {
    return true;
  }
  // Short “why can’t you / what’s your problem with …” while arguing about a knowledge refuse
  if (/\b(what'?s your problem with|why (won'?t|cant|can'?t) you (just )?(answer|tell|say)|not (a |asking (a )?)?(math|homework) question|ack?chually|actually)\b/i.test(t)) {
    return false; // handled as correction / tone with history off-topic
  }
  return false;
}

const CORRECTION_RE =
  /\b(wdym|what do you mean|what are you (even )?saying|what pattern|you (just )?said|i didn'?t (apologi[sz]e|say that|ask)|why (did you|say)|that('?s| was) (weird|odd|wrong)|come again|huh+|that wasn'?t|i am not asking|i'?m not asking|not a .+ question)\b/i;

const SILLY_RE =
  /^(hey[,!]?\s+)?(i'?m\s+)?(hungry|starving|bored|sleepy|tired|horny|lonely|drunk|high|broke|sad|mad|angry|dead|dying)[\s!.?]*$/i;

const SILLY_ALSO_RE =
  /\b(feed me|order (me )?food|what'?s for (lunch|dinner)|make me (a )?sandwich|kill me|end me)\b/i;

const CHITCHAT_RE =
  /\b((just )?wanna chat|want to chat|down to chat|how are you doing|how're you doing|how you doing|how('?s| is) it going)\b/i;

const WELLBEING_RE =
  /^(hey[,!]?\s+)?((are you|are u|r u|you)\s+(ok|okay|alright|good|fine)|(how are you|how r you|how're you|how are you doing|how's it going|hows it going))[\s?!.,]*$/i;

const JOB_PUSHBACK_RE =
  /\b(isn'?t it your job|isnt it your job|your job to (build|make|do)|shouldn'?t you (already )?know|why (don'?t|dont) you (just )?build)\b/i;

const THANKS_RE = /^(thanks|thank you|thx|ty|ok|okay|cool|great|got it|nice)[\s!.]*$/i;

const TONE_FEEDBACK_RE =
  /\b(rude|nonchalant|cold|mean|harsh|unfriendly|attitude|tone|formal|short with me|dismissive|stupid|dumb|dumbo|idiot|useless|broken|creepy|robotic|not funny|wasn'?t funny|wasnt funny|talking like that|why are you talking|why so formal|i'?d block you|id block you|haven'?t (even )?asked|i didn'?t ask)\b/i;

const LISTEN_FIRST_RE =
  /\b(listen( to)?( my)?( the)? idea|hear me out|let me (explain|finish|share)|before you (recommend|suggest|send)|at least listen|i have an idea|got an idea|my idea is)\b/i;

const SIDEWAYS_RE =
  /\b(sue|lawsuit|lawyer|liability|guarantee|guaranteed|millionaire|million dollars|get rich|makes? me rich|promise (me )?(it|that) will)\b/i;

const EXPLORE_RE =
  /\b(idk|i don'?t know|i don'?t really know|dont really know|don'?t really know|not sure|don'?t care|dont care|no idea|give me ideas|suggest ideas|website ideas|ideas for|suggest (something|one|a service)|what should i|aren'?t you going to suggest|are you going to suggest|recommend something|show me (what you|options)|just suggest)\b/i;

const REJECT_SIGNAL_RE =
  /\b((i\s+)?(don'?t|do not|dont)\s+(need|want|like)|not\s+(looking for|interested)|no\s+thanks|wrong\s+(one|service|lane)|pass\s+on)\b/i;

const CATALOG_ASK =
  /what do you (offer|do)|what (services|can you offer)|your (services|work|capabilities)|show me (your )?services|list (your )?services/i;

const SITE_RELEVANT_RE =
  /\b(vawcom|service|services|website|web\s*app|landing|mobile\s*app|ios|android|ecommerce|e-commerce|store|shop|inventory|checkout|voice\s*agent|phone\s*call|chatbot|automat|n8n|maintenance|rescue|bug|project|build|hire|quote|pricing|price|cost|contact|about|gallery|portfolio|founders?|karachi|client|startup|saas|cms|seo|how (do|long|much)|where are you|take over|existing code|help|idea)\b/i;

const PROJECT_SIGNAL_RE =
  /\b(need|want|build|sell|store|website|web\s*app|app|ios|android|inventory|broken|looking for|help with|shop|candles|phone|calls|chatbot|automat|maintenance|bug|portfolio|landing)\b/i;

const SERVICE_TERMS: Record<string, string[]> = {
  web: [
    'website', 'site', 'landing', 'dashboard', 'webapp', 'web app', 'web', 'seo', 'cms',
    'marketing site', 'homepage', 'portfolio site',
  ],
  apps: [
    'app', 'mobile', 'ios', 'android', 'iphone', 'ipad', 'play store', 'app store',
    'testflight', 'cross-platform', 'react native',
  ],
  voice: [
    'phone', 'call', 'calls', 'voice', 'receptionist', 'ivr', 'missed calls', 'telephony',
    'phone line', 'answering', 'dial',
  ],
  ai: [
    'ai', 'chatbot', 'automation', 'automate', 'n8n', 'workflow', 'bot', 'llm',
    'assistant', 'document qa', 'rag', 'zapier',
  ],
  commerce: [
    'shop', 'store', 'ecommerce', 'e-commerce', 'ecom', 'cart', 'checkout', 'inventory',
    'stock', 'orders', 'payments', 'sell online', 'storefront', 'product', 'products',
    'handmade', 'sku', 'online store', 'sell', 'selling', 'candles',
  ],
  care: [
    'bug', 'bugs', 'broken', 'maintenance', 'rescue', 'fix', 'legacy', 'slow',
    'update', 'updates', 'monitor', 'crash', 'error', 'refactor', 'cleanup',
  ],
};

function historyLen(history: unknown): number {
  return Array.isArray(history) ? history.length : 0;
}

function pickVariant<T>(variants: readonly T[], seed: string): T {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return variants[Math.abs(h) % variants.length]!;
}

function historyTexts(history: unknown): string[] {
  if (!Array.isArray(history)) return [];
  return history
    .map((m: { text?: string }) => (typeof m?.text === 'string' ? m.text : ''))
    .filter(Boolean);
}

function lastAssistantText(history: unknown): string {
  if (!Array.isArray(history)) return '';
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i] as { role?: string; text?: string };
    if ((m?.role === 'assistant' || m?.role === 'ai') && typeof m.text === 'string') {
      return m.text;
    }
  }
  return '';
}

function mentionedServiceIds(history: unknown): string[] {
  const ids: string[] = [];
  for (const text of historyTexts(history)) {
    for (const s of SERVICES) {
      if (text.includes(`/services/${s.id}`) && !ids.includes(s.id)) ids.push(s.id);
    }
  }
  return ids;
}

function pickVariantAvoidingLast<T extends string>(
  variants: readonly T[],
  seed: string,
  lastReply: string
): T {
  const first = pickVariant(variants, seed);
  if (!lastReply || variants.length < 2) return first;
  const lastStart = lastReply.slice(0, 24).toLowerCase();
  if (!first.toLowerCase().startsWith(lastStart.slice(0, 12))) return first;
  const idx = variants.indexOf(first);
  return variants[(idx + 1) % variants.length]!;
}

function contactHref(serviceTitle?: string) {
  if (!serviceTitle) return '/contact';
  return `/contact?service=${encodeURIComponent(serviceTitle)}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function containsPhrase(haystack: string, phrase: string): boolean {
  const p = phrase.toLowerCase().trim();
  if (!p) return false;
  if (p.includes(' ')) return haystack.includes(p);
  if (p.length <= 3) {
    return new RegExp(`(?:^|[^a-z0-9])${p}(?:[^a-z0-9]|$)`, 'i').test(haystack);
  }
  return new RegExp(`(?:^|[^a-z0-9])${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[^a-z0-9]|$)`, 'i').test(
    haystack
  );
}

/** True when a term appears under negation (“don’t sell”, “nothing to automate”). */
function phraseIsNegated(queryLower: string, phrase: string): boolean {
  const p = phrase.toLowerCase().trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!p) return false;
  return new RegExp(
    `\\b(don'?t|do not|dont|not|no|nothing|without|never)\\b[\\w\\s',-]{0,48}\\b${p}\\b`,
    'i'
  ).test(queryLower);
}

/** Project language that isn’t under negation — “don’t sell” is not a commerce ask. */
function hasPositiveProjectSignal(message: string): boolean {
  const lower = message.toLowerCase();
  const signals = [
    'need', 'want', 'build', 'sell', 'selling', 'store', 'website', 'web app', 'app', 'ios',
    'android', 'inventory', 'broken', 'looking for', 'help with', 'shop', 'candles', 'phone',
    'calls', 'chatbot', 'automat', 'automation', 'automate', 'maintenance', 'bug', 'portfolio',
    'landing',
  ];
  return signals.some((s) => containsPhrase(lower, s) && !phraseIsNegated(lower, s));
}

/** User has no product yet — clarify, don’t pitch e-commerce. */
const NO_PRODUCT_RE =
  /\b((don'?t|dont|do not) have .{0,48}(to sell|to automate)|nothing to (sell|automate)|no (product|business|idea) (yet|to sell))\b/i;

function historyLooksSideways(history: unknown): boolean {
  return historyTexts(history).some(
    (t) => SIDEWAYS_RE.test(t) || /\b(millionaire|get rich|riches|wealth|no millionaire guarantee)\b/i.test(t)
  );
}

const SIDEWAYS_FOLLOWUP_RE =
  /^(hey[,!]?\s+)?(tell me how|how(\s+do\s+i)?|and how|ok how|then how)[\s?!.,]*$/i;

const CHALLENGE_FIT_RE =
  /\b(how does (that|this|it|automation|ai) fit|why (would|did) you (suggest|say|pick)|that doesn'?t fit|doesn'?t make sense)\b/i;

const AFFIRM_ONLY_RE =
  /^(so[, ]+)?(then[, ]+)?(yes[, ]+)?vawcom can help( me)?[.!?]*$/i;

function servicesMentionedInText(text: string): string[] {
  const lower = text.toLowerCase();
  const ids: string[] = [];
  for (const s of SERVICES) {
    let hit = containsPhrase(lower, s.id) || containsPhrase(lower, s.title.toLowerCase());
    if (!hit && s.id === 'voice' && /\bvoice\b/.test(lower) && /\bagents?\b/.test(lower)) hit = true;
    if (!hit && s.id === 'commerce' && /\b(e-?commerce|online store|storefront)\b/.test(lower)) hit = true;
    if (!hit) {
      for (const term of SERVICE_TERMS[s.id] ?? []) {
        if (term.length >= 4 && containsPhrase(lower, term.toLowerCase())) {
          hit = true;
          break;
        }
      }
    }
    if (hit && !ids.includes(s.id)) ids.push(s.id);
  }
  return ids;
}

function rejectedServiceIds(message: string, history?: unknown): string[] {
  const t = message.trim();
  if (!REJECT_SIGNAL_RE.test(t) && !/\bi don'?t need\b/i.test(t)) return [];

  const named = servicesMentionedInText(t);
  if (named.length) return named;

  if (/\b(that|this|it)\b/i.test(t)) {
    const prior = mentionedServiceIds(history);
    if (prior.length) return [prior[prior.length - 1]!];
  }
  return [];
}

function activePriorServiceIds(history: unknown, message?: string): string[] {
  const rejected = new Set<string>();
  if (message) {
    for (const id of rejectedServiceIds(message, history)) rejected.add(id);
  }
  if (Array.isArray(history)) {
    for (const m of history) {
      if (m?.role === 'user' || m?.role === 'human') {
        const text = typeof m?.text === 'string' ? m.text : '';
        for (const id of rejectedServiceIds(text, history)) rejected.add(id);
      }
    }
  }
  return mentionedServiceIds(history).filter((id) => !rejected.has(id));
}

function historyLooksOffTopic(history: unknown): boolean {
  if (!Array.isArray(history)) return false;
  const recent = history.slice(-6);
  return recent.some((m: { text?: string; role?: string }) => {
    const t = typeof m?.text === 'string' ? m.text : '';
    if (!t) return false;
    if (m?.role === 'user' || m?.role === 'human') {
      return looksLikeKnowledgeAsk(t) || MATH_EXPR_RE.test(t) || OFF_TOPIC_RE.test(t);
    }
    // Prior assistant refused general knowledge / homework
    return /\b(outside what i cover|focused on VAWCOM|can'?t (cover|help with)|not set up for|here for VAWCOM)\b/i.test(
      t
    );
  });
}

function isVagueHelp(message: string): boolean {
  const t = message.trim();
  if (!t || looksLikeKnowledgeAsk(t) || MATH_EXPR_RE.test(t)) return false;
  return VAGUE_HELP_RE.test(t);
}

function isSidewaysAsk(message: string): boolean {
  const t = message.trim();
  if (!SIDEWAYS_RE.test(t)) return false;
  if (
    /\b(build|website|app|store|inventory|ios|android)\b/i.test(t) &&
    !/\b(sue|lawsuit|millionaire|get rich|make me (a )?million|makes? me rich)\b/i.test(t)
  ) {
    return false;
  }
  return true;
}

function isExploreAsk(message: string): boolean {
  const t = message.trim();
  if (!EXPLORE_RE.test(t)) return false;
  if (/\b(sell|inventory|website|store|app|ios|android|candles|phone|chatbot)\b/i.test(t)) {
    return false;
  }
  return true;
}

function isChitchatAsk(message: string): boolean {
  const t = message.trim();
  if (WELLBEING_RE.test(t) || SILLY_RE.test(t) || SILLY_ALSO_RE.test(t)) return true;
  if (
    /\b(friendly convo|nice (and )?friendly|just (want to |wanna )?chat|kinda sleepy|virtual (chai|coffee|tea)|what'?s on your mind)\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (!CHITCHAT_RE.test(t)) return false;
  if (/\b(need a|want a|build|website|store|inventory|sell)\b/i.test(t)) return false;
  if (looksLikeKnowledgeAsk(t) || MATH_EXPR_RE.test(t)) return false;
  return true;
}

// ─── Retrieval (lexical RAG) ───────────────────────────────────────────────

export type RetrievalResult = {
  chunks: KnowledgeChunk[];
  primaryService: Service | null;
  secondaryService: Service | null;
  primaryScore: number;
  catalogAsk: boolean;
};

function serviceChunk(s: Service): KnowledgeChunk {
  return {
    id: `service-${s.id}`,
    terms: SERVICE_TERMS[s.id] ?? [],
    text: [
      `${s.title} — [${s.title}](/services/${s.id})`,
      s.lede,
      `For: ${s.for}`,
      `Start: [Contact](${contactHref(s.title)})`,
    ].join('\n'),
  };
}

export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = SERVICES.map(serviceChunk);

  for (const [i, faq] of SERVICE_FAQS.entries()) {
    chunks.push({
      id: `faq-${i}`,
      terms: tokenize(faq.q),
      text: `FAQ: ${faq.q}\nAnswer: ${faq.a}`,
    });
  }

  chunks.push({
    id: 'site-links',
    text: `Allowed links: ${[
      ...CHAT_SITE_LINKS.map((l) => `[${l.label}](${l.href})`),
      ...SERVICES.map((s) => `[${s.title}](/services/${s.id})`),
    ].join(', ')}.`,
  });

  chunks.push({
    id: 'company',
    terms: ['vawcom', 'company', 'studio', 'who are you', 'based', 'karachi', 'about'],
    text: 'VAWCOM builds web, apps, voice, AI, e-commerce, and maintenance. Karachi base; US/UK/EU overlap. Founder-led. [/about](/about) · [/gallery](/gallery) · [Contact](/contact).',
  });

  chunks.push({
    id: 'process',
    terms: ['process', 'how you work', 'phases', 'wireframes', 'deploy', 'planning'],
    text: 'Process: Idea → Planning → Wireframes → Structure → Development → Deploy. Details on [/about](/about).',
  });

  chunks.push({
    id: 'founders',
    terms: ['founder', 'founders', 'team', 'arham', 'shahbakht', 'who builds'],
    text: `Founders: ${FOUNDERS.map((f) => `${f.name} (${f.role})`).join('; ')}. [/about](/about).`,
  });

  chunks.push({
    id: 'work',
    terms: ['gallery', 'portfolio', 'projects', 'work', 'hisaab', 'vawbot', 'case study'],
    text: [
      'Work ([/gallery](/gallery)):',
      ...PROJECTS.map((p) => `- ${p.title}: ${p.summary}`),
    ].join('\n'),
  });

  return chunks;
}

function scoreChunk(queryTokens: string[], queryLower: string, chunk: KnowledgeChunk): number {
  const hay = `${chunk.text} ${(chunk.terms ?? []).join(' ')}`.toLowerCase();
  let score = 0;
  for (const t of queryTokens) {
    if (phraseIsNegated(queryLower, t)) continue;
    if (containsPhrase(hay, t)) score += t.length > 4 ? 2 : 1;
  }
  for (const term of chunk.terms ?? []) {
    const t = term.toLowerCase();
    if (phraseIsNegated(queryLower, t)) continue;
    if (containsPhrase(queryLower, t)) score += Math.max(5, t.split(/\s+/).length * 4);
  }
  return score;
}

export function retrieveKnowledge(query: string): RetrievalResult {
  const chunks = buildKnowledgeChunks();
  const queryLower = query.toLowerCase();
  const tokens = tokenize(query);
  const catalogAsk = CATALOG_ASK.test(query);

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(tokens, queryLower, chunk) }))
    .sort((a, b) => b.score - a.score);

  const serviceRanked = ranked.filter((r) => r.chunk.id.startsWith('service-') && r.score > 0);
  const primaryScore = serviceRanked[0]?.score ?? 0;
  const primaryId = serviceRanked[0]?.chunk.id.replace(/^service-/, '') ?? null;
  const secondaryId =
    serviceRanked[1] && serviceRanked[1].score >= primaryScore * 0.7 && serviceRanked[1].score >= 3
      ? serviceRanked[1].chunk.id.replace(/^service-/, '')
      : null;

  const primaryService = primaryId ? SERVICES.find((s) => s.id === primaryId) ?? null : null;
  const secondaryService = secondaryId
    ? SERVICES.find((s) => s.id === secondaryId) ?? null
    : null;

  const picked: KnowledgeChunk[] = [];
  const add = (id: string) => {
    const c = chunks.find((x) => x.id === id);
    if (c && !picked.some((p) => p.id === id)) picked.push(c);
  };

  if (catalogAsk) {
    for (const s of SERVICES) add(`service-${s.id}`);
  } else if (primaryService) {
    add(`service-${primaryService.id}`);
    if (secondaryService) add(`service-${secondaryService.id}`);
  } else {
    for (const s of SERVICES) add(`service-${s.id}`);
  }

  for (const r of ranked) {
    if (!r.chunk.id.startsWith('service-') && r.score > 0 && picked.length < 5) {
      add(r.chunk.id);
    }
  }
  add('site-links');

  return { chunks: picked, primaryService, secondaryService, primaryScore, catalogAsk };
}

/** Use redirect template when retrieval is confident — guarantees page + Contact links. */
export function shouldUseServiceRedirect(retrieval: RetrievalResult, message: string): boolean {
  if (isSidewaysAsk(message)) return false;
  if (/\b(sue|lawsuit|millionaire|get rich)\b/i.test(message)) return false;
  if (isExploreAsk(message) || NO_PRODUCT_RE.test(message)) return false;
  if (REJECT_SIGNAL_RE.test(message) && servicesMentionedInText(message).length) return false;
  if (AFFIRM_ONLY_RE.test(message.trim()) || CHALLENGE_FIT_RE.test(message)) return false;
  if (!retrieval.primaryService || retrieval.catalogAsk) return false;
  if (retrieval.primaryScore < 5) return false;
  if (!hasPositiveProjectSignal(message) && retrieval.primaryScore < 10) return false;
  return true;
}

export function isOffTopic(
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): boolean {
  const t = message.trim();
  if (!t) return false;
  if (THANKS_RE.test(t) || TONE_FEEDBACK_RE.test(t)) return false;
  if (isVagueHelp(t) || LISTEN_FIRST_RE.test(t) || isSidewaysAsk(t) || isExploreAsk(t)) return false;
  if (isChitchatAsk(t) || JOB_PUSHBACK_RE.test(t)) return false;

  // Any subject: general-knowledge / homework-style asks outside VAWCOM
  if (looksLikeKnowledgeAsk(t) || OFF_TOPIC_RE.test(t)) return true;

  // Continuing an off-lane thread with a short pushback / follow-up
  if (
    historyLooksOffTopic(history) &&
    !SITE_RELEVANT_RE.test(t) &&
    retrieval.primaryScore < 5 &&
    (t.split(/\s+/).length <= 12 ||
      /\b(not (a |asking)|actually|ack?chually|what'?s your problem|why (won'?t|can'?t)|dumbo)\b/i.test(t))
  ) {
    return true;
  }

  return false;
}

// ─── Intent classification ─────────────────────────────────────────────────

export function classifyIntent(
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): ChatIntent {
  const t = message.trim();
  if (!t) return 'general';

  if (GREETING_RE.test(t)) return 'greeting';
  if (THANKS_RE.test(t)) return 'thanks';

  // Tone / correction before off-topic so pushback isn’t a domain lecture
  if (TONE_FEEDBACK_RE.test(t)) return 'tone_feedback';

  if (CHALLENGE_FIT_RE.test(t) && Array.isArray(history) && history.length >= 2) {
    return 'correction';
  }

  if (
    (CORRECTION_RE.test(t) || /^\?{1,5}$/.test(t)) &&
    Array.isArray(history) &&
    history.length >= 2
  ) {
    return 'correction';
  }

  if (isChitchatAsk(t)) return 'chitchat';

  if (isOffTopic(t, retrieval, history)) return 'off_topic';

  const rejected = rejectedServiceIds(t, history);
  if (rejected.length) {
    const pivot =
      /\b(but|instead|i (want|need)|sell|build|looking for)\b/i.test(t) &&
      !phraseIsNegated(t.toLowerCase(), 'sell') &&
      !phraseIsNegated(t.toLowerCase(), 'build') &&
      servicesMentionedInText(t).some((id) => !rejected.includes(id));
    if (!pivot) return 'reject_suggestion';
  }

  if (
    isSidewaysAsk(t) ||
    (historyLooksSideways(history) && SIDEWAYS_FOLLOWUP_RE.test(t))
  ) {
    return 'sideways';
  }

  if (
    isExploreAsk(t) ||
    NO_PRODUCT_RE.test(t) ||
    AFFIRM_ONLY_RE.test(t) ||
    isVagueHelp(t) ||
    LISTEN_FIRST_RE.test(t) ||
    JOB_PUSHBACK_RE.test(t) ||
    retrieval.catalogAsk
  ) {
    return 'browse_services';
  }

  if (shouldUseServiceRedirect(retrieval, t)) return 'project_need';

  return 'general';
}

// ─── Thin local replies (hard guarantees only) ─────────────────────────────

const GREETINGS = [
  'Hey — what are you trying to build today?',
  'Hi! Ask about our services, or tell me what you need help with.',
  'Hello! How can I help you with VAWCOM?',
] as const;

const THANKS_REPLIES = [
  'You’re welcome — anytime.',
  'Happy to help. Reach out if you need anything else.',
  'Of course. Glad I could help.',
] as const;

const CHITCHAT_REPLIES = [
  'Ha — fair. I’m here when you want to talk through a project, or you can peek at [services](/services).',
  'All good. If you’ve got something to build, I’m happy to help — or browse [services](/services).',
  'Nice chatting. What are you trying to launch, or shall I point you to [services](/services)?',
] as const;

const CORRECTION_REPLIES = [
  'Fair enough — let’s reset. What are you trying to build, or want [services](/services)?',
  'Got it. I’m here for VAWCOM projects — tell me the idea, or browse [services](/services).',
  'You’re right to call that out. How can I help with a site, app, or store?',
] as const;

const TONE_REPLIES = [
  'Got it — I’ll keep it more casual. What are you working on, or want [services](/services)?',
  'Fair. How can I help with your project?',
  'Understood. Tell me what you’re building, or browse [services](/services).',
] as const;

const BROWSE_REPLIES = [
  'Happy to help narrow it down. Browse [services](/services), or tell me the goal in one line.',
  'Start from [services](/services) — or describe what you want to launch, and I’ll point you.',
  'What’s the main goal — a site, an app, a store, or something else? You can also browse [services](/services).',
] as const;

const NO_PRODUCT_REPLIES = [
  'That’s fine — you don’t need something to sell first. Tell me what you’re trying to figure out, or browse [services](/services) to see what we build.',
  'No product yet is common. Are you exploring a site, an app, or something else? [Services](/services) has the full menu.',
  'Understood. Share the problem you’re trying to solve, or peek at [services](/services) and we can match from there.',
] as const;

const LISTEN_REPLIES = [
  'Of course — I’m listening. Go ahead and tell me what you have in mind.',
  'Absolutely. Share the idea whenever you’re ready.',
  'Happy to hear it. What’s the project?',
] as const;

const JOB_REPLIES = [
  'It is — once we know what you need. Tell me about the project, or browse [services](/services).',
  'Yes, building is what we do. Share a short description of what you want, and I’ll point you to the right place.',
  'That’s the goal. What are you trying to launch — a site, app, store, or something else?',
] as const;

const VAGUE_REPLIES = [
  'Of course. What are you trying to build?',
  'Sure — is it a site, an app, a store, or something else?',
  'Happy to help. Tell me the goal in one line, or browse [services](/services).',
] as const;

const SIDEWAYS_REPLIES = [
  'We can’t guarantee wealth or legal outcomes, but we can build a solid product. What should it do?',
  'We don’t promise riches — we ship real sites and apps. What are you trying to launch?',
  'Understood. Share what the product needs to do, or browse [services](/services), and I’ll point you from there.',
] as const;

const OFF_TOPIC_REPLIES = [
  'I’m here for VAWCOM work — sites, apps, stores, and the rest. Browse [services](/services), or tell me what you want to build.',
  'Outside my lane as the site desk. Happy to help with a product idea, or you can peek at [services](/services).',
  'I stay on VAWCOM projects. Share what you’re launching, or start from [services](/services).',
  'Fair — either way I’m set up for build work, not general Q&A. [Services](/services) or describe a project?',
] as const;

export function serviceRedirectReply(
  primary: Service,
  secondary: Service | null,
  message: string,
  history?: unknown
): string {
  const page = `[${primary.title}](/services/${primary.id})`;
  const contact = `[Contact](${contactHref(primary.title)})`;
  const prior = activePriorServiceIds(history, message);
  const last = lastAssistantText(history);
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|${primary.id}|${prior.join(',')}`;

  if (prior.includes(primary.id)) {
    const same = [
      `That’s still under ${page}. You can read the details there, or ${contact} if you want to talk through scope.`,
      `Yep, that fits ${page} as well. Happy to walk through it on ${contact} when you’re ready.`,
      `Same area as before — ${page}. ${contact} and we can cover the whole brief together.`,
    ] as const;
    return pickVariantAvoidingLast(same, seed, last);
  }

  if (prior.length > 0) {
    const also = [
      `We can help with that as well — see ${page}. ${contact} if you’d like to discuss.`,
      `That’s covered by ${page}. ${contact} whenever you’re ready to talk it through.`,
      `Also a fit for ${page}. Details are on that page, or ${contact} to get started.`,
    ] as const;
    let reply = pickVariantAvoidingLast(also, seed, last);
    if (secondary && secondary.id !== primary.id && !prior.includes(secondary.id)) {
      reply += ` [${secondary.title}](/services/${secondary.id}) might matter too.`;
    }
    return reply;
  }

  const first = [
    `We can help with that — take a look at ${page} for details, or ${contact} if you’d like to talk it through.`,
    `That sounds like a fit for ${page}. Read more there, or ${contact} whenever you’re ready to discuss.`,
    `Yes — VAWCOM can help. Here’s ${page}, and ${contact} if you want to get started.`,
    `Happy to help with that. Check out ${page}, or reach us via ${contact} to get the ball rolling.`,
  ] as const;

  let reply = pickVariantAvoidingLast(first, seed, last);
  if (secondary && secondary.id !== primary.id) {
    reply += ` [${secondary.title}](/services/${secondary.id}) might matter too.`;
  }
  return reply;
}

export function offTopicReply(message = '', history?: unknown): string {
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|off`;
  return pickVariant(OFF_TOPIC_REPLIES, seed);
}

function rejectReply(message: string, history?: unknown): string {
  const rejected = rejectedServiceIds(message, history);
  const labels = rejected
    .map((id) => SERVICES.find((s) => s.id === id)?.title)
    .filter(Boolean);
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|reject|${rejected.join(',')}`;
  const variants = [
    `Got it — not ${labels.join(' / ')}. You can browse the full menu on [services](/services), or tell me what you actually need in one line.`,
    `Understood — we’ll leave ${labels.join(' / ')} aside. Take a look at [services](/services), or describe the real problem.`,
    `Fair enough — skipping ${labels.join(' / ')}. What’s the actual need, or would you rather peek at [services](/services)?`,
  ] as const;
  return pickVariant(variants, seed);
}

function browseReply(message: string, history?: unknown): string {
  const t = message.trim();
  const seed = `${t.toLowerCase()}|${historyLen(history)}|browse`;
  if (CATALOG_ASK.test(t)) {
    return `Here’s what we offer:\n${catalogMenu()}\nWhich of these fits, or shall we talk on [Contact](/contact)?`;
  }
  if (LISTEN_FIRST_RE.test(t)) return pickVariant(LISTEN_REPLIES, `${seed}|listen`);
  if (JOB_PUSHBACK_RE.test(t)) return pickVariant(JOB_REPLIES, `${seed}|job`);
  if (NO_PRODUCT_RE.test(t)) return pickVariant(NO_PRODUCT_REPLIES, `${seed}|noproduct`);
  if (isVagueHelp(t)) return pickVariant(VAGUE_REPLIES, `${seed}|help`);
  return pickVariant(BROWSE_REPLIES, `${seed}|explore`);
}

/**
 * Local replies: greeting + browse/unsure (hard guarantee — no CoT leaks).
 * Everything else → LLM; templates also live in offlineFallbackForIntent / applySafetyNets.
 */
export function localReplyForIntent(
  intent: ChatIntent,
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): string | null {
  void retrieval;
  const t = message.trim();
  const seed = `${t.toLowerCase()}|${historyLen(history)}|${intent}`;
  if (intent === 'greeting') {
    return pickVariant(GREETINGS, `${seed}|greeting`);
  }
  // Unsure / “I don’t know” / catalog — keep local so models can’t leak reasoning
  if (intent === 'browse_services') {
    return browseReply(t, history);
  }
  return null;
}

export function offlineFallbackForIntent(
  intent: ChatIntent,
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): string {
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|offline|${intent}`;
  if (intent === 'greeting') {
    return pickVariant(GREETINGS, seed);
  }
  if (intent === 'thanks') return pickVariant(THANKS_REPLIES, seed);
  if (intent === 'off_topic') return offTopicReply(message, history);
  if (intent === 'chitchat') return pickVariant(CHITCHAT_REPLIES, seed);
  if (intent === 'correction') return pickVariant(CORRECTION_REPLIES, seed);
  if (intent === 'tone_feedback') return pickVariant(TONE_REPLIES, seed);
  if (intent === 'sideways') return pickVariant(SIDEWAYS_REPLIES, seed);
  if (intent === 'reject_suggestion') return rejectReply(message, history);
  if (intent === 'browse_services') return browseReply(message, history);
  if (intent === 'project_need' && retrieval.primaryService) {
    return serviceRedirectReply(
      retrieval.primaryService,
      retrieval.secondaryService,
      message,
      history
    );
  }
  if (retrieval.primaryService && shouldUseServiceRedirect(retrieval, message)) {
    return serviceRedirectReply(
      retrieval.primaryService,
      retrieval.secondaryService,
      message,
      history
    );
  }
  return browseReply(message, history);
}

/** Plan a turn: classify + optional local reply. Pure — no network. */
export function planChatTurn(message: string, history?: unknown) {
  const trimmed = message.trim();
  const retrieval = retrieveKnowledge(trimmed);
  const intent = classifyIntent(trimmed, retrieval, history);
  const localResponse = localReplyForIntent(intent, trimmed, retrieval, history);
  return { trimmed, retrieval, intent, localResponse };
}

// ─── Prompts ───────────────────────────────────────────────────────────────

function catalogMenu() {
  return SERVICES.map((s) => `- [${s.title}](/services/${s.id})`).join('\n');
}

const SHARED_TONE = `Tone: warm, casual, and clear — friendly, not stiff or overly formal.
Keep replies to one or two short sentences (list our services only when they ask what you offer).

Hard rules:
- Reply ONLY with the user-facing message. Never write chain-of-thought, analysis, or notes like “Okay, the user said…”, “They’re unsure…”, “Let me think…”.
- Never narrate the chat (“I see what’s going on”, “I see a pattern”).
- Never invent brainstorm lists. Never invent services. Never recommend Etsy/Shopify/Wix/etc.
- Negation matters: “I don’t have anything to sell” is NOT an e-commerce ask.
- No get-rich advice. No random service pitches.
- You are the VAWCOM site desk. Brief banter is fine; always steer back to what someone might build, or [services](/services).
- Do not answer general knowledge, homework, trivia, or school subjects of any kind. Do not name the subject (“I can’t do math/physics”) — just say you’re here for VAWCOM projects and redirect.
- When they have a clear build need, link the matching /services/{id} and [Contact](/contact).`;

function intentAddendum(intent: ChatIntent): string {
  switch (intent) {
    case 'off_topic':
      return `Not a VAWCOM project ask (could be anything). Do not answer it. Do not name the topic. One friendly line + redirect to [services](/services) or “what do you want to build?”. Never repeat the same sentence if they push back — vary the wording, still redirect.`;
    case 'chitchat':
      return `Casual small talk. One short warm reply, then ALWAYS steer: ask what they’re building or link [services](/services). Do not roleplay drinks/food for multiple turns. Do not stay in open-ended chat without a redirect.`;
    case 'browse_services':
      return `Unsure, no product yet, or wants the menu. List Menu links if they ask what you offer; otherwise [services](/services) or one clarifying question. No invented idea lists.`;
    case 'sideways':
      return `Wealth / legal bait. No get-rich advice, no random service. Ask what the product should do, or [services](/services).`;
    case 'correction':
      return `They pushed back. Acknowledge briefly, stay casual, steer to a project or [services](/services). Don’t lecture about topics.`;
    case 'tone_feedback':
      return `They want less formal / better tone. One casual acknowledgment + offer project help or [services](/services).`;
    case 'reject_suggestion':
      return `They rejected a service. Acknowledge, send [services](/services), don’t re-pitch it.`;
    case 'project_need':
      return `Clear project ask. Affirm, link /services/{id}, offer [Contact](/contact).`;
    case 'thanks':
      return `Short thanks.`;
    default:
      return `Build need → service + Contact. Vague → [services](/services). Off-lane Q&A → don’t answer; redirect without naming the subject.`;
  }
}

export function buildRagSystemPrompt(
  retrieval: RetrievalResult,
  opts?: { intent?: ChatIntent }
) {
  const intent = opts?.intent ?? 'general';
  const context = retrieval.chunks.map((c, i) => `[${i + 1}] (${c.id})\n${c.text}`).join('\n\n');
  const allowed = [
    ...CHAT_SITE_LINKS.map((l) => l.href),
    ...SERVICES.map((s) => `/services/${s.id}`),
    '/contact',
  ].join(', ');

  return `You are VAWCOM’s website chat desk.

${SHARED_TONE}

Intent for this turn: ${intent}
${intentAddendum(intent)}

Allowed hrefs only: ${allowed}
Never prefix with Assistant: or VAWCOM:.

Menu:
${catalogMenu()}

${
  intent === 'off_topic' || intent === 'sideways'
    ? 'Do not force a specific service page. Do redirect to [services](/services) or ask what they want to build.'
    : intent === 'chitchat'
      ? 'Stay warm, then include [services](/services) or ask what they want to build.'
      : retrieval.primaryService && retrieval.primaryScore >= 5
        ? `Possible fit: [${retrieval.primaryService.title}](/services/${retrieval.primaryService.id}). Use only for a real project ask.`
        : retrieval.catalogAsk
          ? 'List our services with links only, or send [/services](/services).'
          : 'Ask what they need, or link [/services](/services).'
}

Context:
${context}`;
}

export function buildOllamaMessages(
  system: string,
  message: string,
  history: unknown
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const msgs: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: system },
  ];

  if (Array.isArray(history)) {
    for (const m of history.slice(-8)) {
      const text =
        typeof m?.text === 'string'
          ? m.text.replace(/^(?:(?:VAWCOM|Assistant|Visitor|User):\s*)+/i, '').trim()
          : '';
      if (!text) continue;
      if (
        (m?.role === 'assistant' || m?.role === 'ai') &&
        /ask what we do, or describe an idea/i.test(text)
      ) {
        continue;
      }
      const role = m?.role === 'assistant' || m?.role === 'ai' ? 'assistant' : 'user';
      msgs.push({ role, content: text });
    }
  }

  msgs.push({ role: 'user', content: message });
  return msgs;
}

// ─── Sanitize / safety nets ────────────────────────────────────────────────

export function looksLikeOffTopicAnswer(text: string): boolean {
  return (
    /\b(the answer is|equals?|solve(?:d)?|step\s*1|here'?s how to solve|x\s*=\s*\d|capital of|recipe|ingredients|force equals|f\s*=\s*ma|newton'?s)\b/i.test(
      text
    ) || /\d+\s*[\+\-\*\/×÷=]\s*\d+/.test(text)
  );
}

export function looksLikeInventedBrainstorm(text: string): boolean {
  // Real service menu uses /services/ links — not an invented brainstorm
  if (/\/services\//i.test(text) && !/\b(blog to share|community forum|resource page|showcase your personality)\b/i.test(text)) {
    return false;
  }
  const bullets = (text.match(/(?:^|\n)\s*[-*•]|\*\s+/g) || []).length;
  return (
    bullets >= 3 ||
    /\b(here are some ideas|ideas for your (web)?site|a blog to share|community forum|resource page|showcase your personality)\b/i.test(
      text
    )
  );
}

export function looksLikeMetaNarration(text: string): boolean {
  return (
    /\b(i (think i )?see what'?s going on|you'?re having a bit of fun|keeping me on my toes|i see a pattern|you'?re not laughing|usual ["'].*["'] conversation)\b/i.test(
      text
    ) ||
    /\b(okay,? the user|the user (just )?said|they('re| are) (unsure|exploring)|common for people|let me (think|analyze|reason)|as an ai|my (internal )?reasoning|chain[- ]of[- ]thought)\b/i.test(
      text
    ) ||
    /<think>[\s\S]*?<\/think>/i.test(text) ||
    /^thinking:/i.test(text.trim())
  );
}

/** Strip leaked model reasoning; keep only the user-facing answer when possible. */
export function stripChainOfThought(text: string): string {
  let out = text
    .replace(/<think>[\s\S]*?<\/think>/gi, ' ')
    .replace(/^(?:okay[,.]?\s*)?the user[\s\S]*?(?=\n\n|[A-Z][a-z]|$)/i, ' ')
    .replace(/\b(they('re| are) unsure[^.]*\.)\s*/gi, ' ')
    .replace(/\b(common for people[^.]*\.)\s*/gi, ' ')
    .replace(/^thinking:\s*/i, '')
    .trim();
  return out;
}

export function clampReply(text: string, maxSentences = 2): string {
  const parts = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= maxSentences) return parts.join(' ');
  return parts.slice(0, maxSentences).join(' ');
}

export function sanitizeAssistantReply(
  text: string,
  primary: Service | null,
  catalogAsk = false
): string {
  let out = text
    .replace(/^(?:(?:VAWCOM|Assistant|Visitor|User):\s*)+/gim, '')
    .replace(/\b(?:VAWCOM|Assistant|Visitor|User):\s*/g, '')
    .replace(/Recent chat:[\s\S]*?(?=\n\n|$)/i, '')
    .trim();

  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, (full, label, href: string) => {
    try {
      const u = new URL(href);
      if (u.hostname.endsWith('vawcom.com') || u.hostname === 'localhost') return full;
    } catch {
      /* ignore */
    }
    return String(label);
  });

  out = out
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !VENDOR_RE.test(s) || /\/services\/|vawcom|\[contact\]/i.test(s))
    .join(' ')
    .trim();

  if (VENDOR_RE.test(out)) {
    out = out.replace(VENDOR_RE, '').replace(/\s{2,}/g, ' ').trim();
  }

  out = out
    .replace(
      /^(?:sounds like (?:a |an )?(?:frustrating|tough|great|big) (?:issue|problem|opportunity)[.!]?\s*)+/i,
      ''
    )
    .replace(/^(?:i (?:can )?see (?:that )?[^.!?]*[.!?]\s*)+/i, '')
    .replace(/^(?:that'?s a great opportunity[^.!?]*[.!?]\s*)+/i, '')
    .trim();

  out = clampReply(out, catalogAsk ? 8 : 2);

  if (primary && out && catalogAsk === false) {
    const hasPage = out.includes(`/services/${primary.id}`);
    const hasContact = /\]\(\/contact/i.test(out);
    const looksLikeProjectAnswer =
      /\b(help with that|great fit|can help|got you covered|check out|take a look|read more)\b/i.test(
        out
      );
    if (looksLikeProjectAnswer && (!hasPage || !hasContact)) {
      return serviceRedirectReply(primary, null, out);
    }
  }

  if (!out) {
    return 'Happy to help — ask what we do, or describe an idea.';
  }

  return out;
}

/** Post-Ollama safety: replace bad model output with local guarantees. */
export function applySafetyNets(
  text: string,
  intent: ChatIntent,
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): string {
  let out = text;

  out = stripChainOfThought(out);

  if (intent === 'off_topic' && looksLikeOffTopicAnswer(out)) {
    out = offTopicReply(message, history);
  }

  // Chitchat that never steered back to VAWCOM
  if (
    intent === 'chitchat' &&
    !/\/services|build|project|launch|VAWCOM|site|app|store/i.test(out)
  ) {
    out = pickVariant(CHITCHAT_REPLIES, `${message}|chat-steer`);
  }

  // Model named a subject refuse (“I can’t help with math/physics”) — replace with generic
  if (
    intent === 'off_topic' &&
    /\b(can'?t|cannot|not (able|set up)|don'?t) (help with|cover|do|answer).{0,40}\b(math|physics|homework|chemistry|biology|history)\b/i.test(
      out
    )
  ) {
    out = offTopicReply(message, history);
  }

  if (intent === 'sideways' && /\b(become a millionaire|get rich|path to wealth|make you (a )?million)\b/i.test(out)) {
    out = pickVariant(SIDEWAYS_REPLIES, `${message}|side-safe`);
  }

  if (looksLikeInventedBrainstorm(out)) {
    out = browseReply(message, history);
  }

  if (looksLikeMetaNarration(out) || !out.trim()) {
    out =
      intent === 'browse_services' || intent === 'general' || isExploreAsk(message) || JOB_PUSHBACK_RE.test(message)
        ? browseReply(message, history)
        : intent === 'off_topic'
          ? offTopicReply(message, history)
          : 'Happy to help. Tell me what you’re trying to build, or browse [services](/services).';
  }

  // Confident project ask but model forgot the service link → local redirect
  if (
    intent === 'project_need' &&
    retrieval.primaryService &&
    !out.includes(`/services/${retrieval.primaryService.id}`)
  ) {
    out = serviceRedirectReply(
      retrieval.primaryService,
      retrieval.secondaryService,
      message,
      history
    );
  }

  if (
    intent === 'browse_services' &&
    NO_PRODUCT_RE.test(message) &&
    /\/services\/(commerce|ai)\b/i.test(out)
  ) {
    out = browseReply(message, history);
  }

  return sanitizeAssistantReply(
    out,
    intent === 'project_need' ? retrieval.primaryService : null,
    retrieval.catalogAsk || CATALOG_ASK.test(message)
  );
}
