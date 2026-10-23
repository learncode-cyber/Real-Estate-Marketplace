/** Public, browser-safe summary of a property listing. Contains no owner contact details. */
export type ListingType = 'sale' | 'rent';

export interface ListingSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly locationLabel: string;
  readonly listingType: ListingType;
  /** Integer minor units (for example paisa for BDT). Never a floating-point value. */
  readonly priceMinor: number;
  readonly currencyCode: string;
  readonly bedrooms: number | null;
  readonly bathrooms: number | null;
  readonly areaSqm: number | null;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly isNew: boolean;
}
