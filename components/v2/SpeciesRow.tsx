import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import { ArrowIcon } from './icons';

/**
 * Trade species register (B2B), not a retail product card: no boxes, no tags,
 * no hover zoom. A wide row per species: the whole fish (transparent cut-out),
 * its trade / local / scientific names, a short fact list, and two actions
 * (specifications, quote). Use inside a <ul> with `divide-y divide-line`.
 */
export interface SpeciesRowProps {
    /** Running number in the register, e.g. 1 → "01" */
    index?: number;
    name: string;
    scientificName?: string;
    /** Local market names (shown as one muted line) */
    altNames?: string[];
    href: string;
    quoteHref: string;
    image?: ImageProps;
    /** Short published facts only (origin, water type, indicative grades). No prices. */
    facts: { label: string; value: string }[];
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export function SpeciesRow({ index, name, scientificName, altNames, href, quoteHref, image, facts, headingAs: H = 'h3', className }: SpeciesRowProps) {
    const t = useTranslations('v2.cta');
    return (
        <article className={cn('grid grid-cols-4 items-center gap-x-6 gap-y-5 py-8 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:py-10', className)}>
            <Link
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="relative col-span-4 block aspect-[16/9] sm:col-span-3 lg:col-span-4"
            >
                {image ? (
                    <Image
                        src={image.src}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 36vw, 100vw"
                        className={image.cutout ? 'object-contain drop-shadow-[0_12px_16px_rgba(0,45,114,0.12)]' : 'rounded-card object-cover'}
                    />
                ) : null}
            </Link>

            <div className="col-span-4 sm:col-span-5 lg:col-span-4">
                {typeof index === 'number' ? (
                    <p className="text-caption font-semibold tabular-nums tracking-wide text-gold-ink" aria-hidden="true">
                        {String(index).padStart(2, '0')}
                    </p>
                ) : null}
                <H className="mt-1 text-heading-lg text-navy">
                    <Link href={href} className="hover:underline focus-visible:underline">
                        {name}
                    </Link>
                </H>
                {scientificName ? (
                    <p className="mt-1 text-body-sm italic text-fg-muted" lang="la">
                        {scientificName}
                    </p>
                ) : null}
                {altNames && altNames.length ? <p className="mt-2 text-body-sm text-fg-muted">{altNames.join(' · ')}</p> : null}
            </div>

            <div className="col-span-4 sm:col-span-8 lg:col-span-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-s-2 border-gold ps-5 text-body-sm">
                    {facts.map((f) => (
                        <div key={f.label} className="contents">
                            <dt className="text-fg-muted">{f.label}</dt>
                            <dd className="font-medium text-fg">{f.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 ps-5">
                    <Link
                        href={href}
                        className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 hover:decoration-navy"
                    >
                        {t('view_specifications')}
                        <span className="sr-only">: {name}</span>
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                    <Link
                        href={quoteHref}
                        className="inline-flex min-h-[44px] items-center rounded-control border border-navy px-4 font-semibold text-navy transition-colors duration-fast hover:bg-navy hover:text-white motion-reduce:transition-none"
                    >
                        {t('request_quote')}
                        <span className="sr-only">: {name}</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

/**
 * Compact register entry for home "core species" and related species: the
 * fish, a hairline, names and one link. No card box, no tag, no shadow box.
 */
export interface SpeciesEntryProps {
    name: string;
    scientificName?: string;
    href: string;
    image?: ImageProps;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export function SpeciesEntry({ name, scientificName, href, image, headingAs: H = 'h3', className }: SpeciesEntryProps) {
    const t = useTranslations('v2.cta');
    return (
        <article className={cn('group relative', className)}>
            <div className="relative aspect-[16/9]">
                {image ? (
                    <Image
                        src={image.src}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                        className={image.cutout ? 'object-contain drop-shadow-[0_12px_16px_rgba(0,45,114,0.12)]' : 'rounded-card object-cover'}
                    />
                ) : null}
            </div>
            <div className="mt-4 border-t border-line pt-4">
                <H className="text-heading-md text-navy">
                    <Link href={href} className="after:absolute after:inset-0 after:content-[''] group-hover:underline">
                        {name}
                    </Link>
                </H>
                {scientificName ? (
                    <p className="mt-1 text-body-sm italic text-fg-muted" lang="la">
                        {scientificName}
                    </p>
                ) : null}
                <p className="mt-3 inline-flex items-center gap-2 text-body-sm font-semibold text-navy" aria-hidden="true">
                    {t('view_specifications')}
                    <ArrowIcon className="h-4 w-4" />
                </p>
            </div>
        </article>
    );
}
