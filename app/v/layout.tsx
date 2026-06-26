import { ReactNode } from 'react';
import '../globals.css';

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
      <body className="bg-gray-50 min-h-screen text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
