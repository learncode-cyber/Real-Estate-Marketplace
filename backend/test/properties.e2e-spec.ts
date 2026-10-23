import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { Server } from 'node:http';
import request from 'supertest';
import type { PagedResult, PropertySummary, ApiErrorBody } from '@property-platform/shared-types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.factory';
import { APP_CONFIG } from '../src/config/app-config';
import type { AppConfig } from '../src/config/env';
import {
  PROPERTY_REPOSITORY,
  type PropertyRecord,
} from '../src/modules/properties/properties.repository';

const sample: PropertyRecord = {
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

describe('Properties API (e2e, fake repository)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(APP_CONFIG)
      .useValue({
        nodeEnv: 'test',
        port: 0,
        appVersion: '0.0.0-test',
        corsOrigins: ['https://app.example.invalid'],
        databaseUrl: undefined,
      } satisfies AppConfig)
      .overrideProvider(PROPERTY_REPOSITORY)
      .useValue({
        search: () => Promise.resolve({ rows: [sample], total: 1 }),
        findPublishedBySlug: (slug: string) =>
          Promise.resolve(slug === sample.slug ? sample : null),
        listAreas: () =>
          Promise.resolve([{ slug: 'sonadanga', nameEn: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' }]),
      })
      .compile();
    app = moduleRef.createNestApplication();
    configureApp(app, ['https://app.example.invalid']);
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists published properties with pagination metadata', async () => {
    const res = await request(server).get('/api/v1/properties?listingType=RENT').expect(200);
    const body = res.body as PagedResult<PropertySummary>;
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.priceMinor).toBe(2500000);
    expect(body).toMatchObject({ page: 1, pageSize: 12, total: 1, totalPages: 1 });
  });

  it('returns 400 with a readable message for invalid filters', async () => {
    const res = await request(server).get('/api/v1/properties?pageSize=999').expect(400);
    const body = res.body as ApiErrorBody;
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.message).toMatch(/pageSize/);
  });

  it('returns the detail view for a known slug and 404 otherwise', async () => {
    await request(server).get(`/api/v1/properties/${sample.slug}`).expect(200);
    const missing = await request(server).get('/api/v1/properties/does-not-exist').expect(404);
    expect((missing.body as ApiErrorBody).error.code).toBe('NOT_FOUND');
  });

  it('rejects malformed slugs before touching the repository', async () => {
    await request(server).get('/api/v1/properties/Bad%20Slug!').expect(404);
  });

  it('lists areas for filter dropdowns', async () => {
    const res = await request(server).get('/api/v1/areas').expect(200);
    expect(res.body).toEqual([{ slug: 'sonadanga', nameEn: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' }]);
  });
});
