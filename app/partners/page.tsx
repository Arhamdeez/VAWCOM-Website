import type { Metadata } from 'next';
import PartnersPage from '@/components/partners/PartnersPage';

export const metadata: Metadata = {
  title: 'White-Label Development Partners | VAWCOM',
  description:
    'VAWCOM also works as a confidential white-label development partner for agencies and studios: SaaS, mobile apps, web apps and AI solutions built behind the scenes under your brand.',
};

export default function Partners() {
  return <PartnersPage />;
}
