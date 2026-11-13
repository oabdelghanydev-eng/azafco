import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';

/**
 * Design G building blocks for the inner pages /processing and /quality.
 * They copy the visual language of the G home (components/g/home/*): navy #001b47 /
 * #002d72, gold #f7b500, off-white #f2f5fa, 1320px container, 112px section padding
 * on desktop, the AR/EN type scale, gold-rule eyebrows and pill buttons.
 * No copy lives here: every string comes from the page's locale JSON.
 */

export const G_FOCUS =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002d72]';
const FOCUS_ON_DARK =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

/** Type scale of the G home, per script (Arabic needs looser leading). */
export function gType(ar: boolean) {
    return {
        base: ar ? 'text-[17px] leading-[1.85] lg:text-[18px]' : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]',
        h1: ar
            ? 'text-[32px] font-bold leading-[1.4] lg:text-[clamp(38px,4.2vw,60px)] lg:leading-[1.3]'
            : 'text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] lg:text-[clamp(38px,4.4vw,64px)] lg:leading-[1.06]',
        h2: ar
            ? 'text-[28px] font-bold leading-[1.4] lg:text-[clamp(32px,3.4vw,50px)] lg:leading-[1.35]'
            : 'text-[29px] font-extrabold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[1.12]',
        h3: ar
            ? 'text-[19px] font-bold leading-[1.5] lg:text-[22px] lg:leading-[1.4]'
            : 'text-[19px] font-extrabold leading-[1.25] lg:text-[21px] lg:leading-[1.35]',
        stage: ar ? 'text-[14px] font-bold' : 'text-[14px] font-extrabold',
        small: ar ? 'text-[15px] leading-[1.7] lg:text-[16px]' : 'text-[15px] leading-[1.55]',
    };
}

/* ── Eyebrow: gold rule + label (navy on light, gold on navy) ───────────────── */
export function GEyebrow({ ar, children, onDark = false, center = false }: { ar: boolean; children: ReactNode; onDark?: boolean; center?: boolean }) {
    return (
        <p
            className={`m-0 flex items-center gap-2.5 lg:gap-3.5 ${center ? 'lg:justify-center' : ''} ${onDark ? 'text-[#f7b500]' : 'text-[#002d72]'} ${
                ar ? 'mb-2 text-[15px] font-bold lg:mb-3 lg:text-[17px]' : 'mb-2.5 text-[14px] font-extrabold lg:mb-3.5 lg:text-[15px]'
            }`}
        >
            <span aria-hidden="true" className="block h-[2px] w-7 shrink-0 bg-[#f7b500] lg:w-11" />
            {children}
        </p>
    );
}

/* ── Buttons: G pill buttons, 54px tall (44px+ tap target) ──────────────────── */
export type GButtonVariant = 'gold' | 'navy' | 'outline' | 'outlineLight';

export function GButton({
    href,
    variant = 'gold',
    ar,
    cta,
    children,
}: {
    /** Locale-less route ('/contact') or an absolute/mailto link */
    href: string;
    variant?: GButtonVariant;
    ar: boolean;
    /** data-cta value for lead tracking, e.g. 'processing_whatsapp' */
    cta?: string;
    children: ReactNode;
}) {
    const look: Record<GButtonVariant, string> = {
        gold: `bg-[#f7b500] text-[#001b47] hover:bg-[#ffc633] hover:text-[#001b47] ${FOCUS_ON_DARK}`,
        navy: `bg-[#002d72] text-white hover:bg-[#001b47] hover:text-white ${G_FOCUS}`,
        outline: `border-[1.5px] border-solid border-[#002d72] text-[#002d72] hover:bg-[#002d72] hover:text-white ${G_FOCUS}`,
        outlineLight: `border-[1.5px] border-solid border-white/70 text-white hover:border-[#f7b500] hover:text-[#f7b500] ${FOCUS_ON_DARK}`,
    };
    const cls = `flex h-[54px] items-center justify-center rounded-full px-8 text-center transition-colors sm:inline-flex lg:h-14 lg:px-[34px] ${
        ar ? 'font-bold' : 'font-extrabold'
    } ${look[variant]}`;
    if (href.startsWith('/')) {
        return (
            <Link href={href} data-cta={cta} className={cls}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} data-cta={cta} className={cls}>
            {children}
        </a>
    );
}

/** Arrow text link in the G about-section style ("Our value chain →"). */
export function GTextLink({ href, ar, children, onDark = false }: { href: string; ar: boolean; children: ReactNode; onDark?: boolean }) {
    return (
        <Link
            href={href}
            className={`group inline-flex min-h-11 items-center gap-2.5 py-2 underline-offset-4 hover:underline ${
                onDark ? `text-[#f7b500] ${FOCUS_ON_DARK}` : `text-[#002d72] ${G_FOCUS}`
            } ${ar ? 'font-bold' : 'font-extrabold'}`}
        >
            {children}
            <span
                aria-hidden="true"
                className={`inline-block motion-safe:transition-transform ${ar ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            >
                {ar ? '←' : '→'}
            </span>
        </Link>
    );
}

/**
 * External text link in the GTextLink style. Opens in a new tab, so it carries a
 * visible ↗ and a screen-reader hint (`newTabHint`, from the page's locale JSON).
 */
export function GExternalLink({
    href,
    ar,
    newTabHint,
    cta,
    children,
}: {
    href: string;
    ar: boolean;
    newTabHint: string;
    cta?: string;
    children: ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-cta={cta}
            className={`group inline-flex min-h-11 items-center gap-2.5 py-2 text-[#002d72] underline-offset-4 hover:underline ${G_FOCUS} ${ar ? 'font-bold' : 'font-extrabold'}`}
        >
            {children}
            <span className="sr-only"> {newTabHint}</span>
            <span aria-hidden="true" className={`inline-block ${ar ? '-scale-x-100' : ''}`}>
                ↗
            </span>
        </a>
    );
}

/* ── Section shell: surface + 1320px container + G rhythm ───────────────────── */
export function GSection({
    tone = 'white',
    labelledBy,
    id,
    children,
}: {
    tone?: 'white' | 'offwhite' | 'navy';
    labelledBy: string;
    id?: string;
    children: ReactNode;
}) {
    const surface = tone === 'navy' ? 'bg-[#001b47] text-white' : tone === 'offwhite' ? 'bg-[#f2f5fa] text-[#0d1f3f]' : 'bg-white text-[#0d1f3f]';
    return (
        <section id={id} aria-labelledby={labelledBy} className={`scroll-mt-24 ${surface}`}>
            <div className="mx-auto box-border max-w-[1320px] px-5 py-16 lg:px-8 lg:py-28">{children}</div>
        </section>
    );
}

/** Eyebrow + h2 + intro, start-aligned (or centred from lg). */
export function GSectionHead({
    ar,
    id,
    eyebrow,
    title,
    intro,
    onDark = false,
    center = false,
}: {
    ar: boolean;
    id: string;
    eyebrow: ReactNode;
    title: ReactNode;
    intro?: ReactNode;
    onDark?: boolean;
    center?: boolean;
}) {
    const ty = gType(ar);
    return (
        <div className={`mb-10 lg:mb-14 ${center ? 'lg:mx-auto lg:max-w-[760px] lg:text-center' : 'max-w-[760px]'}`}>
            <GEyebrow ar={ar} onDark={onDark} center={center}>
                {eyebrow}
            </GEyebrow>
            <h2 id={id} className={`m-0 ${ty.h2}`}>
                {title}
            </h2>
            {intro ? <p className={`mb-0 ${ar ? 'mt-3.5 lg:mt-[18px]' : 'mt-4 lg:mt-5'} ${onDark ? 'text-white/[.86]' : 'text-[#4a5a75]'}`}>{intro}</p> : null}
        </div>
    );
}

/* ── Page hero: navy field, photo on the end side, gold-rule kicker, one h1 ──── */
export interface GCrumb {
    label: string;
    href?: string;
}

export function GPageHero({
    ar,
    image,
    imageAlt,
    crumbsLabel,
    crumbs,
    kicker,
    title,
    intro,
    actions,
}: {
    ar: boolean;
    image: string;
    imageAlt: string;
    crumbsLabel: string;
    crumbs: GCrumb[];
    kicker: ReactNode;
    title: ReactNode;
    intro: ReactNode;
    actions?: ReactNode;
}) {
    const ty = gType(ar);
    return (
        <section aria-labelledby="g-page-title" className={`relative isolate overflow-hidden bg-[#001b47] text-white ${ty.base}`}>
            <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
                className={`-z-20 object-cover object-center ${ar ? '-scale-x-100' : ''}`}
            />
            {/* Scrim: solid navy behind the text, fading towards the photo (mirrored in RTL) */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#001b47] via-[#001b47]/90 to-[#001b47]/40 lg:bg-gradient-to-r lg:from-[#001b47] lg:via-[#001b47]/85 lg:to-[#001b47]/10 rtl:lg:bg-gradient-to-l"
            />
            <div className="mx-auto box-border flex min-h-[560px] max-w-[1320px] flex-col justify-end px-5 pb-12 pt-28 lg:min-h-[600px] lg:justify-center lg:px-8 lg:py-24">
                <nav aria-label={crumbsLabel} className="mb-6 lg:mb-8">
                    <ol className={`m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-white/80 ${ty.small}`}>
                        {crumbs.map((c, i) => {
                            const last = i === crumbs.length - 1;
                            return (
                                <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                                    {c.href && !last ? (
                                        <Link href={c.href} className={`inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline ${FOCUS_ON_DARK}`}>
                                            {c.label}
                                        </Link>
                                    ) : (
                                        <span aria-current={last ? 'page' : undefined} className={last ? 'font-semibold text-white' : undefined}>
                                            {c.label}
                                        </span>
                                    )}
                                    {!last ? (
                                        <span aria-hidden="true" className="text-[#f7b500]">
                                            {ar ? '‹' : '›'}
                                        </span>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
                <div className="md:max-w-[640px] lg:max-w-[720px]">
                    <GEyebrow ar={ar} onDark>
                        {kicker}
                    </GEyebrow>
                    <h1 id="g-page-title" className={`m-0 ${ty.h1}`}>
                        {title}
                    </h1>
                    <p
                        className={
                            ar
                                ? 'mb-0 mt-3.5 text-[18px] leading-[1.75] text-white/90 lg:mt-[22px] lg:max-w-[600px] lg:text-[20px] lg:leading-[1.85]'
                                : 'mb-0 mt-4 text-[17px] text-white/90 lg:mt-6 lg:max-w-[580px] lg:text-[19px]'
                        }
                    >
                        {intro}
                    </p>
                    {actions ? <div className={`grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 ${ar ? 'mt-[26px]' : 'mt-7'} lg:mt-10`}>{actions}</div> : null}
                </div>
            </div>
        </section>
    );
}

/* ── Closing call to action: text, then the actions row (partnership, form, WhatsApp, email) ─ */
export function GClosing({
    ar,
    id,
    eyebrow,
    title,
    text,
    actions,
}: {
    ar: boolean;
    id: string;
    eyebrow: ReactNode;
    title: ReactNode;
    text: ReactNode;
    actions: ReactNode;
}) {
    const ty = gType(ar);
    return (
        <GSection tone="offwhite" labelledBy={id}>
            <div className="rounded border border-t-4 border-[#d5dde9] border-t-[#f7b500] bg-white px-5 py-8 lg:px-12 lg:py-14">
                <div className="max-w-[760px]">
                    <GEyebrow ar={ar}>{eyebrow}</GEyebrow>
                    <h2 id={id} className={`m-0 ${ty.h2}`}>
                        {title}
                    </h2>
                    <p className={`mb-0 text-[#4a5a75] ${ar ? 'mt-3.5' : 'mt-4'}`}>{text}</p>
                </div>
                <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">{actions}</div>
            </div>
        </GSection>
    );
}
