/** Copy for the Partners (white-label) page. Source: VAWCOM_White_Label_Outsourced_Development_Page_Copy.docx,
 *  trimmed to the white-label partnership only. */

export const PARTNER_CONTACT_SERVICE = 'White-label partnership';

export const WHITE_LABEL = [
  {
    icon: 'lock',
    title: 'Confidential partnership',
    body: 'We can sign an NDA before project details are shared.',
  },
  {
    icon: 'eyeOff',
    title: 'White-label delivery',
    body: 'No VAWCOM branding or public credits in client-facing deliverables, as agreed in the project terms.',
  },
  {
    icon: 'workflow',
    title: 'Your process, your tools',
    body: 'We can work with your Slack, Jira, Trello, GitHub or other agreed tools.',
  },
  {
    icon: 'video',
    title: 'Client-call support',
    body: 'Where agreed, our developers can join calls as part of your delivery team.',
  },
  {
    icon: 'badgePercent',
    title: 'Partner-friendly pricing',
    body: 'Scope and rates are agreed so you can plan your own client pricing and margins.',
  },
] as const;

export const BUILD = [
  {
    icon: 'layers',
    title: 'SaaS development',
    body: 'Multi-tenant platforms, subscription billing, user dashboards and admin panels designed around your product and growth plans.',
  },
  {
    icon: 'smartphone',
    title: 'Mobile app development',
    body: 'iOS and Android apps using the right approach for your requirements, including cross-platform development where suitable, through testing and store release.',
  },
  {
    icon: 'dashboard',
    title: 'Web app development',
    body: 'Custom web applications, portals and dashboards tailored to how your business works.',
  },
  {
    icon: 'bot',
    title: 'AI solutions & agents',
    body: 'AI chatbots, voice assistants, workflow automation and LLM integrations that make products and operations smarter.',
  },
  {
    icon: 'rocket',
    title: 'MVP development',
    body: 'A focused first version that helps you test assumptions, gather feedback and validate demand.',
  },
  {
    icon: 'plug',
    title: 'APIs & integrations',
    body: 'Payment gateways, CRMs, third-party APIs and custom backends that connect your systems.',
  },
  {
    icon: 'lifeBuoy',
    title: 'Project rescue',
    body: 'Stuck with a half-finished or buggy project? We assess the code, explain the risks and help fix, improve or complete it.',
  },
  {
    icon: 'wrench',
    title: 'Maintenance & support',
    body: 'Bug fixes, updates, performance improvements and new features after launch.',
  },
] as const;

export const STEPS = [
  {
    title: 'Free discovery call',
    body: 'Tell us about your project, goals and timeline. We ask questions to clarify the requirements.',
  },
  {
    title: 'Clear proposal',
    body: 'You receive a defined scope, timeline and fixed or estimated cost, depending on the project.',
  },
  {
    title: 'Design & build',
    body: 'We work in agreed milestones or short sprints and share regular progress updates.',
  },
  {
    title: 'Test & launch',
    body: 'We test, deploy to production and support app-store submission where needed.',
  },
  {
    title: 'Support & grow',
    body: 'After launch, we can continue with fixes, improvements and new features as your product evolves.',
  },
] as const;

export const WHY = [
  {
    title: 'You own the deliverables',
    body: 'Source code, designs and intellectual property are handed over according to the signed agreement and payment terms.',
  },
  {
    title: 'Clear communication',
    body: 'Regular updates, a shared progress board and agreed response times help you see what is happening.',
  },
  {
    title: 'Clean, maintainable code',
    body: 'We aim for documented, tested and structured work that another developer can understand and maintain.',
  },
  {
    title: 'Business-minded delivery',
    body: 'We consider users, business goals and budget, not just technical implementation.',
  },
  {
    title: 'Confidential by default',
    body: 'We can sign an NDA before discussing sensitive project details.',
  },
] as const;

export const COUNTRIES = ['USA', 'France', 'Germany', 'Nigeria', 'Australia'] as const;

export const MODELS = [
  {
    icon: 'fileCheck',
    name: 'Fixed price',
    best: 'Clearly defined projects and MVPs',
    how: 'Agreed scope, timeline and price, usually paid by milestones.',
  },
  {
    icon: 'clock',
    name: 'Hourly',
    best: 'Evolving projects and ongoing changes',
    how: 'Pay for the agreed hours worked, with time reporting.',
  },
  {
    icon: 'calendar',
    name: 'Monthly retainer',
    best: 'Agencies and post-launch support',
    how: 'A set amount of capacity reserved each month for fixes, features or white-label work.',
  },
] as const;

export const PARTNER_FAQS = [
  {
    q: 'Who owns the code?',
    a: 'Ownership and handover of source code, designs and other deliverables are set out in the agreement. Once the agreed payment terms are met, the agreed project IP is transferred to you.',
  },
  {
    q: 'Do you sign NDAs?',
    a: 'Yes, we can sign an NDA before you share confidential project details.',
  },
  {
    q: 'For white-label work, will my client know you built it?',
    a: 'We can work as a confidential white-label partner. Client contact, branding and disclosure arrangements are agreed with your agency in advance.',
  },
  {
    q: 'How much does a project cost?',
    a: 'It depends on scope, complexity, timeline and team requirements. Get in touch for a consultation and we will send a clear proposal with the pricing approach and assumptions.',
    link: { label: 'Book a consultation', href: '/contact?service=Consultation' },
  },
  {
    q: 'How long does it take?',
    a: 'It depends on your requirements. Get in touch for a consultation and we will map out a clear timeline for your project.',
    link: { label: 'Book a consultation', href: '/contact?service=Consultation' },
  },
  {
    q: 'How do we communicate?',
    a: 'We can use your preferred agreed channels, such as Slack, email, WhatsApp, Jira or a shared project board, with regular progress updates and calls as needed.',
  },
  {
    q: 'What happens after launch?',
    a: 'We can provide maintenance and support for bug fixes, updates, monitoring and new features under an agreed support plan.',
  },
  {
    q: 'Can you take over an existing project?',
    a: 'Yes. We can begin with a code and project review, explain our findings, and propose a practical plan to fix, improve or complete the product.',
  },
] as const;
