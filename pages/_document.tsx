import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="ar" dir="rtl">
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#0073e6" />
                <link rel="icon" href="/images/logo.svg" />
                <link rel="apple-touch-icon" href="/images/logo.svg" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
