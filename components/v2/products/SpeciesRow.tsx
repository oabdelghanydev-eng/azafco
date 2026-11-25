import Image from 'next/image';
import { Link } from '@/navigation';
import { cn, focusRing, typography } from '@/components/ui';
import type { ImageProps } from '@/lib/v2/media';

/**
 * Species register for the fish pages (design system, components/ui).
 *
 * - <SpeciesEntry> compact entry (related species): fish, hairline, names (the whole entry is the link).
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

export interface SpeciesEntryProps {
    name: string;
    scientificName?: string;
    href: string;
    image?: ImageProps;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

/** Related-species entry: the fish, a hairline and the names (the whole entry is clickable). */
export function SpeciesEntry({ name, scientificName, href, image, headingAs: H = 'h3', className }: SpeciesEntryProps) {
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
            </div>
        </article>
    );
}
