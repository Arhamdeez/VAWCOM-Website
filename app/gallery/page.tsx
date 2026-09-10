import type { Metadata } from 'next';
import CreamPage from '@/components/services/CreamPage';
import WorkRoom from '@/components/work/WorkRoom';

export const metadata: Metadata = {
  title: 'Gallery | VAWCOM',
  description: 'Work we have shipped, across web, apps, voice, and everything else.',
};

export default function Gallery() {
  return (
    <CreamPage nav="gallery" footer={false}>
      <WorkRoom />
    </CreamPage>
  );
}
