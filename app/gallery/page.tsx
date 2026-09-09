import type { Metadata } from 'next';
import WorkPage from '@/components/work/WorkPage';

export const metadata: Metadata = {
  title: 'Gallery | VAWCOM',
  description: 'Work we have shipped, across web, apps, voice, and everything else.',
};

export default function Gallery() {
  return <WorkPage />;
}
