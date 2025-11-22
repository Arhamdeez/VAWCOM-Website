import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffectWrapper from '@/components/BackgroundEffectWrapper';
import SplashScreenWrapper from '@/components/SplashScreenWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'VAWCOM | Voice. Automation. Web. Communication.',
  description: 'Automation-first digital solutions. We connect your systems, so your business runs on autopilot.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'VAWCOM | Voice. Automation. Web. Communication.',
    description: 'Automation-first digital solutions. We connect your systems, so your business runs on autopilot.',
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
    title: 'VAWCOM | Voice. Automation. Web. Communication.',
    description: 'Automation-first digital solutions. We connect your systems, so your business runs on autopilot.',
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
          <main className="bg-black">{children}</main>
          <Footer />
        </SplashScreenWrapper>
      </body>
    </html>
  );
}
