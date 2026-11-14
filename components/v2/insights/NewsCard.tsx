import Image from 'next/image';
import { Link } from '@/navigation';
import { Badge, ExternalLink, cardClass, cn, focusRing, typography } from '@/components/ui';
import type { ImageProps } from '@/lib/v2/media';

/**
 * News & press card (design G). Server component, presentational: the page passes
 * translated, formatted strings.
 *
 * - `sourceUrl` → "View source" external link (new tab + screen-reader hint).
 * - `href` → the title becomes a stretched internal link (teaser on /insights).
 *   Use one or the other, never both (no nested interactive elements).
 * - `illustrativeLabel` marks a manifest photo that is context, not a photo of the event.
 */
export interface NewsCardProps {
    id?: string;
    title: string;
    summary: string;
    /** ISO date for <time dateTime> */
    date: string;
    dateLabel: string;
    /** "Source: …" line */
    sourceLine: string;
    image?: ImageProps;
    illustrativeLabel?: string;
    sourceUrl?: string;
    viewSourceLabel?: string;
    newTabLabel?: string;
    href?: string;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

export default function NewsCard({
    id,
    title,
    summary,
    date,
    dateLabel,
    sourceLine,
    image,
    illustrativeLabel,
    sourceUrl,
    viewSourceLabel,
    newTabLabel,
    href,
    headingAs: H = 'h3',
    className,
}: NewsCardProps) {
    return (
        <article
            id={id}
            className={cn(
                cardClass({ interactive: !!href }),
                'group relative flex h-full scroll-mt-28 flex-col overflow-hidden',
                className,
            )}
        >
            {image ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-offwhite">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1320px) 410px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                    {illustrativeLabel ? (
                        <Badge className="absolute bottom-3 start-3 bg-white/95 text-ink">{illustrativeLabel}</Badge>
                    ) : null}
                </div>
            ) : null}
            <div className="flex flex-1 flex-col p-5 lg:p-6">
                <p className={cn('m-0 font-semibold text-navy', typography.caption)}>
                    <time dateTime={date}>{dateLabel}</time>
                </p>
                <H className={cn('m-0 mt-2 text-ink', typography.h3)}>
                    {href ? (
                        <Link
                            href={href}
                            className={cn('underline-offset-4 after:absolute after:inset-0 after:content-[\'\'] group-hover:underline', focusRing)}
                        >
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </H>
                <p className={cn('m-0 mt-3 flex-1 text-ink-muted', typography.small)}>{summary}</p>
                <div className="mt-5 flex flex-col items-start gap-1 border-t border-solid border-line-soft pt-3">
                    <p className={cn('m-0 text-ink-subtle', typography.caption)}>{sourceLine}</p>
                    {sourceUrl && !href && viewSourceLabel && newTabLabel ? (
                        <ExternalLink href={sourceUrl} newTabLabel={newTabLabel} className={typography.small}>
                            {viewSourceLabel}
                            <span className="sr-only">: {title}</span>
                        </ExternalLink>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
