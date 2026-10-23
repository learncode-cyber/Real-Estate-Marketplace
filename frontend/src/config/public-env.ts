import { z } from 'zod';

/**
 * Browser-safe configuration only. Anything in this file is bundled into client JavaScript,
 * so it must never contain secrets, database URLs, or internal hostnames beyond the public API.
 */
const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .refine((value) => value.startsWith('https://') || value.startsWith('http://localhost'), {
      message: 'must be https:// (http:// is allowed only for localhost development)',
    })
    .default('http://localhost:4000/api/v1'),
});

export type PublicEnv = z.infer<typeof schema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid public environment configuration: ${problems}`);
  }
  return parsed.data;
}

// Next.js inlines NEXT_PUBLIC_* values at build time only when they are read as literal
// property accesses, so the object is built from explicit references.
export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
