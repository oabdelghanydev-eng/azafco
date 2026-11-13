import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AZAFCO International | Contact',
  description: 'AZAFCO International: website, WhatsApp and email.',
  robots: { index: false, follow: true },
  icons: { icon: '/brand/favicon.svg', apple: '/brand/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#002D72', width: 'device-width', initialScale: 1 };

export default function QrLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${cairo.className} min-h-screen bg-[#002D72] text-white antialiased`}>{children}</body>
    </html>
  );
}
