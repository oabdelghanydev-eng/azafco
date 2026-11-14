import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowIcon, Eyebrow, Section, cn, focusRing, typography } from '@/components/ui';
import { routes } from '@/lib/v2/routes';
import MarketsMap, { isMapCode, type MapCode } from './MarketsMap';
import { flagSrc } from './marketData';

/**
 * Navy markets block in the G home style (components/g/home/GMarkets.tsx), built on
 * the design system (Section variant="navy", Eyebrow, type roles, Lucide arrow):
 * active markets with round flags and start year on the start side, the route map
 * on the end side, planned markets (dashed flags) and the paused note below.
 * Unlike the home picker, each market is a link to its detail page (no client JS).
 * All strings arrive translated from the page.
 */
export interface MarketsIndexProps {
    headingId: string;
    eyebrow: string;
    title: string;
    intro?: string;
    /** Active markets in display order */
    active: { key: string; countryCode: string; name: string; short: string; since: string }[];
    planned: { key: string; countryCode: string; name: string }[];
    plannedTitle: string;
    /** e.g. "Spain: exports paused" */
    pausedNote?: string;
    /** Market key of the current detail page (aria-current + map highlight) */
    current?: string;
    mapLabel: string;
    origin: string;
    /** Heading level of the block title */
    as?: 'h2' | 'h3';
    /**
     * Market detail pages: longer, sentence-like titles. Uses the smaller h2 role and
     * a 5/12 text column from xl (instead of 430px) so es/de/fr titles stay short.
     */
    compact?: boolean;
}

export default function MarketsIndex({
    headingId,
    eyebrow,
    title,
    intro,
    active,
    planned,
    plannedTitle,
    pausedNote,
    current,
    mapLabel,
    origin,
    as: H = 'h2',
    compact = false,
}: MarketsIndexProps) {
    const mapMarkets = active
        .map((m) => ({ code: m.countryCode.toLowerCase(), short: m.short }))
        .filter((m): m is { code: MapCode; short: string } => isMapCode(m.code));
    const currentCode = active.find((m) => m.key === current)?.countryCode.toLowerCase();
    const highlight = currentCode && isMapCode(currentCode) ? currentCode : undefined;

    return (
        <Section variant="navy" labelledBy={headingId} contained={false}>
            <div
                className={cn(
                    'mx-auto box-border w-full max-w-v2 px-5 md:px-8 lg:grid lg:grid-cols-[430px_minmax(0,1fr)] lg:items-center lg:gap-12',
                    compact && 'xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]',
                )}
            >
                <div className="mx-auto min-w-0 max-w-[640px] lg:mx-0 lg:max-w-none">
                    <Eyebrow className="mb-3 lg:mb-4">{eyebrow}</Eyebrow>
                    <H id={headingId} className={cn('v2-heading m-0', compact ? typography.h2Sm : typography.h2)}>
                        {title}
                    </H>
                    {intro ? <p className={cn('m-0 mt-3.5 text-fg-muted lg:mt-5', typography.body)}>{intro}</p> : null}

                    {/* phone/tablet map between the intro and the list */}
                    <MarketsMap
                        markets={mapMarkets}
                        label={mapLabel}
                        origin={origin}
                        highlight={highlight}
                        idPrefix={`${headingId}-m`}
                        className="-mx-3 mt-4 lg:hidden"
                    />

                    <ul className="m-0 mt-2 grid list-none gap-1 p-0 lg:mt-7">
                        {active.map((m) => {
                            const isCurrent = m.key === current;
                            return (
                                <li key={m.key}>
                                    <Link
                                        href={`${routes.markets}/${m.key}`}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={cn(
                                            'group flex min-h-12 items-center gap-3.5 rounded-control px-3.5 py-2.5 font-display text-heading-sm text-white transition-colors duration-base hover:bg-white/[.08] motion-reduce:transition-none lg:py-3',
                                            focusRing,
                                            isCurrent && 'bg-white/[.12]',
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'relative h-8 w-8 flex-none overflow-hidden rounded-full bg-white ring-2',
                                                isCurrent ? 'ring-gold' : 'ring-white/30',
                                            )}
                                        >
                                            <Image src={flagSrc(m.countryCode)} alt="" aria-hidden="true" fill sizes="32px" className="object-cover" />
                                        </span>
                                        <span className="min-w-0 flex-1">{m.name}</span>
                                        <span className="whitespace-nowrap text-caption font-semibold text-fg-muted">{m.since}</span>
                                        <ArrowIcon
                                            size={20}
                                            className="shrink-0 text-gold opacity-70 transition-opacity duration-base group-hover:opacity-100 motion-reduce:transition-none"
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {planned.length || pausedNote ? (
                        <div className="mt-5 border-t border-rule pt-5 lg:mt-6">
                            {planned.length ? (
                                <>
                                    <p className="m-0 mb-3 text-caption font-bold text-eyebrow">{plannedTitle}</p>
                                    <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3.5 p-0">
                                        {planned.map((m) => (
                                            <li key={m.key} className="flex items-center gap-2.5">
                                                <span
                                                    aria-hidden="true"
                                                    className="relative h-[30px] w-[30px] flex-none overflow-hidden rounded-full bg-white opacity-85 outline-dashed outline-[1.5px] outline-offset-[3px] outline-white/60"
                                                >
                                                    <Image src={flagSrc(m.countryCode)} alt="" aria-hidden="true" fill sizes="30px" className="object-cover" />
                                                </span>
                                                <span className="text-body font-bold">{m.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                            {pausedNote ? <p className="m-0 mt-3.5 text-caption text-fg-muted">{pausedNote}</p> : null}
                        </div>
                    ) : null}
                </div>

                <MarketsMap
                    markets={mapMarkets}
                    label={mapLabel}
                    origin={origin}
                    highlight={highlight}
                    idPrefix={`${headingId}-d`}
                    className="hidden min-w-0 lg:block"
                />
            </div>
        </Section>
    );
}
