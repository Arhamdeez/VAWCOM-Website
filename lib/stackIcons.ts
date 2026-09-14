/** simple-icons CDN — keep one version so home + service pages stay in sync. */
export const STACK_ICON_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons';

export type StackIcon = { slug: string; color: string };

/** Brand icons keyed by the label shown in UI / service.stack. */
export const STACK_ICONS: Record<string, StackIcon> = {
  'Next.js': { slug: 'nextdotjs', color: '#0b0d0c' },
  React: { slug: 'react', color: '#087ea4' },
  TypeScript: { slug: 'typescript', color: '#3178C6' },
  Tailwind: { slug: 'tailwindcss', color: '#0b6e75' },
  Postgres: { slug: 'postgresql', color: '#336791' },
  PostgreSQL: { slug: 'postgresql', color: '#4169E1' },
  'React Native': { slug: 'react', color: '#087ea4' },
  Flutter: { slug: 'flutter', color: '#02569B' },
  Kotlin: { slug: 'kotlin', color: '#7F52FF' },
  Swift: { slug: 'swift', color: '#F05138' },
  Firebase: { slug: 'firebase', color: '#DD2C00' },
  Twilio: { slug: 'twilio', color: '#F22F46' },
  OpenAI: { slug: 'openai', color: '#0b0d0c' },
  n8n: { slug: 'n8n', color: '#EA4B71' },
  'Calendar APIs': { slug: 'googlecalendar', color: '#1A73E8' },
  Claude: { slug: 'anthropic', color: '#D4A27F' },
  Python: { slug: 'python', color: '#3776AB' },
  'Node.js': { slug: 'nodedotjs', color: '#339933' },
  Stripe: { slug: 'stripe', color: '#635BFF' },
  AWS: { slug: 'amazonaws', color: '#FF9900' },
  Docker: { slug: 'docker', color: '#2496ED' },
  Django: { slug: 'django', color: '#092E20' },
  'Google Cloud': { slug: 'googlecloud', color: '#4285F4' },
  WordPress: { slug: 'wordpress', color: '#21759B' },
  WooCommerce: { slug: 'woocommerce', color: '#96588A' },
  Shopify: { slug: 'shopify', color: '#96BF48' },
};

export function stackIconUrl(slug: string) {
  return `${STACK_ICON_BASE}/${slug}.svg`;
}
