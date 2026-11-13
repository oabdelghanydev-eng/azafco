import { FLAGS, MAP_COUNTRIES } from '@/components/g/home/gMarketsMap';

/**
 * Static shipping-routes map for the markets pages, in the visual language of the
 * G home markets section (components/g/home/GMarkets.tsx): same base map, country
 * outlines, gold dashed routes from Egypt (Motobas) and round flag pins.
 * Server-only, no client JS. Geometry copied from the G home (viewBox 0 0 1000 620).
 *
 * `highlight` (country code, lower case) draws that market's route solid and fills
 * its outline in gold (market detail pages); without it every route is drawn equally.
 */
const BASE_MAP = '/images/g/markets-map.svg';
const EG = { x: 267.3, y: 216.8 };

type Anchor = 'start' | 'middle' | 'end';
type Geo = {
    /** index into MAP_COUNTRIES (order: ae, kw, bh, lb, qa, iq, sy) */
    outline: number;
    pin: readonly [number, number];
    q: readonly [number, number];
    label: readonly [number, number, Anchor];
    fd: readonly [number, number];
    fm: readonly [number, number];
};

export const MAP_GEO: Record<'ae' | 'kw' | 'bh' | 'lb' | 'qa' | 'iq' | 'sy', Geo> = {
    ae: { outline: 0, pin: [760.3, 369.5], q: [556.6, 155.1], label: [782.3, 377.5, 'start'], fd: [742.1, 355.9], fm: [746.6, 359.3] },
    kw: { outline: 1, pin: [618.5, 248.6], q: [451.8, 134.4], label: [640.5, 254.6, 'start'], fd: [600.3, 234.9], fm: [604.9, 238.4] },
    bh: { outline: 2, pin: [680.9, 326.2], q: [504.7, 155.7], label: [660.9, 312.2, 'end'], fd: [662.7, 312.6], fm: [667.2, 316.0] },
    lb: { outline: 3, pin: [369.9, 134.2], q: [295.5, 146.8], label: [347.9, 142.2, 'end'], fd: [351.7, 120.5], fm: [356.2, 124.0] },
    qa: { outline: 4, pin: [694.7, 343.8], q: [516.6, 160.6], label: [672.7, 365.8, 'end'], fd: [676.5, 330.2], fm: [681.1, 333.6] },
    iq: { outline: 5, pin: [537.5, 156.8], q: [385.6, 111.1], label: [537.5, 130.8, 'middle'], fd: [519.3, 143.2], fm: [523.9, 146.6] },
    sy: { outline: 6, pin: [425.7, 105.5], q: [315.3, 116.8], label: [425.7, 79.5, 'middle'], fd: [407.5, 91.8], fm: [412.1, 95.3] },
};

export type MapCode = keyof typeof MAP_GEO;
export const isMapCode = (code: string): code is MapCode => code in MAP_GEO;

export interface MarketsMapProps {
    /** Markets to draw (lower-case country codes with geometry) and their short map labels */
    markets: { code: MapCode; short: string }[];
    /** Accessible description of the map (role="img") */
    label: string;
    /** Origin label under the Egypt pin, e.g. "Egypt · Motobas" */
    origin: string;
    highlight?: MapCode;
    /** Unique prefix for the SVG ids when the map appears more than once on a page */
    idPrefix?: string;
    className?: string;
}

function MapSvg({ variant, markets, label, origin, highlight, p }: MarketsMapProps & { variant: 'desktop' | 'phone'; p: string }) {
    const desk = variant === 'desktop';
    const pinR = desk ? 16 : 12;
    const flagScale = desk ? 1 : 0.75;
    const on = (code: MapCode) => !highlight || highlight === code;
    return (
        <svg
            viewBox={desk ? '0 0 1000 620' : '170 30 700 420'}
            role="img"
            aria-label={label}
            className={desk ? 'hidden h-auto w-full lg:block' : 'block h-auto w-full lg:hidden'}
        >
            <image href={BASE_MAP} x="0" y="0" width="1000" height="620" preserveAspectRatio="none" />
            {markets.map(({ code }) => (
                <use
                    key={code}
                    href={`#${p}-c-${code}`}
                    fill={highlight === code ? 'rgba(247,181,0,0.32)' : 'rgba(143,193,255,0.2)'}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="0.8"
                />
            ))}
            {markets.map(({ code }) => {
                const g = MAP_GEO[code];
                const strong = highlight === code;
                return (
                    <path
                        key={code}
                        d={`M${EG.x} ${EG.y} Q${g.q[0]} ${g.q[1]} ${g.pin[0]} ${g.pin[1]}`}
                        fill="none"
                        stroke="#f7b500"
                        strokeLinecap="round"
                        strokeWidth={strong ? 3 : 1.6}
                        strokeDasharray={strong ? undefined : '2 7'}
                        opacity={on(code) ? 0.9 : 0.45}
                    />
                );
            })}
            {markets.map(({ code, short }) => {
                const g = MAP_GEO[code];
                const f = desk ? g.fd : g.fm;
                return (
                    <g key={code}>
                        <circle
                            cx={g.pin[0]}
                            cy={g.pin[1]}
                            r={pinR}
                            fill="#fff"
                            stroke={highlight === code ? '#f7b500' : '#fff'}
                            strokeWidth="2.5"
                        />
                        <g clipPath={`url(#${p}-${desk ? 'cd' : 'cm'}-${code})`}>
                            <use href={`#${p}-flag-${code}`} transform={`translate(${f[0]} ${f[1]}) scale(${flagScale})`} />
                        </g>
                        {desk ? (
                            <text
                                x={g.label[0]}
                                y={g.label[1]}
                                textAnchor={g.label[2]}
                                fontSize="17"
                                fontWeight="700"
                                fill="#fff"
                                stroke="#002d72"
                                strokeWidth="5"
                                paintOrder="stroke"
                                opacity={on(code) ? 1 : 0.7}
                            >
                                {short}
                            </text>
                        ) : null}
                    </g>
                );
            })}
            <circle cx={EG.x} cy={EG.y} r={desk ? 34.2 : 27.4} fill="none" stroke="#f7b500" strokeWidth="1.5" opacity=".5" />
            <circle cx={EG.x} cy={EG.y} r={desk ? 23 : 19.2} fill="#f7b500" />
            <g clipPath={`url(#${p}-${desk ? 'cd' : 'cm'}-eg)`}>
                <use href={`#${p}-flag-eg`} transform={desk ? 'translate(241.3 197.2)' : 'translate(246.5 201.1) scale(0.8)'} />
            </g>
            <text x={EG.x} y={desk ? 276.8 : 260.8} textAnchor="middle" fontSize={desk ? 18 : 14} fontWeight="700" fill="#f7b500">
                {origin}
            </text>
        </svg>
    );
}

/** Desktop map (labels) from lg, cropped phone map below lg. Wrapped in dir="ltr" (map geometry is not mirrored). */
export default function MarketsMap(props: MarketsMapProps) {
    const p = props.idPrefix ?? 'mkm';
    return (
        <div dir="ltr" className={props.className}>
            <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', overflow: 'hidden' }}>
                <defs>
                    {props.markets.map(({ code }) => (
                        <path key={code} id={`${p}-c-${code}`} d={MAP_COUNTRIES[MAP_GEO[code].outline]} />
                    ))}
                    {props.markets.map(({ code }) => (
                        <image key={code} id={`${p}-flag-${code}`} href={FLAGS[code]} width="36.4" height="27.3" preserveAspectRatio="xMidYMid slice" />
                    ))}
                    <image id={`${p}-flag-eg`} href={FLAGS.eg} width="52.1" height="39.1" preserveAspectRatio="xMidYMid slice" />
                    {props.markets.map(({ code }) => (
                        <clipPath key={`d-${code}`} id={`${p}-cd-${code}`}>
                            <circle cx={MAP_GEO[code].pin[0]} cy={MAP_GEO[code].pin[1]} r="13" />
                        </clipPath>
                    ))}
                    {props.markets.map(({ code }) => (
                        <clipPath key={`m-${code}`} id={`${p}-cm-${code}`}>
                            <circle cx={MAP_GEO[code].pin[0]} cy={MAP_GEO[code].pin[1]} r="9.75" />
                        </clipPath>
                    ))}
                    <clipPath id={`${p}-cd-eg`}>
                        <circle cx={EG.x} cy={EG.y} r="19" />
                    </clipPath>
                    <clipPath id={`${p}-cm-eg`}>
                        <circle cx={EG.x} cy={EG.y} r="15.2" />
                    </clipPath>
                </defs>
            </svg>
            <MapSvg {...props} variant="desktop" p={p} />
            <MapSvg {...props} variant="phone" p={p} />
        </div>
    );
}
