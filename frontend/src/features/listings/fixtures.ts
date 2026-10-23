import type { ListingSummary } from './types';

/**
 * SYNTHETIC sample data for layout review only. These are not real properties, prices, or
 * owners. They are removed from any public route before real listing data is connected.
 */
const PLACEHOLDER_IMAGE = '/images/property-placeholder.svg';

export const SAMPLE_LISTINGS: readonly ListingSummary[] = [
  {
    id: 'sample-001',
    slug: 'sample-khulna-apartment-3bed',
    title: 'Sample 3-bedroom apartment',
    locationLabel: 'Sample area, Khulna',
    listingType: 'rent',
    priceMinor: 2500000,
    currencyCode: 'BDT',
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 135,
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Placeholder illustration of an apartment',
    isNew: true,
  },
  {
    id: 'sample-002',
    slug: 'sample-khulna-flat-2bed',
    title: 'Sample 2-bedroom flat',
    locationLabel: 'Sample area, Khulna',
    listingType: 'sale',
    priceMinor: 382000000,
    currencyCode: 'BDT',
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 98,
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Placeholder illustration of a flat',
    isNew: false,
  },
  {
    id: 'sample-003',
    slug: 'sample-khulna-studio',
    title: 'Sample studio apartment',
    locationLabel: 'Sample area, Khulna',
    listingType: 'rent',
    priceMinor: 1200000,
    currencyCode: 'BDT',
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 55,
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Placeholder illustration of a studio',
    isNew: false,
  },
  {
    id: 'sample-004',
    slug: 'sample-khulna-townhouse',
    title: 'Sample townhouse',
    locationLabel: 'Sample area, Khulna',
    listingType: 'sale',
    priceMinor: 960000000,
    currencyCode: 'BDT',
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 210,
    imageUrl: PLACEHOLDER_IMAGE,
    imageAlt: 'Placeholder illustration of a townhouse',
    isNew: true,
  },
];
