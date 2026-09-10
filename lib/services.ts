export const SERVICES = [
  {
    id: 'web',
    nav: 'Web',
    title: 'Web Development',
    lede: 'Marketing sites, dashboards, and web apps. Designed and built by the same team.',
    hook: 'Stop handing design to one vendor and code to another.',
    for: 'For founders and product teams who need a public site or web product without splitting the work across shops.',
    help: 'We own structure, UI, and launch so what you ship matches what you promised.',
    promise:
      'We help with structure, a responsive UI, and getting the site online with hosting, domain, and the basics covered.',
    outcomes: [
      {
        title: 'Intentional page structure',
        body: 'Every page has a purpose before we draw a layout. Your team can explain the site in one pass.',
      },
      {
        title: 'Design and development together',
        body: 'Design and code move together. You review working screens as we build.',
      },
      {
        title: 'Editable content',
        body: 'We set up a CMS or admin where your team will update content regularly.',
      },
      {
        title: 'Hosting and launch help',
        body: 'We help with hosting, your domain, analytics, and basic SEO so the site is live for real visitors.',
      },
    ],
    first: 'A site map and the first pages you can click through on your phone.',
    bring: 'Your current URL if you have one, the pages you know you need, and brand files if they exist.',
    span: 'Marketing sites: a few weeks. Product surfaces: longer. Dates go on the first delivery before we code.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Postgres'],
    extras: ['CMS / admin', 'Auth and dashboards', 'Analytics and SEO', 'Custom APIs'],
  },
  {
    id: 'apps',
    nav: 'Apps',
    title: 'App Development',
    lede: 'iOS and Android from one codebase, with store listing, push, and the APIs included.',
    hook: 'Ship the one job that makes the app worth opening.',
    for: 'For teams whose product has to live as an app, including solo founders.',
    help: 'We lock the first-version job, then ship both platforms from the same codebase.',
    promise:
      'We get a core flow onto a real phone first, then polish and expand from there.',
    outcomes: [
      {
        title: 'iOS and Android together',
        body: 'React Native or Flutter when it fits. Native only where the platform requires it.',
      },
      {
        title: 'Core flow first',
        body: 'Auth, data, and the main flow first. Extra features come after that works.',
      },
      {
        title: 'Test builds for review',
        body: 'We prepare builds, listing copy, and assets for TestFlight and Play internal testing.',
      },
      {
        title: 'Room to grow after launch',
        body: 'You leave with code you can keep improving after the first release.',
      },
    ],
    first: 'The core flow on a test build you can use on a real phone.',
    bring: 'The one job v1 must do, which platforms you need, and any accounts or APIs to connect.',
    span: 'A focused first version usually takes several weeks. We timebox the core flow before store work.',
    stack: ['React Native', 'Flutter', 'Kotlin', 'Swift', 'Firebase'],
    extras: ['Push notifications', 'Store listing', 'Offline-first data', 'Deep links'],
  },
  {
    id: 'voice',
    nav: 'Voice',
    title: 'Voice Agents',
    lede: 'Phone agents that answer, book, answer FAQs, and hand off to a person when it matters.',
    hook: 'Your phone should finish work, not fill a voicemail box.',
    for: 'For businesses that miss calls and want a number that completes tasks.',
    help: 'The agent answers, checks tools like your calendar, and passes the call to a human when needed.',
    promise:
      'We set up the agent to handle your main call types, connect it to your tools, and define when a person should take over.',
    outcomes: [
      {
        title: 'Call flows from real requests',
        body: 'We map what callers ask most often and plan for the edge cases before go-live.',
      },
      {
        title: 'Connected to your tools',
        body: 'Calendar, CRM, docs, or a spreadsheet. The agent works with the tools your team already uses.',
      },
      {
        title: 'Hand off to a person',
        body: 'We set clear rules for when a human joins the call.',
      },
      {
        title: 'Pilot on a test number',
        body: 'You try the top call types on a test line before it sits on your public number.',
      },
    ],
    first: 'A test number that handles your top three call types end to end.',
    bring: 'The calls you miss or repeat, the hours the line should answer, and the tools to connect.',
    span: 'A focused pilot can be ready in a few weeks once the call list is clear.',
    stack: ['Twilio', 'OpenAI', 'n8n', 'Calendar APIs'],
    extras: ['Booking and FAQs', 'CRM writeback', 'SMS confirmations', 'After-hours cover'],
  },
  {
    id: 'ai',
    nav: 'AI',
    title: 'AI & Automation',
    lede: 'Site chat, document Q&A, and automations that move work from message to record to reply.',
    hook: 'Automate the hours you already waste every week.',
    for: 'For teams stuck on repeat questions, or ops still living in inboxes and spreadsheets.',
    help: 'We automate one workflow first, with logs, and a person in the loop where a wrong send hurts.',
    promise:
      'We automate the repeat work that eats your week, keep a log of what ran, and leave approval steps where a mistake would hurt.',
    outcomes: [
      {
        title: 'Answers from your own sources',
        body: 'Chat and doc Q&A grounded in material you control.',
      },
      {
        title: 'Automate a repeat workflow',
        body: 'We automate the job that takes the most hours, with retries and an audit trail.',
      },
      {
        title: 'Integrations with your stack',
        body: 'Email, Slack, sheets, CRM. The automation meets your team where they work.',
      },
      {
        title: 'Approval where it matters',
        body: 'Approval steps on anything that spends money or messages customers.',
      },
    ],
    first: 'One workflow in production with a log you can open on Monday.',
    bring: 'The repeat task to remove first, where the data lives, and who must approve sends.',
    span: 'The first workflow often takes a few weeks. More follow once that pattern works.',
    stack: ['OpenAI', 'Claude', 'n8n', 'Python', 'Node.js'],
    extras: ['Site chat', 'Doc Q&A', 'Slack and email', 'Sheets to CRM'],
  },
  {
    id: 'commerce',
    nav: 'Commerce',
    title: 'E-commerce',
    lede: 'Catalog, cart, payments, and inventory that stay in sync when an order lands.',
    hook: 'Stop reconciling orders that do not match the shelf.',
    for: 'For brands selling online who need stock, money, and the storefront to agree.',
    help: 'Storefront, payments, and inventory update together so ops is not cleaning mismatches by hand.',
    promise:
      'We help you sell online with a storefront, working checkout, and inventory that updates when orders come in.',
    outcomes: [
      {
        title: 'Product pages and cart',
        body: 'Product pages and cart flows shaped around how you sell.',
      },
      {
        title: 'Checkout and payments',
        body: 'Payment setup for how you get paid, including common failure cases.',
      },
      {
        title: 'Inventory that stays in sync',
        body: 'Stock updates when an order lands so you can see oversells early.',
      },
      {
        title: 'Simple order ops',
        body: 'Order email and a simple view for the people shipping boxes.',
      },
    ],
    first: 'A catalog, checkout, and one real test order that completes cleanly.',
    bring: 'How you fulfill today, a product list even if it is a spreadsheet, and how you get paid.',
    span: 'A focused catalog can launch in a few weeks once fulfillment is clear.',
    stack: ['Next.js', 'Stripe', 'Postgres', 'AWS'],
    extras: ['Catalog and cart', 'Inventory sync', 'Order email', 'Ops dashboard'],
  },
  {
    id: 'care',
    nav: 'Care',
    title: 'Maintenance & Rescue',
    lede: 'Updates, monitoring, backups, bug fixes, and cleanup so the next change is safer.',
    hook: 'If touching production scares you, that is the problem we fix.',
    for: 'For anyone with a live site or app that is unstable, slow, or hard to change.',
    help: 'We find the root cause, put monitoring on a schedule, and leave the next change easier.',
    promise:
      'We stabilize what is live, fix the real bugs, and leave clear notes so the next change is easier.',
    outcomes: [
      {
        title: 'Monitoring and updates',
        body: 'Monitoring, updates, and backups on a cadence so issues show up before customers report them.',
      },
      {
        title: 'Root-cause bug fixes',
        body: 'We reproduce, rank, and fix the underlying bug, not only the symptom.',
      },
      {
        title: 'Code cleanup',
        body: 'Structure, types, and tests where they make changes safer.',
      },
      {
        title: 'Written handoff notes',
        body: 'Short notes on what changed and why.',
      },
    ],
    first: 'The worst issue reproduced, ranked, and a fix date on the calendar.',
    bring: 'Access or a walkthrough of what breaks, what hurts most, and any hard deadline.',
    span: 'Stabilization often shows results in the first week. Deeper cleanup is paced to risk.',
    stack: ['Docker', 'AWS', 'Postgres', 'TypeScript'],
    extras: ['Uptime and backups', 'Bug hunts', 'Refactors', 'Handover notes'],
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];
export type Service = (typeof SERVICES)[number];

const TRACK_COLOR: Record<ServiceId, string> = {
  web: '#429f7f',
  apps: '#63cbc0',
  voice: '#1f7f9c',
  ai: '#0cb78b',
  commerce: '#cf6a2c',
  care: '#d9a961',
};

export const SERVICE_TRACK = SERVICES.map((s) => ({
  title: s.title,
  href: `/services/${s.id}`,
  body: s.lede,
  color: TRACK_COLOR[s.id],
}));

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export const SERVICE_FAQS = [
  {
    q: 'How do we start?',
    a: 'A short call or the contact form. We scope the first delivery, then build. You talk to the people doing the work.',
  },
  {
    q: 'How long does a project take?',
    a: 'A marketing site is usually weeks. An app, voice line, or store depends on the first version. We put dates on paper before we write code.',
  },
  {
    q: 'Do you take over existing code?',
    a: 'Yes. Maintenance, bug hunts, and cleanup are a full service.',
  },
  {
    q: 'Where are you based?',
    a: 'Karachi, with real overlap across US, UK, and EU days.',
  },
] as const;
