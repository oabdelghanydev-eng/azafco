'use client';

import type { ReactNode } from 'react';
import { Link, usePathname } from '@/navigation';
import { rfqHref } from '@/lib/v2/routes';

/** Valid detail slugs, built on the server (GFooter) so the data files stay out of the client bundle. */
export interface RfqContext {
    /** Published product slugs (/products/<slug>) */
    products: readonly string[];
    /** Active market slug -> ISO country code (/markets/<slug>) */
    markets: Readonly<Record<string, string>>;
}

/**
 * Same prefill as the page hero: /products/<slug> -> ?product=<slug>&type=product,
 * /markets/<slug> -> ?country=<code>&type=market; every other page -> /requirements.
 */
export function contextRfqHref(pathname: string, ctx: RfqContext): string {
    const m = /^\/(products|markets)\/([^/]+)\/?$/.exec(pathname);
    if (m) {
        const slug = m[2];
        if (m[1] === 'products' && ctx.products.includes(slug)) return rfqHref({ product: slug, type: 'product' });
        const code = m[1] === 'markets' ? ctx.markets[slug] : undefined;
        if (code) return rfqHref({ country: code, type: 'market' });
    }
    return rfqHref();
}

/**
 * Footer "Send your requirements" link that keeps the page's context (ROUND-ASTRA 3.1).
 * usePathname only (no search params), so static pages stay static.
 */
export default function GFooterRfqLink({
    context,
    className,
    cta,
    children,
}: {
    context: RfqContext;
    className: string;
    cta: string;
    children: ReactNode;
}) {
    const pathname = usePathname();
    return (
        <Link href={contextRfqHref(pathname, context)} data-cta={cta} className={className}>
            {children}
        </Link>
    );
}
