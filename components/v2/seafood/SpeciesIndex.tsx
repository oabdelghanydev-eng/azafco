import Image from 'next/image';
import { Link } from '@/navigation';
import { ChevronEndIcon } from '@/components/v2/icons';
import type { CatalogueProduct } from '@/components/v2/products/catalogue';

export interface SpeciesIndexProps {
    items: Pick<CatalogueProduct, 'slug' | 'href' | 'name' | 'scientificName' | 'image'>[];
    /** Label per item under the name (e.g. water type) */
    meta?: Record<string, string>;
}

/**
 * Compact species quick-links ("species at a glance"): thumbnail, trade name,
 * verified scientific name. Each row is one link, at least 64px tall.
 */
export default function SpeciesIndex({ items, meta }: SpeciesIndexProps) {
    return (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
                <li key={p.slug}>
                    <Link
                        href={p.href}
                        className="group flex min-h-16 items-center gap-4 rounded-card border border-rule bg-panel p-3 transition-colors duration-base hover:bg-tint motion-reduce:transition-none"
                    >
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control bg-surface-mist">
                            <Image src={p.image.src} alt="" aria-hidden="true" fill sizes="56px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-body font-semibold text-fg">{p.name}</span>
                            {p.scientificName ? (
                                <span className="block truncate text-caption italic text-fg-muted" lang="la" dir="ltr">
                                    {p.scientificName}
                                </span>
                            ) : meta?.[p.slug] ? (
                                <span className="block text-caption text-fg-muted">{meta[p.slug]}</span>
                            ) : null}
                        </span>
                        <ChevronEndIcon size={18} className="shrink-0 text-fg-muted transition-transform duration-base group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
