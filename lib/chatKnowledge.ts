import { FOUNDERS } from '@/components/home/data';
import { SERVICES, SERVICE_FAQS, getService, type Service } from '@/lib/services';
import { CHAT_SITE_LINKS, CONTACT_EMAIL } from '@/lib/site';
import { PROJECTS } from '@/lib/work';
import { PROCESS_STEPS } from '@/lib/process';

export type KnowledgeChunk = {
  id: string;
  text: string;
  terms?: string[];
};

/**
 * Intent labels for routing. Live classification is LLM (meaning);
 * classifyIntent() is the offline / CI fallback only.
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

export const CHAT_INTENTS: readonly ChatIntent[] = [
  'greeting',
  'chitchat',
  'thanks',
  'correction',
  'tone_feedback',
  'reject_suggestion',
  'off_topic',
  'browse_services',
  'project_need',
  'sideways',
  'general',
] as const;

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

/** Legacy keyword list , prefer looksLikeKnowledgeAsk; keep for weak signal only. */
const OFF_TOPIC_RE =
  /\b(homework|essay|poem|recipe|weather|riddle|translate|tutoring|who (?:won|is the president)|capital of|movie|netflix|spotify|dating|horoscope|cooking)\b/i;

const MATH_EXPR_RE = /\d\s*[\+\-\*\/×÷^=]\s*\d/;

/** “Who should build this / best company / right place to hire” , buying intent, not trivia. */
const VENDOR_CHOICE_RE =
  /\b((best|right|good|top|decent|legit|recommend(ed)?)\s+(place|company|agency|studio|team|shop|partner|freelancer|developer|dev(s)?)|(best|right)\s+software\s+(company|agency|studio|team)|who (should|can|do) i (hire|use|go (with|to)|call|work with)|where (should|can|do) i (get|go|hire|find)|looking for (a |an )?(software |dev |web |app )?(company|agency|studio|team|developer|freelancer|partner)|are you (guys |people )?(a )?good (fit|choice|company|team)|why (choose |pick |hire )?(you|vawcom)|should i (hire|use|work with) (you|vawcom)|am i in the right place)\b/i;

function isVendorChoiceAsk(message: string): boolean {
  return VENDOR_CHOICE_RE.test(message.trim());
}

/**
 * General-knowledge / homework-style asks , any subject.
 * Not a domain blocklist: “what is X / explain Y / 1+1” when not about VAWCOM.
 */
function looksLikeKnowledgeAsk(message: string): boolean {
  const t = message.trim();
  if (!t || SITE_RELEVANT_RE.test(t) || isVendorChoiceAsk(t)) return false;
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

const CHITCHAT_RE =
  /\b((just )?wanna chat|want to chat|down to chat|how are you doing|how're you doing|how you doing|how('?s| is) it going)\b/i;

const WELLBEING_RE =
  /^(hey[,!]?\s+)?((are you|are u|r u|you)\s+(ok|okay|alright|good|fine)|(how are you|how r you|how're you|how are you doing|how's it going|hows it going|how r u|hru|hbu|sup|wassup|wazzup|wyd))[\s?!.]*$/i;

const CORRECTION_RE =
  /\b(wdym|what do you mean|what are you (even )?saying|what pattern|you (just )?said|i didn'?t (apologi[sz]e|say that|ask)|why (did you|say)|that('?s| was) (weird|odd|wrong)|come again|huh+|that wasn'?t|i am not asking|i'?m not asking|not a .+ question|when did i (say|ask|mention)|i (never|didn'?t) (say|ask|mention)|who said i|narrow what|i'?m not (trying|looking) to (build|launch))\b/i;

const SILLY_RE =
  /^(hey[,!]?\s+)?(i'?m\s+)?(hungry|starving|bored|sleepy|tired|horny|lonely|drunk|high|broke|sad|mad|angry|dead|dying)[\s!.?]*$/i;

const SILLY_ALSO_RE =
  /\b(feed me|order (me )?food|what'?s for (lunch|dinner)|make me (a )?sandwich|kill me|end me)\b/i;

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
  /\b(vawcom|service|services|website|web\s*app|landing|mobile\s*app|ios|android|ecommerce|e-commerce|store|shop|inventory|checkout|voice\s*agent|phone\s*call|chatbot|automat|n8n|maintenance|rescue|bug|project|build|hire|quote|pricing|price|cost|contact|about|gallery|portfolio|founders?|karachi|client|startup|saas|cms|seo|how (do|long|much)|where are you|take over|existing code|help|idea|agency|studio|software company|developer|freelancer|outsource|partner)\b/i;

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

function recentAssistantTexts(history: unknown, n = 4): string[] {
  if (!Array.isArray(history)) return [];
  const out: string[] = [];
  for (let i = history.length - 1; i >= 0 && out.length < n; i--) {
    const m = history[i] as { role?: string; text?: string };
    if ((m?.role === 'assistant' || m?.role === 'ai') && typeof m.text === 'string' && m.text.trim()) {
      out.push(m.text);
    }
  }
  return out;
}

/** Compare replies ignoring markdown links and punctuation. */
function normalizeReplyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function replyIsRepeat(candidate: string, prior: string): boolean {
  if (!prior) return false;
  const a = normalizeReplyKey(candidate);
  const b = normalizeReplyKey(prior);
  if (!a || !b) return false;
  if (a === b) return true;
  // Same opening stretch = same canned line
  if (a.length >= 24 && b.length >= 24 && a.slice(0, 36) === b.slice(0, 36)) return true;
  return false;
}

function pickVariantAvoidingLast<T extends string>(
  variants: readonly T[],
  seed: string,
  history?: unknown
): T {
  const first = pickVariant(variants, seed);
  if (variants.length < 2) return first;
  const priors = recentAssistantTexts(history, 4);
  if (!priors.length) return first;

  let pick = first;
  for (let step = 0; step < variants.length; step++) {
    if (!priors.some((p) => replyIsRepeat(pick, p))) return pick;
    const idx = variants.indexOf(pick);
    pick = variants[(idx + 1) % variants.length]!;
  }
  return pick;
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

/** Project language that isn’t under negation , “don’t sell” is not a commerce ask. */
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

/** User has no product yet , clarify, don’t pitch e-commerce. */
const NO_PRODUCT_RE =
  /\b((don'?t|dont|do not) have .{0,48}(to sell|to automate)|nothing to (sell|automate)|no (product|business|idea) (yet|to sell))\b/i;

function historyLooksSideways(history: unknown): boolean {
  return historyTexts(history).some(
    (t) => SIDEWAYS_RE.test(t) || /\b(millionaire|get rich|riches|wealth|no millionaire guarantee)\b/i.test(t)
  );
}

const SIDEWAYS_FOLLOWUP_RE =
  /^(hey[,!]?\s+)?(tell me how|how(\s+do\s+i)?|and how|ok how|then how)[\s?!.]*$/i;

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
  page: PageContext;
};

export type PageContext = {
  path: string;
  title: string;
  /** Short facts for the model about what this page is. */
  blurb: string;
  /** One-line visitor-facing summary. No em dashes. */
  summary: string;
  serviceId?: string;
  chunkIds: string[];
};

/** Map the browser path to page-specific chat context. */
export function resolvePageContext(pathname?: string | null): PageContext {
  const raw = (pathname || '/').trim() || '/';
  const path = raw.split(/[?#]/)[0] || '/';

  if (path === '/' || path === '/splash') {
    return {
      path: '/',
      title: 'Home',
      summary: 'This is the VAWCOM home page: what we build and how to start.',
      blurb:
        'Home introduces VAWCOM, the hero chat, services overview, tech stack, and why-us. Visitors often ask what we build or how to start.',
      chunkIds: ['company', 'site-links'],
    };
  }

  if (path === '/services') {
    return {
      path,
      title: 'Services',
      summary: 'This is the services hub: Web, Apps, Voice, AI, Commerce, and Care.',
      blurb:
        'Services hub listing Web, Apps, Voice, AI, Commerce, and Care. Use this page to pick a lane or send them to a detail page.',
      chunkIds: SERVICES.map((s) => `service-${s.id}`),
    };
  }

  const serviceMatch = path.match(/^\/services\/([^/]+)\/?$/);
  if (serviceMatch) {
    const service = getService(serviceMatch[1]!);
    if (service) {
      return {
        path: `/services/${service.id}`,
        title: service.title,
        serviceId: service.id,
        summary: `${service.title}: ${service.lede}`,
        blurb: [
          `They are on the ${service.title} service page.`,
          service.lede,
          service.promise,
          `Who it’s for: ${service.for}`,
          `Includes: ${service.outcomes.map((o) => o.title).join('; ')}.`,
          `Stack often used: ${service.stack.join(', ')}.`,
          `First delivery: ${service.first}`,
          `Typical span: ${service.span}`,
        ].join(' '),
        chunkIds: [`service-${service.id}`],
      };
    }
  }

  if (path === '/about') {
    return {
      path,
      title: 'About',
      summary: 'This About page covers VAWCOM’s story, founders, and how we work.',
      blurb: [
        'About covers the studio story, founders, and how we work.',
        `Founders: ${FOUNDERS.map((f) => `${f.name} (${f.role})`).join('; ')}.`,
        `Process: ${PROCESS_STEPS.map((s) => s.title).join(' → ')}.`,
        'Karachi base with US/UK/EU overlap. Founder-led; design and build stay together.',
      ].join(' '),
      chunkIds: ['company', 'founders', 'process'],
    };
  }

  if (path === '/gallery') {
    return {
      path,
      title: 'Gallery',
      summary: 'This is the gallery of public VAWCOM work samples.',
      blurb: [
        'Gallery shows public work samples.',
        ...PROJECTS.map((p) => `${p.title} (${p.service}): ${p.summary}`),
      ].join(' '),
      chunkIds: ['work'],
    };
  }

  if (path === '/contact') {
    return {
      path,
      title: 'Contact',
      summary: 'This is the contact page, with a form to start a project.',
      blurb: `Contact page with a project form. Email ${CONTACT_EMAIL}. Prefer linking [Contact](/contact) or that email when they want to talk.`,
      chunkIds: ['company', 'site-links'],
    };
  }

  return {
    path,
    title: path,
    summary: 'You are on vawcom.com.',
    blurb: 'They are elsewhere on vawcom.com. Stay on VAWCOM topics and link relevant pages.',
    chunkIds: ['site-links', 'company'],
  };
}

function serviceChunk(s: Service): KnowledgeChunk {
  return {
    id: `service-${s.id}`,
    terms: SERVICE_TERMS[s.id] ?? [],
    text: [
      `${s.title}: [${s.title}](/services/${s.id})`,
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
    terms: [
      'vawcom', 'company', 'studio', 'agency', 'who are you', 'based', 'karachi', 'about',
      'software company', 'best place', 'hire', 'partner', 'team', 'right place',
    ],
    text: [
      'VAWCOM is a founder-led studio that builds web, apps, voice, AI, e-commerce, and maintenance.',
      'Karachi base with US/UK/EU overlap. Design and build stay with the same team.',
      'If someone asks who to hire, the best place/company/agency to get work built, or whether they are in the right place: they already are. Say so, invite [Contact](/contact), and link matching services.',
      '[/about](/about) · [/gallery](/gallery) · [Contact](/contact) · [services](/services).',
    ].join(' '),
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

export function retrieveKnowledge(query: string, pathname?: string | null): RetrievalResult {
  const page = resolvePageContext(pathname);
  const chunks = buildKnowledgeChunks();
  const queryLower = query.toLowerCase();
  const tokens = tokenize(query);
  const catalogAsk = CATALOG_ASK.test(query);

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(tokens, queryLower, chunk) }))
    .sort((a, b) => b.score - a.score);

  const serviceRanked = ranked.filter((r) => r.chunk.id.startsWith('service-') && r.score > 0);
  let primaryScore = serviceRanked[0]?.score ?? 0;
  let primaryId = serviceRanked[0]?.chunk.id.replace(/^service-/, '') ?? null;
  let secondaryId =
    serviceRanked[1] && serviceRanked[1].score >= primaryScore * 0.7 && serviceRanked[1].score >= 3
      ? serviceRanked[1].chunk.id.replace(/^service-/, '')
      : null;

  // On a service detail page, prefer that service unless the message clearly points elsewhere.
  if (page.serviceId) {
    const pageHit = serviceRanked.find((r) => r.chunk.id === `service-${page.serviceId}`);
    const elsewhereStrong =
      primaryId &&
      primaryId !== page.serviceId &&
      primaryScore >= 8 &&
      hasPositiveProjectSignal(query);
    if (!elsewhereStrong) {
      primaryId = page.serviceId;
      primaryScore = Math.max(primaryScore, pageHit?.score ?? 6, 6);
      secondaryId =
        serviceRanked.find((r) => r.chunk.id !== `service-${page.serviceId}` && r.score >= 3)?.chunk.id.replace(
          /^service-/,
          '',
        ) ?? null;
    }
  }

  const primaryService = primaryId ? SERVICES.find((s) => s.id === primaryId) ?? null : null;
  const secondaryService = secondaryId
    ? SERVICES.find((s) => s.id === secondaryId) ?? null
    : null;

  const picked: KnowledgeChunk[] = [];
  const add = (id: string) => {
    const c = chunks.find((x) => x.id === id);
    if (c && !picked.some((p) => p.id === id)) picked.push(c);
  };

  // Always pin the page the visitor is looking at.
  for (const id of page.chunkIds) add(id);

  if (catalogAsk || page.path === '/services') {
    for (const s of SERVICES) add(`service-${s.id}`);
  } else if (primaryService) {
    add(`service-${primaryService.id}`);
    if (secondaryService) add(`service-${secondaryService.id}`);
  } else {
    for (const s of SERVICES) add(`service-${s.id}`);
  }

  for (const r of ranked) {
    if (!r.chunk.id.startsWith('service-') && r.score > 0 && picked.length < 7) {
      add(r.chunk.id);
    }
  }
  if (isVendorChoiceAsk(query)) add('company');
  add('site-links');

  // Synthetic page chunk so the model always sees where they are.
  picked.unshift({
    id: 'current-page',
    text: `Current page: ${page.title} (${page.path})\n${page.blurb}`,
  });

  return { chunks: picked, primaryService, secondaryService, primaryScore, catalogAsk, page };
}

/** Use redirect template when retrieval is confident , guarantees page + Contact links. */
export function shouldUseServiceRedirect(retrieval: RetrievalResult, message: string): boolean {
  if (isSidewaysAsk(message)) return false;
  if (isVendorChoiceAsk(message)) return false;
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

  // Buying / vendor selection: promote VAWCOM via LLM + promote fallback, not off-topic deflect
  if (isVendorChoiceAsk(t)) return 'general';

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
  'Hey. What are you trying to build today?',
  'Hi! Ask about our services, or tell me what you need help with.',
  'Hello! How can I help you with VAWCOM?',
] as const;

const THANKS_REPLIES = [
  'You’re welcome. Anytime.',
  'Happy to help. Reach out if you need anything else.',
  'Of course. Glad I could help.',
] as const;

const CHITCHAT_REPLIES = [
  'Ha, fair. I’m here when you want to talk through a project, or you can peek at [services](/services).',
  'All good. If you’ve got something to build, I’m happy to help, or browse [services](/services).',
  'Nice chatting. What are you trying to launch, or shall I point you to [services](/services)?',
] as const;

const CORRECTION_REPLIES = [
  'Fair enough. Let’s reset. What are you trying to build, or want [services](/services)?',
  'Got it. I’m here for VAWCOM projects. Tell me the idea, or browse [services](/services).',
  'You’re right to call that out. How can I help with a site, app, or store?',
] as const;

const TONE_REPLIES = [
  'Got it. I’ll keep it more casual. What are you working on, or want [services](/services)?',
  'Fair. How can I help with your project?',
  'Understood. Tell me what you’re building, or browse [services](/services).',
] as const;

const BROWSE_REPLIES = [
  'Happy to help narrow it down. Browse [services](/services), or tell me the goal in one line.',
  'Start from [services](/services), or describe what you want to launch, and I’ll point you.',
  'What’s the main goal: a site, an app, a store, or something else? You can also browse [services](/services).',
] as const;

const NO_PRODUCT_REPLIES = [
  'That’s fine. You don’t need something to sell first. Tell me what you’re trying to figure out, or browse [services](/services) to see what we build.',
  'No product yet is common. Are you exploring a site, an app, or something else? [Services](/services) has the full menu.',
  'Understood. Share the problem you’re trying to solve, or peek at [services](/services) and we can match from there.',
] as const;

const LISTEN_REPLIES = [
  'Of course. I’m listening. Go ahead and tell me what you have in mind.',
  'Absolutely. Share the idea whenever you’re ready.',
  'Happy to hear it. What’s the project?',
] as const;

const JOB_REPLIES = [
  'It is, once we know what you need. Tell me about the project, or browse [services](/services).',
  'Yes, building is what we do. Share a short description of what you want, and I’ll point you to the right place.',
  'That’s the goal. What are you trying to launch: a site, app, store, or something else?',
] as const;

const VAGUE_REPLIES = [
  'Of course. What are you trying to build?',
  'Sure. Is it a site, an app, a store, or something else?',
  'Happy to help. Tell me the goal in one line, or browse [services](/services).',
] as const;

const SIDEWAYS_REPLIES = [
  'We can’t guarantee wealth or legal outcomes, but we can build a solid product. What should it do?',
  'We don’t promise riches. We ship real sites and apps. What are you trying to launch?',
  'Understood. Share what the product needs to do, or browse [services](/services), and I’ll point you from there.',
] as const;

const OFF_TOPIC_REPLIES = [
  'I’m here for VAWCOM work: sites, apps, stores, and the rest. Browse [services](/services), or tell me what you want to build.',
  'Outside my lane as the site desk. Happy to help with a product idea, or you can peek at [services](/services).',
  'I stay on VAWCOM projects. Share what you’re launching, or start from [services](/services).',
  'Fair. Either way I’m set up for build work, not general Q&A. [Services](/services) or describe a project?',
] as const;

/** Soft promote when someone is picking a vendor / asking if they’re in the right place. */
function promoteStudioReply(
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): string {
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|promote`;
  const contact = '[Contact](/contact)';
  const services = '[services](/services)';
  const primary = retrieval.primaryService;
  const secondary = retrieval.secondaryService;

  if (primary && secondary && primary.id !== secondary.id && retrieval.primaryScore >= 5) {
    const a = `[${primary.title}](/services/${primary.id})`;
    const b = `[${secondary.title}](/services/${secondary.id})`;
    const multi = [
      `You’re in the right place. VAWCOM builds that. Start with ${a} and ${b}, or ${contact} and we’ll scope both.`,
      `That’s us. We cover ${a} and ${b}. Peek at those pages, or ${contact} when you want to talk it through.`,
      `You’re already talking to the team. ${a} and ${b} are the lanes; ${contact} if you want a single brief for both.`,
    ] as const;
    return pickVariantAvoidingLast(multi, seed, history);
  }

  if (primary && retrieval.primaryScore >= 5) {
    const page = `[${primary.title}](/services/${primary.id})`;
    const one = [
      `You’re in the right place. We handle that under ${page}, or ${contact} if you’d rather talk first.`,
      `That’s VAWCOM’s lane. See ${page}, or reach us on ${contact}.`,
      `You’re already here. ${page} has the details, and ${contact} is open when you’re ready.`,
    ] as const;
    return pickVariantAvoidingLast(one, seed, history);
  }

  const general = [
    `You’re in the right place. VAWCOM builds sites, apps, and more. Browse ${services}, or ${contact} and we’ll match the work.`,
    `That’s what this studio is for. Peek at ${services}, or ${contact} when you want to start a brief.`,
    `You’re already talking to VAWCOM. See ${services} for the menu, or ${contact} to talk through what you need.`,
  ] as const;
  return pickVariantAvoidingLast(general, seed, history);
}

export function serviceRedirectReply(
  primary: Service,
  secondary: Service | null,
  message: string,
  history?: unknown
): string {
  const page = `[${primary.title}](/services/${primary.id})`;
  const contact = `[Contact](${contactHref(primary.title)})`;
  const prior = activePriorServiceIds(history, message);
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|${primary.id}|${prior.join(',')}`;

  if (prior.includes(primary.id)) {
    const same = [
      `That’s still under ${page}. You can read the details there, or ${contact} if you want to talk through scope.`,
      `Yep, that fits ${page} as well. Happy to walk through it on ${contact} when you’re ready.`,
      `Same area as before: ${page}. ${contact} and we can cover the whole brief together.`,
    ] as const;
    return pickVariantAvoidingLast(same, seed, history);
  }

  if (prior.length > 0) {
    const also = [
      `We can help with that as well. See ${page}. ${contact} if you’d like to discuss.`,
      `That’s covered by ${page}. ${contact} whenever you’re ready to talk it through.`,
      `Also a fit for ${page}. Details are on that page, or ${contact} to get started.`,
    ] as const;
    let reply = pickVariantAvoidingLast(also, seed, history);
    if (secondary && secondary.id !== primary.id && !prior.includes(secondary.id)) {
      reply += ` [${secondary.title}](/services/${secondary.id}) might matter too.`;
    }
    return reply;
  }

  const first = [
    `We can help with that. Take a look at ${page} for details, or ${contact} if you’d like to talk it through.`,
    `That sounds like a fit for ${page}. Read more there, or ${contact} whenever you’re ready to discuss.`,
    `Yes. VAWCOM can help. Here’s ${page}, and ${contact} if you want to get started.`,
    `Happy to help with that. Check out ${page}, or reach us via ${contact} to get the ball rolling.`,
  ] as const;

  if (secondary && secondary.id !== primary.id) {
    const other = `[${secondary.title}](/services/${secondary.id})`;
    const multi = [
      `We can help with both. See ${page} and ${other}, or ${contact} to scope them together.`,
      `That covers ${page} and ${other}. Read those pages, or ${contact} whenever you’re ready.`,
      `Yes. VAWCOM can help with both. Start at ${page} and ${other}, or ${contact} to talk through one brief.`,
    ] as const;
    return pickVariantAvoidingLast(multi, seed, history);
  }

  return pickVariantAvoidingLast(first, seed, history);
}

export function offTopicReply(message = '', history?: unknown): string {
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|off`;
  return pickVariantAvoidingLast(OFF_TOPIC_REPLIES, seed, history);
}

function rejectReply(message: string, history?: unknown): string {
  const rejected = rejectedServiceIds(message, history);
  const labels = rejected
    .map((id) => SERVICES.find((s) => s.id === id)?.title)
    .filter(Boolean);
  const seed = `${message.trim().toLowerCase()}|${historyLen(history)}|reject|${rejected.join(',')}`;
  const variants = [
    `Got it. Not ${labels.join(' / ')}. You can browse the full menu on [services](/services), or tell me what you actually need in one line.`,
    `Understood. We’ll leave ${labels.join(' / ')} aside. Take a look at [services](/services), or describe the real problem.`,
    `Fair enough. Skipping ${labels.join(' / ')}. What’s the actual need, or would you rather peek at [services](/services)?`,
  ] as const;
  return pickVariantAvoidingLast(variants, seed, history);
}

function browseReply(message: string, history?: unknown): string {
  const t = message.trim();
  const seed = `${t.toLowerCase()}|${historyLen(history)}|browse`;
  if (CATALOG_ASK.test(t)) {
    return `Here’s what we offer:\n${catalogMenu()}\nWhich of these fits, or shall we talk on [Contact](/contact)?`;
  }
  if (LISTEN_FIRST_RE.test(t)) return pickVariantAvoidingLast(LISTEN_REPLIES, `${seed}|listen`, history);
  if (JOB_PUSHBACK_RE.test(t)) return pickVariantAvoidingLast(JOB_REPLIES, `${seed}|job`, history);
  if (NO_PRODUCT_RE.test(t)) return pickVariantAvoidingLast(NO_PRODUCT_REPLIES, `${seed}|noproduct`, history);
  if (isVagueHelp(t)) return pickVariantAvoidingLast(VAGUE_REPLIES, `${seed}|help`, history);
  return pickVariantAvoidingLast(BROWSE_REPLIES, `${seed}|explore`, history);
}

/**
 * Local replies: greeting + browse/unsure (hard guarantee. No CoT leaks).
 * Everything else → LLM; templates also live in offlineFallbackForIntent / applySafetyNets.
 */
export function localReplyForIntent(
  intent: ChatIntent,
  message: string,
  retrieval: RetrievalResult,
  history?: unknown
): string | null {
  const t = message.trim();
  // Deterministic page answers: keep them short and exact.
  if (/\b(what page (am i|are we) on|where am i|which page|what page is this)\b/i.test(t)) {
    return `You’re on the ${retrieval.page.title} page.`;
  }
  if (
    /\b((what|whats|what'?s) (is |does )?(this|the) (page )?about|summar[iy]se (this|the) page|what('?s| is) on this page|tell me about this page)\b/i.test(
      t,
    )
  ) {
    return retrieval.page.summary;
  }
  const seed = `${t.toLowerCase()}|${historyLen(history)}|${intent}`;
  if (intent === 'greeting') {
    return pickVariantAvoidingLast(GREETINGS, `${seed}|greeting`, history);
  }
  // Unsure / “I don’t know” / catalog. Keep local so models can’t leak reasoning
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
    return pickVariantAvoidingLast(GREETINGS, seed, history);
  }
  if (intent === 'thanks') return pickVariantAvoidingLast(THANKS_REPLIES, seed, history);
  if (intent === 'off_topic') return offTopicReply(message, history);
  if (intent === 'chitchat') return pickVariantAvoidingLast(CHITCHAT_REPLIES, seed, history);
  if (intent === 'correction') return pickVariantAvoidingLast(CORRECTION_REPLIES, seed, history);
  if (intent === 'tone_feedback') return pickVariantAvoidingLast(TONE_REPLIES, seed, history);
  if (intent === 'sideways') return pickVariantAvoidingLast(SIDEWAYS_REPLIES, seed, history);
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
  if (isVendorChoiceAsk(message)) {
    return promoteStudioReply(message, retrieval, history);
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

/** Plan a turn with the heuristic classifier only (eval / offline). */
export function planChatTurn(message: string, history?: unknown, pathname?: string | null) {
  const trimmed = message.trim();
  const retrieval = retrieveKnowledge(trimmed, pathname);
  const intent = classifyIntent(trimmed, retrieval, history);
  const localResponse = localReplyForIntent(intent, trimmed, retrieval, history);
  return { trimmed, retrieval, intent, localResponse };
}

/** Parse a model classify reply into a known label, or null. */
export function parseIntentLabel(raw: string): ChatIntent | null {
  const line = raw
    .trim()
    .split(/\n/)[0]
    ?.toLowerCase()
    .replace(/['"`]/g, '')
    .trim();
  if (!line) return null;
  const token = line.replace(/[^a-z_]/g, '');
  if ((CHAT_INTENTS as readonly string[]).includes(token)) return token as ChatIntent;
  for (const intent of CHAT_INTENTS) {
    if (line === intent || line.startsWith(`${intent} `) || line.includes(` ${intent}`)) {
      return intent;
    }
  }
  return null;
}

/**
 * Meaning-based classifier prompt. Definitions only , no phrase lists.
 * The model must generalize to slang, typos, and unseen wording.
 */
export function buildIntentClassifierPrompt(retrieval: RetrievalResult): string {
  const fit =
    retrieval.primaryService && retrieval.primaryScore >= 5
      ? `${retrieval.primaryService.title} (score ${retrieval.primaryScore})`
      : 'none';

  return `You classify one user message for VAWCOM’s website chat.
Reply with EXACTLY one label from the list. No punctuation, no explanation.

Labels:
greeting , hello / hi only
chitchat , wellbeing or small talk in any phrasing (including slang like hru)
thanks , short thanks
correction , pushback on the bot’s assumption, “I didn’t say that”, clarifying what they meant
tone_feedback , complaining about tone or formality
reject_suggestion , rejecting a service we already suggested
off_topic , homework, trivia, or general knowledge unrelated to hiring VAWCOM or building a product with us
browse_services , unsure, wants the menu, or no clear product yet
project_need , clear ask to build or fix a site, app, store, voice line, AI/automation, etc.
sideways , get-rich, lawsuit, or wealth-guarantee bait
general , vendor choice (“best company/place to build this”), about VAWCOM, or other on-topic that is not a single-service pitch

Rules:
- Classify by meaning, not keywords. Typos and slang still count.
- “Who / where / which company should build X” is general (they are already on VAWCOM), never off_topic.
- If they describe a real build need, prefer project_need.
- Possible service fit from site retrieval: ${fit}.`;
}

export function buildClassifierMessages(
  system: string,
  message: string,
  history?: unknown
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const msgs: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: system },
  ];
  if (Array.isArray(history)) {
    for (const m of history.slice(-4)) {
      const text = typeof m?.text === 'string' ? m.text.trim() : '';
      if (!text) continue;
      if (
        (m?.role === 'assistant' || m?.role === 'ai') &&
        /ask what we do, or describe an idea/i.test(text)
      ) {
        continue;
      }
      const role = m?.role === 'assistant' || m?.role === 'ai' ? 'assistant' : 'user';
      msgs.push({ role, content: text.slice(0, 280) });
    }
  }
  msgs.push({ role: 'user', content: message });
  return msgs;
}

/**
 * Prefer LLM intent (generalizes). Fall back to heuristics when the model
 * is down or returns garbage , eval stays on classifyIntent() directly.
 */
export async function resolveChatIntent(params: {
  message: string;
  history?: unknown;
  retrieval: RetrievalResult;
  classify: (messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) => Promise<string>;
}): Promise<{ intent: ChatIntent; source: 'llm' | 'heuristic' }> {
  try {
    const system = buildIntentClassifierPrompt(params.retrieval);
    const messages = buildClassifierMessages(system, params.message, params.history);
    const raw = await params.classify(messages);
    const parsed = parseIntentLabel(raw);
    if (parsed) return { intent: parsed, source: 'llm' };
  } catch {
    /* use heuristic */
  }
  return {
    intent: classifyIntent(params.message, params.retrieval, params.history),
    source: 'heuristic',
  };
}

// ─── Prompts ───────────────────────────────────────────────────────────────

function catalogMenu() {
  return SERVICES.map((s) => `- [${s.title}](/services/${s.id})`).join('\n');
}

const SHARED_TONE = `Tone: warm, casual, and clear. Friendly, not stiff or overly formal.
Keep replies short: usually one sentence, two at most. Answer only what they asked. Do not ramble, recap the whole page, or list extra facts they did not request.
Always finish complete sentences. Never trail off mid thought.
Never repeat your previous reply word for word. If you already said something, rephrase it or ask a clearer follow-up.

Hard rules:
- Reply ONLY with the user-facing message. Never write chain-of-thought, analysis, or notes like “Okay, the user said…”, “They’re unsure…”, “Let me think…”.
- Never narrate the chat (“I see what’s going on”, “I see a pattern”).
- Never invent brainstorm lists. Never invent services. Never recommend Etsy/Shopify/Wix/etc.
- Negation matters: “I don’t have anything to sell” is NOT an e-commerce ask.
- No get-rich advice. No random service pitches.
- You are the VAWCOM site desk. Brief banter is fine; always steer back to what someone might build, or [services](/services).
- If they ask who to hire, the best place/company/agency to get something built, whether VAWCOM is a fit, or if they are in the right place: they already are. Say so plainly, invite [Contact](/contact), and link matching services. That is on-topic, not a deflect.
- When they need more than one thing (for example a website and an app), link each matching /services/{id} page. Do not collapse everything into one service.
- Do not answer general knowledge, homework, trivia, or school subjects of any kind. Do not name the subject (“I can’t do math/physics”). Just say you’re here for VAWCOM projects and redirect.
- When they have a clear build need, link the matching /services/{id} and [Contact](/contact).
- You know which page they are viewing. Use it to ground answers about “this” / “here” / “this page”. Do not recite the page brief unless they ask for details. “What page am I on?” → one short sentence naming the page, then stop.`;

function intentAddendum(intent: ChatIntent): string {
  switch (intent) {
    case 'off_topic':
      return `Not a VAWCOM project ask (could be anything). Do not answer it. Do not name the topic. One friendly line + redirect to [services](/services) or “what do you want to build?”. Never repeat the same sentence if they push back , vary the wording, still redirect.`;
    case 'chitchat':
      return `Casual small talk (including short forms like “hru”). One short warm reply, then ALWAYS steer: ask what they’re building or link [services](/services). Do not roleplay drinks/food for multiple turns. Do not stay in open-ended chat without a redirect. Do not paste a prior reply again.`;
    case 'browse_services':
      return `Unsure, no product yet, or wants the menu. List Menu links if they ask what you offer; otherwise [services](/services) or one clarifying question. No invented idea lists.`;
    case 'sideways':
      return `Wealth / legal bait. No get-rich advice, no random service. Ask what the product should do, or [services](/services).`;
    case 'correction':
      return `They pushed back on an assumption or a prior reply. Own it briefly, do not reuse the same sentence you just used, and ask what they actually want , or link [services](/services).`;
    case 'tone_feedback':
      return `They want less formal / better tone. One casual acknowledgment + offer project help or [services](/services).`;
    case 'reject_suggestion':
      return `They rejected a service. Acknowledge, send [services](/services), don’t re-pitch it.`;
    case 'project_need':
      return `Clear project ask. Affirm, link every matching /services/{id} when more than one fits, offer [Contact](/contact).`;
    case 'thanks':
      return `Short thanks.`;
    default:
      return `If this is vendor/hiring (“best company”, “who should build this”, “right place”): promote VAWCOM , they are already here , then [Contact](/contact) and matching services. Build need → service + Contact. Vague → [services](/services). Off-lane Q&A → don’t answer; redirect without naming the subject. Finish every sentence.`;
  }
}

export function buildRagSystemPrompt(
  retrieval: RetrievalResult,
  opts?: { intent?: ChatIntent; message?: string; unified?: boolean }
) {
  const intent = opts?.intent ?? 'general';
  const message = opts?.message ?? '';
  const vendorAsk = Boolean(message && isVendorChoiceAsk(message));
  const unified = Boolean(opts?.unified);
  const context = retrieval.chunks.map((c, i) => `[${i + 1}] (${c.id})\n${c.text}`).join('\n\n');
  const allowed = [
    ...CHAT_SITE_LINKS.map((l) => l.href),
    ...SERVICES.map((s) => `/services/${s.id}`),
    '/contact',
  ].join(', ');

  const fitLine =
    retrieval.primaryService && retrieval.primaryScore >= 5
      ? retrieval.secondaryService && retrieval.secondaryService.id !== retrieval.primaryService.id
        ? `Possible fits: [${retrieval.primaryService.title}](/services/${retrieval.primaryService.id}) and [${retrieval.secondaryService.title}](/services/${retrieval.secondaryService.id}). Use both when the ask covers both.`
        : `Possible fit: [${retrieval.primaryService.title}](/services/${retrieval.primaryService.id}). Use only for a real project ask.`
      : retrieval.catalogAsk
        ? 'List our services with links only, or send [/services](/services).'
        : vendorAsk
          ? 'Vendor/hiring ask: promote VAWCOM as the right place. Link matching services when clear, plus [Contact](/contact).'
          : 'Ask what they need, or link [/services](/services).';

  const intentBlock = unified
    ? `Classify by meaning (slang and typos count), then answer in one shot.

Output format , exactly two parts:
INTENT <label>
<user-facing reply only>

Labels: ${CHAT_INTENTS.join(', ')}

Quick meaning guide:
- greeting = hi/hello only
- chitchat = wellbeing / small talk
- thanks = short thanks
- correction = pushback on a bot assumption
- tone_feedback = tone/formality complaint
- reject_suggestion = rejecting a pitched service
- off_topic = homework/trivia unrelated to hiring us
- browse_services = unsure / wants the menu
- project_need = clear build/fix ask
- sideways = get-rich / lawsuit bait
- general = vendor choice (“best company/place”) or other on-topic

Never put the INTENT line in the user-facing reply. Never repeat your previous reply word for word.`
    : `Intent for this turn: ${intent}
${intentAddendum(intent)}`;

  return `You are VAWCOM’s website chat desk.

${SHARED_TONE}

Viewer location: ${retrieval.page.title} (${retrieval.page.path})
Page notes (for you, not to dump verbatim): ${retrieval.page.blurb}
One-line summary if they ask what this page is about: ${retrieval.page.summary}
Use location to answer “where am I / this page” briefly. Only expand if they ask for founders, process, or other details.
Never use em dashes in replies.

${intentBlock}

Allowed hrefs only: ${allowed}
Never prefix with Assistant: or VAWCOM:.

Menu:
${catalogMenu()}

${
  unified
    ? fitLine
    : intent === 'off_topic' || intent === 'sideways'
      ? 'Do not force a specific service page. Do redirect to [services](/services) or ask what they want to build.'
      : intent === 'chitchat'
        ? 'Stay warm, then include [services](/services) or ask what they want to build.'
        : vendorAsk
          ? 'Vendor/hiring ask: promote VAWCOM as the right place. Link matching services when clear, plus [Contact](/contact). Finish complete sentences.'
          : fitLine
}

Context:
${context}`;
}

/** Pull INTENT label + user-facing body from a single model completion. */
export function splitIntentAndReply(raw: string): { intent: ChatIntent | null; reply: string } {
  const text = raw.replace(/^\uFEFF/, '').trim();
  const tagged = text.match(/^INTENT\s+([a-z_]+)\s*(?:\n+|\r\n+)([\s\S]*)$/i);
  if (tagged) {
    return {
      intent: parseIntentLabel(tagged[1]!),
      reply: tagged[2]!.trim(),
    };
  }
  const firstLine = text.split(/\n/, 1)[0] ?? '';
  const maybe = parseIntentLabel(firstLine);
  if (maybe && /\n/.test(text)) {
    return { intent: maybe, reply: text.slice(firstLine.length).trim() };
  }
  return { intent: null, reply: text };
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
    for (const m of history.slice(-4)) {
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
      msgs.push({ role, content: text.slice(0, 320) });
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
  // Real service menu uses /services/ links , not an invented brainstorm
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
    .replace(/^INTENT\s+[a-z_]+\s*/i, '')
    .replace(/^(?:okay[.]?\s*)?the user[\s\S]*?(?=\n\n|[A-Z][a-z]|$)/i, ' ')
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
  catalogAsk = false,
  maxSentences = 2
): string {
  let out = text
    .replace(/^(?:(?:VAWCOM|Assistant|Visitor|User):\s*)+/gim, '')
    .replace(/\b(?:VAWCOM|Assistant|Visitor|User):\s*/g, '')
    .replace(/Recent chat:[\s\S]*?(?=\n\n|$)/i, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
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

  out = clampReply(out, catalogAsk ? 8 : maxSentences);

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
    return 'Happy to help. Ask what we do, or describe an idea.';
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
    out = pickVariantAvoidingLast(CHITCHAT_REPLIES, `${message}|chat-steer`, history);
  }

  // Model named a subject refuse (“I can’t help with math/physics”) , replace with generic
  if (
    intent === 'off_topic' &&
    /\b(can'?t|cannot|not (able|set up)|don'?t) (help with|cover|do|answer).{0,40}\b(math|physics|homework|chemistry|biology|history)\b/i.test(
      out
    )
  ) {
    out = offTopicReply(message, history);
  }

  if (intent === 'sideways' && /\b(become a millionaire|get rich|path to wealth|make you (a )?million)\b/i.test(out)) {
    out = pickVariantAvoidingLast(SIDEWAYS_REPLIES, `${message}|side-safe`, history);
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

  if (isVendorChoiceAsk(message)) {
    const promotes =
      /\b(right place|already (here|talking)|that'?s (us|vawcom)|vawcom builds|what (we|this studio) (is|are) for)\b/i.test(
        out
      ) || /\/contact|\/services/i.test(out);
    if (!promotes || looksLikeOffTopicAnswer(out)) {
      out = promoteStudioReply(message, retrieval, history);
    }
  }

  // Exact (or near-exact) repeat of a recent assistant line → force a different local line
  if (recentAssistantTexts(history, 4).some((p) => replyIsRepeat(out, p))) {
    out = offlineFallbackForIntent(intent, `${message}|dedupe`, retrieval, history);
  }

  const allowThree =
    retrieval.catalogAsk ||
    CATALOG_ASK.test(message) ||
    Boolean(
      retrieval.secondaryService &&
        retrieval.primaryService &&
        retrieval.secondaryService.id !== retrieval.primaryService.id &&
        intent === 'project_need'
    );

  // Simple location / “where am I” asks stay to one sentence.
  const locationAsk =
    /\b(what page (am i|are we) on|where am i|which page|what page is this)\b/i.test(message);

  return sanitizeAssistantReply(
    out,
    intent === 'project_need' ? retrieval.primaryService : null,
    retrieval.catalogAsk || CATALOG_ASK.test(message),
    locationAsk ? 1 : allowThree ? 3 : 2
  );
}
