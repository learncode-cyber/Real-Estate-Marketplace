import { describe, expect, it } from 'vitest';
import type { PropertySummary } from '@property-platform/shared-types';
import { toListingSummary } from './map-listing';
import { toApiParams } from './search-params';

const base: PropertySummary = {
  id: '1',
  slug: 'demo-x',
  title: 'Demo: test',
  listingType: 'RENT',
  kind: 'APARTMENT',
  priceMinor: 2500000,
  currencyCode: 'BDT',
  bedrooms: 3,
  bathrooms: 2,
  areaSqm: 135,
  areaSlug: 'sonadanga',
  areaNameEn: 'Sonadanga',
  areaNameBn: 'সোনাডাঙ্গা',
  imageUrl: null,
  imageAlt: null,
  isDemo: true,
  publishedAt: '2026-10-20T00:00:00.000Z',
};

describe('toListingSummary', () => {
  it('uses the Bengali area name for Bengali locale and English otherwise', () => {
    expect(toListingSummary(base, 'bn').locationLabel).toBe('সোনাডাঙ্গা');
    expect(toListingSummary(base, 'en').locationLabel).toBe('Sonadanga');
  });

  it('marks listings published within 14 days as new', () => {
    const now = Date.parse('2026-10-23T00:00:00.000Z');
    expect(toListingSummary(base, 'en', now).isNew).toBe(true);
    expect(
      toListingSummary({ ...base, publishedAt: '2026-08-01T00:00:00.000Z' }, 'en', now).isNew,
    ).toBe(false);
  });

  it('falls back to the placeholder image when none is provided', () => {
    const card = toListingSummary(base, 'en');
    expect(card.imageUrl).toBe('/images/property-placeholder.svg');
    expect(card.listingType).toBe('rent');
  });
});

describe('toApiParams', () => {
  it('forwards only known, well-formed filters', () => {
    const params = toApiParams({
      listingType: 'RENT',
      area: 'sonadanga',
      minPrice: '1000',
      bedrooms: '2',
      sort: 'price_asc',
      evil: 'x',
      page: '2',
    });
    expect(params.toString()).toBe(
      'listingType=RENT&area=sonadanga&minPrice=1000&bedrooms=2&page=2&sort=price_asc',
    );
  });

  it('drops values that fail validation instead of forwarding them', () => {
    const params = toApiParams({
      listingType: 'LEASE',
      area: "x'; drop",
      minPrice: '-5',
      sort: 'random',
    });
    expect(params.toString()).toBe('');
  });
});
