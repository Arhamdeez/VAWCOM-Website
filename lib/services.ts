export const SERVICES = [
  {
    id: 'web',
    nav: 'Web',
    title: 'Web Development',
    lede: 'Marketing sites, dashboards, and custom web apps. Designed, built, and launched together.',
    for: 'Founders and teams who need a public site or a product on the web, without a separate design shop and a separate build shop.',
    deliverables: [
      'Information architecture and page or app structure',
      'Responsive UI on the cream-and-brand system, or yours',
      'CMS or admin where you will actually edit content',
      'Launch: hosting, domains, analytics, basic SEO',
    ],
    steps: ['Scope the pages and the jobs they do', 'Design and build in the same pass', 'Launch, then watch real use'],
    need: [
      'A URL if something already exists',
      'The pages or jobs you already know you need',
      'Brand files if you have them. If not, we start without.',
    ],
    first: 'A site map and the first few pages, live enough to click through.',
  },
  {
    id: 'apps',
    nav: 'Apps',
    title: 'App Development',
    lede: 'Cross-platform mobile with store listing, push, and the APIs behind it.',
    for: 'Products that have to live as an app, not a bookmark. Solo builders and small teams included.',
    deliverables: [
      'iOS and Android from one codebase',
      'Auth, data, and the screens that matter first',
      'Store-ready builds and listing copy',
      'A path to iterate after the first release',
    ],
    steps: ['Lock the first-version jobs', 'Build the core loop', 'Ship to TestFlight / internal track, then stores'],
    need: [
      'The one job the first version must do well',
      'Whether you need iOS, Android, or both',
      'Any accounts or APIs we should plug into',
    ],
    first: 'The core loop on a test build you can actually use.',
  },
  {
    id: 'voice',
    nav: 'Voice',
    title: 'Voice Agents',
    lede: 'Phone flows that pick up when you cannot: calendar, FAQs, and handoff to a person when it matters.',
    for: 'Businesses that lose calls, and anyone who wants a number that actually does something.',
    deliverables: [
      'Call flow mapped to what you actually get asked',
      'Live agent connected to calendar, CRM, or docs',
      'Handoff rules for the cases a human should take',
      'A test number before it sits on your real line',
    ],
    steps: ['List the calls you want handled', 'Wire tools and the script', 'Pilot on a test line, then cut over'],
    need: [
      'The calls you miss or hate repeating',
      'Hours the line should pick up',
      'Tools it should talk to (calendar, CRM, a spreadsheet)',
    ],
    first: 'A test number that handles your top three call types.',
  },
  {
    id: 'ai',
    nav: 'AI',
    title: 'AI & Automation',
    lede: 'Chat on your site, document Q&A, and n8n automations that move a message to a record to a reply.',
    for: 'Teams drowning in repeat questions, or ops that still live in inboxes and spreadsheets.',
    deliverables: [
      'A scoped assistant with sources you control',
      'Automations for the three jobs that eat the week',
      'Integrations: email, Slack, sheets, your stack',
      'A human-in-the-loop where a wrong send would hurt',
    ],
    steps: ['Pick one painful loop', 'Automate it with an audit trail', 'Add the next loop once this one is boring'],
    need: [
      'The repeat task you want off your plate first',
      'Where the data lives today',
      'Who has to approve a send, if anyone',
    ],
    first: 'One loop running with a log you can check.',
  },
  {
    id: 'commerce',
    nav: 'Commerce',
    title: 'E-commerce',
    lede: 'Catalog, cart, payments, and inventory that stay honest. Not a theme dumped on a warehouse.',
    for: 'Brands selling online who are tired of orders that do not match the shelf.',
    deliverables: [
      'Storefront and product pages',
      'Checkout and payment rails',
      'Stock that updates when an order lands',
      'Order email and a simple ops view',
    ],
    steps: ['Map catalog and fulfillment', 'Build store and payments', 'Launch with a real test order'],
    need: [
      'How you fulfill today',
      'A product list, even if it is a spreadsheet',
      'How you want to get paid',
    ],
    first: 'A catalog, checkout, and one real test order.',
  },
  {
    id: 'care',
    nav: 'Care',
    title: 'Maintenance & Rescue',
    lede: 'Updates, monitoring, backups, bug hunts, and code cleanup so the next change is cheaper, not scarier.',
    for: 'Anyone with a live site or app that is drifting, breaking, or too messy to touch.',
    deliverables: [
      'Monitoring, updates, and backups on a cadence',
      'Bugs traced to cause, not patched at the symptom',
      'Cleanup: structure, types, tests where they pay off',
      'A short written report of what changed and why',
    ],
    steps: ['Reproduce and rank the pain', 'Fix the cause', 'Leave the next person a map'],
    need: [
      'Access, or a walkthrough of what is breaking',
      'What hurts most: speed, bugs, or fear of touching it',
      'Any deadline we should know about',
    ],
    first: 'The worst issue reproduced, ranked, and a fix on the calendar.',
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];
export type Service = (typeof SERVICES)[number];

/** Home carousel cards — one per service, single catalog. */
const TRACK_COLOR: Record<ServiceId, string> = {
  web: '#429f7f',
  apps: '#63cbc0',
  voice: '#1f7f9c',
  ai: '#6c4bb0',
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
    a: 'A short call or the contact form. We scope the first slice, then build. You talk to the people doing the work.',
  },
  {
    q: 'How long does a project take?',
    a: 'A marketing site is usually weeks. An app, voice line, or store depends on the first-version jobs. We put dates on paper before we write code.',
  },
  {
    q: 'Do you take over existing code?',
    a: 'Yes. Maintenance, bug hunts, and cleanup are a service, not a consolation prize.',
  },
  {
    q: 'Where are you based?',
    a: 'Karachi, with real overlap across US, UK, and EU days.',
  },
] as const;
