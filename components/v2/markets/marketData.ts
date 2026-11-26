/**
 * Market lists for the markets pages, derived from config/company.config.ts
 * (single source of truth for status and start year). Never upgrade a status in copy.
 *
 * Owner decisions (docs/team/web/g/RELEASE-DECISIONS.md, 14 Nov 2026):
 * - 7 registered active markets, shown as "7+" ("the Middle East and beyond");
 * - Russia and the USA are planned; Spain is paused.
 * Owner, 22 Nov 2026 (ROUND-ASTRA-SPEC §1.7): AZAFCO is approved for export to the
 * European Union, so Europe is no longer a planned entry. The pages show one
 * "European Union: approved for export" line before the planned list instead
 * (never an approval number, establishment number or date).
 */
import { companyConfig, type MarketConfig, type MarketStatus } from '@/config/company.config';

export type MarketRegion = 'gulf' | 'levant' | 'middle_east' | 'europe' | 'americas' | 'other';

/** Display grouping only (geography, not business status) */
const REGION: Record<string, MarketRegion> = {
    KW: 'gulf',
    AE: 'gulf',
    QA: 'gulf',
    BH: 'gulf',
    SA: 'gulf',
    OM: 'gulf',
    IQ: 'middle_east',
    SY: 'levant',
    LB: 'levant',
    JO: 'levant',
    EU: 'europe',
    ES: 'europe',
    RU: 'europe',
    US: 'americas',
};

export const regionOf = (m: Pick<MarketConfig, 'countryCode'>): MarketRegion => REGION[m.countryCode] ?? 'other';

/** A market as the pages show it. `key` = translation key in data.markets.<key>.country */
export interface DisplayMarket {
    key: string;
    countryCode: string;
    status: MarketStatus;
    since: number | null;
}

const all = companyConfig.markets as readonly MarketConfig[];

/** Active markets in the order the G home shows them: by start year (UAE 2008 … Syria 2026). */
export const activeMarketConfigs = all
    .filter((m) => m.status === 'active')
    .slice()
    .sort((a, b) => (a.since ?? 9999) - (b.since ?? 9999));

/** Planned markets: the planned config countries (Russia, the United States). */
export const plannedMarkets: DisplayMarket[] = all.filter((m) => m.status === 'planned');

/** Paused markets (Spain). The start year is not shown for paused markets. */
export const pausedMarkets: DisplayMarket[] = all.filter((m) => m.status === 'paused');

/** Every non-active market (planned + paused), for callers that need one list. */
export const otherMarketConfigs: DisplayMarket[] = [...plannedMarkets, ...pausedMarkets];

export const getActiveMarketConfig = (key: string) => activeMarketConfigs.find((m) => m.key === key);

/** Flag image in public/flags (flag-icons set). */
export const flagSrc = (countryCode: string) => `/flags/${countryCode.toLowerCase()}.svg`;
