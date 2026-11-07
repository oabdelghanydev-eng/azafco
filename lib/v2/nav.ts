import { routes } from './routes';

/**
 * Global navigation model shared by SiteHeader and SiteFooter.
 * `labelKey` is a key inside the `v2.nav` namespace (locales/<l>/pages/v2-common.json).
 */
export interface NavLink {
    labelKey: string;
    href: string;
}

export interface NavGroup {
    labelKey: string;
    /** Single link (no dropdown) when there are no children */
    href?: string;
    children?: NavLink[];
}

export const mainNav: NavGroup[] = [
    {
        labelKey: 'seafood',
        children: [
            { labelKey: 'seafood_overview', href: routes.seafood },
            { labelKey: 'products', href: routes.products },
            { labelKey: 'processing', href: routes.processing },
            { labelKey: 'quality', href: routes.quality },
        ],
    },
    {
        labelKey: 'export',
        children: [
            { labelKey: 'markets', href: routes.markets },
            { labelKey: 'for_importers', href: routes.forImporters },
        ],
    },
    {
        labelKey: 'company',
        children: [
            { labelKey: 'about', href: routes.about },
            { labelKey: 'businesses', href: routes.businesses },
        ],
    },
    { labelKey: 'insights', href: routes.insights },
];
