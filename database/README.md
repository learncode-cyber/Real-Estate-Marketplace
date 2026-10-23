# Database workflow

- Initial provider: Neon PostgreSQL Free for development and early testing.
- ORM/migrations: Prisma; keep schema and all ordered migrations under version control.
- Source of truth: PostgreSQL. Keep provider-specific features isolated and documented.
- Credentials: server-only environment variables; never commit or expose in frontend bundles.
- Future migration: test a consistent `pg_dump`/`pg_restore` to a compatible VPS PostgreSQL instance, validate schema/data/constraints/indexes, run tests, and plan a final sync/cutover with rollback.
- Neon Free limits and backup/history behavior must be checked against current official documentation before production launch.
- Do not claim the database is connected until credentials are configured and connection plus migration checks have actually passed.

See `../PLANNING.md`, sections 8 and 19, for the authoritative requirements.
