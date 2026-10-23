import type { PropertySummary } from '@property-platform/shared-types';
import type { ListingSummary } from '@/features/listings/types';
import type { Locale } from '@/messages';

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const PLACEHOLDER = '/images/property-placeholder.svg';

/** Converts an API summary into the card model. Pure function, safe to unit test. */
export function toListingSummary(
  property: PropertySummary,
  locale: Locale,
  now: number = Date.now(),
): ListingSummary {
  const published = property.publishedAt ? Date.parse(property.publishedAt) : NaN;
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    locationLabel: locale === 'bn' ? property.areaNameBn : property.areaNameEn,
    listingType: property.listingType === 'RENT' ? 'rent' : 'sale',
    priceMinor: property.priceMinor,
    currencyCode: property.currencyCode,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: property.areaSqm,
    imageUrl: property.imageUrl ?? PLACEHOLDER,
    imageAlt: property.imageAlt ?? property.title,
    isNew: Number.isFinite(published) && now - published < NEW_WINDOW_MS,
  };
}
