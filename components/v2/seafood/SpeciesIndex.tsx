import Image from 'next/image';
import { Link } from '@/navigation';
import { ChevronEndIcon, cn, focusRing, typography } from '@/components/ui';
import type { CatalogueProduct } from '@/components/v2/products/catalogue';

export interface SpeciesIndexProps {
    items: Pick<CatalogueProduct, 'slug' | 'href' | 'name' | 'scientificName' | 'image'>[];
    /** Label per item under the name (e.g. water type), used when there is no scientific name */
    meta?: Record<string, string>;
}

/**
 * Compact species quick-links ("species at a glance"): thumbnail, short trade name,
 * scientific name (Latin, dir="ltr"). Each row is one link, at least 64px tall.
 */
export default function SpeciesIndex({ items, meta }: SpeciesIndexProps) {
    return (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
                <li key={p.slug}>
                    <Link
                        href={p.href}
                        className={cn(
                            'group flex min-h-16 items-center gap-4 rounded-card border border-solid border-line bg-white p-3 transition-colors duration-base hover:border-navy hover:bg-navy-50 motion-reduce:transition-none',
                            focusRing,
                        )}
                    >
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control bg-surface-offwhite">
                            <Image
                                src={p.image.src}
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes="56px"
                                className={p.image.cutout ? 'object-contain p-0.5' : 'object-cover'}
                            />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className={cn('block font-semibold text-ink', typography.body)}>{p.name}</span>
                            {p.scientificName ? (
                                <span className={cn('block italic text-ink-muted [overflow-wrap:anywhere]', typography.caption)}>
                                    <span lang="la" dir="ltr">
                                        {p.scientificName}
                                    </span>
                                </span>
                            ) : meta?.[p.slug] ? (
                                <span className={cn('block text-ink-muted', typography.caption)}>{meta[p.slug]}</span>
                            ) : null}
                        </span>
                        <ChevronEndIcon
                            size={20}
                            className="text-ink-muted transition-transform duration-base group-hover:translate-x-0.5 group-hover:text-navy rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
