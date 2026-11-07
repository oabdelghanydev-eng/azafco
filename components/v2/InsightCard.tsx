import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { ImageProps } from '@/lib/v2/media';

export interface InsightCardProps {
    title: string;
    href: string;
    excerpt?: string;
    image?: ImageProps;
    /** e.g. "Export guide" */
    category?: string;
    /** ISO date (YYYY-MM-DD): published or last reviewed */
    date?: string;
    readingMinutes?: number;
    headingAs?: 'h2' | 'h3';
    className?: string;
}

/** Article / guide teaser. Whole card is one link. */
export default function InsightCard({ title, href, excerpt, image, category, date, readingMinutes, headingAs: H = 'h3', className }: InsightCardProps) {
    const t = useTranslations('v2.insight');
    const format = useFormatter();
    return (
        <article data-surface="light" className={cn('group relative flex h-full flex-col text-ink', className)}>
            {image ? (
                <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-card bg-surface-mist">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-slow group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-subtle">
                {category ? <span className="font-semibold uppercase tracking-wide text-navy rtl:tracking-normal">{category}</span> : null}
                {date ? <time dateTime={date}>{format.dateTime(new Date(date), { dateStyle: 'medium' })}</time> : null}
                {readingMinutes ? <span>{t('minutes', { count: readingMinutes })}</span> : null}
            </div>
            <H className="mt-2 text-heading-md text-navy">
                <Link href={href} className="underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline">
                    {title}
                </Link>
            </H>
            {excerpt ? <p className="mt-2 text-body-sm text-ink-muted">{excerpt}</p> : null}
        </article>
    );
}
