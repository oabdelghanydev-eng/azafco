'use client';

/**
 * The species stage on /products (owner's pick "D3", 25 Nov 2026): one wide
 * panel shows the chosen species large, with its names, water type and weight
 * grades; a strip of the twelve species picks which one. On phones the strip
 * is a 4-column grid above the panel.
 *
 * All twelve panels are in the HTML (the inactive ones are display:none), so
 * every name and grade is there without JavaScript. Copy comes in as props from
 * the server page; this file reads no messages.
 */
import { useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn, focusRing, typography } from '@/components/ui/tokens';
import { noBreakValue } from '@/components/ui/format';
import type { ImageProps } from '@/lib/v2/media';

export interface StageItem {
    slug: string;
    href: string;
    /** "01" … "12" */
    num: string;
    name: string;
    scientificName?: string;
    altNames: string[];
    /** Water type label */
    water: string;
    /** Label over the grades ("Weight grades (indicative)" or "Weight grades") */
    gradesLabel: string;
    /** Grade texts, or the single "On request" text */
    grades: string[];
    image: ImageProps;
}

export interface SpeciesStageProps {
    items: StageItem[];
    rtl: boolean;
    /** Accessible name of the picker ("Species we supply") */
    pickLabel: string;
    /** Button to the species page ("View specifications") */
    openLabel: string;
}

/** Big names on the panel: the longest word and the whole length decide the size, so long names in any language fit. */
function nameSize(name: string): string {
    const longest = Math.max(...name.split(/[\s-]+/).map((w) => w.length));
    if (longest <= 8 && name.length <= 12) return 'text-[40px] lg:text-[50px] xl:text-[76px]';
    if (longest <= 11 && name.length <= 18) return 'text-[34px] lg:text-[40px] xl:text-[58px]';
    return 'text-[28px] lg:text-[32px] xl:text-[44px]';
}

/** Diagonal brand cut (as in the phone header): a darker block and a gold stripe, mirrored in LTR. */
function cut(rtl: boolean, top: [number, number], bottom: [number, number]): CSSProperties {
    const x = (v: number) => `${rtl ? v : 100 - v}%`;
    return { clipPath: `polygon(${x(top[0])} 0, ${x(top[1])} 0, ${x(bottom[1])} 100%, ${x(bottom[0])} 100%)` };
}

export default function SpeciesStage({ items, rtl, pickLabel, openLabel }: SpeciesStageProps) {
    const [cur, setCur] = useState(0);

    return (
        <div className="flex flex-col gap-2.5 lg:flex-col-reverse lg:gap-3">
            {/* Picker: 4 columns on phones, one strip of twelve from lg */}
            <ul aria-label={pickLabel} className="m-0 grid list-none grid-cols-4 gap-1.5 p-0 lg:grid-cols-6 lg:gap-2 xl:grid-cols-12">
                {items.map((it, i) => (
                    <li key={it.slug} className="flex">
                        <button
                            type="button"
                            aria-pressed={i === cur}
                            aria-controls={`stage-${it.slug}`}
                            onClick={() => setCur(i)}
                            className={cn(
                                'relative flex min-h-[86px] w-full cursor-pointer flex-col items-center rounded-control border-0 px-1 pb-2 pt-2 text-center text-white transition-colors hover:bg-white/10 motion-reduce:transition-none lg:min-h-[108px] lg:pt-3',
                                i === cur ? 'bg-white/10 shadow-[inset_0_0_0_1.5px_theme(colors.gold.DEFAULT)]' : 'bg-white/5',
                                focusRing,
                            )}
                        >
                            <span aria-hidden="true" className="absolute start-2 top-1 font-display text-[10.5px] font-extrabold tracking-wider text-gold lg:text-[11px]">
                                {it.num}
                            </span>
                            <Image
                                src={it.image.src}
                                alt=""
                                aria-hidden="true"
                                width={120}
                                height={90}
                                sizes="120px"
                                className="block h-[46px] w-full object-contain lg:h-14 ltr:-scale-x-100"
                            />
                            <span className="mt-1 hyphens-auto break-words text-[15px] font-bold leading-tight ltr:text-[12.5px] lg:text-[16.5px] lg:ltr:text-[14px]">
                                {it.name}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Stage */}
            <div className="relative overflow-hidden rounded-[8px] bg-[#0B2F6B] lg:min-h-[480px]">
                {/* phone cut (top part only) */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[250px] bg-[#072452] lg:hidden" style={cut(rtl, [0, 52], [0, 24])} />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[250px] bg-gold lg:hidden" style={cut(rtl, [52, 54.4], [24, 26.4])} />
                {/* desktop cut: each piece is only as wide as its shape, so no layer lies behind the text column
                    (a full-size layer made the contrast checker read the text as white on gold) */}
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 hidden w-1/2 bg-[#072452] lg:block"
                    style={{ [rtl ? 'left' : 'right']: 0, ...cut(rtl, [0, 100], [0, 68]) }}
                />
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 hidden w-[17.2%] bg-gold lg:block"
                    style={{ [rtl ? 'left' : 'right']: '34%', ...cut(rtl, [93, 100], [0, 7]) }}
                />

                {items.map((it, i) => (
                    <article
                        key={it.slug}
                        id={`stage-${it.slug}`}
                        className={cn(
                            'relative z-[1] flex-col-reverse px-[18px] pb-6 pt-3.5 lg:absolute lg:inset-0 lg:flex-row lg:items-center lg:gap-2 lg:px-[60px] lg:py-9',
                            i === cur ? 'flex' : 'hidden',
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute end-3.5 top-2 font-display text-[120px] font-extrabold leading-none tracking-tighter text-transparent lg:end-11 lg:top-0 lg:text-[270px]"
                            style={{ WebkitTextStroke: '2px rgba(247,181,0,.55)' }}
                        >
                            {it.num}
                        </span>

                        <div className="relative min-w-0 lg:basis-[37%]">
                            <p className={cn('m-0 font-semibold text-gold', typography.small)}>{it.water}</p>
                            <h3 className={cn('m-0 mt-1 hyphens-auto break-words font-display font-bold leading-[1.15] text-white rtl:leading-[1.4]', nameSize(it.name))}>{it.name}</h3>
                            {it.scientificName ? (
                                <p className={cn('m-0 mt-1 italic text-white/75', typography.body)}>
                                    <span lang="la" dir="ltr">
                                        {it.scientificName}
                                    </span>
                                </p>
                            ) : null}
                            {it.altNames.length ? <p className={cn('m-0 mt-2 text-white/80', typography.small)}>{it.altNames.join(' · ')}</p> : null}
                            <p className={cn('mb-0 mt-5 font-semibold text-white/75 lg:mt-6', typography.caption)}>{it.gradesLabel}</p>
                            <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                                {it.grades.map((g) => (
                                    <li key={g} className={cn('rounded-full bg-white/[.12] px-3.5 py-1.5 font-medium text-white', typography.small)}>
                                        {noBreakValue(g)}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-5 lg:mt-6">
                                <Button href={it.href} arrow dataAttrs={{ 'data-cta': 'catalogue_stage_species', 'data-species': it.slug }}>
                                    {openLabel}
                                </Button>
                            </div>
                        </div>

                        <div className="relative mx-auto mb-1 aspect-[4/3] w-[92%] -rotate-[5deg] ltr:rotate-[5deg] lg:mb-0 lg:aspect-auto lg:h-[400px] lg:w-auto lg:min-w-0 lg:flex-1 lg:scale-[1.16]">
                            <Image
                                src={it.image.src}
                                alt={it.image.alt}
                                fill
                                priority={i === 0}
                                sizes="(min-width: 1024px) 760px, 92vw"
                                className="object-contain drop-shadow-[0_24px_24px_rgba(0,8,30,0.6)] ltr:-scale-x-100"
                            />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
