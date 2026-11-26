import type { ReactNode } from 'react';
import { Link } from '@/navigation';
import { ArrowIcon, ExternalIcon } from './icons';
import { cn, focusRing } from './tokens';

/**
 * Standalone text links in the G about-section style ("Our value chain →").
 * Colour follows the surface: navy on light, white on navy (gold on hover).
 * 44px tall hit area. For inline links inside running text use a plain <a>/<Link>
 * with `underline`.
 */
const linkBase =
    'group inline-flex min-h-tap items-center gap-2.5 py-2 v2-btn text-link underline-offset-4 transition-colors hover:text-link-hover hover:underline';

export interface TextLinkProps {
    /** Locale-less route ('/quality'), '#anchor', or mailto:/tel: */
    href: string;
    children: ReactNode;
    /** Trailing arrow (default true), mirrored in RTL */
    arrow?: boolean;
    className?: string;
    dataAttrs?: Record<`data-${string}`, string>;
}

export function TextLink({ href, children, arrow = true, className, dataAttrs }: TextLinkProps) {
    const cls = cn(linkBase, focusRing, className);
    const inner = (
        <>
            <span>{children}</span>
            {arrow ? (
                <ArrowIcon
                    size={20}
                    className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                />
            ) : null}
        </>
    );
    if (href.startsWith('#') || /^(mailto:|tel:)/.test(href)) {
        return (
            <a href={href} className={cls} {...dataAttrs}>
                {inner}
            </a>
        );
    }
    return (
        <Link href={href} className={cls} {...dataAttrs}>
            {inner}
        </Link>
    );
}

export interface ExternalLinkProps {
    href: string;
    children: ReactNode;
    /** Screen-reader hint, e.g. "(opens in a new tab)", from the page's locale JSON */
    newTabLabel: string;
    className?: string;
    dataAttrs?: Record<`data-${string}`, string>;
}

/** External link: opens in a new tab, visible ↗ (mirrored in RTL) + screen-reader hint. */
export function ExternalLink({ href, children, newTabLabel, className, dataAttrs }: ExternalLinkProps) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn(linkBase, focusRing, className)} {...dataAttrs}>
            <span>{children}</span>
            <span className="sr-only"> {newTabLabel}</span>
            <ExternalIcon size={20} />
        </a>
    );
}
