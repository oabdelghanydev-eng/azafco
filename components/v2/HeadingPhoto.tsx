import Image from 'next/image';
import { cn } from '@/lib/v2/cn';
import { mediaImage } from '@/lib/v2/media';

export interface HeadingPhotoProps {
    /** Media id from lib/v2/media.ts (illustrative `photo-*` ids) */
    id: string;
    /** Crop (default 3/2) */
    aspect?: '3/2' | '4/3';
    /** CSS object-position */
    position?: string;
    className?: string;
}

/**
 * Small illustrative photo under a split section's H2 (heading column), so the
 * column does not end in white space. Calm navy duotone: grayscale photo
 * blended (luminosity) over navy, plus a light navy wash. Decorative only
 * (alt="", aria-hidden). Desktop only: on small screens the heading stacks
 * above the copy and the photo would push it down.
 */
export default function HeadingPhoto({ id, aspect = '3/2', position = 'center', className }: HeadingPhotoProps) {
    const img = mediaImage(id, 'en');
    return (
        <div
            aria-hidden="true"
            className={cn(
                'relative mt-10 hidden w-full max-w-[420px] overflow-hidden rounded-card bg-navy-800 lg:block',
                aspect === '3/2' ? 'aspect-[3/2]' : 'aspect-[4/3]',
                className,
            )}
        >
            <Image
                src={img.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1280px) 420px, 34vw"
                className="object-cover opacity-90 grayscale mix-blend-luminosity"
                style={{ objectPosition: position }}
            />
            <span className="absolute inset-0 bg-navy/25" />
        </div>
    );
}
