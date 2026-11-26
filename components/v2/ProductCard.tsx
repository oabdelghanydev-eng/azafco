import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';
import { ArrowIcon } from '@/components/ui/icons';

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
    const ts = useTranslations('v2.spec');
    return (
        <article
            data-surface="light"
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white text-fg',
                'transition-[border-color,box-shadow] duration-base hover:border-navy hover:shadow-card motion-reduce:transition-none',
                className,
            )}
        >
            <div className="relative aspect-[4/3] bg-surface-offwhite">
                {image ? (
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className={image.cutout ? 'object-contain p-[4%] drop-shadow-[0_10px_14px_rgba(0,27,71,0.22)] rtl:-scale-x-100' : 'object-cover transition-transform duration-slow group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'}
                    />
                ) : null}
                {tag ? (
                    <span className="absolute start-3 top-3 rounded-full bg-white px-3 py-1 text-caption font-bold text-navy">
                        {tag}
                    </span>
                ) : null}
            </div>
            <div className="flex flex-1 flex-col px-5 pb-6 pt-5 lg:px-6">
                <H className="m-0 text-heading-md text-ink">
                    <Link href={href} className="after:absolute after:inset-0 after:content-['']">
                        {name}
                    </Link>
                </H>
                {scientificName ? (
                    <p className="m-0 mt-1 text-caption italic text-ink-muted" lang="la" dir="ltr">
                        {scientificName}
                    </p>
                ) : null}
                {attributes?.length ? (
                    <dl className="m-0 mt-4 space-y-1.5 text-body-sm">
                        {attributes.map((a) => (
                            <div key={a.label} className="flex gap-2">
                                <dt className="text-ink-muted">{ts('attribute_label', { label: a.label })}</dt>
                                <dd className="font-medium text-ink">{a.value}</dd>
                            </div>
                        ))}
                    </dl>
                ) : null}
                <span
                    aria-hidden="true"
                    className="v2-btn mt-auto inline-flex items-center gap-2.5 pt-5 text-body-sm text-navy underline-offset-4 group-hover:underline"
                >
                    {ctaLabel ?? t('view_specifications')}
                    <ArrowIcon size={18} className="transition-transform duration-base group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none" />
                </span>
            </div>
        </article>
    );
}
