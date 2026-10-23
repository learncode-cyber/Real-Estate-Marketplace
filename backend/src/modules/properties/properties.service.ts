import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  AreaOption,
  PagedResult,
  PropertyDetail,
  PropertySummary,
} from '@property-platform/shared-types';
import { parsePropertyQuery } from './properties.query';
import {
  PROPERTY_REPOSITORY,
  type PropertyRecord,
  type PropertyRepository,
} from './properties.repository';

const PLACEHOLDER_IMAGE = '/images/property-placeholder.svg';

function toSummary(record: PropertyRecord): PropertySummary {
  const cover = record.media[0];
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    listingType: record.listingType,
    kind: record.kind,
    priceMinor: record.priceMinor,
    currencyCode: record.currencyCode,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    areaSqm: record.areaSqm,
    areaSlug: record.areaSlug,
    areaNameEn: record.areaNameEn,
    areaNameBn: record.areaNameBn,
    imageUrl: cover?.url ?? PLACEHOLDER_IMAGE,
    imageAlt: cover?.altText ?? record.title,
    isDemo: record.isDemo,
    publishedAt: record.publishedAt ? record.publishedAt.toISOString() : null,
  };
}

function toDetail(record: PropertyRecord): PropertyDetail {
  return {
    ...toSummary(record),
    description: record.description,
    developerName: record.developerName,
    media:
      record.media.length > 0 ? record.media : [{ url: PLACEHOLDER_IMAGE, altText: record.title }],
  };
}

@Injectable()
export class PropertiesService {
  constructor(@Inject(PROPERTY_REPOSITORY) private readonly repo: PropertyRepository) {}

  async list(raw: Record<string, unknown>): Promise<PagedResult<PropertySummary>> {
    const query = parsePropertyQuery(raw);
    const { rows, total } = await this.repo.search(query);
    return {
      items: rows.map(toSummary),
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    };
  }

  async getBySlug(slug: string): Promise<PropertyDetail> {
    const record = await this.repo.findPublishedBySlug(slug);
    if (!record) throw new NotFoundException('Listing not found.');
    return toDetail(record);
  }

  async listAreas(): Promise<AreaOption[]> {
    return this.repo.listAreas();
  }
}
