import { Global, Module } from '@nestjs/common';
import { APP_CONFIG } from './app-config';
import { loadConfig } from './env';

/** Validated configuration is available to every module through one token (APP_CONFIG). */
@Global()
@Module({
  providers: [{ provide: APP_CONFIG, useFactory: () => loadConfig() }],
  exports: [APP_CONFIG],
})
export class ConfigModule {}
