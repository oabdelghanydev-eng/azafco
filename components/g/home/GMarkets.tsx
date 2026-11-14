import { getTranslations } from 'next-intl/server';
import { Eyebrow, cn, typography } from '@/components/ui';
import styles from './GMarkets.module.css';
import { FLAGS, MAP_COUNTRIES, PLANNED_FLAGS } from './gMarketsMap';
import { GMarketsList, GMarketsState } from './GMarketsPicker';

/** Static base map (world outline + Egypt highlight), viewBox 0 0 1000 620, drawn under the dynamic layers. */
const BASE_MAP = '/images/g/markets-map.svg';

/** Egypt (Motobas) origin on the map, viewBox 0 0 1000 620. */
const EG = { x: 267.3, y: 216.8 };

type Anchor = 'start' | 'middle' | 'end';

/**
 * The seven markets in board order (MK). Years and geometry copied from the G boards:
 * pin centre, route control point, desktop label position and the flag image
 * origins for the desktop (36.4 x 27.3) and phone (27.3 x 20.5) maps.
 */
const MARKETS = [
    { code: 'ae', since: 2008, pin: [760.3, 369.5], q: [556.6, 155.1], label: [782.3, 377.5, 'start'], fd: [742.1, 355.9], fm: [746.6, 359.3] },
    { code: 'kw', since: 2009, pin: [618.5, 248.6], q: [451.8, 134.4], label: [640.5, 254.6, 'start'], fd: [600.3, 234.9], fm: [604.9, 238.4] },
    { code: 'bh', since: 2012, pin: [680.9, 326.2], q: [504.7, 155.7], label: [660.9, 312.2, 'end'], fd: [662.7, 312.6], fm: [667.2, 316.0] },
    { code: 'lb', since: 2015, pin: [369.9, 134.2], q: [295.5, 146.8], label: [347.9, 142.2, 'end'], fd: [351.7, 120.5], fm: [356.2, 124.0] },
    { code: 'qa', since: 2024, pin: [694.7, 343.8], q: [516.6, 160.6], label: [672.7, 365.8, 'end'], fd: [676.5, 330.2], fm: [681.1, 333.6] },
    { code: 'iq', since: 2025, pin: [537.5, 156.8], q: [385.6, 111.1], label: [537.5, 130.8, 'middle'], fd: [519.3, 143.2], fm: [523.9, 146.6] },
    { code: 'sy', since: 2026, pin: [425.7, 105.5], q: [315.3, 116.8], label: [425.7, 79.5, 'middle'], fd: [407.5, 91.8], fm: [412.1, 95.3] },
] as const satisfies ReadonlyArray<{
    code: keyof typeof FLAGS;
    since: number;
    pin: readonly [number, number];
    q: readonly [number, number];
    label: readonly [number, number, Anchor];
    fd: readonly [number, number];
    fm: readonly [number, number];
}>;

const PLANNED = ['eu', 'ru', 'us'] as const;

const M_CLASS = [styles.m0, styles.m1, styles.m2, styles.m3, styles.m4, styles.m5, styles.m6];

/** Hidden <defs>: selectable country outlines, flag images and pin clip circles, shared by the desktop and phone maps. */
function MapDefs() {
    return (
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute overflow-hidden">
            <defs>
                {MAP_COUNTRIES.map((d, k) => (
                    <path key={k} id={`gmk-c${k}`} d={d} />
                ))}
                {MARKETS.map((m) => (
                    <image key={m.code} id={`gmk-flag-${m.code}`} href={FLAGS[m.code]} width="36.4" height="27.3" preserveAspectRatio="xMidYMid slice" />
                ))}
                <image id="gmk-flag-eg" href={FLAGS.eg} width="52.1" height="39.1" preserveAspectRatio="xMidYMid slice" />
                {MARKETS.map((m) => (
                    <clipPath key={`d-${m.code}`} id={`gmk-cd-${m.code}`}>
                        <circle cx={m.pin[0]} cy={m.pin[1]} r="13" />
                    </clipPath>
                ))}
                {MARKETS.map((m) => (
                    <clipPath key={`m-${m.code}`} id={`gmk-cm-${m.code}`}>
                        <circle cx={m.pin[0]} cy={m.pin[1]} r="9.75" />
                    </clipPath>
                ))}
                <clipPath id="gmk-cd-eg">
                    <circle cx={EG.x} cy={EG.y} r="19" />
                </clipPath>
                <clipPath id="gmk-cm-eg">
                    <circle cx={EG.x} cy={EG.y} r="15.2" />
                </clipPath>
            </defs>
        </svg>
    );
}

type MapProps = {
    variant: 'desktop' | 'phone';
    label: string;
    origin: string;
    shortNames: string[];
};

/** Shipping-routes map. Desktop: viewBox 0 0 1000 620 with labels; phone: cropped 170 30 700 420, no market labels. */
function MarketsMap({ variant, label, origin, shortNames }: MapProps) {
    const desk = variant === 'desktop';
    const pinR = desk ? 16 : 12;
    const flagScale = desk ? 1 : 0.75;
    return (
        <svg viewBox={desk ? '0 0 1000 620' : '170 30 700 420'} role="img" aria-label={label} className={styles.map}>
            {/* base map in the same 0 0 1000 620 user space as everything below (phone viewBox just crops it) */}
            <image href={BASE_MAP} x="0" y="0" width="1000" height="620" preserveAspectRatio="none" />
            {MARKETS.map((m, k) => (
                <use key={m.code} href={`#gmk-c${k}`} className={`${styles.country} ${M_CLASS[k]}`} />
            ))}
            {MARKETS.map((m, k) => (
                <path
                    key={m.code}
                    d={`M${EG.x} ${EG.y} Q${m.q[0]} ${m.q[1]} ${m.pin[0]} ${m.pin[1]}`}
                    className={`${styles.route} ${M_CLASS[k]}`}
                />
            ))}
            {MARKETS.map((m, k) => {
                const f = desk ? m.fd : m.fm;
                return (
                    <g key={m.code}>
                        <circle cx={m.pin[0]} cy={m.pin[1]} r={pinR} className={`${styles.pin} ${M_CLASS[k]}`} />
                        <g clipPath={`url(#gmk-${desk ? 'cd' : 'cm'}-${m.code})`}>
                            <use href={`#gmk-flag-${m.code}`} transform={`translate(${f[0]} ${f[1]}) scale(${flagScale})`} />
                        </g>
                        {desk && (
                            <text x={m.label[0]} y={m.label[1]} textAnchor={m.label[2]} fontSize="17" className={styles.label}>
                                {shortNames[k]}
                            </text>
                        )}
                    </g>
                );
            })}
            <circle cx={EG.x} cy={EG.y} r={desk ? 34.2 : 27.4} strokeWidth="1.5" opacity=".5" className="fill-none stroke-gold" />
            <circle cx={EG.x} cy={EG.y} r={desk ? 23 : 19.2} className="fill-gold" />
            <g clipPath={`url(#gmk-${desk ? 'cd' : 'cm'}-eg)`}>
                <use href="#gmk-flag-eg" transform={desk ? 'translate(241.3 197.2)' : 'translate(246.5 201.1) scale(0.8)'} />
            </g>
            <text x={EG.x} y={desk ? 276.8 : 260.8} textAnchor="middle" fontSize={desk ? 18 : 14} fontWeight="700" className="fill-gold">
                {origin}
            </text>
        </svg>
    );
}

/** Home "markets" section (design G): seven active markets with a route map, planned markets below. */
export default async function GMarkets() {
    const t = await getTranslations('g_markets_v2');

    const items = MARKETS.map((m) => ({
        code: m.code,
        name: t(`markets.${m.code}.name`),
        since: t('since', { year: String(m.since) }),
    }));
    const shortNames = MARKETS.map((m) => t(`markets.${m.code}.short`));
    const mapLabel = t('mapLabel');
    const origin = t('origin');

    return (
        // Board navy (token `navy`), one step lighter than the fish band and the footer.
        <section
            id="markets"
            data-surface="dark"
            aria-labelledby="g-markets-title"
            className="g-font relative scroll-mt-24 bg-navy text-body text-white"
        >
            <MapDefs />
            <GMarketsState
                className={cn(
                    'mx-auto box-border w-full max-w-[760px] px-5 py-section-sm md:px-8 md:py-20 lg:grid lg:max-w-[1360px] lg:grid-cols-[430px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-[104px]',
                )}
            >
                <div className="min-w-0">
                    <Eyebrow className="mb-2.5 lg:mb-3.5">{t('eyebrow')}</Eyebrow>
                    <h2 id="g-markets-title" className={cn('v2-heading m-0', typography.h2)}>
                        {t('title')}
                    </h2>
                    <p className="m-0 mb-2 mt-3.5 text-fg-muted lg:mb-0 lg:mt-5">{t('intro')}</p>

                    {/* phone/tablet map sits between the intro and the list */}
                    <div dir="ltr" className="-mx-3 lg:hidden">
                        <MarketsMap variant="phone" label={mapLabel} origin={origin} shortNames={shortNames} />
                    </div>

                    <GMarketsList items={items} className="m-0 mt-1 grid list-none gap-0.5 p-0 lg:mt-[26px] lg:gap-1" />

                    <div className="mt-[18px] border-0 border-t border-solid border-white/20 pt-[18px] lg:mt-[22px]">
                        <p className={cn('m-0 mb-3 font-bold text-gold', typography.caption)}>{t('plannedTitle')}</p>
                        <ul className="m-0 flex list-none flex-wrap gap-x-[26px] gap-y-3.5 p-0">
                            {PLANNED.map((code) => (
                                <li key={code} className="flex items-center gap-2.5">
                                    <span
                                        aria-hidden="true"
                                        className="h-[30px] w-[30px] flex-none rounded-full bg-white bg-cover bg-center bg-no-repeat opacity-85 outline-dashed outline-[1.5px] outline-offset-[3px] outline-white/60"
                                        style={{ backgroundImage: `url("${PLANNED_FLAGS[code]}")` }}
                                    />
                                    <span className="font-bold">{t(`planned.${code}`)}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={cn('m-0 mt-3.5 text-fg-muted', typography.caption)}>{t('paused')}</p>
                    </div>
                </div>

                <div dir="ltr" className="hidden min-w-0 lg:block">
                    <MarketsMap variant="desktop" label={mapLabel} origin={origin} shortNames={shortNames} />
                </div>
            </GMarketsState>
        </section>
    );
}
