import type { Metadata } from 'next';
import ServicesHub from '@/components/services/ServicesHub';

export const metadata: Metadata = {
  title: 'Services | VAWCOM',
  description: 'Web, mobile, voice agents, AI automation, e-commerce, and maintenance from Karachi.',
};

export default function Services() {
  return <ServicesHub />;
}
