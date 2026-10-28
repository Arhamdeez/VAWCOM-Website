import type { Metadata } from 'next';
import ThankYouPage from '@/components/contact/ThankYouPage';

export const metadata: Metadata = {
  title: 'Thank you | VAWCOM',
  robots: { index: false, follow: false },
};

export default function ContactThanks() {
  return <ThankYouPage />;
}
