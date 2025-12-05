import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '../components/ErrorBoundary'
import { I18nProvider } from '../contexts/I18nContext'
import GoogleAnalytics from '../components/GoogleAnalytics'

// Replace with your Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
      <I18nProvider>
        <Component {...pageProps} />
      </I18nProvider>
    </ErrorBoundary>
  )
}
