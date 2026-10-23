import { z } from 'zod';

/**
 * Server-side environment validation. The process refuses to start with invalid values.
 * Secrets are never logged; errors report variable names only.
 */
const postgresUrl = z
  .string()
  .regex(/^postgres(ql)?:\/\/.+/, 'must be a postgresql:// connection string');

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_VERSION: z.string().min(1).default('0.1.0'),
  /** Comma-separated list of exact origins allowed by CORS. No wildcards. */
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .refine((origins) => !origins.includes('*'), 'wildcard origins are not allowed'),
  /** Runtime connection (may be pooled). Optional until the database is configured. */
  DATABASE_URL: postgresUrl.optional(),
  /** Non-pooled connection for migrations. Used by the database workspace, not the API. */
  DIRECT_URL: postgresUrl.optional(),
});

export type AppConfig = Readonly<{
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  appVersion: string;
  corsOrigins: readonly string[];
  databaseUrl?: string;
}>;

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${problems}`);
  }
  const env = parsed.data;
  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    appVersion: env.APP_VERSION,
    corsOrigins: env.CORS_ORIGINS,
    databaseUrl: env.DATABASE_URL,
  };
}
