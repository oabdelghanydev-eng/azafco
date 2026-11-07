/**
 * Market lists for the v2 markets pages, derived from config/company.config.ts
 * (single source of truth for status). Never upgrade a status in copy.
 */
import { companyConfig, type MarketConfig } from '@/config/company.config';

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
    ES: 'europe',
    RU: 'europe',
    US: 'americas',
};

export const regionOf = (m: Pick<MarketConfig, 'countryCode'>): MarketRegion => REGION[m.countryCode] ?? 'other';

const all = companyConfig.markets as readonly MarketConfig[];
export const activeMarketConfigs = all.filter((m) => m.status === 'active');
export const otherMarketConfigs = all.filter((m) => m.status !== 'active');
export const getActiveMarketConfig = (key: string) => activeMarketConfigs.find((m) => m.key === key);
