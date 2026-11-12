'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './GHero.module.css';

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
    isAr: boolean;
    groupLabel: string;
    ctaPartner: string;
    ctaFish: string;
}

const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500]';

/**
 * Hero of design G: four slides switched only by the user (no autoplay, as on the board).
 * Only the active slide's text is rendered, so the page keeps exactly one h1.
 */
export default function GHeroSlides({ slides, isAr, groupLabel, ctaPartner, ctaFish }: Props) {
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
                        className={`${styles.slideImg} absolute inset-0 ${on ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={s.img}
                            alt={on ? s.alt : ''}
                            aria-hidden={on ? undefined : true}
                            fill
                            sizes="100vw"
                            priority={k === 0}
                            loading={k === 0 ? undefined : 'lazy'}
                            className={`object-cover ${s.pos} ${isAr ? '-scale-x-100' : ''}`}
                        />
                    </div>
                );
            })}
            <div aria-hidden="true" className={`${styles.overlay} ${isAr ? styles.overlayRtl : ''}`} />

            <div
                className={`relative mx-auto box-border flex max-w-[1320px] flex-col justify-end px-5 lg:min-h-[720px] lg:justify-between lg:px-8 ${
                    isAr ? 'min-h-[640px]' : 'min-h-[620px]'
                }`}
            >
                <div
                    className={`pb-7 pt-[200px] md:max-w-[640px] lg:max-w-[760px] lg:pb-16 ${
                        isAr ? 'lg:pt-[112px]' : 'lg:pt-[120px]'
                    }`}
                >
                    <div aria-live="polite">
                        <p
                            className={`flex items-center gap-2.5 font-bold text-[#f7b500] lg:gap-3.5 ${
                                isAr
                                    ? 'mb-3 mt-0 text-[15px] lg:mb-[18px] lg:text-[17px]'
                                    : 'mb-3.5 mt-0 text-[13px] lg:mb-5 lg:text-[15px]'
                            }`}
                        >
                            <span aria-hidden="true" className="block h-[2px] w-7 shrink-0 bg-[#f7b500] lg:w-11" />
                            {slide.kicker}
                        </p>
                        <h1
                            className={
                                isAr
                                    ? 'm-0 text-[34px] font-bold leading-[1.35] lg:text-[clamp(40px,5vw,72px)] lg:leading-[1.3]'
                                    : 'm-0 text-[36px] font-extrabold leading-[1.1] tracking-[-0.02em] lg:text-[clamp(40px,5.2vw,76px)] lg:leading-[1.06]'
                            }
                        >
                            {slide.title}
                        </h1>
                        <p
                            className={
                                isAr
                                    ? 'mb-0 mt-3.5 text-[18px] leading-[1.75] text-white/90 lg:mt-[22px] lg:max-w-[580px] lg:text-[21px] lg:leading-[1.85]'
                                    : 'mb-0 mt-4 text-[17px] text-white/90 lg:mt-6 lg:max-w-[560px] lg:text-[20px] lg:text-white/[.88]'
                            }
                        >
                            {slide.text}
                        </p>
                    </div>
                    <div
                        className={`grid gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 lg:mt-10 ${
                            isAr ? 'mt-[26px]' : 'mt-7'
                        }`}
                    >
                        <a
                            href="#contact"
                            className={`flex h-[54px] items-center justify-center rounded-full bg-[#f7b500] px-8 text-[#001b47] transition-colors hover:bg-[#ffc633] hover:text-[#001b47] sm:inline-flex ${focusRing} ${
                                isAr ? 'font-bold lg:h-14 lg:px-[34px]' : 'font-extrabold'
                            }`}
                        >
                            {ctaPartner}
                        </a>
                        <a
                            href="#fish"
                            className={`flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-solid border-white/70 px-8 font-bold text-white transition-colors hover:border-[#f7b500] hover:text-[#f7b500] sm:inline-flex ${focusRing} ${
                                isAr ? 'lg:h-14 lg:px-[34px]' : ''
                            }`}
                        >
                            {ctaFish}
                        </a>
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
                                className={`flex h-11 cursor-pointer items-center border-0 bg-transparent p-0 text-start lg:block lg:h-auto lg:min-h-[88px] lg:border-s lg:border-t-[3px] lg:border-solid lg:border-s-white/[.18] lg:px-5 lg:pb-5 lg:pt-[18px] lg:font-bold lg:transition-colors lg:hover:text-white ${focusRing} ${
                                    on ? 'lg:border-t-[#f7b500] lg:text-white' : 'lg:border-t-transparent lg:text-white/[.78]'
                                } ${isAr ? 'lg:text-[18px] lg:leading-[1.5]' : 'lg:text-[17px] lg:leading-[1.3]'}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`block h-[3px] w-full rounded-sm lg:hidden ${
                                        on ? 'bg-[#f7b500]' : 'bg-white/40'
                                    }`}
                                />
                                <span className="sr-only lg:not-sr-only">{s.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
