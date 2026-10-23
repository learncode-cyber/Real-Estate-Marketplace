# Database verification report

Last updated: 2026-10-23. No credentials are recorded here.

## 1. Live Neon audit (read-only)
Project `cool-scene-06029733` (`global-property-platform`), PostgreSQL 17.11, region `aws-ap-southeast-1`,
database `neondb`, audited through the Neon connector with SELECT-only queries.

| Table | Columns | PK | FK | UNIQUE (index) | CHECK | Indexes | RLS |
|---|---|---|---|---|---|---|---|
| `_prisma_migrations` | 8 | 1 | 0 | — | 0 | 1 | off |
| `markets` | 12 | 1 | 0 | 1 (countryCode) | 5 | 3 | off |
| `areas` | 7 | 1 | 0 | 1 (slug) | 1 | 3 | off |
| `developers` | 6 | 1 | 0 | 1 (slug) | 0 | 2 | off |
| `properties` | 18 | 1 | 2 | 1 (slug) | 6 | 4 | off |
| `property_media` | 5 | 1 | 1 | 1 (propertyId, sortOrder) | 1 | 2 | off |

- Enums: `listing_status`, `listing_type`, `market_lifecycle`, `property_kind`.
- Extensions: `plpgsql` only. PostGIS is NOT installed.
- Row-level security: disabled on all tables. No policies exist.
- Migrations: 4 recorded, all with `finished_at` set.
- Row counts after this phase: markets 4, areas 5, developers 1, properties 12 (demo), property_media 12 (demo).

## 2. Changes applied in this phase
- Seed `database/seeds/000_reference_markets.sql` (BD, AE, SA, EG; all CONFIGURED). Applied to Neon
  through the connector twice; the count stayed at 4, confirming idempotency. Existing rows unchanged.
- No DDL was run on Neon in this phase.

## 3. Local verification (PostgreSQL 16, Ubuntu sandbox)
- Four migrations applied in order to `marketplace_test`; seed applied and re-run (idempotent).
- Backup: `pg_dump -Fc` produced a custom-format dump (kept outside the repository, deleted after use).
- Restore: `pg_restore --exit-on-error` into `marketplace_restore` succeeded.
- Row counts source vs restored: markets 4/4, areas 5/5, developers 1/1, properties 12/12,
  property_media 12/12: all match.
- Catalog comparison (columns, data types, nullability, primary/foreign/unique keys, indexes, enum
  labels): identical, 83 entries on each side.
- Known difference: `pg_dump` re-deparses CHECK expressions in a different but equivalent form. Not
  compared by the catalog check; semantic equivalence is expected but not separately proven.
- Known gap: `_prisma_migrations` does not exist on the local test database because local migrations
  were applied with `psql`, not Prisma. Neon has the table.

## 4. Not verified (blockers)
- `prisma migrate diff` / `migrate status` against Neon: the Prisma schema engine cannot be downloaded
  in this sandbox, and the sandbox cannot open TCP connections to neon.tech. Run from a developer
  machine: `npm run migrate:status -w @property-platform/database`.
- Connection-level test from the developer's environment: not performed by this agent.
- Restore into Neon: not performed (would require a branch; not needed for this phase).
- Authorisation/RLS: not implemented; no policy tests exist.

## 5. Outstanding issues
1. Auth provider decision (blocks Group B).
2. `markets` currently has no read path that is exposed by the API; activation is a manual decision.
3. Demo rows (`isDemo = true`) must be removed before public launch.
4. PostGIS unavailable; coordinates not modelled.
