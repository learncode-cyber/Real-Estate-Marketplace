import { Injectable } from '@nestjs/common';
import type { Prisma } from '@property-platform/database';
import { PrismaService } from '../../database/prisma.service';
import type { AreaRecord, PropertyRecord, PropertyRepository } from './properties.repository';
import type { PropertyQuery } from './properties.query';

/** Minor units per whole currency unit. BDT, AED, SAR and EGP all use 2 decimal places. */
const MINOR_PER_UNIT = 100n;

const summarySelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  listingType: true,
  kind: true,
  priceMinor: true,
  currencyCode: true,
  bedrooms: true,
  bathrooms: true,
  areaSqm: true,
  isDemo: true,
  publishedAt: true,
  area: { select: { slug: true, nameEn: true, nameBn: true } },
  developer: { select: { name: true } },
  media: { select: { url: true, altText: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
} satisfies Prisma.PropertySelect;

type Row = Prisma.PropertyGetPayload<{ select: typeof summarySelect }>;

function toRecord(row: Row): PropertyRecord {
  const priceMinor = Number(row.priceMinor);
  if (!Number.isSafeInteger(priceMinor)) {
    throw new RangeError(`Stored price for ${row.slug} exceeds the safe integer range.`);
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    listingType: row.listingType,
    kind: row.kind,
    priceMinor,
    currencyCode: row.currencyCode.trim(),
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaSqm: row.areaSqm,
    areaSlug: row.area.slug,
    areaNameEn: row.area.nameEn,
    areaNameBn: row.area.nameBn,
    developerName: row.developer?.name ?? null,
    isDemo: row.isDemo,
    publishedAt: row.publishedAt,
    media: row.media,
  };
}

function orderBy(sort: PropertyQuery['sort']): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case 'price_asc':
      return [{ priceMinor: 'asc' }, { id: 'asc' }];
    case 'price_desc':
      return [{ priceMinor: 'desc' }, { id: 'asc' }];
    case 'newest':
      return [{ publishedAt: 'desc' }, { id: 'asc' }];
  }
}

@Injectable()
export class PrismaPropertyRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: PropertyQuery): Promise<{ rows: PropertyRecord[]; total: number }> {
    const where: Prisma.PropertyWhereInput = {
      status: 'PUBLISHED',
      ...(query.listingType ? { listingType: query.listingType } : {}),
      ...(query.area ? { area: { slug: query.area } } : {}),
      ...(query.bedrooms !== undefined ? { bedrooms: { gte: query.bedrooms } } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            priceMinor: {
              ...(query.minPrice !== undefined
                ? { gte: BigInt(query.minPrice) * MINOR_PER_UNIT }
                : {}),
              ...(query.maxPrice !== undefined
                ? { lte: BigInt(query.maxPrice) * MINOR_PER_UNIT }
                : {}),
            },
          }
        : {}),
    };

    const db = this.prisma.db;
    const [rows, total] = await db.$transaction([
      db.property.findMany({
        where,
        select: summarySelect,
        orderBy: orderBy(query.sort),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      db.property.count({ where }),
    ]);
    return { rows: rows.map(toRecord), total };
  }

  async findPublishedBySlug(slug: string): Promise<PropertyRecord | null> {
    const row = await this.prisma.db.property.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: summarySelect,
    });
    return row ? toRecord(row) : null;
  }

  async listAreas(): Promise<AreaRecord[]> {
    const rows = await this.prisma.db.area.findMany({
      where: { properties: { some: { status: 'PUBLISHED' } } },
      select: { slug: true, nameEn: true, nameBn: true },
      orderBy: { nameEn: 'asc' },
    });
    return rows;
  }
}
