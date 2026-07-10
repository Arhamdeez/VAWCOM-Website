import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SiteShell from '@/components/SiteShell';
import { SPLASH_BOOT_SCRIPT } from '@/lib/splashBoot';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-[#050a14]"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }} />
      </head>
      <body className={`${inter.className} bg-[#050a14]`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
