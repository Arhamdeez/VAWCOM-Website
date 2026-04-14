import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffectWrapper from '@/components/BackgroundEffectWrapper';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';
import PageTransition from '@/components/PageTransition';

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
    <html lang="en" className="bg-black">
      <body className={`${inter.className} bg-black`}>
        <SplashScreenWrapper>
          <BackgroundEffectWrapper />
          <Navbar />
          <main className="relative min-h-0 w-full overflow-x-hidden bg-black supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SplashScreenWrapper>
      </body>
    </html>
  );
}
