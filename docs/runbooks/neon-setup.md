# Neon setup and migration runbook

## Connection strings
- `DATABASE_URL`: pooled connection (application runtime). Host contains `-pooler`.
- `DIRECT_URL`: direct, non-pooled connection (migrations). Same host without `-pooler`.
- Store both only in a local, git-ignored `.env` file or the deployment platform's secret store.
  Never paste them into chat, tickets, screenshots, logs, or commits.
- If a connection string is exposed, reset the role password in the Neon console and update
  every environment that uses it.

## Apply migrations (developer machine with direct network access)
1. `npm ci` at the repository root.
2. `npm run migrate:status -w @property-platform/database` (shows applied and pending migrations).
3. `npm run migrate:deploy -w @property-platform/database` (applies pending migrations using `DIRECT_URL`).
4. Optional demo data (development only, never production):
   `psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f database/seeds/001_demo_data.sql`

## Verification performed
- Local PostgreSQL 16: all four migrations applied in order; seed applied; API queries verified
  end to end (filters, sorting, pagination, detail, 404, 400, areas, readiness).
- Neon project `cool-scene-06029733` (PostgreSQL 17.11): the same four migrations and the demo
  seed were applied through the Neon connector; row counts and migration history verified.
- The sandbox used to build this release cannot open direct TCP connections to Neon, so
  `migrate:status` against Neon must be run from a developer machine.

## Known limitations
- The two Prisma migrations and the `_prisma_migrations` rows were written by hand because the
  Prisma schema engine could not be downloaded in the build sandbox. Confirm with
  `prisma migrate diff` against a disposable Neon branch before production.
- Neon Free plan limits and backup/history behaviour must be re-checked before launch.
