'use client';

import { routes } from '@/lib/v2/routes';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Layout';
import { cn, containerClass, focusRing, typography } from '@/components/ui/tokens';

export interface GHeroSlide {
    label: string;
    kicker: string;
    title: string;
    text: string;
    alt: string;
    img: string;
    /** object-position classes (phone / lg) */
    pos: string;
}

interface Props {
    slides: GHeroSlide[];
    groupLabel: string;
    ctaPartner: string;
    ctaFish: string;
}

/**
 * Navy overlay over the photo: vertical on phones (text sits low), dark on the
 * reading-start side from lg up (mirrored in RTL). Tokens only (navy-900).
 */
const overlay = cn(
    'absolute inset-0',
    'bg-gradient-to-b from-navy-900/50 from-0% via-navy-900/[.62] via-40% to-navy-900/95 to-80%',
    'lg:bg-gradient-to-r lg:from-navy-900/[.92] lg:via-navy-900/70 lg:to-navy-900/[.12] lg:to-80%',
    'rtl:lg:bg-gradient-to-l',
);

/** Bottom scrim under the tab row (lg+ only; on phones the vertical overlay already ends at navy/95). */
const tabScrim = 'absolute inset-x-0 bottom-0 hidden h-60 bg-gradient-to-t from-navy-900/90 via-navy-900/60 via-45% to-transparent lg:block';

/**
 * Hero of design G: four slides switched only by the user (no autoplay, as on the board).
 * Only the active slide's text is rendered, so the page keeps exactly one h1.
 * Sits inside the hero <section data-surface="dark">, so the eyebrow, the outline
 * button and the focus ring take their on-navy colours from the surface tokens.
 */
export default function GHeroSlides({ slides, groupLabel, ctaPartner, ctaFish }: Props) {
    const [active, setActive] = useState(0);
    // Slide images are mounted only once a slide is wanted (picked, or its tab hovered/focused),
    // so slides 2-4 never download unless the visitor asks for them and never compete with the LCP image.
    const [wanted, setWanted] = useState<ReadonlySet<number>>(() => new Set([0]));

    const want = (k: number) =>
        setWanted((prev) => {
            if (prev.has(k)) return prev;
            const next = new Set(prev);
            next.add(k);
            return next;
        });

    const pick = (k: number) => {
        want(k);
        setActive(k);
    };

    const slide = slides[active];
    if (!slide) return null;

    return (
        <>
            {slides.map((s, k) => {
                const on = k === active;
                if (!on && !wanted.has(k)) return null;
                return (
                    <div
                        key={s.img}
                        aria-hidden={on ? undefined : true}
                        className={cn(
                            'absolute inset-0 transition-opacity duration-slow ease-out motion-reduce:transition-none',
                            on ? 'opacity-100' : 'opacity-0',
                        )}
                    >
                        <Image
                            src={s.img}
                            alt={on ? s.alt : ''}
                            aria-hidden={on ? undefined : true}
                            fill
                            sizes="100vw"
                            priority={k === 0}
                            loading={k === 0 ? undefined : 'lazy'}
                            className={cn('object-cover rtl:-scale-x-100', s.pos)}
                        />
                    </div>
                );
            })}
            <div aria-hidden="true" className={overlay} />
            {/* From lg the overlay fades out toward the reading end, where the photo is pale ice;
                this bottom scrim keeps the slide tabs readable over it (white/78 on navy, 7:1+) */}
            <div aria-hidden="true" className={tabScrim} />

            <div
                className={cn(
                    containerClass,
                    'relative flex min-h-[620px] flex-col justify-end lg:min-h-[720px] lg:justify-between rtl:min-h-[640px] rtl:lg:min-h-[720px]',
                )}
            >
                <div className="pb-7 pt-[200px] md:max-w-[640px] lg:max-w-[860px] lg:pb-16 lg:pt-[116px]">
                    <div aria-live="polite">
                        <Eyebrow tone="dark" className="mb-3 lg:mb-5">
                            {slide.kicker}
                        </Eyebrow>
                        <h1 className={cn('v2-heading m-0', typography.display)}>{slide.title}</h1>
                        <p className={cn('mb-0 mt-4 text-fg-muted lg:mt-6 lg:max-w-[580px]', typography.lead)}>{slide.text}</p>
                    </div>
                    <div className="mt-7 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10">
                        <Button href={routes.contact} size="lg" stretch="phone" arrow dataAttrs={{ 'data-cta': 'home_hero_partner' }}>
                            {ctaPartner}
                        </Button>
                        <Button href="#fish" external variant="outline" size="lg" stretch="phone" dataAttrs={{ 'data-cta': 'home_hero_fish' }}>
                            {ctaFish}
                        </Button>
                    </div>
                </div>

                <div
                    role="group"
                    aria-label={groupLabel}
                    className="grid grid-cols-4 gap-2 pb-3 lg:gap-0 lg:border-t lg:border-solid lg:border-white/[.28] lg:pb-0"
                >
                    {slides.map((s, k) => {
                        const on = k === active;
                        return (
                            <button
                                key={s.label}
                                type="button"
                                aria-pressed={on}
                                onClick={() => pick(k)}
                                onPointerEnter={() => want(k)}
                                onFocus={() => want(k)}
                                className={cn(
                                    'flex h-tap cursor-pointer items-center border-0 bg-transparent p-0 text-start',
                                    'lg:block lg:h-auto lg:min-h-[88px] lg:border-s lg:border-t-[3px] lg:border-solid lg:border-s-white/[.18] lg:px-5 lg:pb-5 lg:pt-[18px]',
                                    'lg:font-bold lg:transition-colors lg:duration-base lg:hover:text-white motion-reduce:transition-none',
                                    typography.h4,
                                    focusRing,
                                    on ? 'lg:border-t-gold lg:text-white' : 'lg:border-t-transparent lg:text-white/[.78]',
                                )}
                            >
                                <span aria-hidden="true" className={cn('block h-[3px] w-full rounded-sm lg:hidden', on ? 'bg-gold' : 'bg-white/40')} />
                                <span className="sr-only lg:not-sr-only">{s.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
