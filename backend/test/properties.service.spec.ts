import { describe, expect, it } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from '../src/modules/properties/properties.service';
import type {
  AreaRecord,
  PropertyRecord,
  PropertyRepository,
} from '../src/modules/properties/properties.repository';
import type { PropertyQuery } from '../src/modules/properties/properties.query';

const record: PropertyRecord = {
  id: '30000000-0000-4000-8000-000000000001',
  slug: 'demo-sonadanga-3bed-rent',
  title: 'Demo: 3-bedroom apartment, Sonadanga',
  description: 'Demo listing.',
  listingType: 'RENT',
  kind: 'APARTMENT',
  priceMinor: 2500000,
  currencyCode: 'BDT',
  bedrooms: 3,
  bathrooms: 2,
  areaSqm: 135,
  areaSlug: 'sonadanga',
  areaNameEn: 'Sonadanga',
  areaNameBn: 'সোনাডাঙ্গা',
  developerName: null,
  isDemo: true,
  publishedAt: new Date('2026-10-23T00:00:00.000Z'),
  media: [],
};

class FakeRepo implements PropertyRepository {
  lastQuery: PropertyQuery | null = null;
  constructor(private readonly rows: PropertyRecord[]) {}
  search(query: PropertyQuery) {
    this.lastQuery = query;
    return Promise.resolve({ rows: this.rows, total: 25 });
  }
  findPublishedBySlug(slug: string) {
    return Promise.resolve(this.rows.find((r) => r.slug === slug) ?? null);
  }
  listAreas(): Promise<AreaRecord[]> {
    return Promise.resolve([{ slug: 'sonadanga', nameEn: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' }]);
  }
}

describe('PropertiesService', () => {
  it('maps records to public summaries and computes pagination', async () => {
    const repo = new FakeRepo([record]);
    const service = new PropertiesService(repo);
    const page = await service.list({ pageSize: '12', page: '2' });

    expect(page.total).toBe(25);
    expect(page.totalPages).toBe(3);
    expect(page.page).toBe(2);
    expect(page.items[0]).toMatchObject({
      slug: 'demo-sonadanga-3bed-rent',
      priceMinor: 2500000,
      imageUrl: '/images/property-placeholder.svg',
      publishedAt: '2026-10-23T00:00:00.000Z',
    });
    expect(repo.lastQuery?.page).toBe(2);
  });

  it('never exposes internal fields such as status or owner identifiers', async () => {
    const service = new PropertiesService(new FakeRepo([record]));
    const page = await service.list({});
    expect(Object.keys(page.items[0] ?? {})).not.toContain('status');
    expect(Object.keys(page.items[0] ?? {})).not.toContain('ownerId');
  });

  it('returns a detail view and throws 404 for unknown slugs', async () => {
    const service = new PropertiesService(new FakeRepo([record]));
    await expect(service.getBySlug('demo-sonadanga-3bed-rent')).resolves.toMatchObject({
      description: 'Demo listing.',
      media: [{ url: '/images/property-placeholder.svg', altText: record.title }],
    });
    await expect(service.getBySlug('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
