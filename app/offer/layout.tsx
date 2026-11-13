import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700'], display: 'swap' });

// Hidden offer pages: reached only by QR / direct link. Not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: 'AZAFCO International | Price Quotation',
  description: 'AZAFCO International price quotation.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: '/brand/favicon.svg', apple: '/brand/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#002D72', width: 'device-width', initialScale: 1 };

export default function OfferLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body dir="ltr" style={{ direction: 'ltr' }} className={`${cairo.className} min-h-screen bg-white text-[#10233f] antialiased`}>{children}</body>
    </html>
  );
}
