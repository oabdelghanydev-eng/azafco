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
 * Design G pill buttons (all pass WCAG AA on their intended surface):
 *   primary   gold pill + navy #001B47 text (9.5:1), hover lighter gold. Works on light and navy.
 *   secondary G outline pill (same as `outline`): 1.5px navy border + navy text on light,
 *             filled navy on hover; white/70 border + white text on navy, gold on hover.
 *   outline   as secondary.
 *   ghost     transparent pill, tinted on hover.
 *   text      standalone link: navy (white on navy), bold, trailing arrow, underline on hover.
 * Sizes keep 44px+ tap targets: sm 44px, md 48px, lg 54px (56px from lg, as the G hero).
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
    sm: 'min-h-[44px] px-5 text-body-sm',
    md: 'min-h-[48px] px-7 text-body',
    lg: 'min-h-[54px] px-8 text-body lg:min-h-[56px] lg:px-[34px]',
};

const outlinePill =
    'border-[1.5px] border-solid border-[color:var(--v2-outline-border)] text-[color:var(--v2-outline-fg)] hover:border-[color:var(--v2-outline-hover-border)] hover:bg-[color:var(--v2-outline-hover-bg)] hover:text-[color:var(--v2-outline-hover-fg)]';

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gold text-[#001B47] hover:bg-gold-400 hover:text-[#001B47] active:bg-[#E5AA00]',
    secondary: outlinePill,
    outline: outlinePill,
    ghost: 'text-fg hover:bg-tint active:bg-tint-strong',
    text: 'min-h-[44px] px-0 text-link underline-offset-4 hover:text-link-hover hover:underline',
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
        'v2-btn group inline-flex select-none items-center justify-center gap-2.5 text-center leading-tight transition-colors duration-base ease-out',
        'motion-reduce:transition-none',
        variant !== 'text' && 'rounded-full py-2.5',
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
                    className="shrink-0 transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
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
