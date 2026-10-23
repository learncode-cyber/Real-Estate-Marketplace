import type { ListingType } from './types';

/**
 * Formats an integer minor-unit amount for display. Money is never computed with floats; the
 * division by 10^exponent happens only at the presentation boundary.
 */
export function formatPrice(
  amountMinor: number,
  currencyCode: string,
  locale: string,
  minorUnits = 2,
): string {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new RangeError('amountMinor must be a safe integer');
  }
  const major = amountMinor / 10 ** minorUnits;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: minorUnits,
    maximumFractionDigits: minorUnits,
  }).format(major);
}

export function formatArea(areaSqm: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(areaSqm)} m²`;
}

export function priceSuffix(listingType: ListingType, labels: { perMonth: string }): string {
  return listingType === 'rent' ? labels.perMonth : '';
}
