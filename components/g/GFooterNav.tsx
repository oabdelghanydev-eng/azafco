'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { isActivePath, routes } from '@/lib/v2/routes';

export const G_NAV_KEYS = ['about', 'fish', 'chain', 'quality', 'markets'] as const;
export type GNavKey = (typeof G_NAV_KEYS)[number] | 'contact';

/** Real route behind each board anchor (inner pages link here). */
const ROUTE: Record<GNavKey, string> = {
    about: routes.about,
    fish: routes.products,
    chain: routes.processing,
    quality: routes.quality,
    markets: routes.markets,
    contact: routes.contact,
};

export interface GNavItem {
    key: GNavKey;
    /** On home: in-page '#anchor'; elsewhere: the locale-less route for the next-intl Link */
    href: string;
    /** true on home (plain <a href="#...">), false elsewhere (next-intl Link) */
    anchor: boolean;
    current: boolean;
}

/**
 * Design G nav (lead decision): on the home page the items keep the board
 * anchors (#about #fish #chain #quality #markets #contact); on every other page
 * they link to the real routes, with aria-current="page" on the matching one.
 */
export function useGNav(withContact: boolean): GNavItem[] {
    const pathname = usePathname();
    const home = pathname === '/' || pathname === '';
    const keys: GNavKey[] = withContact ? [...G_NAV_KEYS, 'contact'] : [...G_NAV_KEYS];
    return keys.map((key) =>
        home
            ? { key, href: `#${key}`, anchor: true, current: false }
            : { key, href: ROUTE[key], anchor: false, current: isActivePath(pathname, ROUTE[key]) },
    );
}

/** Renders one nav item as an in-page anchor (home) or a localized route link. */
export function GNavLink({
    item,
    className,
    onClick,
    children,
}: {
    item: GNavItem;
    className: string;
    onClick?: () => void;
    children: React.ReactNode;
}) {
    if (item.anchor) {
        return (
            <a href={item.href} onClick={onClick} className={className}>
                {children}
            </a>
        );
    }
    return (
        <Link href={item.href} onClick={onClick} aria-current={item.current ? 'page' : undefined} className={className}>
            {children}
        </Link>
    );
}

/** Footer site links (client: needs the pathname to pick anchors vs routes). */
export default function GFooterNav({ label, className, linkClassName }: { label: string; className: string; linkClassName: string }) {
    const tNav = useTranslations('g_header_v2');
    const items = useGNav(false);
    return (
        <nav aria-label={label} className={className}>
            {items.map((item) => (
                <GNavLink key={item.key} item={item} className={linkClassName}>
                    {tNav(`nav.${item.key}`)}
                </GNavLink>
            ))}
        </nav>
    );
}
