import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffectWrapper from '@/components/BackgroundEffectWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'VAWCOM | Voice. Automation. Web. Communication.',
  description: 'Automation-first digital solutions. We connect your systems, so your business runs on autopilot.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackgroundEffectWrapper />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
