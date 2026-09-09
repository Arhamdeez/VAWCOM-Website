import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from '@/components/services/ServiceDetail';
import { SERVICES, getService } from '@/lib/services';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = getService(id);
  if (!service) return { title: 'Services | VAWCOM' };
  return {
    title: `${service.title} | VAWCOM`,
    description: service.lede,
  };
}

export default async function Service({ params }: Props) {
  const { id } = await params;
  const service = getService(id);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
