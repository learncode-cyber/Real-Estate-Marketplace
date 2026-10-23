# Prisma migrations

- `schema.prisma` is the authoritative model. Migrations are ordered by timestamp and
  committed; never edit a migration that has been applied to a shared database.
- Migrations whose folder name contains no generator output are reviewed SQL. The file
  header states provenance. Reconcile every hand-authored migration against Prisma's
  `migrate diff` before production.
- Apply to Neon with `DIRECT_URL` set (non-pooled). See `docs/runbooks/neon-setup.md`.
