import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/v2/cn';
import { getMedia } from '@/lib/v2/media';

export interface GalleryItem {
    /** Manifest id from lib/v2/media.ts */
    id: string;
    /** Optional visible caption (keep factual; no unapproved claims) */
    caption?: string;
}

export interface MediaGalleryProps {
    items: GalleryItem[];
    columns?: 2 | 3 | 4;
    /** Crop all tiles to one ratio (default 4/3) or keep each photo's own ratio */
    aspect?: '4/3' | '1/1' | '3/4' | 'natural';
    /** Accessible name for the list (default v2.gallery.label) */
    label?: string;
    className?: string;
}

/**
 * Simple, keyboard-neutral photo grid (no lightbox, no carousel). Alt text
 * comes from the manifest in the current language.
 */
export default function MediaGallery({ items, columns = 3, aspect = '4/3', label, className }: MediaGalleryProps) {
    const locale = useLocale();
    const t = useTranslations('v2.gallery');
    const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[columns];
    const ratio = { '4/3': 'aspect-[4/3]', '1/1': 'aspect-square', '3/4': 'aspect-[3/4]', natural: '' }[aspect];
    const sizes =
        columns === 2 ? '(min-width: 640px) 50vw, 100vw' : columns === 3 ? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw';

    return (
        <ul aria-label={label ?? t('label')} className={cn('m-0 grid list-none gap-3 p-0 md:gap-4 lg:gap-5', cols, className)}>
            {items.map(({ id, caption }) => {
                const m = getMedia(id);
                const alt = locale === 'ar' ? m.alt.ar : m.alt.en;
                return (
                    <li key={id}>
                        <figure className="m-0">
                            <div className={cn('relative overflow-hidden rounded-card bg-surface-offwhite', ratio)}>
                                {aspect === 'natural' ? (
                                    <Image src={m.src} alt={alt} width={m.width} height={m.height} sizes={sizes} className="h-auto w-full" />
                                ) : (
                                    <Image src={m.src} alt={alt} fill sizes={sizes} className={m.cutout ? 'object-contain bg-surface-offwhite p-[2%] drop-shadow-[0_10px_14px_rgba(0,27,71,0.2)]' : 'object-cover'} />
                                )}
                            </div>
                            {caption ? <figcaption className="mt-2.5 text-body-sm text-fg-muted">{caption}</figcaption> : null}
                        </figure>
                    </li>
                );
            })}
        </ul>
    );
}
