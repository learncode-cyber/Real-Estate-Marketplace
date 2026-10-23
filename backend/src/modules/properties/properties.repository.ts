import type { PropertyQuery } from './properties.query';

export const PROPERTY_REPOSITORY = Symbol('PROPERTY_REPOSITORY');

/** Flat record returned by the repository. Money is already a safe-integer minor-unit number. */
export interface PropertyRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  listingType: 'SALE' | 'RENT';
  kind: 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL';
  priceMinor: number;
  currencyCode: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  areaSlug: string;
  areaNameEn: string;
  areaNameBn: string;
  developerName: string | null;
  isDemo: boolean;
  publishedAt: Date | null;
  media: { url: string; altText: string }[];
}

export interface AreaRecord {
  slug: string;
  nameEn: string;
  nameBn: string;
}

export interface PropertyRepository {
  search(query: PropertyQuery): Promise<{ rows: PropertyRecord[]; total: number }>;
  findPublishedBySlug(slug: string): Promise<PropertyRecord | null>;
  listAreas(): Promise<AreaRecord[]>;
}
