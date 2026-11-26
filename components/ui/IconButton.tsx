import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from '@/navigation';
import { cn, focusRing } from './tokens';

/**
 * Round icon-only control (back to top, close, carousel arrows). Always 44px or
 * more. `label` is required: it is the accessible name (the icon is aria-hidden).
 *
 *   <IconButton label={t('back_to_top')} href="#top" variant="outline"><ArrowUpIcon /></IconButton>
 */
export type IconButtonVariant = 'outline' | 'solid' | 'ghost';

export interface IconButtonProps {
    label: string;
    children: ReactNode;
    variant?: IconButtonVariant;
    /** 44px (default) or 52px */
    size?: 'md' | 'lg';
    /** '#anchor', a locale-less route, or an external URL */
    href?: string;
    external?: boolean;
    type?: 'button' | 'submit';
    onClick?: MouseEventHandler<HTMLElement>;
    className?: string;
    dataAttrs?: Record<`data-${string}`, string>;
}

const look: Record<IconButtonVariant, string> = {
    // Follows the surface: navy outline on light, white/40 outline on navy (gold on hover)
    outline: 'border border-solid border-edge text-fg hover:border-link-hover hover:text-link-hover',
    solid: 'bg-gold text-navy-900 hover:bg-gold-400',
    ghost: 'text-fg hover:bg-tint',
};

export function IconButton({ label, children, variant = 'outline', size = 'md', href, external, type = 'button', onClick, className, dataAttrs }: IconButtonProps) {
    const cls = cn(
        'inline-grid shrink-0 place-items-center rounded-full transition-colors duration-base motion-reduce:transition-none',
        size === 'lg' ? 'h-[52px] w-[52px]' : 'h-tap w-tap',
        look[variant],
        focusRing,
        className,
    );
    if (href !== undefined) {
        if (external || href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href)) {
            const newTab = href.startsWith('http');
            return (
                <a
                    href={href}
                    aria-label={label}
                    className={cls}
                    onClick={onClick}
                    {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    {...dataAttrs}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} aria-label={label} className={cls} onClick={onClick} {...dataAttrs}>
                {children}
            </Link>
        );
    }
    return (
        <button type={type} aria-label={label} className={cls} onClick={onClick} {...dataAttrs}>
            {children}
        </button>
    );
}

export default IconButton;
