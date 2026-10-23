import type {
  AreaOption,
  PagedResult,
  PropertyDetail,
  PropertySummary,
} from '@property-platform/shared-types';
import { publicEnv } from '@/config/public-env';
import { SAMPLE_LISTINGS } from '@/features/listings/fixtures';

const TIMEOUT_MS = 5000;

export type DataSource = 'api' | 'demo';

export interface ListResult {
  readonly source: DataSource;
  readonly data: PagedResult<PropertySummary>;
}

/** Server-side fetch with a hard timeout. Public listing data is cacheable for 60 seconds. */
async function getJson<T>(path: string, params?: URLSearchParams): Promise<T> {
  const url = `${publicEnv.NEXT_PUBLIC_API_BASE_URL}${path}${params && params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'application/json' },
  });
  if (response.status === 404) throw new NotFoundError();
  if (!response.ok) throw new Error(`API responded with ${response.status}`);
  return (await response.json()) as T;
}

export class NotFoundError extends Error {
  constructor() {
    super('not found');
    this.name = 'NotFoundError';
  }
}

/** Demo fallback built from the synthetic fixtures, used only when the API cannot be reached. */
function demoPage(params: URLSearchParams): PagedResult<PropertySummary> {
  const type = params.get('listingType');
  const bedrooms = Number(params.get('bedrooms') ?? 0);
  const items: PropertySummary[] = SAMPLE_LISTINGS.filter(
    (l) => (type ? l.listingType === type.toLowerCase() : true) && (l.bedrooms ?? 0) >= bedrooms,
  ).map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    listingType: l.listingType === 'rent' ? 'RENT' : 'SALE',
    kind: 'APARTMENT',
    priceMinor: l.priceMinor,
    currencyCode: l.currencyCode,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    areaSqm: l.areaSqm,
    areaSlug: 'sample-area',
    areaNameEn: 'Sample area',
    areaNameBn: 'নমুনা এলাকা',
    imageUrl: l.imageUrl,
    imageAlt: l.imageAlt,
    isDemo: true,
    publishedAt: null,
  }));
  return { items, page: 1, pageSize: items.length || 12, total: items.length, totalPages: 1 };
}

/** Lists properties. Falls back to demo data if the API is unreachable, and says so. */
export async function fetchProperties(params: URLSearchParams): Promise<ListResult> {
  try {
    const data = await getJson<PagedResult<PropertySummary>>('/properties', params);
    return { source: 'api', data };
  } catch {
    return { source: 'demo', data: demoPage(params) };
  }
}

export async function fetchAreas(): Promise<AreaOption[]> {
  try {
    return await getJson<AreaOption[]>('/areas');
  } catch {
    return [];
  }
}

/** Returns the detail, null for a 404, or throws for an unavailable service. */
export async function fetchPropertyDetail(slug: string): Promise<PropertyDetail | null> {
  try {
    return await getJson<PropertyDetail>(`/properties/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}
