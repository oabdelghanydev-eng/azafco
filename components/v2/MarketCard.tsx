import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { cn } from '@/lib/v2/cn';
import type { MarketStatus } from '@/config/company.config';
import { ArrowIcon } from './icons';

export interface MarketCardProps {
    name: string;
    /** Use the status from config/company.config.ts markets — never upgrade it in copy */
    status: MarketStatus;
    region?: string;
    description?: string;
    /** ISO alpha-2, renders /flags/<code>.svg if present in public/flags */
    countryCode?: string;
    href?: string;
    /** Short facts the market data already holds (e.g. transport, documents, species). No volumes or dates. */
    facts?: { label: string; value: string }[];
    className?: string;
}

const statusStyle: Record<MarketStatus, string> = {
    active: 'bg-navy text-white',
    planned: 'border border-dashed border-line-strong text-ink-muted',
    paused: 'border border-line-strong text-ink-muted',
};

/**
 * Export market card. Status is shown as text + shape (never colour only):
 * active = solid navy pill with dot, planned = dashed outline, paused = outline.
 */
export default function MarketCard({ name, status, region, description, countryCode, href, facts, className }: MarketCardProps) {
    const t = useTranslations('v2.market');
    const Title = href ? (
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {name}
        </Link>
    ) : (
        name
    );
    return (
        <article
            data-surface="light"
            className={cn(
                'relative flex h-full flex-col rounded-card border border-line bg-white p-5 text-ink',
                href && 'transition-shadow duration-base hover:shadow-card motion-reduce:transition-none',
                className,
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {countryCode ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`/flags/${countryCode.toLowerCase()}.svg`}
                            alt=""
                            aria-hidden="true"
                            width={28}
                            height={20}
                            className="h-5 w-7 rounded-[2px] border border-line object-cover"
                            loading="lazy"
                        />
                    ) : null}
                    <h3 className="text-heading-md text-navy">{Title}</h3>
                </div>
                <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold', statusStyle[status])}>
                    {status === 'active' ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" /> : null}
                    {t(`status_${status}`)}
                </span>
            </div>
            {region ? <p className="mt-2 text-caption text-ink-subtle">{region}</p> : null}
            {facts?.length ? (
                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-body-sm">
                    {facts.map((f) => (
                        <div key={f.label}>
                            <dt className="text-caption text-ink-subtle">{f.label}</dt>
                            <dd className="font-medium text-ink">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            ) : null}
            {description ? <p className="mt-3 text-body-sm text-ink-muted">{description}</p> : null}
            {href ? (
                <span aria-hidden="true" className="mt-auto inline-flex pt-4 text-navy">
                    <ArrowIcon size={18} />
                </span>
            ) : null}
        </article>
    );
}
