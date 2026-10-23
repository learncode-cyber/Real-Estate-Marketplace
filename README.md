# Global Property Marketplace — Architecture Scaffold

This repository is a **planning and architecture scaffold**, not a production-ready application. The current build scope is the core international property marketplace. The future Advertising Platform / Ad Engine is documented in `PLANNING.md` but is **locked and must not be implemented without explicit owner approval**.

## Deployment boundaries
- `frontend/`: Next.js application; deploy independently with hosting root set to `frontend/`.
- `backend/`: NestJS API; deploy independently with hosting root set to `backend/`.
- `database/`: Prisma schema/migrations and reviewed SQL.
- `packages/`: public-safe shared contracts and types only.
- `infrastructure/`: deployment, observability, backups, and security operations.
- `docs/`: architecture decisions, route catalogue, permissions, data model, and runbooks.
- `PLANNING.md`: single authoritative master plan and phased roadmap.
- `STATUS.md`: truthful record of implementation and verification state.

## Suggested technology baseline
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui/Radix.
- Motion: CSS transitions first; Motion for React only where meaningful; GSAP only for a proven complex timeline. Optional 3D is a measured future experiment, not a launch requirement.
- Backend: Node.js, NestJS, TypeScript, versioned REST API (`/api/v1`).
- Data: PostgreSQL + PostGIS; Prisma for ordinary CRUD plus reviewed SQL for spatial/index-specific needs.
- Jobs/cache: Redis + BullMQ, added only where operationally justified.
- Search: PostgreSQL initially or a dedicated search engine when measured requirements justify it.
- Media: private object storage for sensitive documents; public/CDN delivery only for approved public media.
- AI: optional provider-agnostic integrations with scoped tools, approvals, evaluations, quotas, and audit trails after separate approval.

## Non-negotiable rules
- Read `PLANNING.md` before implementation and execute phases in order.
- The Advertising Platform is the final future phase. Do not create ad campaigns, creatives, placements, delivery, algorithms, billing, routes, UI, workers, tests, or database schema until the owner explicitly authorizes it.
- A monorepo does not itself provide security isolation. Keep secrets server-side, restrict CI/CD permissions, isolate production environments, and enforce authorization in the backend.
- Do not expose arbitrary code/package uploads to end users. Feature flags may switch on reviewed, implemented functionality; they are not a substitute for code review or owner approval.
- Do not claim features are implemented until code exists and tests pass.


## Database provider decision

Use **Neon PostgreSQL Free** for development and early testing, with Prisma and version-controlled migrations. Keep the application portable to standard PostgreSQL so it can be migrated to a VPS later. Do not use another provider without owner approval. Never commit database credentials; configure them as server-only environment variables. Review `PLANNING.md` for the required migration and production-readiness gates.
