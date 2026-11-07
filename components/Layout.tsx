import React from 'react';

/**
 * Legacy page wrapper, kept so existing (not yet rebuilt) pages compile unchanged.
 *
 * Site v2: the global shell (skip link, SiteHeader, <main id="main-content">,
 * SiteFooter, MobileQuoteBar) now lives in app/[locale]/layout.tsx, so every
 * route gets the new header/footer. This component only passes children through.
 * New v2 pages should NOT wrap themselves in <Layout>.
 *
 * Removed from here (now in the v2 shell): old header/nav, old footer, WhatsApp
 * float (→ MobileQuoteBar), BackToTop.
 */
interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => <>{children}</>;

export default Layout;
