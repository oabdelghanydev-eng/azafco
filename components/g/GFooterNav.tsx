'use client';

import { Link, usePathname } from '@/navigation';
import { isActivePath } from '@/lib/v2/routes';
import { G_NAV_KEYS, G_NAV_KEYS_WITH_CONTACT, G_NAV_ROUTE, type GNavKey } from './nav';

export type { GNavKey } from './nav';

export interface GNavItem {
    key: GNavKey;
    /** Locale-less route for the next-intl Link */
    href: string;
    /** Kept for the GNavLink API; always false now (every item is a route) */
    anchor: boolean;
    current: boolean;
}

/**
 * Design G nav: every item links to its own page (a multi-page site, not a
 * one-pager), with aria-current="page" on the matching route. Home sections
 * keep their ids for the hero buttons and in-page links only.
 */
export function useGNav(withContact: boolean): GNavItem[] {
    const pathname = usePathname();
    const keys = withContact ? G_NAV_KEYS_WITH_CONTACT : G_NAV_KEYS;
    return keys.map((key) => ({ key, href: G_NAV_ROUTE[key], anchor: false, current: isActivePath(pathname, G_NAV_ROUTE[key]) }));
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
