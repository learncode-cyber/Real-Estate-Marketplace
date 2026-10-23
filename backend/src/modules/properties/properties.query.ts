import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc'] as const;

/** Whole currency units (BDT) in the public API; converted to minor units in the repository. */
const wholeUnits = z.coerce.number().int().min(0).max(1_000_000_000_000);

export const propertyQuerySchema = z
  .object({
    listingType: z.enum(['SALE', 'RENT']).optional(),
    area: z
      .string()
      .regex(/^[a-z0-9-]{1,80}$/, 'area must be a lowercase slug')
      .optional(),
    minPrice: wholeUnits.optional(),
    maxPrice: wholeUnits.optional(),
    bedrooms: z.coerce.number().int().min(0).max(30).optional(),
    sort: z.enum(SORT_OPTIONS).default('newest'),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(48).default(12),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: 'must not exceed maxPrice',
    path: ['minPrice'],
  });

export type PropertyQuery = z.infer<typeof propertyQuerySchema>;

/** Parses raw query-string input. Throws 400 with a readable message on invalid input. */
export function parsePropertyQuery(raw: Record<string, unknown>): PropertyQuery {
  const result = propertyQuerySchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const field = first?.path.join('.') || 'query';
    throw new BadRequestException(`${field}: ${first?.message ?? 'invalid value'}`);
  }
  return result.data;
}
