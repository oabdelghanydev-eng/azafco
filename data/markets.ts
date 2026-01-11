/**
 * Market Types and Data - Derives order from config
 * 
 * Market ORDER comes from: config/company.config.ts (Kuwait #1)
 * Market LABELS come from: locales/[locale]/data/markets.json
 */

import { companyConfig, MarketStatus } from '@/config/company.config';

// Re-export type for backward compatibility
export type { MarketStatus };

export interface Market {
    // Translation key for market data (e.g., 'uae', 'kuwait')
    // Used to lookup translations at data.markets.[key]
    translationKey: string;
    flag: string;
    // For coming-soon status, use translationKey 'coming_soon' to lookup t('common.coming_soon')
    since: string;
    status?: 'paused' | 'coming-soon';
}

// Map config status to UI status
function mapStatus(status: MarketStatus): 'paused' | 'coming-soon' | undefined {
    if (status === 'paused') return 'paused';
    if (status === 'planned') return 'coming-soon';
    return undefined;
}

// Derive markets from config - ORDER IS FROM CONFIG (Kuwait #1)
export const markets: Market[] = companyConfig.markets.map(m => ({
    translationKey: m.key,
    flag: `/flags/${m.countryCode}.svg`,
    since: m.since ? String(m.since) : 'coming_soon',
    status: mapStatus(m.status),
}));

export const marketCountries = markets.filter(m => m.status !== 'coming-soon');
