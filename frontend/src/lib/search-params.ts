export const FILTER_KEYS = [
  'listingType',
  'area',
  'minPrice',
  'maxPrice',
  'bedrooms',
  'sort',
  'page',
] as const;

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.length > 0 ? v : undefined;
}

/**
 * Keeps only known, well-formed filter keys so arbitrary query strings are never forwarded
 * to the API. The backend validates again; this is defence in depth and a cleaner URL.
 */
export function toApiParams(raw: RawParams): URLSearchParams {
  const params = new URLSearchParams();
  const type = first(raw['listingType']);
  if (type === 'SALE' || type === 'RENT') params.set('listingType', type);
  const area = first(raw['area']);
  if (area && /^[a-z0-9-]{1,80}$/.test(area)) params.set('area', area);
  for (const key of ['minPrice', 'maxPrice', 'bedrooms', 'page'] as const) {
    const value = first(raw[key]);
    if (value && /^\d{1,12}$/.test(value)) params.set(key, value);
  }
  const sort = first(raw['sort']);
  if (sort === 'newest' || sort === 'price_asc' || sort === 'price_desc') params.set('sort', sort);
  return params;
}
