# Database

PostgreSQL via Prisma. Neon is the initial host; the schema is written to stay portable to a
self-managed PostgreSQL 16+ server on a VPS.

## Environment
- `DATABASE_URL`: pooled connection string for the running API. Server-side only.
- `DIRECT_URL`: direct (non-pooled) connection string for migrations. Falls back to `DATABASE_URL`.
- Put both in the git-ignored `.env` at the repository root. Never commit, paste into chat, or log.

## Common commands (run from the repository root)
- Generate client: `npm run generate -w @property-platform/database`
- Validate schema: `npm run validate -w @property-platform/database`
- Migration status: `npm run migrate:status -w @property-platform/database`
- Apply migrations: `npm run migrate:deploy -w @property-platform/database`
- Create a migration (development only): `npm run migrate:dev -w @property-platform/database`

## Migrations
- `prisma/migrations/` holds ordered, version-controlled migrations. Never edit one that has been applied.
- Two earlier migrations were hand-authored to match the schema because the Prisma schema engine could
  not be downloaded in the build sandbox. Reconcile with `prisma migrate diff` before production.

## Seeds (`seeds/`)
- `000_reference_markets.sql`: market configuration. Safe for all environments; idempotent.
- `001_demo_data.sql`: synthetic demo listings. Development only; flagged `isDemo`.
- Apply with: `psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f database/seeds/<file>.sql`

## Backup and restore (tested locally, see docs/database/DATABASE-VERIFICATION.md)
```
pg_dump "$DIRECT_URL" -Fc -f backup.dump
createdb restore_check
pg_restore --exit-on-error -d restore_check backup.dump
```
Store dumps outside the repository, encrypted, with a retention policy. Verify restores by comparing
row counts and catalog before relying on a backup.

## Moving to a VPS
1. Provision PostgreSQL 16 or newer; create an owner role and an application role.
2. Take a `pg_dump -Fc` from Neon using `DIRECT_URL`.
3. `pg_restore --exit-on-error` into the VPS database; compare catalog and row counts.
4. Freeze writes or schedule a maintenance window, take a final dump, restore, switch `DATABASE_URL`.
5. Keep the Neon database read-only until the cutover is confirmed; retain a rollback path.

## Troubleshooting
- `P1001 can't reach database`: check the network route and that the URL host is correct.
- Migration checksum mismatch: an applied migration was edited. Restore the original file; add a new migration.
- Prisma schema engine download fails in restricted networks: run migrations from a machine with access.
