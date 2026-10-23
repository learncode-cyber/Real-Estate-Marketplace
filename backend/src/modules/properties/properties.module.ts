import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PROPERTY_REPOSITORY } from './properties.repository';
import { PrismaPropertyRepository } from './prisma-property.repository';

@Module({
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    { provide: PROPERTY_REPOSITORY, useClass: PrismaPropertyRepository },
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
