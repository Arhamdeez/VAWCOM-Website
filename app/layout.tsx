import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import { SPLASH_COOKIE } from '@/lib/splashBoot';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export const metadata: Metadata = {
  title: 'VAWCOM | Web, Mobile, Voice & AI Services',
  description:
    'Full-service digital studio: web and mobile apps, voice experiences, AI chatbots, and integrations. We design, build, and ship what you need end to end.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'VAWCOM | Web, Mobile, Voice & AI Services',
    description:
      'Full-service digital studio: web and mobile apps, voice experiences, AI chatbots, and integrations. We design, build, and ship what you need end to end.',
    url: 'https://www.vawcom.com',
    siteName: 'VAWCOM',
    images: [
      {
        url: '/logo.png',
        width: 200,
        height: 200,
        alt: 'VAWCOM Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'VAWCOM | Web, Mobile, Voice & AI Services',
    description:
      'Full-service digital studio: web and mobile apps, voice experiences, AI chatbots, and integrations. We design, build, and ship what you need end to end.',
    images: ['/logo.png'],
  },
  metadataBase: new URL('https://www.vawcom.com'),
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const seen = jar.get(SPLASH_COOKIE)?.value === '1';

  return (
    <html
      lang="en"
      className={`${jakarta.variable} bg-[#050a14] ${seen ? 'splash-complete' : 'splash-pending'}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${jakarta.className} bg-[#050a14]`} suppressHydrationWarning>
        <noscript>
          <style>{`html.splash-pending,html.splash-pending body{overflow:auto!important}html.splash-pending .splash-boot{display:none!important}`}</style>
        </noscript>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
