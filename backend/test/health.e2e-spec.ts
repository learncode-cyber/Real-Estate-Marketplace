import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import type { Server } from 'node:http';
import request from 'supertest';
import type { ApiErrorBody, HealthResponse } from '@property-platform/shared-types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.factory';
import { APP_CONFIG } from '../src/config/app-config';
import type { AppConfig } from '../src/config/env';

interface ReadinessBody {
  status: 'ready' | 'not_ready';
  checks: { database: string };
}

describe('API foundation (e2e, no database configured)', () => {
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
      .compile();
    app = moduleRef.createNestApplication();
    configureApp(app, ['https://app.example.invalid']);
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('liveness endpoint returns ok under /api/v1 and sets a request ID', async () => {
    const res = await request(server).get('/api/v1/health').expect(200);
    const body = res.body as HealthResponse;
    expect(body).toMatchObject({ status: 'ok', version: '0.0.0-test' });
    expect(String(res.headers['x-request-id'])).toMatch(/[0-9a-f-]{36}/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('readiness reports the database as NOT_CONFIGURED and fails closed with 503', async () => {
    const res = await request(server).get('/api/v1/health/ready').expect(503);
    expect(res.body as ReadinessBody).toEqual({
      status: 'not_ready',
      checks: { database: 'NOT_CONFIGURED' },
    });
  });

  it('unknown routes use the standard error envelope with the request ID', async () => {
    const res = await request(server)
      .get('/api/v1/does-not-exist')
      .set('x-request-id', 'client-req-12345')
      .expect(404);
    const body = res.body as ApiErrorBody;
    expect(body.error).toMatchObject({ code: 'NOT_FOUND', requestId: 'client-req-12345' });
  });

  it('reuses only well-formed incoming request IDs', async () => {
    const res = await request(server)
      .get('/api/v1/health')
      .set('x-request-id', 'bad id with spaces <script>')
      .expect(200);
    expect(String(res.headers['x-request-id'])).not.toContain('<script>');
  });

  it('does not expose the Prisma client or database URL in responses', async () => {
    const res = await request(server).get('/api/v1/health').expect(200);
    expect(JSON.stringify(res.body)).not.toMatch(/postgres|prisma/i);
  });
});
