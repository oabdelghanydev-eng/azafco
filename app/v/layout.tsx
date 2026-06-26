import { ReactNode } from 'react';
import { Cairo } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function VerificationLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicons/favicon.ico" sizes="48x48" />
      </head>
      <body className={`${cairo.className} bg-slate-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
