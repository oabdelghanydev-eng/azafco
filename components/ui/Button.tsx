import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { Link } from '@/navigation';
import { Icon } from './Icon';
import { ArrowIcon } from './icons';
import { cn, focusRing } from './tokens';

/**
 * Button / link-button. No hooks, so it works in server AND client components.
 *
 * - `href` → next-intl <Link> (locale-prefixed). `external`, or an href starting with
 *   http(s):, mailto: or tel: → plain <a>; http(s) links open in a new tab (pass
 *   `newTabLabel` for the screen-reader hint).
 * - no `href` → <button>. `loading` disables it, sets aria-busy, shows a spinner.
 * - `disabled` on a link renders a non-interactive <span aria-disabled>.
 *
 * Design G pill buttons (all pass WCAG AA on their intended surface):
 *   primary   gold pill + navy-900 text (9.5:1), hover lighter gold. Works on light and navy.
 *   navy      filled navy pill + white text (light surfaces only).
 *   secondary / outline  1.5px outline pill: navy on light (fills navy on hover);
 *             white/70 + white on navy (gold on hover). Follows data-surface.
 *   ghost     transparent pill, tinted on hover.
 *   text      standalone link: navy (white on navy), bold, trailing arrow, underline on hover.
 * Sizes keep 44px+ tap targets: sm 44px, md 48px, lg 54px (56px from lg, as the G hero).
 * `stretch="phone"` makes the button full width below 640px (hero / closing action rows).
 */
export type ButtonVariant = 'primary' | 'navy' | 'secondary' | 'outline' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

type LinkHref = ComponentProps<typeof Link>['href'];

export interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: LinkHref | string;
    /** Treat href as an external/protocol URL (plain <a>) */
    external?: boolean;
    /** Screen-reader hint appended to links that open a new tab, e.g. "(opens in a new tab)" */
    newTabLabel?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    /** Screen-reader text while loading (default: children stay visible) */
    loadingLabel?: string;
    /** Trailing arrow (flips in RTL). Default on for `text` variant. */
    arrow?: boolean;
    /** Leading icon element, e.g. <WhatsAppIcon size={20} /> */
    icon?: ReactNode;
    fullWidth?: boolean;
    /** Full width on phones only (stacked action rows) */
    stretch?: 'phone';
    onClick?: MouseEventHandler<HTMLElement>;
    className?: string;
    /** Extra attributes for analytics, e.g. { 'data-cta': 'processing_whatsapp' } */
    dataAttrs?: Record<`data-${string}`, string>;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

const sizes: Record<ButtonSize, string> = {
    sm: 'min-h-tap px-5 text-body-sm',
    md: 'min-h-[48px] px-7 text-body',
    lg: 'min-h-[54px] px-8 text-body lg:min-h-14 lg:px-[34px]',
};

const outlinePill =
    'border-[1.5px] border-solid border-[color:var(--v2-outline-border)] text-[color:var(--v2-outline-fg)] hover:border-[color:var(--v2-outline-hover-border)] hover:bg-[color:var(--v2-outline-hover-bg)] hover:text-[color:var(--v2-outline-hover-fg)]';

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gold text-navy-900 hover:bg-gold-400 hover:text-navy-900 active:bg-gold-600',
    navy: 'bg-navy text-white hover:bg-navy-900 hover:text-white',
    secondary: outlinePill,
    outline: outlinePill,
    ghost: 'text-fg hover:bg-tint active:bg-tint-strong',
    text: 'min-h-tap px-0 text-link underline-offset-4 hover:text-link-hover hover:underline',
};

const disabledCls = 'pointer-events-none opacity-50 saturate-50';

/** Class string of a button look, for the rare element that cannot be <Button> (e.g. a <summary>). */
export function buttonClass({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    stretch,
    className,
}: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'stretch' | 'className'> = {}) {
    return cn(
        'v2-btn group inline-flex select-none items-center justify-center gap-2.5 text-center leading-tight transition-colors duration-base ease-out motion-reduce:transition-none',
        focusRing,
        variant !== 'text' && 'rounded-full py-2.5',
        variant === 'text' ? 'text-body' : sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        stretch === 'phone' && 'w-full sm:w-auto',
        className,
    );
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    external = false,
    newTabLabel,
    type = 'button',
    disabled = false,
    loading = false,
    loadingLabel,
    arrow,
    icon,
    fullWidth = false,
    stretch,
    onClick,
    className,
    dataAttrs,
    ...aria
}: ButtonProps) {
    const showArrow = arrow ?? variant === 'text';
    const cls = cn(buttonClass({ variant, size, fullWidth, stretch, className }), (disabled || loading) && disabledCls);

    const inner = (
        <>
            {loading ? (
                <Icon icon={LuLoader2} size={16} className="animate-spin motion-reduce:animate-none" />
            ) : icon ? (
                <span className="inline-flex shrink-0">{icon}</span>
            ) : null}
            <span>{children}</span>
            {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
            {showArrow && !loading ? (
                <ArrowIcon
                    size={20}
                    className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
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
        if (external || (typeof href === 'string' && /^(https?:|mailto:|tel:)/.test(href))) {
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
                    {newTab && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
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

/** Alias: a Button with an href. Same component, clearer at the call site. */
export const LinkButton = Button;

export default Button;
