'use client';

import CreamPage from '@/components/services/CreamPage';
import WorkRoom from './WorkRoom';

export default function WorkPage() {
  return (
    <CreamPage nav="gallery" footer={false}>
      <WorkRoom />
    </CreamPage>
  );
}
