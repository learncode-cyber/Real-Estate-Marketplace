# Database master plan — Global Property Marketplace

Authoritative inventory: the "Master Database Implementation Prompt" supplied by the owner (groups A–L,
124 candidate tables). Not every table is required for launch; optional groups stay deferred until their
product requirements are approved. Advertising Engine tables are excluded and remain locked (owner
authorisation required).

## Conventions (decided)
- PostgreSQL `snake_case` identifiers in the target design. Existing tables keep their current
  camelCase identifiers (Prisma defaults) for consistency with migrations already applied. New tables
  will use `@map`/`@@map` so the database names follow the convention. Decision recorded in STATUS.md.
- UUID primary keys for new application entities; explicit foreign keys; `timestamptz` in UTC.
- Money: integer minor units plus ISO 4217 code. No floating-point money.
- Pricing basis and rental period are required fields for rental listings (to be added in Phase C).
- JSONB only for genuinely flexible metadata. Media stored as object-storage keys, never as blobs.
- No plaintext passwords. No raw card data. Hashed tokens only.

## Group status

| Group | Scope | Status |
|---|---|---|
| A | Markets and reference data | PARTIAL: `markets` (with lifecycle), 4 configuration rows seeded. `countries`, `regions`, `cities`, `localities`, `currencies`, `locales` NOT YET; areas currently carry city/country. |
| B | Users, authentication, authorisation | NOT IMPLEMENTED. Blocked on auth-provider decision (see below). |
| C | Properties and listings | PARTIAL: `properties`, `property_media`. Listings, types, features, addresses, price/status history NOT YET. |
| D | Developers, projects, buildings, units | PARTIAL: `developers`. Projects, buildings, units NOT YET. |
| E | Agents, agencies, management | NOT IMPLEMENTED. |
| F | Search and discovery | NOT IMPLEMENTED. |
| G | Inquiries, communication, notifications | NOT IMPLEMENTED. |
| H | Trust, moderation, support | NOT IMPLEMENTED. |
| I | Admin, staff, governance | NOT IMPLEMENTED. |
| J | Optional commerce (non-advertising) | DEFERRED until provider, terms, and legal review are approved. |
| K | CMS, SEO, media | NOT IMPLEMENTED (`media_assets` will supersede per-entity media later). |
| L | Platform operations | NOT IMPLEMENTED. |
| — | Advertising Engine | NOT IN SCOPE. Owner authorisation required. |

## Open decisions (owner)
1. Authentication provider for Group B (managed identity service vs application-owned credentials).
   Without this, `users`, `user_credentials`, `user_sessions` and `auth_identities` cannot be designed
   correctly, because the choice decides which tables the application owns.
2. Whether the launch needs `user_credentials` and `user_sessions` at all.
3. Confirm default locale for Bangladesh (currently English; Bengali is supported).

## Phase order
- Phase A — audit, reference data, documentation, backup/restore (current; see DATABASE-VERIFICATION.md).
- Phase B — identity and authorisation (blocked on decision 1).
- Phase C — listing lifecycle, price/status history, addresses, features.
- Phase D — projects, buildings, units, developer verification.
- Phase E — favourites, saved searches, inquiries, notifications.
- Phase F — moderation, reviews, support, audit logs, CMS, SEO.
- Phase G — optional commerce, only after approval.
- Phase H — final verification on clean and upgraded databases, backup/restore, VPS migration.

## Acceptance criteria per phase
- Migrations apply to an empty database and to the live database without touching existing rows.
- Constraints reject invalid data (negative tests).
- Seeds are idempotent and contain no fabricated people, listings, reviews, or testimonials.
- `pg_dump` → `pg_restore` reproduces catalog and row counts.
- Backend authorisation tested for cross-user and cross-organisation access before any write path ships.
