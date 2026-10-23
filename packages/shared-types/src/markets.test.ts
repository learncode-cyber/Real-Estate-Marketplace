import { describe, expect, it } from 'vitest';
import { MARKET_CONFIGS, getMarketConfig, textDirectionFor } from './markets';

describe('market configuration (Phase 0 owner decisions)', () => {
  it('starts with Bangladesh as the first expansion market, with Khulna as the launch area', () => {
    const first = MARKET_CONFIGS.find((m) => m.expansionOrder === 1);
    expect(first?.countryCode).toBe('BD');
    expect(first?.launchArea?.name).toBe('Khulna');
  });

  it('plans the owner-listed international markets in order: UAE, Saudi Arabia, Egypt', () => {
    const order = [...MARKET_CONFIGS]
      .sort((a, b) => a.expansionOrder - b.expansionOrder)
      .map((m) => m.countryCode);
    expect(order).toEqual(['BD', 'AE', 'SA', 'EG']);
  });

  it('uses ISO-shaped codes and a supported currency exponent for every market', () => {
    for (const market of MARKET_CONFIGS) {
      expect(market.countryCode).toMatch(/^[A-Z]{2}$/);
      expect(market.currencyCode).toMatch(/^[A-Z]{3}$/);
      expect(market.currencyMinorUnits).toBeGreaterThanOrEqual(0);
      expect(market.currencyMinorUnits).toBeLessThanOrEqual(4);
    }
  });

  it('expects currencies BDT, AED, SAR, and EGP as configured', () => {
    expect(MARKET_CONFIGS.map((m) => m.currencyCode)).toEqual(['BDT', 'AED', 'SAR', 'EGP']);
  });

  it('only supports English, Bengali, and Arabic', () => {
    for (const market of MARKET_CONFIGS) {
      expect(market.supportedLocales).toContain(market.defaultLocale);
      for (const locale of market.supportedLocales) {
        expect(['en', 'bn', 'ar']).toContain(locale);
      }
    }
  });

  it('activates no market by default', () => {
    expect(MARKET_CONFIGS.every((m) => m.lifecycle === 'CONFIGURED')).toBe(true);
  });

  it('derives text direction from locale, with Arabic as right-to-left', () => {
    expect(textDirectionFor('ar')).toBe('rtl');
    expect(textDirectionFor('bn')).toBe('ltr');
    expect(textDirectionFor('en')).toBe('ltr');
  });

  it('looks up markets by country code', () => {
    expect(getMarketConfig('BD')?.currencyCode).toBe('BDT');
    expect(getMarketConfig('ZZ')).toBeUndefined();
  });
});
