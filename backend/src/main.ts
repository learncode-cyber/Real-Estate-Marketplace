import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.factory';
import { APP_CONFIG } from './config/app-config';
import type { AppConfig } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get<AppConfig>(APP_CONFIG);
  configureApp(app, config.corsOrigins);
  app.enableShutdownHooks();
  await app.listen(config.port);
}

void bootstrap();
