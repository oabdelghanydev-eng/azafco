import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'
import { I18nProvider } from '../contexts/I18nContext'
import GoogleAnalytics from '../components/GoogleAnalytics'
import { Cairo } from 'next/font/google'

// Configure Cairo font with next/font for optimal loading
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
})

// Replace with your Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
      <I18nProvider>
        <main className={cairo.className}>
          <Component {...pageProps} />
        </main>
      </I18nProvider>
    </ErrorBoundary>
  )
}
