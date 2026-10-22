import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SHOW_GALLERY } from '@/lib/site';
import CreamPage from '@/components/services/CreamPage';
import WorkRoom from '@/components/work/WorkRoom';

export const metadata: Metadata = {
  title: 'Gallery | VAWCOM',
  description: 'Work we have shipped, across web, apps, voice, and everything else.',
};

export default function Gallery() {
  if (!SHOW_GALLERY) notFound();
  return (
    <CreamPage nav="gallery" footer={false}>
      <WorkRoom />
    </CreamPage>
  );
}
