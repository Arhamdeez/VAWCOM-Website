'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICES } from '@/lib/services';

/** Old /services#web bookmarks land on /services/web. */
export default function HashToService() {
  const router = useRouter();

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (SERVICES.some((s) => s.id === id)) router.replace(`/services/${id}`);
  }, [router]);

  return null;
}
