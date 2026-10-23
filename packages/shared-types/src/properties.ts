/** Public property contracts shared by the API and the web app. No owner contact details. */
export type ListingType = 'SALE' | 'RENT';
export type PropertyKind = 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL';
export type SortOrder = 'newest' | 'price_asc' | 'price_desc';

export interface PropertySummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly listingType: ListingType;
  readonly kind: PropertyKind;
  /** Integer minor units (paisa for BDT). */
  readonly priceMinor: number;
  readonly currencyCode: string;
  readonly bedrooms: number | null;
  readonly bathrooms: number | null;
  readonly areaSqm: number | null;
  readonly areaSlug: string;
  readonly areaNameEn: string;
  readonly areaNameBn: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string | null;
  readonly isDemo: boolean;
  readonly publishedAt: string | null;
}

export interface PropertyDetail extends PropertySummary {
  readonly description: string;
  readonly developerName: string | null;
  readonly media: readonly { readonly url: string; readonly altText: string }[];
}

export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface AreaOption {
  readonly slug: string;
  readonly nameEn: string;
  readonly nameBn: string;
}
