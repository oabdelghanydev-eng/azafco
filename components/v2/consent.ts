/**
 * Cookie consent constants shared by the server layout (GA inline script) and the
 * client banner (components/v2/ConsentBanner.tsx). Plain module: a server component
 * cannot read values exported from a 'use client' file.
 */

/** localStorage key holding 'granted' or 'denied'. */
export const CONSENT_STORAGE_KEY = 'azafco-consent';
export type ConsentChoice = 'granted' | 'denied';

/** Consent Mode v2 types, all 'denied' by default and switched together by the banner. */
export const CONSENT_TYPES = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'] as const;
