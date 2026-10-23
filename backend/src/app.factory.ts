import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ApiErrorFilter } from './common/http/api-error.filter';
import { requestIdMiddleware } from './common/http/request-id';

export const API_PREFIX = 'api/v1';

/**
 * Applies process-wide HTTP conventions. Shared by main.ts and the e2e tests so both
 * exercise identical behaviour.
 */
export function configureApp(app: INestApplication, corsOrigins: readonly string[]): void {
  app.setGlobalPrefix(API_PREFIX);
  app.use(helmet());
  app.use(requestIdMiddleware);
  app.enableCors({
    origin: [...corsOrigins],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.useGlobalFilters(new ApiErrorFilter());
}
