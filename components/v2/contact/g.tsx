/**
 * Design G primitives for the inner pages of the contact / requirements /
 * insights / legal / 404 area. They copy the visual language of the G home
 * (components/g/**): navy #001b47 / #002d72, gold #f7b500, off-white #f2f5fa,
 * 1320px container, eyebrow with a gold rule, the G type scale (separate AR and
 * EN line heights) and pill buttons. No hooks: usable in server components.
 */
import type { ElementType, ReactNode } from 'react';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import Breadcrumbs, { type Crumb } from '@/components/v2/Breadcrumbs';

/* ── Tokens ─────────────────────────────────────────────────────────────── */

export const G = {
    navy: '#002d72',
    navyDeep: '#001b47',
    gold: '#f7b500',
    ink: '#0d1f3f',
    muted: '#4a5a75',
    line: '#d5dde9',
    offwhite: '#f2f5fa',
} as const;

export const FOCUS_LIGHT = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]';
export const FOCUS_DARK = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

/** 1320px container with the G side padding */
export const gWrap = 'mx-auto box-border w-full max-w-[1320px] px-5 md:px-8';
/** G section rhythm: 64px phone, 112px desktop */
export const gSectionY = 'py-16 lg:py-28';

/** Body text size + line height (AR needs more leading) */
export const gBody = (ar: boolean) =>
    ar ? 'text-[17px] leading-[1.85] lg:text-[18px]' : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]';

/** Section heading (h2), same scale as the G home sections */
export const gH2 = (ar: boolean) =>
    ar
        ? 'm-0 text-[28px] font-bold leading-[1.4] lg:text-[clamp(32px,3.4vw,46px)] lg:leading-[1.35]'
        : 'm-0 text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,48px)] lg:leading-[1.12]';

/** Card / sub-section heading (h3) */
export const gH3 = (ar: boolean) =>
    ar ? 'm-0 text-[20px] font-bold leading-[1.5] lg:text-[22px]' : 'm-0 text-[20px] font-extrabold leading-[1.3] tracking-[-0.01em] lg:text-[22px]';

/** Small text (captions, meta) */
export const gSmall = (ar: boolean) => (ar ? 'text-[15px] leading-[1.75]' : 'text-[14px] leading-[1.6] lg:text-[15px]');

/** G card: white, hairline border, 4px radius; `accent` adds the gold top rule of the quality cards */
export const gCard = (accent = false) =>
    cn('rounded border border-[#d5dde9] bg-white', accent && 'border-t-4 border-t-[#f7b500]');

/* ── Eyebrow ────────────────────────────────────────────────────────────── */

/** Eyebrow with the gold rule. `dark` = on navy (gold text), otherwise navy text. */
export function GEyebrow({ children, ar, dark = false, as: Tag = 'p', id, className }: { children: ReactNode; ar: boolean; dark?: boolean; as?: ElementType; id?: string; className?: string }) {
    return (
        <Tag
            id={id}
            className={cn(
                'm-0 flex items-center gap-2.5 lg:gap-3',
                dark ? 'text-[#f7b500]' : 'text-[#002d72]',
                ar ? 'text-[15px] font-bold lg:text-[17px]' : 'text-[14px] font-extrabold lg:text-[15px]',
                className,
            )}
        >
            <span aria-hidden="true" className="block h-0.5 w-7 shrink-0 bg-[#f7b500] lg:w-10" />
            <span>{children}</span>
        </Tag>
    );
}

/* ── Buttons (pill, as in the G hero) ───────────────────────────────────── */

export type GButtonVariant = 'gold' | 'navy' | 'outline' | 'outline-light';

const btnVariant: Record<GButtonVariant, string> = {
    gold: 'bg-[#f7b500] text-[#001b47] hover:bg-[#ffc633]',
    navy: 'bg-[#002d72] text-white hover:bg-[#001b47]',
    outline: 'border-[1.5px] border-solid border-[#002d72] text-[#002d72] hover:bg-[#f2f5fa]',
    'outline-light': 'border-[1.5px] border-solid border-white/70 text-white hover:border-[#f7b500] hover:text-[#f7b500]',
};

/**
 * Pill button classes. `dark` = the button sits on a navy band
 * (data-surface="dark"): the focus outline turns gold so it stays visible.
 * 'outline-light' is only used on navy, so it always gets the gold outline.
 */
export const gButton = (variant: GButtonVariant, ar: boolean, className?: string, dark = false) =>
    cn(
        'inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-7 text-center leading-[1.3] transition-colors',
        ar ? 'text-[16px] font-bold' : 'text-[15px] font-extrabold',
        btnVariant[variant],
        dark || variant === 'outline-light' ? FOCUS_DARK : FOCUS_LIGHT,
        className,
    );

/** Arrow that points in the reading direction */
export function GArrow({ ar, className }: { ar: boolean; className?: string }) {
    return (
        <svg className={cn('h-[18px] w-[18px] shrink-0', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d={ar ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
        </svg>
    );
}

interface GLinkButtonProps {
    href: string;
    children: ReactNode;
    ar: boolean;
    variant?: GButtonVariant;
    /** Plain <a> (mailto:, tel:, https://wa.me); https links open in a new tab */
    external?: boolean;
    /** Screen-reader text for links that open a new tab */
    newTabLabel?: string;
    arrow?: boolean;
    icon?: ReactNode;
    /** On a navy band: gold focus outline */
    dark?: boolean;
    className?: string;
    dataAttrs?: Record<`data-${string}`, string>;
}

export function GLinkButton({ href, children, ar, variant = 'gold', external = false, newTabLabel, arrow = false, icon, dark = false, className, dataAttrs }: GLinkButtonProps) {
    const cls = gButton(variant, ar, className, dark);
    const inner = (
        <>
            {icon}
            <span>{children}</span>
            {arrow ? <GArrow ar={ar} /> : null}
        </>
    );
    if (external) {
        const newTab = href.startsWith('http');
        return (
            <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...dataAttrs}>
                {inner}
                {newTab && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
            </a>
        );
    }
    return (
        <Link href={href} className={cls} {...dataAttrs}>
            {inner}
        </Link>
    );
}

/* ── Page head (navy band) ──────────────────────────────────────────────── */

interface GPageHeadProps {
    ar: boolean;
    /** Breadcrumb items after Home */
    crumbs?: Crumb[];
    eyebrow: ReactNode;
    title: ReactNode;
    titleId: string;
    intro?: ReactNode;
    /** Extra content under the intro (buttons, meta) */
    children?: ReactNode;
}

/**
 * Inner-page opening: navy band (#001b47) like the G footer and markets
 * section, gold-rule eyebrow, white h1 on the G hero scale (one step smaller).
 */
export function GPageHead({ ar, crumbs, eyebrow, title, titleId, intro, children }: GPageHeadProps) {
    return (
        <section data-surface="dark" aria-labelledby={titleId} className="g-font relative overflow-hidden bg-[#001b47] text-white">
            <span aria-hidden="true" className="pointer-events-none absolute -end-40 -top-40 hidden h-[520px] w-[520px] rounded-full border border-white/[.08] lg:block" />
            <span aria-hidden="true" className="pointer-events-none absolute -end-20 -top-20 hidden h-[360px] w-[360px] rounded-full border border-[#f7b500]/20 lg:block" />
            <div className={cn(gWrap, 'relative pb-14 pt-8 lg:pb-24 lg:pt-12')}>
                {crumbs ? <Breadcrumbs items={crumbs} className={ar ? 'text-[14px]' : 'text-[13px]'} /> : null}
                <GEyebrow ar={ar} dark className="mt-10 lg:mt-14">
                    {eyebrow}
                </GEyebrow>
                <h1
                    id={titleId}
                    className={cn(
                        'mb-0 mt-3 max-w-[900px] text-white lg:mt-4',
                        ar
                            ? 'text-[32px] font-bold leading-[1.4] lg:text-[clamp(38px,4vw,58px)] lg:leading-[1.32]'
                            : 'text-[34px] font-extrabold leading-[1.12] tracking-[-0.02em] lg:text-[clamp(40px,4.4vw,62px)] lg:leading-[1.08]',
                    )}
                >
                    {title}
                </h1>
                {intro ? (
                    <p className={cn('mb-0 mt-4 max-w-[680px] text-white/[.82] lg:mt-6', ar ? 'text-[18px] leading-[1.8] lg:text-[20px]' : 'text-[17px] leading-[1.6] lg:text-[19px]')}>
                        {intro}
                    </p>
                ) : null}
                {children}
            </div>
        </section>
    );
}

/* ── Section header ─────────────────────────────────────────────────────── */

export function GSectionHead({ ar, eyebrow, title, id, intro, className }: { ar: boolean; eyebrow?: ReactNode; title: ReactNode; id: string; intro?: ReactNode; className?: string }) {
    return (
        <div className={cn('mb-8 lg:mb-12 lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-16 lg:gap-y-4', className)}>
            <div className="min-w-0 max-w-[760px]">
                {eyebrow ? (
                    <GEyebrow ar={ar} className="mb-2 lg:mb-3">
                        {eyebrow}
                    </GEyebrow>
                ) : null}
                <h2 id={id} className={cn(gH2(ar), 'text-[#0d1f3f]')}>
                    {title}
                </h2>
            </div>
            {intro ? <p className={cn('mb-0 mt-3.5 text-[#4a5a75] lg:m-0 lg:max-w-[460px]')}>{intro}</p> : null}
        </div>
    );
}

/** "+20 100 773 6419" from the config number (201007736419), same format as the G footer */
export function phoneDisplay(n: string): string {
    const d = n.replace(/\D/g, '');
    return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
}
