import { describe, expect, it } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { parsePropertyQuery } from '../src/modules/properties/properties.query';

describe('parsePropertyQuery', () => {
  it('applies safe defaults for an empty query', () => {
    expect(parsePropertyQuery({})).toEqual({
      sort: 'newest',
      page: 1,
      pageSize: 12,
    });
  });

  it('coerces numeric query-string values', () => {
    const q = parsePropertyQuery({
      listingType: 'RENT',
      bedrooms: '2',
      minPrice: '1000',
      page: '3',
    });
    expect(q).toMatchObject({ listingType: 'RENT', bedrooms: 2, minPrice: 1000, page: 3 });
  });

  it('caps page size at 48', () => {
    expect(() => parsePropertyQuery({ pageSize: '500' })).toThrow(BadRequestException);
  });

  it('rejects minPrice greater than maxPrice', () => {
    expect(() => parsePropertyQuery({ minPrice: '900', maxPrice: '100' })).toThrow(
      /must not exceed maxPrice/,
    );
  });

  it('rejects an unknown listing type and an unsafe area slug', () => {
    expect(() => parsePropertyQuery({ listingType: 'LEASE' })).toThrow(BadRequestException);
    expect(() => parsePropertyQuery({ area: "x'; DROP TABLE" })).toThrow(BadRequestException);
  });

  it('rejects unknown sort values', () => {
    expect(() => parsePropertyQuery({ sort: 'random' })).toThrow(BadRequestException);
  });
});
