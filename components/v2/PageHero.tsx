import type { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import Button from './Button';
import { Container, Eyebrow } from './Layout';
import GeoArcs from './GeoArcs';

export interface HeroAction {
    label: string;
    href: string;
    /** For tel:/mailto:/wa.me links */
    external?: boolean;
}

export interface PageHeroProps {
    /**
     * `fullbleed`: cinematic photo behind the text, navy scrim, white type.
     * `split`: editorial headline on the start side, real facility photo on the end side.
     * Without `image` both variants render the typographic navy hero (GeoArcs, no photo).
     */
    variant?: 'fullbleed' | 'split';
    title: ReactNode;
    eyebrow?: ReactNode;
    intro?: ReactNode;
    /** Omit when no professional photo exists: renders a typographic navy hero instead */
    image?: ImageProps;
    /** Primary (gold) action: page navigation or a page-specific enquiry; no generic "Request a quote" */
    primaryAction?: HeroAction;
    secondaryAction?: HeroAction;
    /** Slot above the eyebrow, e.g. <Breadcrumbs /> */
    breadcrumbs?: ReactNode;
    /** Minimal proof under the actions, e.g. <ProofStrip compact /> */
    proof?: ReactNode;
    /** CSS object-position for the photo, e.g. 'center 30%' */
    imagePosition?: string;
    /** Hero is usually the LCP: keep true on the first hero of a page */
    priority?: boolean;
    /** `display-2xl` for the home page, `display-xl` default */
    size?: 'xl' | '2xl';
    headingId?: string;
    className?: string;
}

/** Page hero. The H1 lives here: use one PageHero per page. */
export default function PageHero({
    variant = 'fullbleed',
    title,
    eyebrow,
    intro,
    image,
    primaryAction,
    secondaryAction,
    breadcrumbs,
    proof,
    imagePosition = 'center',
    priority = true,
    size = 'xl',
    headingId,
    className,
}: PageHeroProps) {
    const h1 = cn('v2-heading font-display', size === '2xl' ? 'text-display-2xl' : 'text-display-xl');
    const actions =
        primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-wrap gap-3">
                {primaryAction ? (
                    <Button href={primaryAction.href} external={primaryAction.external} size="lg" arrow>
                        {primaryAction.label}
                    </Button>
                ) : null}
                {secondaryAction ? (
                    <Button href={secondaryAction.href} external={secondaryAction.external} variant="outline" size="lg">
                        {secondaryAction.label}
                    </Button>
                ) : null}
            </div>
        ) : null;

    if (!image) {
        // Typographic hero: no photo, navy field, globe arcs as the only decoration.
        return (
            <section
                data-surface="dark"
                className={cn('relative isolate overflow-hidden bg-navy-950 text-fg', className)}
                aria-labelledby={headingId}
            >
                <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-950 rtl:bg-gradient-to-bl" />
                <GeoArcs
                    tone="onDark"
                    className="absolute -end-48 -top-24 -z-10 w-[440px] opacity-60 sm:-end-32 sm:w-[560px] lg:-end-20 lg:-top-32 lg:w-[720px] lg:opacity-90"
                />
                <Container className={cn('relative', size === '2xl' ? 'py-20 md:py-28 lg:py-36' : 'py-16 md:py-20 lg:py-28')}>
                    <div className="max-w-3xl">
                        {breadcrumbs ? <div className="mb-8">{breadcrumbs}</div> : null}
                        {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
                        <h1 id={headingId} className={h1}>
                            {title}
                        </h1>
                        {intro ? <div className="mt-6 max-w-prose-v2 text-body-lg text-fg-muted">{intro}</div> : null}
                        {actions}
                        {proof ? <div className="mt-10">{proof}</div> : null}
                    </div>
                </Container>
            </section>
        );
    }

    if (variant === 'split') {
        return (
            <section data-surface="light" className={cn('relative overflow-hidden bg-white text-fg', className)} aria-labelledby={headingId}>
                <GeoArcs className="absolute -start-40 -top-40 hidden w-[520px] lg:block" />
                <Container grid className="relative items-center gap-y-10 py-12 md:py-16 lg:py-20">
                    <div className="col-span-4 sm:col-span-8 lg:col-span-6">
                        {breadcrumbs ? <div className="mb-8">{breadcrumbs}</div> : null}
                        {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
                        <h1 id={headingId} className={h1}>
                            {title}
                        </h1>
                        {intro ? <div className="mt-6 max-w-prose-v2 text-body-lg text-fg-muted">{intro}</div> : null}
                        {actions}
                        {proof ? <div className="mt-10">{proof}</div> : null}
                    </div>
                    <div className="col-span-4 sm:col-span-8 lg:col-span-6">
                        <div className={cn('relative aspect-[4/3] overflow-hidden rounded-card bg-surface-mist', image.cutout ? 'bg-gradient-to-b from-surface-mist to-white' : 'lg:aspect-[4/5]')}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={priority}
                                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                                className={image.cutout ? 'object-contain p-[2%] drop-shadow-[0_10px_14px_rgba(0,45,114,0.14)]' : 'object-cover'}
                                style={{ objectPosition: imagePosition }}
                            />
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section
            data-surface="dark"
            className={cn('relative isolate flex min-h-[560px] items-end overflow-hidden bg-navy-950 text-fg md:min-h-[640px] lg:min-h-[78vh]', className)}
            aria-labelledby={headingId}
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                sizes="100vw"
                className="-z-20 object-cover"
                style={{ objectPosition: imagePosition }}
            />
            {/* Scrim: strongest behind the text (start side + bottom) for AA contrast on any photo */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/60 to-navy-950/20 lg:bg-gradient-to-r lg:from-navy-950/95 lg:via-navy-950/70 lg:to-navy-950/10 rtl:lg:bg-gradient-to-l"
            />
            <GeoArcs tone="onDark" className="absolute -end-32 -top-32 -z-10 hidden w-[620px] opacity-70 lg:block" />
            <Container className="relative pb-12 pt-28 md:pb-16 lg:pb-20">
                <div className="max-w-3xl">
                    {breadcrumbs ? <div className="mb-8">{breadcrumbs}</div> : null}
                    {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
                    <h1 id={headingId} className={h1}>
                        {title}
                    </h1>
                    {intro ? <div className="mt-6 max-w-prose-v2 text-body-lg text-fg-muted">{intro}</div> : null}
                    {actions}
                    {proof ? <div className="mt-10">{proof}</div> : null}
                </div>
            </Container>
        </section>
    );
}
