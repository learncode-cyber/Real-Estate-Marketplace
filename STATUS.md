# STATUS.md

## Current status
**Architecture and planning scaffold only — NOT IMPLEMENTED / NOT PRODUCTION READY.**

## Latest planning decisions
- Neon PostgreSQL Free is the required initial hosted database for development and early testing.
- PostgreSQL + Prisma migrations must remain portable to a self-managed PostgreSQL database on a VPS.
- Advertising Platform / Ad Engine remains a final, owner-approval-gated phase. No advertising implementation is authorized before explicit approval.

## Scaffold included
- Frontend/backend folder skeletons and route/domain planning.
- Database, shared packages, infrastructure, CI, and test folder skeletons.
- Master plan includes product vision, route map, roles/permissions, architecture, SEO, motion/3D decision gates, security, database migration, rollout phases, and the locked future Advertising Platform plan.

## Not yet implemented or verified
- No functional frontend pages or backend endpoints.
- No production database schema/migrations or verified Neon connection.
- No authentication, authorization guards, payment provider, analytics implementation, or AI provider integration.
- No CI/CD deployment, penetration test, load test, or production backup/restore drill.
- No advertising UI, routes, tables, workers, billing logic, or algorithms are implemented or authorized.

## Next required work
Follow `PLANNING.md` phase-by-phase. The owner must provide/configure Neon credentials; developers must verify the connection and migration before marking them complete. Do not claim features are implemented until code exists and tests pass.
