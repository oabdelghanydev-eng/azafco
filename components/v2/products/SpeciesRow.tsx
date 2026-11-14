import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowIcon, Badge, cn, focusRing, noBreakValue, typography } from '@/components/ui';
import type { ImageProps } from '@/lib/v2/media';

/**
 * Species register for the fish pages (design system, components/ui).
 *
 * - <SpeciesRow>   one wide row per species in the catalogue list: whole-fish cut-out,
 *                  short trade name, scientific name, local names, chips, a short fact
 *                  list and one link to the specification. Use inside a <ul> with
 *                  `divide-y divide-line`.
 * - <SpeciesEntry> compact entry (related species): fish, hairline, names, one link.
 *
 * Scientific names are Latin: always lang="la" dir="ltr" (inline, so they still sit
 * on the start side in Arabic). No prices, no stock, no farmed/wild labels.
 */

function Scientific({ name, className }: { name: string; className?: string }) {
    return (
        <p className={cn('m-0 italic text-fg-muted', className)}>
            <span lang="la" dir="ltr">
                {name}
            </span>
        </p>
    );
}

/** Whole-fish cut-outs sit on the page (no box); a photo gets the card radius. */
function fishClass(image: ImageProps) {
    return image.cutout ? 'object-cover drop-shadow-md' : 'rounded-card object-cover';
}

export interface SpeciesRowProps {
    /** Running number in the register, e.g. 1 -> "01" */
    index?: number;
    name: string;
    scientificName?: string;
    /** Local market names (one muted line) */
    altNames?: string[];
    href: string;
    image?: ImageProps;
    /** Published facts only (form, indicative grades). A string[] renders one item per line. */
    facts: { label: string; value: string | string[] }[];
    /** Short tags under the names (water type, origin) */
    chips?: string[];
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export function SpeciesRow({ index, name, scientificName, altNames, href, image, facts, chips, headingAs: H = 'h3', className }: SpeciesRowProps) {
    const t = useTranslations('v2.cta');
    return (
        <article
            className={cn(
                'grid grid-cols-4 items-center gap-x-6 gap-y-5 border-0 border-s-2 border-solid border-transparent px-3 py-8 transition-colors duration-base hover:border-gold hover:bg-navy-50 focus-within:border-gold focus-within:bg-navy-50 motion-reduce:transition-none sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:px-5 lg:py-10',
                className,
            )}
        >
            {/* Decorative duplicate of the name link: hidden from the keyboard and screen readers */}
            <Link href={href} tabIndex={-1} aria-hidden="true" className="relative col-span-4 block aspect-[16/9] sm:col-span-3 lg:col-span-4">
                {image ? (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1320px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 36vw, 100vw"
                        className={fishClass(image)}
                    />
                ) : null}
            </Link>

            <div className="col-span-4 min-w-0 sm:col-span-5 lg:col-span-4">
                {typeof index === 'number' ? (
                    <p aria-hidden="true" className="m-0 text-caption font-semibold tabular-nums tracking-wide text-gold-ink">
                        {String(index).padStart(2, '0')}
                    </p>
                ) : null}
                <H className="m-0 text-heading-lg text-navy">
                    <Link href={href} className={cn('inline-flex min-h-tap items-center rounded-[2px] hover:underline', focusRing)}>
                        {name}
                    </Link>
                </H>
                {scientificName ? <Scientific name={scientificName} className={cn('mt-1', typography.small)} /> : null}
                {altNames && altNames.length ? <p className={cn('m-0 mt-2 text-fg-muted', typography.small)}>{altNames.join(' · ')}</p> : null}
                {chips && chips.length ? (
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                        {chips.map((c) => (
                            <li key={c}>
                                <Badge tone="outline">{c}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>

            <div className="col-span-4 min-w-0 sm:col-span-8 lg:col-span-4">
                <dl className={cn('m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 border-0 border-s-2 border-solid border-gold ps-5', typography.small)}>
                    {facts.map((f) => (
                        <div key={f.label} className="contents">
                            <dt className="text-fg-muted">{f.label}</dt>
                            <dd className="m-0 font-medium text-fg">
                                {Array.isArray(f.value) ? (
                                    <ul className="m-0 list-none space-y-1 p-0">
                                        {f.value.map((v) => (
                                            <li key={v}>
                                                <bdi>{noBreakValue(v)}</bdi>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    noBreakValue(f.value)
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-4 ps-5">
                    <Link
                        href={href}
                        className={cn(
                            'group inline-flex min-h-tap items-center gap-2 font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy',
                            typography.body,
                            focusRing,
                        )}
                    >
                        {t('view_specifications')}
                        <span className="sr-only">: {name}</span>
                        <ArrowIcon
                            size={16}
                            className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export interface SpeciesEntryProps {
    name: string;
    scientificName?: string;
    href: string;
    image?: ImageProps;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

/** Related-species entry: the fish, a hairline, the names and one link (the whole entry is clickable). */
export function SpeciesEntry({ name, scientificName, href, image, headingAs: H = 'h3', className }: SpeciesEntryProps) {
    const t = useTranslations('v2.cta');
    return (
        <article className={cn('group relative', className)}>
            <div className="relative aspect-[16/9]">
                {image ? (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1320px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className={fishClass(image)}
                    />
                ) : null}
            </div>
            <div className="mt-4 border-0 border-t border-solid border-line pt-4">
                <H className={cn('m-0 text-navy', typography.h3)}>
                    <Link href={href} className={cn('after:absolute after:inset-0 after:content-[\'\'] group-hover:underline', focusRing)}>
                        {name}
                    </Link>
                </H>
                {scientificName ? <Scientific name={scientificName} className={cn('mt-1', typography.small)} /> : null}
                <p aria-hidden="true" className={cn('m-0 mt-3 inline-flex items-center gap-2 font-semibold text-navy', typography.small)}>
                    {t('view_specifications')}
                    <ArrowIcon
                        size={16}
                        className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none"
                    />
                </p>
            </div>
        </article>
    );
}
