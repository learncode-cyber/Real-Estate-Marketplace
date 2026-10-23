import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** Shared database access. Feature modules depend on repositories, not on this module directly. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
