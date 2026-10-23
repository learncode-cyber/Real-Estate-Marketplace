import { describe, expect, it } from 'vitest';
import { formatArea, formatPrice, priceSuffix } from './format';
import { SAMPLE_LISTINGS } from './fixtures';
import { MESSAGES } from '@/messages';

describe('formatPrice', () => {
  it('converts integer minor units to a grouped currency string without floating-point storage', () => {
    expect(formatPrice(150000000, 'BDT', 'en-US')).toMatch(/1,500,000\.00/);
  });

  it('rejects amounts that are not safe integers', () => {
    expect(() => formatPrice(1.5, 'BDT', 'en-US')).toThrow(RangeError);
    expect(() => formatPrice(Number.MAX_SAFE_INTEGER + 2, 'BDT', 'en-US')).toThrow(RangeError);
  });
});

describe('formatArea and priceSuffix', () => {
  it('formats area with a square-metre unit', () => {
    expect(formatArea(135, 'en-US')).toBe('135 m²');
  });

  it('adds the per-month suffix only for rentals', () => {
    expect(priceSuffix('rent', MESSAGES.en)).toBe('/ month');
    expect(priceSuffix('sale', MESSAGES.en)).toBe('');
  });
});

describe('sample fixtures', () => {
  it('have unique ids and slugs, integer prices, and alt text for every image', () => {
    const ids = new Set(SAMPLE_LISTINGS.map((l) => l.id));
    const slugs = new Set(SAMPLE_LISTINGS.map((l) => l.slug));
    expect(ids.size).toBe(SAMPLE_LISTINGS.length);
    expect(slugs.size).toBe(SAMPLE_LISTINGS.length);
    for (const listing of SAMPLE_LISTINGS) {
      expect(Number.isSafeInteger(listing.priceMinor)).toBe(true);
      expect(listing.priceMinor).toBeGreaterThan(0);
      expect(listing.imageAlt.length).toBeGreaterThan(0);
      expect(listing.title).toMatch(/^Sample/);
    }
  });

  it('provides matching Bengali and English message keys', () => {
    expect(Object.keys(MESSAGES.bn).sort()).toEqual(Object.keys(MESSAGES.en).sort());
  });
});
