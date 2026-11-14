'use client';

import { Link, usePathname } from '@/navigation';
import { isActivePath } from '@/lib/v2/routes';
import { G_NAV_KEYS, G_NAV_KEYS_WITH_CONTACT, G_NAV_ROUTE, type GNavKey } from './nav';

export type { GNavKey } from './nav';

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
    const keys = withContact ? G_NAV_KEYS_WITH_CONTACT : G_NAV_KEYS;
    return keys.map((key) =>
        home
            ? { key, href: `#${key}`, anchor: true, current: false }
            : { key, href: G_NAV_ROUTE[key], anchor: false, current: isActivePath(pathname, G_NAV_ROUTE[key]) },
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

/**
 * Footer site links (client: needs the pathname to pick anchors vs routes).
 * Labels come from the server footer as props (no client messages).
 */
export default function GFooterNav({
    label,
    labels,
    className,
    linkClassName,
}: {
    label: string;
    labels: Partial<Record<GNavKey, string>>;
    className: string;
    linkClassName: string;
}) {
    const items = useGNav(false);
    return (
        <nav aria-label={label} className={className}>
            {items.map((item) => (
                <GNavLink key={item.key} item={item} className={linkClassName}>
                    {labels[item.key]}
                </GNavLink>
            ))}
        </nav>
    );
}
