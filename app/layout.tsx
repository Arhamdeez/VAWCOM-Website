import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffect from '@/components/BackgroundEffect';

const inter = Inter({ subsets: ['latin'] });

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
        <BackgroundEffect />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
