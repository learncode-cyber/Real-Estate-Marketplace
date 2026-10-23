# STATUS.md

Last updated: 2026-10-23. Honest status of the Global Property Platform. Labels: IMPLEMENTED,
VERIFIED, PARTIALLY VERIFIED, UNVERIFIED, BLOCKED, NOT IN SCOPE.

## Summary
The core marketplace vertical slice is implemented end to end (database, API, web) with
synthetic demo data. It is NOT production-ready: there is no authentication, no owner
workflow, no moderation, no real listings, and no production deployment.

## Database (PostgreSQL via Prisma; Neon initially)
- IMPLEMENTED + VERIFIED locally (PostgreSQL 16): migrations 20261023120000 (markets),
  20261023120100 (market CHECKs), 20261023120200 (areas, developers, properties,
  property_media), 20261023120300 (marketplace CHECKs). Constraints rejected invalid data in tests.
- IMPLEMENTED + VERIFIED on Neon `cool-scene-06029733` via the Neon connector: the same four
  migrations, registered in `_prisma_migrations`, row counts and constraints checked.
- PARTIALLY VERIFIED: migration SQL was hand-written because the Prisma schema engine could not
  be downloaded in the build sandbox. Reconcile with `prisma migrate diff` before production.
- IMPLEMENTED: demo seed `database/seeds/001_demo_data.sql` (5 areas, 1 developer, 12 published
  demo properties, 12 placeholder media). Loaded locally and on Neon.
- UNVERIFIED from the sandbox: a direct `prisma migrate status` against Neon (no outbound route to
  neon.tech from the build sandbox). Run `npm run migrate:status -w @property-platform/database`
  from a developer machine.
- Not in this phase: users, organizations, inquiries, favorites, moderation, verification, audit log.

## Database phase A (2026-10-23)
- VERIFIED: live Neon audit (read-only); market reference seed applied to Neon and re-run (idempotent, 4 rows); local `pg_dump`/`pg_restore` round trip with matching row counts and catalog.
- PARTIALLY VERIFIED: Prisma migration status against Neon (blocked from this sandbox).
- NOT IMPLEMENTED: identity and authorisation (blocked on auth-provider decision), listing lifecycle tables, projects/units, inquiries, moderation, audit logs, CMS.
- Documentation moved to `docs/database/`.

## Database audit (2026-10-23)
- VERIFIED by read-only live audit of Neon: six tables exist (`markets`, `areas`, `developers`,
  `properties`, `property_media`, `_prisma_migrations`); four migrations recorded as applied;
  enums present; PostGIS NOT installed; row-level security disabled on all tables.
- Only the marketplace core is implemented. Identity, organizations, favorites, inquiries,
  moderation, and audit tables are NOT implemented. See `docs/DATABASE-MASTER-PLAN.md`.
- The full 124-table inventory document was not supplied to the repository.

## Backend (NestJS 11, CommonJS)
- IMPLEMENTED + VERIFIED: config validation, request IDs, error envelope, health and readiness,
  `GET /api/v1/properties` (filters, sorting, pagination, input validation), `GET
  /api/v1/properties/:slug`, `GET /api/v1/areas`.
- VERIFIED: 24 tests (unit and e2e with a fake repository); lint; typecheck; production build;
  real API run against the migrated local PostgreSQL database over HTTP.
- NOT IMPLEMENTED: authentication, authorization guards, rate limiting, write endpoints.

## Frontend (Next.js 16, React 19, Tailwind 4)
- IMPLEMENTED: home page, `/search` (filters, sorting, pagination, Bengali and English),
  `/property/[slug]` (detail, metadata, canonical URL), two-column mobile listing grid, save
  button (client-side only; not persisted), demo fallback with a visible notice when the API is
  unreachable, `/listings-preview` (production-disabled).
- VERIFIED: lint; typecheck; 17 unit tests; production build; the production server rendered
  search results, filters, Bengali strings, the detail page, the 404, and the demo fallback
  against the live local API.
- UNVERIFIED: visual review on real mobile devices (no browser in the build environment).
- NOT IMPLEMENTED: login, favorites persistence, inquiries, dashboards, map view, image pipeline,
  structured data, analytics consent.

## Repository and CI
- VERIFIED: `npm run verify` (advertising scope check, secret scan, format, lint, typecheck,
  tests, builds) passed before this release.
- IMPLEMENTED: `.github/workflows/ci.yml` with actions pinned to commit SHAs and read-only
  permissions. NOT YET RUN on GitHub (no remote repository is connected from this environment).

## Advertising Platform
NOT IN SCOPE. No advertising code, routes, tables, or workers exist. Owner authorization required.

## Blockers
- Neon connectivity from the build sandbox (developer machine needed for `migrate:status`).
- Owner decisions: default locale for Bangladesh (currently English), brand identity, legal review.

## Next work (in dependency order)
1. Authentication and role-based access (buyer, owner, agent, admin).
2. Owner listing workflow: draft, submit, moderation, publish.
3. Inquiries and favorites persistence.
4. Admin moderation queue and audit log.
5. Map view, image pipeline, structured data, accessibility audit on devices.
