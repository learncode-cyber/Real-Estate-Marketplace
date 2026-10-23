import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@property-platform/database';
import { APP_CONFIG } from '../config/app-config';
import { AppConfig } from '../config/env';

export type DatabaseStatus = 'NOT_CONFIGURED' | 'OK' | 'UNAVAILABLE';

/**
 * Owns the Prisma client. The client is created only when DATABASE_URL is set, and no
 * connection is opened until a query runs. A missing URL is reported honestly as
 * NOT_CONFIGURED rather than treated as a healthy database.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: PrismaClient | null;

  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.client = config.databaseUrl
      ? new PrismaClient({ adapter: new PrismaPg({ connectionString: config.databaseUrl }) })
      : null;
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  /** Runs SELECT 1 to prove connectivity. Never throws; returns a status for readiness. */
  async checkConnectivity(): Promise<DatabaseStatus> {
    if (!this.client) return 'NOT_CONFIGURED';
    try {
      await this.client.$queryRaw`SELECT 1`;
      return 'OK';
    } catch (error) {
      this.logger.warn(
        `Database connectivity check failed: ${error instanceof Error ? error.name : 'unknown'}`,
      );
      return 'UNAVAILABLE';
    }
  }

  /** Returns the client or throws a 503-style error when no database is configured. */
  get db(): PrismaClient {
    if (!this.client) {
      throw new ServiceUnavailableException('Database is not configured for this environment.');
    }
    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.$disconnect();
  }
}
