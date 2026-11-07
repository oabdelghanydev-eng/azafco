import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import { ArrowIcon } from './icons';

export interface ProductCardProps {
    name: string;
    /** Latin binomial, rendered in italics, lang="la" */
    scientificName?: string;
    /** Product detail href, e.g. productHref('tilapia') */
    href: string;
    image?: ImageProps;
    /** 2–3 short facts already published (category, formats). No prices. */
    attributes?: { label: string; value: string }[];
    /** Small verified-only label, e.g. category "Freshwater" */
    tag?: string;
    /** CTA text (default: v2.cta.view_specifications) */
    ctaLabel?: string;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

/**
 * Catalogue card. Whole card is one link (single tab stop); CTA text is
 * "View Specifications". Never shows prices or add-to-cart.
 * Sizes assume a 1/2/3/4-column grid.
 */
export default function ProductCard({
    name,
    scientificName,
    href,
    image,
    attributes,
    tag,
    ctaLabel,
    headingAs: H = 'h3',
    className,
}: ProductCardProps) {
    const t = useTranslations('v2.cta');
    return (
        <article
            data-surface="light"
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white text-fg shadow-card',
                'transition-shadow duration-base hover:shadow-raised motion-reduce:transition-none',
                className,
            )}
        >
            <div className="relative aspect-[4/3] bg-surface-mist">
                {image ? (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-slow group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                ) : null}
                {tag ? (
                    <span className="absolute start-3 top-3 rounded-control bg-white/95 px-2.5 py-1 text-caption font-semibold text-navy">
                        {tag}
                    </span>
                ) : null}
            </div>
            <div className="flex flex-1 flex-col p-5">
                <H className="text-heading-md text-navy">
                    <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                        {name}
                    </Link>
                </H>
                {scientificName ? (
                    <p className="mt-1 text-caption italic text-ink-subtle" lang="la" dir="ltr">
                        {scientificName}
                    </p>
                ) : null}
                {attributes?.length ? (
                    <dl className="mt-4 space-y-1.5 text-body-sm">
                        {attributes.map((a) => (
                            <div key={a.label} className="flex gap-2">
                                <dt className="text-ink-subtle">{a.label}:</dt>
                                <dd className="font-medium text-ink">{a.value}</dd>
                            </div>
                        ))}
                    </dl>
                ) : null}
                <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-body-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-[6px]"
                >
                    {ctaLabel ?? t('view_specifications')}
                    <ArrowIcon size={16} className="transition-transform duration-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
            </div>
        </article>
    );
}
