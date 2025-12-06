import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="ar" dir="rtl">
            <Head>
                {/* Preconnect to Google Fonts for faster font loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                <meta charSet="utf-8" />
                <meta name="theme-color" content="#0073e6" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon-48x48.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* Cloudflare Web Analytics */}
                <script
                    defer
                    src="https://static.cloudflareinsights.com/beacon.min.js"
                    data-cf-beacon='{"token": "8f71f218933a46aaae27dea11f31713a"}'
                />
            </body>
        </Html>
    )
}
