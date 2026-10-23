/**
 * Market configuration (Phase 0 owner decisions, recorded in docs/PHASE-0-DECISIONS.md).
 *
 * This is configuration, not domain logic. A market becomes active only when its
 * lifecycle is advanced through the readiness checklist (PLANNING.md Phase 9). Nothing
 * here activates a market by itself.
 */

export type SupportedLocale = 'en' | 'bn' | 'ar';

export type MarketLifecycle = 'CONFIGURED' | 'READINESS_REVIEW' | 'LAUNCHED' | 'SUSPENDED';

export interface LaunchArea {
  /** Human-readable name of the first city/area inside the market. */
  readonly name: string;
}

export interface MarketConfig {
  /** ISO 3166-1 alpha-2 country code. */
  readonly countryCode: string;
  readonly name: string;
  /** ISO 4217 currency code. Amounts are stored as integer minor units. */
  readonly currencyCode: string;
  /** Number of minor-unit decimal places for the currency (ISO 4217 exponent). */
  readonly currencyMinorUnits: number;
  /** IANA timezone used at the presentation boundary. */
  readonly timezone: string;
  readonly defaultLocale: SupportedLocale;
  readonly supportedLocales: readonly SupportedLocale[];
  /** Expansion order from the owner's plan: 1 = first, then international markets. */
  readonly expansionOrder: number;
  readonly launchArea?: LaunchArea;
  readonly lifecycle: MarketLifecycle;
}

/** Arabic is right-to-left; direction is derived from locale, never stored per market. */
export function textDirectionFor(locale: SupportedLocale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export const MARKET_CONFIGS: readonly MarketConfig[] = [
  {
    countryCode: 'BD',
    name: 'Bangladesh',
    currencyCode: 'BDT',
    currencyMinorUnits: 2,
    timezone: 'Asia/Dhaka',
    // Owner's plan: Bengali and English. Default locale is an open product decision;
    // English is used until the owner confirms Bengali-first (see PHASE-0-DECISIONS.md).
    defaultLocale: 'en',
    supportedLocales: ['en', 'bn'],
    expansionOrder: 1,
    launchArea: { name: 'Khulna' },
    lifecycle: 'CONFIGURED',
  },
  {
    countryCode: 'AE',
    name: 'United Arab Emirates',
    currencyCode: 'AED',
    currencyMinorUnits: 2,
    timezone: 'Asia/Dubai',
    defaultLocale: 'en',
    supportedLocales: ['en', 'ar'],
    expansionOrder: 2,
    lifecycle: 'CONFIGURED',
  },
  {
    countryCode: 'SA',
    name: 'Saudi Arabia',
    currencyCode: 'SAR',
    currencyMinorUnits: 2,
    timezone: 'Asia/Riyadh',
    defaultLocale: 'en',
    supportedLocales: ['en', 'ar'],
    expansionOrder: 3,
    lifecycle: 'CONFIGURED',
  },
  {
    countryCode: 'EG',
    name: 'Egypt',
    currencyCode: 'EGP',
    currencyMinorUnits: 2,
    timezone: 'Africa/Cairo',
    defaultLocale: 'en',
    supportedLocales: ['en', 'ar'],
    expansionOrder: 4,
    lifecycle: 'CONFIGURED',
  },
];

export function getMarketConfig(countryCode: string): MarketConfig | undefined {
  return MARKET_CONFIGS.find((m) => m.countryCode === countryCode);
}
