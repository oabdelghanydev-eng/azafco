import type { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import { Button } from '@/components/ui/Button';
import { Container, Eyebrow } from '@/components/ui/Layout';
import GeoArcs from './GeoArcs';

export interface HeroAction {
    label: string;
    href: string;
    /** For tel:/mailto:/wa.me links */
    external?: boolean;
}

export interface PageHeroProps {
    /**
     * Design G navy hero in every case (the H1 sits on navy, white type, gold eyebrow rule):
     * `fullbleed`: tall hero, photo behind the text with the G gradient overlay.
     * `split`: the same photo + overlay treatment, a little shorter. With a cut-out image
     * (`image.cutout`, e.g. a whole fish) the cut-out stands on the end side over a navy field.
     * Without `image` both variants render the typographic navy hero (no photo).
     */
    variant?: 'fullbleed' | 'split';
    title: ReactNode;
    eyebrow?: ReactNode;
    intro?: ReactNode;
    /** Omit when no professional photo exists: renders a typographic navy hero instead */
    image?: ImageProps;
    /** Primary (gold) action: page navigation or a page-specific enquiry */
    primaryAction?: HeroAction;
    secondaryAction?: HeroAction;
    /** Slot above the eyebrow, e.g. <Breadcrumbs /> */
    breadcrumbs?: ReactNode;
    /** Custom actions row (e.g. several <Button>s); rendered instead of primary/secondaryAction */
    actions?: ReactNode;
    /** Minimal proof under the actions, e.g. <ProofStrip compact /> */
    proof?: ReactNode;
    /** Mirror the photo in RTL so the subject stays on the end side */
    mirrorImage?: boolean;
    /** CSS object-position for the photo, e.g. 'center 30%' */
    imagePosition?: string;
    /** Hero is usually the LCP: keep true on the first hero of a page */
    priority?: boolean;
    /** `2xl` for a landing-style hero (taller, largest H1), `xl` default */
    size?: 'xl' | '2xl';
    headingId?: string;
    className?: string;
}

/**
 * Slot content written for light surfaces (ink / navy text classes) is mapped to
 * the dark-surface tokens inside the hero, so page code never puts dark text on navy.
 */
const onNavy =
    '[&_.text-ink]:text-fg [&_.text-navy]:text-fg [&_.text-ink-muted]:text-fg-muted [&_.text-ink-subtle]:text-fg-muted';

/** Page hero (design G). The H1 lives here: use one PageHero per page. */
export default function PageHero({
    variant = 'fullbleed',
    title,
    eyebrow,
    intro,
    image,
    primaryAction,
    secondaryAction,
    breadcrumbs,
    actions: actionsSlot,
    proof,
    mirrorImage = false,
    imagePosition = 'center',
    priority = true,
    size = 'xl',
    headingId,
    className,
}: PageHeroProps) {
    // Inner pages share one h1 size (type.h1, 34px -> 62px); '2xl' is the landing size.
    const h1 = cn('v2-heading m-0 font-display', size === '2xl' ? 'text-display-2xl' : 'text-display-page');

    const actions = actionsSlot ? (
        <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">{actionsSlot}</div>
    ) : primaryAction || secondaryAction ? (
            <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                {primaryAction ? (
                    <Button href={primaryAction.href} external={primaryAction.external} size="lg" stretch="phone" arrow>
                        {primaryAction.label}
                    </Button>
                ) : null}
                {secondaryAction ? (
                    <Button href={secondaryAction.href} external={secondaryAction.external} variant="outline" size="lg" stretch="phone">
                        {secondaryAction.label}
                    </Button>
                ) : null}
            </div>
        ) : null;

    const text = (
        <>
            {breadcrumbs ? <div className="mb-6 lg:mb-8">{breadcrumbs}</div> : null}
            {eyebrow ? <Eyebrow className="mb-3.5 lg:mb-5">{eyebrow}</Eyebrow> : null}
            <h1 id={headingId} className={h1}>
                {title}
            </h1>
            {intro ? <div className="mt-4 max-w-[600px] text-body-lg text-fg-muted lg:mt-6">{intro}</div> : null}
            {actions}
            {proof ? <div className="mt-10">{proof}</div> : null}
        </>
    );

    const shell = (extra: string) =>
        cn('relative isolate overflow-hidden bg-navy-900 text-fg', extra, className);

    // ── Typographic hero: navy field, globe arcs as the only decoration ──────────
    if (!image) {
        return (
            <section data-page-hero="" data-surface="dark" className={shell('v2-hero-field')} aria-labelledby={headingId}>
                <GeoArcs
                    tone="onDark"
                    className="absolute -end-48 -top-24 -z-10 w-[440px] opacity-40 sm:-end-32 sm:w-[560px] lg:-end-20 lg:-top-32 lg:w-[720px] lg:opacity-60"
                />
                <Container className={cn('relative', size === '2xl' ? 'py-20 md:py-24 lg:py-32' : 'py-14 md:py-20 lg:py-28')}>
                    <div className={cn('max-w-[760px]', onNavy)}>{text}</div>
                </Container>
            </section>
        );
    }

    // ── Cut-out (e.g. a whole fish on a transparent background): stands on the end side ──
    if (image.cutout) {
        return (
            <section data-page-hero="" data-surface="dark" className={shell('v2-hero-field')} aria-labelledby={headingId}>
                <Container grid className="relative items-center gap-y-6 py-12 md:py-16 lg:gap-y-10 lg:py-24">
                    <div className={cn('col-span-4 sm:col-span-8 lg:col-span-6', onNavy)}>{text}</div>
                    <div className="col-span-4 sm:col-span-8 lg:col-span-6">
                        <div className="relative mx-auto aspect-[16/9] w-full max-w-[640px]">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={priority}
                                sizes="(min-width: 1320px) 610px, (min-width: 1024px) 46vw, (min-width: 640px) 90vw, 100vw"
                                className="object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.4)] rtl:-scale-x-100"
                                style={{ objectPosition: imagePosition }}
                            />
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    // ── Photo hero (fullbleed and split): photo + G gradient overlay ────────────
    const tall = variant === 'fullbleed' || size === '2xl';
    return (
        <section
            data-page-hero=""
            data-surface="dark"
            className={shell(
                cn(
                    'flex items-end lg:items-center',
                    tall ? 'min-h-[600px] md:min-h-[620px] lg:min-h-[680px]' : 'min-h-[520px] md:min-h-[540px] lg:min-h-[560px]',
                ),
            )}
            aria-labelledby={headingId}
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                sizes="100vw"
                className={cn('-z-20 object-cover', mirrorImage && 'rtl:-scale-x-100')}
                style={{ objectPosition: imagePosition }}
            />
            <div aria-hidden="true" className="v2-hero-overlay absolute inset-0 -z-10" />
            <Container className={cn('relative pb-8 lg:pb-20', tall ? 'pt-[200px] lg:pt-24' : 'pt-[180px] lg:pt-20')}>
                <div className={cn('max-w-[760px]', onNavy)}>{text}</div>
            </Container>
        </section>
    );
}
