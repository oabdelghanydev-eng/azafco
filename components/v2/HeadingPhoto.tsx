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
 * column does not end in white space. Design G imagery treatment (as the "Who we
 * are" photo on the home): full-colour photo, 4px corners, a gold block offset
 * behind its bottom-start corner. Decorative only (alt="", aria-hidden).
 * Desktop only: on small screens the heading stacks above the copy and the photo
 * would push it down.
 */
export default function HeadingPhoto({ id, aspect = '3/2', position = 'center', className }: HeadingPhotoProps) {
    const img = mediaImage(id, 'en');
    return (
        <div aria-hidden="true" className={cn('relative mt-10 hidden w-full max-w-[420px] pb-4 ps-4 lg:block', className)}>
            <span className="absolute bottom-0 start-0 h-[52%] w-[46%] rounded-card bg-gold" />
            <div className={cn('relative overflow-hidden rounded-card bg-navy-800', aspect === '3/2' ? 'aspect-[3/2]' : 'aspect-[4/3]')}>
                <Image
                    src={img.src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1320px) 404px, 32vw"
                    className="object-cover"
                    style={{ objectPosition: position }}
                />
            </div>
        </div>
    );
}
