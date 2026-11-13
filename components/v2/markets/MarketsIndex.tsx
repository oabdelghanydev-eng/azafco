import { Link } from '@/navigation';
import { ArrowIcon } from '@/components/v2/icons';
import { routes } from '@/lib/v2/routes';
import MarketsMap, { isMapCode, type MapCode } from './MarketsMap';
import { flagSrc } from './marketData';

/**
 * Navy markets block in the G home style (components/g/home/GMarkets.tsx):
 * active markets with round flags and start year on the start side, the
 * route map on the end side, planned markets (dashed flags) and the paused note below.
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
    ar?: boolean;
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
    ar = false,
}: MarketsIndexProps) {
    const mapMarkets = active
        .map((m) => ({ code: m.countryCode.toLowerCase(), short: m.short }))
        .filter((m): m is { code: MapCode; short: string } => isMapCode(m.code));
    const currentCode = active.find((m) => m.key === current)?.countryCode.toLowerCase();
    const highlight = currentCode && isMapCode(currentCode) ? currentCode : undefined;

    const h = ar
        ? 'text-[28px] font-bold leading-[1.4] lg:text-[clamp(32px,3.4vw,50px)] lg:leading-[1.35]'
        : 'text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[1.12]';

    return (
        <section
            aria-labelledby={headingId}
            data-surface="dark"
            className={`bg-[#002d72] text-white ${ar ? 'text-[17px] leading-[1.85] lg:text-[18px]' : 'text-[16px] leading-[1.6] lg:text-[17px] lg:leading-[1.65]'}`}
        >
            <div className="mx-auto box-border max-w-[1320px] px-5 py-16 lg:grid lg:grid-cols-[430px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-8 lg:py-28">
                <div className="min-w-0">
                    <p className={`m-0 mb-3 flex items-center gap-3 text-[#f7b500] ${ar ? 'text-[15px] font-bold lg:text-[17px]' : 'text-[14px] font-extrabold lg:text-[15px]'}`}>
                        <span aria-hidden="true" className="h-0.5 w-8 shrink-0 bg-[#f7b500]" />
                        <span>{eyebrow}</span>
                    </p>
                    <H id={headingId} className={`m-0 ${h}`}>
                        {title}
                    </H>
                    {intro ? <p className="m-0 mt-[14px] text-white/90 lg:mt-5">{intro}</p> : null}

                    {/* phone/tablet map between the intro and the list */}
                    <MarketsMap
                        markets={mapMarkets}
                        label={mapLabel}
                        origin={origin}
                        highlight={highlight}
                        idPrefix={`${headingId}-m`}
                        className="-mx-3 mt-4 lg:hidden"
                    />

                    <ul className="m-0 mt-2 grid list-none gap-1 p-0 lg:mt-[26px]">
                        {active.map((m) => {
                            const isCurrent = m.key === current;
                            return (
                                <li key={m.key}>
                                    <Link
                                        href={`${routes.markets}/${m.key}`}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={`group flex min-h-[48px] items-center gap-[14px] rounded-lg px-[14px] py-[10px] font-bold text-white transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b500] motion-reduce:transition-none lg:py-3 ${
                                            isCurrent ? 'bg-white/[0.12]' : ''
                                        } text-[17px] lg:text-[18px]`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`h-8 w-8 flex-none overflow-hidden rounded-full bg-white ${isCurrent ? 'shadow-[0_0_0_2px_#f7b500]' : 'shadow-[0_0_0_2px_rgba(255,255,255,0.3)]'}`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={flagSrc(m.countryCode)} alt="" width={32} height={32} className="h-full w-full object-cover" loading="lazy" />
                                        </span>
                                        <span className="min-w-0 flex-1">{m.name}</span>
                                        <span className="whitespace-nowrap text-[14px] font-semibold text-white/75">{m.since}</span>
                                        <ArrowIcon size={18} className="shrink-0 text-[#f7b500] opacity-70 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {planned.length || pausedNote ? (
                        <div className="mt-[18px] border-t border-white/20 pt-[18px] lg:mt-[22px]">
                            {planned.length ? (
                                <>
                                    <p className="m-0 mb-3 text-[14px] font-bold text-[#f7b500]">{plannedTitle}</p>
                                    <ul className="m-0 flex list-none flex-wrap gap-x-[26px] gap-y-[14px] p-0">
                                        {planned.map((m) => (
                                            <li key={m.key} className="flex items-center gap-[10px]">
                                                <span
                                                    aria-hidden="true"
                                                    className="h-[30px] w-[30px] flex-none rounded-full bg-white bg-cover bg-center bg-no-repeat opacity-[0.85] outline-dashed outline-[1.5px] outline-offset-[3px] outline-white/60"
                                                    style={{ backgroundImage: `url("${flagSrc(m.countryCode)}")` }}
                                                />
                                                <span className="text-[16px] font-bold">{m.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : null}
                            {pausedNote ? <p className="m-0 mt-[14px] text-[14px] text-white/75">{pausedNote}</p> : null}
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
        </section>
    );
}
