import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { HealthResponse } from '@property-platform/shared-types';
import { APP_CONFIG } from '../../config/app-config';
import type { AppConfig } from '../../config/env';
import { DatabaseStatus, PrismaService } from '../../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly prisma: PrismaService,
  ) {}

  /** Liveness: the process is up. Does not touch dependencies. */
  @Get()
  live(): HealthResponse {
    return {
      status: 'ok',
      service: 'property-platform-api',
      version: this.config.appVersion,
      timestamp: new Date().toISOString(),
    };
  }

  /** Readiness: dependencies needed to serve data are reachable. */
  @Get('ready')
  async ready(@Res({ passthrough: true }) res: Response): Promise<{
    status: 'ready' | 'not_ready';
    checks: { database: DatabaseStatus };
  }> {
    const database = await this.prisma.checkConnectivity();
    const ready = database === 'OK';
    if (!ready) res.status(HttpStatus.SERVICE_UNAVAILABLE);
    return { status: ready ? 'ready' : 'not_ready', checks: { database } };
  }
}
