# System Architecture

## Deployment topology
Internet -> CDN/WAF -> Frontend (Next.js) -> API gateway/reverse proxy -> Backend (NestJS `/api/v1`)
Backend -> private PostgreSQL/PostGIS, optional Redis/job queue, object storage, search index, and approved provider adapters.

The frontend must not connect directly to the database, Redis, payment secrets, or privileged storage. The backend is the system of record for authorization, listing lifecycle, moderation, and all privileged operations.

## Monorepo boundaries
- `frontend/`: public website and current role-based dashboard UI.
- `backend/`: API, domain logic, authorization, and approved background jobs.
- `packages/`: schemas/types/contracts that contain no secrets or server-only implementation.
- `database/`: schema, migrations, seeds, reviewed SQL.
- `infrastructure/`: deployment, observability, backups, and security operations.
- `docs/`: authoritative plans and runbooks.

## Architectural style
Start as a modular monolith with strong module boundaries. Use asynchronous jobs for media processing, email/notifications, indexing, imports, and approved agent schedules. Extract a service only when measured load, team boundaries, or reliability justify it.

## Extensibility rules
- New domains must have explicit ownership, API contracts, authorization rules, data migrations, tests, and operational monitoring.
- Keep provider integrations behind adapters and avoid leaking provider-specific data models across the domain.
- Keep optional features independent of core property search, listing access, and enquiries.
- Future advertising is planning-only and excluded from the active implementation tree until explicit owner approval; see `PLANNING.md`.

## Data boundaries
- Public listing media: publish only after moderation and explicit public status.
- Private documents: private storage, short-lived authorized URLs, access logs.
- Payments: provider tokens/IDs only; never store raw card data.
- AI context: minimum necessary data, redaction, tenant isolation, retention controls.
- Analytics: minimize personal data; aggregate when possible.

## Reliability
- Request IDs and structured logs.
- Readiness/liveness endpoints.
- Retry only idempotent jobs; dead-letter queue and replay procedure.
- Idempotency keys for mutations that may be retried.
- Database migration/rollback policy and tested backup restore.
