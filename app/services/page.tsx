import type { Metadata } from 'next';
import ServicesHub from '@/components/services/ServicesHub';

export const metadata: Metadata = {
  title: 'Services | VAWCOM',
  description: 'Web, mobile, voice agents, AI, e-commerce, ERP, CRM, and maintenance from Lahore.',
};

export default function Services() {
  return <ServicesHub />;
}
