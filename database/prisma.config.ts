// Prisma CLI configuration. Migrations use DIRECT_URL when present (Neon recommends a
// non-pooled connection for schema changes); the application runtime uses DATABASE_URL.
// Connection strings come from server-side environment variables only. The placeholder
// below is used solely so `prisma generate` and `prisma validate` run without a database.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const PLACEHOLDER = 'postgresql://USER:PASSWORD@localhost:5432/property_platform';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? PLACEHOLDER,
  },
});
