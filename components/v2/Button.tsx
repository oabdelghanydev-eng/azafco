import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import { ArrowIcon } from './icons';

/**
 * Button / link-button. No hooks, so it works in server AND client components.
 *
 * - `href` → renders the next-intl <Link> (locale-prefixed). `external` → plain <a>
 *   (tel:, mailto:, https://wa.me…; https links open in a new tab).
 * - no `href` → <button>. `loading` disables it, sets aria-busy, shows a spinner.
 * - `disabled` on a link renders a non-interactive <span aria-disabled>.
 *
 * Variants (all pass WCAG AA on their intended surface):
 *   primary   gold bg + navy text (7.15:1) — the RFQ action. Works on light and navy.
 *   secondary navy bg + white on light; white bg + navy inside navy sections (CSS vars).
 *   outline   1.5px border in current fg colour (navy on light, white on navy).
 *   ghost     transparent, tinted on hover.
 *   text      inline link with arrow, no box.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

type LinkHref = ComponentProps<typeof Link>['href'];

export interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: LinkHref | string;
    /** Treat href as an external/protocol URL (plain <a>) */
    external?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    /** Screen-reader text while loading (default: children stay visible) */
    loadingLabel?: string;
    /** Trailing arrow (flips in RTL). Default on for `text` variant. */
    arrow?: boolean;
    /** Leading icon element */
    icon?: ReactNode;
    fullWidth?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
    className?: string;
    /** Extra attributes for analytics, e.g. { 'data-track': 'rfq_header' } */
    dataAttrs?: Record<`data-${string}`, string>;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

const sizes: Record<ButtonSize, string> = {
    sm: 'min-h-[40px] px-4 text-body-sm',
    md: 'min-h-[44px] px-5 text-body-sm md:text-body',
    lg: 'min-h-[52px] px-7 text-body',
};

const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-gold text-navy hover:bg-gold-400 active:bg-[#E5AA00] shadow-[inset_0_-1px_0_rgba(0,26,68,0.12)]',
    secondary: 'bg-btn2 text-btn2-fg hover:bg-btn2-hover',
    outline: 'border-[1.5px] border-current text-fg hover:bg-tint active:bg-tint-strong',
    ghost: 'text-fg hover:bg-tint active:bg-tint-strong',
    text: 'text-fg underline decoration-gold decoration-2 underline-offset-[6px] hover:decoration-[3px] px-0 min-h-[44px]',
};

const disabledCls = 'pointer-events-none opacity-50 saturate-50';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    external = false,
    type = 'button',
    disabled = false,
    loading = false,
    loadingLabel,
    arrow,
    icon,
    fullWidth = false,
    onClick,
    className,
    dataAttrs,
    ...aria
}: ButtonProps) {
    const showArrow = arrow ?? variant === 'text';
    const cls = cn(
        'group inline-flex select-none items-center justify-center gap-2 font-semibold transition-colors duration-base ease-out',
        'motion-reduce:transition-none',
        variant !== 'text' && 'rounded-control',
        variant === 'text' ? 'text-body' : sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        (disabled || loading) && disabledCls,
        className,
    );

    const inner = (
        <>
            {loading ? <Spinner /> : icon ? <span className="shrink-0">{icon}</span> : null}
            <span>{children}</span>
            {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
            {showArrow && !loading ? (
                <ArrowIcon
                    size={18}
                    className="shrink-0 transition-transform duration-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
                />
            ) : null}
        </>
    );

    if (href !== undefined) {
        if (disabled) {
            return (
                <span aria-disabled="true" className={cls} {...dataAttrs} {...aria}>
                    {inner}
                </span>
            );
        }
        if (external || typeof href === 'string' && /^(https?:|mailto:|tel:)/.test(href)) {
            const url = href as string;
            const newTab = url.startsWith('http');
            return (
                <a
                    href={url}
                    className={cls}
                    onClick={onClick}
                    {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    {...dataAttrs}
                    {...aria}
                >
                    {inner}
                </a>
            );
        }
        return (
            <Link href={href as LinkHref} className={cls} onClick={onClick} {...dataAttrs} {...aria}>
                {inner}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={cls}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            onClick={onClick}
            {...dataAttrs}
            {...aria}
        >
            {inner}
        </button>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}
