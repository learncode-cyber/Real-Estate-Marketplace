import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { PropertiesModule } from './modules/properties/properties.module';

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule, PropertiesModule],
})
export class AppModule {}
