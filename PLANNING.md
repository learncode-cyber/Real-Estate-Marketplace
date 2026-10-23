# PLANNING.md — Global Property Marketplace Master Plan

> **Document status:** Authoritative source of truth for product scope, architecture, implementation order, quality gates, and deferred modules.  
> **Current delivery scope:** Core marketplace only.  
> **Non-negotiable release gate:** The Advertising Platform / Ad Engine is a future phase and MUST NOT be implemented until the owner gives explicit written approval in the project conversation or task.

## 0. How every developer and AI agent must use this document

1. Read this file completely before changing code. Then read `STATUS.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/FRONTEND-ROUTES.md`, `docs/RBAC-MATRIX.md`, `docs/DATA-MODEL.md`, `docs/DEPLOYMENT-SECURITY.md`, and relevant ADRs.
2. This file is the single authoritative plan. Do not create a second competing `planning.md`, `PLAN.md`, or roadmap. Update this file when a real product decision changes.
3. Before implementation, inspect the existing repository and current status. Do not assume a folder placeholder is a working feature.
4. Implement phases in order. Do not skip a gate, invent requirements, or repeatedly ask the owner to re-plan ordinary engineering decisions. Ask only when a decision genuinely changes business scope, legal exposure, cost, or irreversible architecture.
5. Keep scope boundaries explicit. A planned feature is not implemented merely because its folder, route, type, or documentation exists.
6. Never claim `IMPLEMENTED` or `VERIFIED` unless code exists and the named tests/checks have actually passed. Use `PLANNED`, `IN PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, or `NOT IN SCOPE` accurately.
7. After every meaningful phase, update `STATUS.md`, test the cumulative repository, and deliver a **full cumulative ZIP** of the whole project. Verify the archive can be opened and report the exact artifact path. Do not deliver only changed files.
8. Never commit secrets, real user data, fabricated listings, invented reviews, fake metrics, or claims of legal/identity verification that have not occurred.

## 1. Product vision

Build a high-quality, trustworthy, international property marketplace that launches with a focused market and can expand country by country without rewriting the core system.

The product should help people discover, compare, enquire about, and manage property opportunities, while enabling property owners, agents, agencies, developers, and platform staff to manage legitimate listings and projects through secure, role-appropriate workspaces.

### 1.1 Product principles

- **Trust first:** clear verification states, listing moderation, fraud reporting, provenance for important claims, and no fake reviews or guaranteed-return promises.
- **Search-engine first architecture:** crawlable server-rendered content, stable canonical URLs, structured data only where accurate, XML sitemaps, internal linking, and strong Core Web Vitals.
- **Performance by default:** ship only the JavaScript and media needed for the current task; defer nonessential animation, maps, and rich 3D experiences.
- **Accessibility by default:** keyboard support, visible focus, semantic HTML, contrast, reduced-motion support, screen-reader labels, and accessible form errors.
- **Secure by design:** backend authorization is authoritative; a hidden menu or disabled button is never a security boundary.
- **International-ready, not prematurely globalized:** model country-specific configuration, currencies, measurement units, and locales now; activate each market only after legal, content, support, and operational readiness checks.
- **Composable architecture:** add future modules through stable contracts, permissions, feature flags, migrations, and tests—not by coupling unrelated business logic.
- **Honest delivery:** no feature is described as complete until it is implemented and verified.

## 2. Initial launch and expansion strategy

### Launch sequence

1. Build the core marketplace foundation and public browsing experience.
2. Deliver secure user identity and role-based workspaces.
3. Deliver listing, project, search, enquiry, moderation, and administrative operations.
4. Optimize mobile UX, SEO, accessibility, security, and performance.
5. Run a controlled launch in the first selected market after content, legal, support, and operational checks.
6. Measure real usage and reliability; fix core marketplace friction before adding nonessential systems.
7. Expand to additional countries using country configuration and a market-readiness checklist.
8. **Only after the core product is launched and the owner explicitly authorizes it:** begin the separately gated Advertising Platform phase at the very end of the roadmap.

The initial market and exact launch date are business decisions. Do not hardcode Bangladesh-only assumptions into the domain model. Use the selected launch market as configuration once confirmed.

## 3. Technology baseline and deployment boundaries

### Frontend

- Next.js App Router + TypeScript.
- React Server Components by default; Client Components only where interactivity requires them.
- Tailwind CSS + shadcn/ui/Radix primitives, with a documented design-token system.
- Server-rendered public listing/project pages with dynamic database-driven templates.
- Forms with schema-based validation, accessible error states, loading/empty/error states, and safe optimistic updates only where appropriate.

### Backend

- Node.js + NestJS + TypeScript.
- Versioned REST API under `/api/v1`; publish OpenAPI contracts.
- Modular monolith first, with clear domain boundaries and independently scalable web/API/worker deployments.
- DTO validation, centralized error handling, request IDs, structured logs, rate limiting, and authorization policies.

### Data and supporting services

- **Initial database provider: Neon PostgreSQL Free** for development, prototypes, and early testing. The developer must create/connect the Neon project using owner-provided credentials; never commit credentials.
- PostgreSQL is the source of truth. Use Prisma for standard data access and versioned migrations; use reviewed SQL for specialized indexes and query plans.
- Design for portability to a self-managed PostgreSQL instance on a VPS. Do not make core business logic depend on Neon-only APIs, serverless functions, branching behavior, or vendor-specific features.
- Before relying on PostGIS or any extension, verify that the required extension is available and supported in the selected Neon project. Document any portability limitation and provide a compatible migration path.
- Neon Free is a development/early-stage tier, not a promise of production capacity or uptime. Check current official plan limits before launch and upgrade or migrate when usage, reliability, backup, or support requirements demand it.
- Redis/BullMQ only for justified caching, throttling, and asynchronous jobs; never treat cache counters as the financial source of truth.
- Search: start with PostgreSQL full-text/search capabilities if adequate; introduce Meilisearch or another dedicated engine only after requirements and load tests justify it.
- Object storage such as Cloudflare R2 for approved public media and separately protected private documents; CDN for optimized public assets.
- Email/SMS, maps, payments, analytics, and AI providers behind server-side adapters so providers can be changed without rewriting domain logic.

### Independent deployment

- `frontend/` and `backend/` must be deployable independently, with separate environment variables, CI checks, secrets, logs, and rollback paths.
- `database/`, `packages/`, and `infrastructure/` are versioned with the monorepo but do not imply shared runtime permissions.
- Production database and Redis must not be publicly exposed. Never put secrets in `NEXT_PUBLIC_*` variables.
- Use HTTPS, narrow CORS, secure cookie/session settings, CSRF protection where cookie-based flows require it, and least-privilege service credentials.
- Start with a modular monolith and a small number of deployments; split services only after measurable load, team boundaries, or reliability needs justify the operational cost.

## 4. Repository structure and responsibility map

```text
global-property-platform/
├── frontend/                       # Next.js public site and role workspaces
│   ├── public/                      # Optimized static assets, icons, locale assets
│   └── src/
│       ├── app/                     # Route groups and page entry points
│       ├── components/              # Shared visual primitives and domain UI
│       ├── features/                 # Feature-specific UI/data orchestration
│       ├── hooks/                   # Reusable client hooks
│       ├── lib/                     # API client, auth, permissions, SEO, i18n
│       ├── stores/                  # Minimal client state only where needed
│       ├── config/                  # Public-safe runtime configuration
│       └── types/                   # Frontend-only types
├── backend/                         # NestJS API and background workers
│   ├── src/
│   │   ├── common/                  # Guards, decorators, filters, policies
│   │   ├── config/                  # Validated server configuration
│   │   ├── database/                # Database integration
│   │   ├── integrations/            # Provider adapters
│   │   ├── modules/                 # Domain modules listed in API plan
│   │   ├── observability/           # Logs, metrics, tracing hooks
│   │   └── workers/                 # Async jobs, separate from request path
│   └── test/                        # Unit, integration, security, E2E
├── packages/
│   ├── api-contracts/               # Versioned API contract types
│   ├── shared-types/                # Safe cross-layer domain types
│   ├── validation-schemas/          # Shared schemas where appropriate
│   └── tsconfig/                    # Shared TypeScript config
├── database/
│   ├── prisma/                      # Schema and migrations
│   ├── seeds/                       # Synthetic development/demo data only
│   └── sql/                         # Reviewed specialized SQL
├── infrastructure/
│   ├── deployment/                  # Separate frontend/backend deployment
│   ├── docker/                      # Local development only unless reviewed
│   ├── monitoring/                  # Dashboards/alerts/runbooks
│   ├── backup/                      # Backup and restore procedures
│   ├── security/                    # Security configuration/checklists
│   ├── queues/                      # Queue operations and DLQ handling
│   └── load-testing/                # Reproducible load scenarios
├── docs/
│   ├── ADR/                         # Accepted architecture decisions
│   ├── runbooks/                    # Operational procedures
│   ├── ARCHITECTURE.md
│   ├── FRONTEND-ROUTES.md
│   ├── API-MODULES.md
│   ├── DATA-MODEL.md
│   ├── RBAC-MATRIX.md
│   └── DEPLOYMENT-SECURITY.md
├── tests/                           # Accessibility, E2E, integration, perf, security
├── .github/workflows/               # CI/CD workflows
├── .env.example                     # Names and safe sample values only
├── PLANNING.md                      # Authoritative plan (this file)
├── STATUS.md                        # Truthful implementation status
├── package.json
└── README.md
```

This is a responsibility map, not permission to create empty folders for every future feature. Create a module's code folders when its phase starts. The Advertising Platform is explicitly excluded from the current folder tree and implementation scope.

## 5. User types, organizations, and permissions

### User identity model

Use one identity per person with one or more roles/workspaces. Support organizations and memberships so a person can work for an agency or developer organization without duplicating their account. Model resource ownership and organization scope explicitly.

### Core roles

- Visitor / anonymous browser.
- Buyer / renter.
- Property owner / landlord.
- Individual agent.
- Agency owner / manager / staff.
- Developer organization owner / manager / staff.
- Property manager / host for short-stay inventory where enabled.
- Platform support, moderator, verifier, finance operator, and administrator.

### Authorization requirements

- Build a permission matrix with actions such as `read`, `create`, `update`, `submit`, `approve`, `publish`, `archive`, `export`, `refund`, and `manage_members` where relevant.
- Check permissions and tenant/resource ownership in backend services and database access patterns.
- Use least privilege and separation of duties for high-risk actions. A content moderator should not automatically gain financial access.
- Log sensitive actions, permission changes, impersonation/support access, verification decisions, and exports.
- Test cross-user and cross-organization access at API and database layers.
- Hiding dashboard navigation is a usability measure only; every protected API operation must independently authorize the request.

## 6. Product surfaces and page map

Every public route must have defined purpose, metadata, canonical URL strategy, loading state, empty state, error state, responsive layout, and analytics/privacy consideration. Use database-driven templates for individual properties, projects, developers, agents, agencies, and locations; do not create a new code page for every listing.

### Public discovery pages

- `/` — value proposition, primary search, browse-by-intent/location, carefully selected verified inventory, and trust explanation.
- `/buy`, `/rent`, `/commercial`, `/land`, `/short-stays` — intent-specific search entry pages, only for inventory types actually supported.
- `/search` — filterable results with shareable query state, sort options, map/list modes when useful, and accessible filter controls.
- `/map` — geospatial discovery with a list alternative; never make the map the only way to access results.
- `/compare` — side-by-side comparison of a limited set of listings with meaningful differences highlighted.
- `/property/[slug]` — canonical property detail template: gallery, price and availability, location context, facts, description, features, verified-document state where applicable, owner/agent identity, enquiry actions, report-listing flow, and related properties.
- `/projects`, `/projects/[slug]` — project directory and dynamic project detail, including developer profile, location, approved facts, buildings/units/inventory where available, availability timestamp, and enquiry path.
- `/developers`, `/developers/[slug]` — developer directory and verified organization profile.
- `/agents`, `/agents/[slug]`, `/agencies`, `/agencies/[slug]` — professional discovery and profile pages.
- `/areas/[slug]`, `/countries` — location landing pages backed by real inventory and editorial content, not thin generated doorway pages.
- `/ai-search` — optional natural-language search experience; must degrade gracefully to ordinary filters if AI is unavailable.
- `/investment`, `/investment/calculator`, `/market-insights` — educational tools with transparent assumptions and sourced data; never promise returns.
- `/blog`, `/blog/[slug]` — editorial content with author/reviewer, updated dates, sources, internal links, and editorial quality checks.
- `/about`, `/contact`, `/help`, `/faq`, `/pricing` — company information, support, and clearly described current marketplace/listing plans.
- Legal pages: terms, privacy, cookies, listing policy, and fraud/safety policy. Publish country-specific legal text only after qualified review.

### Authentication and account

- `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/select-role`, `/onboarding`.
- `/account/profile`, `/account/security`, `/account/sessions`, `/account/notifications`.
- Include rate limits, safe recovery flows, session revocation, clear consent, and abuse monitoring.

### Buyer/renter workspace

- Overview, saved properties, saved searches, enquiries, viewing requests, buyer requirements, notification preferences, profile/security.
- Buyers must only see their own private activity unless a defined sharing permission exists.

### Owner workspace

- Listing inventory, create/edit listing, media management, document submission, verification status, enquiries/leads, viewing requests, listing performance analytics, account/security.
- Do not include ad/campaign pages in the current build. Future paid promotion is gated separately.

### Agent and agency workspaces

- Listings/inventory, client requirements, enquiries/leads, pipeline, calendar/viewings, team/member access, organization profile, activity history, and allowed reports.
- Agency team access must be organization-scoped; individual agents should not automatically see unrelated agency data.
- Do not include ads/campaign pages in the current build.

### Developer workspace

- Developer organization profile, projects, buildings, unit types/units, floor plans/media, inventory/availability, lead enquiries, team members, review status, and audit/activity history.
- Developers can draft and submit projects. Public publishing requires the defined review/publish policy.
- Admin-created projects must be explicitly linked to the correct organization and ownership/access grant.
- Do not include ads/campaign pages in the current build.

### Platform operations/admin workspace

- Users, organizations, properties/listings, projects, verification queue, moderation queue, reports/complaints, fraud triage, country/localization configuration, role/permission management, content management, audit logs, operational metrics, and feature flags.
- Financial operations, refunds, and payment-provider administration only when the core marketplace requires them and the relevant staff permission is granted.
- Do not include an advertising admin area in the current build.

## 7. Core backend domain modules

Implement only when their roadmap phase starts; maintain clear boundaries and explicit ownership of data.

- Identity: `auth`, `users`, `sessions`, `organizations`, `organization-members`, `roles`, `permissions`, `audit`.
- Marketplace: `properties`, `property-media`, `property-documents`, `locations`, `search`, `saved-searches`, `comparisons`, `buyer-requirements`.
- Professional inventory: `agents`, `agencies`, `developers`, `projects`, `buildings`, `units`.
- Communication: `inquiries`, `leads`, `viewings`, `notifications`, `messaging` where approved.
- Trust and safety: `verification`, `moderation`, `complaints`, `fraud`, `reviews` with anti-abuse rules.
- Platform operations: `admin`, `countries`, `currencies`, `content`, `imports`, `feature-flags`, `analytics`.
- Optional later integrations: `payments`, `subscriptions`, AI search/agent capabilities, and market-specific provider adapters after requirements are approved.

Do not create the Advertising Platform modules in this phase. In particular, do not create campaign, ad-set, creative, audience, placement, auction, ranking, pacing, attribution, ad-event, ad-billing, or ad-optimization code.

## 8. Database and data-model requirements

### 8.1 Required initial provider and migration strategy

- Use **Neon PostgreSQL Free** as the initial hosted PostgreSQL provider for development and early validation. This is the selected default, not an optional alternative. The owner must supply/create the Neon account and credentials; developers must not invent credentials or claim a connection is configured until tested.
- Store the connection string in server-only environment variables such as `DATABASE_URL`; use a separate direct/unpooled connection string for administrative dump/restore operations where Neon recommends it. Never expose credentials through `NEXT_PUBLIC_*`, frontend bundles, logs, screenshots, or commits.
- Keep the authoritative schema in `database/prisma/schema.prisma` and checked-in, ordered Prisma migrations. Any hand-written SQL, extensions, indexes, triggers, and seed logic must also be version-controlled and documented.
- Use standard PostgreSQL data types and features wherever practical. Isolate provider-specific behavior behind adapters and document it in an Architecture Decision Record (ADR).
- Maintain a repeatable migration runbook from Neon to a VPS-hosted PostgreSQL database: provision a compatible PostgreSQL version, enable required extensions, apply schema/migrations, take a consistent `pg_dump`, restore with `pg_restore`, validate row counts/constraints/indexes, run smoke/integration tests, freeze writes or perform a final sync during cutover, switch server-side environment configuration, monitor, and retain a rollback path.
- Test restore and migration using non-production/synthetic data before launch. Backups are not proven until a restore has succeeded. Keep the application read-only or schedule a maintenance window during a simple dump/restore cutover to avoid losing writes.
- Record Neon plan limits, compute/storage/egress usage, backup/history limitations, and the date reviewed in deployment documentation. Re-check official pricing/limits before public production launch because plans can change.
- **Migration target:** a compatible self-managed PostgreSQL database on a VPS; the application must not require a rewrite to move providers. Database portability does not automatically migrate object-storage files, secrets, DNS, queues, or application hosting; those require their own migration steps.

- Use normalized relational data for identity, organizations, listings, projects, units, inquiries, verification, moderation, and audit events.
- Use stable IDs; human-readable slugs are not primary keys. Enforce unique constraints for canonical slugs within the appropriate scope.
- Add indexes based on real query patterns. Use PostGIS for coordinates, radius search, and map boundaries where justified.
- Store money as integer minor units plus ISO currency code; never use floating-point values for financial arithmetic.
- Store timestamps in UTC and format in the user's/market's timezone at the presentation boundary.
- Country-specific fields should be modeled through explicit typed fields or controlled extension tables, not an unbounded JSON dumping ground.
- Keep sensitive documents private. Public property images must be explicitly approved for publication. Use short-lived authorized URLs for private files.
- Every state transition that matters (submit, approve, reject, publish, archive, verify) should record actor, time, reason, and previous/new state as appropriate.
- Use migrations reviewed in CI; seed only synthetic demo data. Define retention, deletion, and export policies before production launch.

## 9. API and integration rules

- Version endpoints under `/api/v1` and publish OpenAPI documentation.
- Validate all request input on the server; validate uploads by size, type, content, ownership, and malware scanning where available.
- Use consistent pagination, filtering, sorting, error shapes, request IDs, and rate limits.
- Generate idempotency keys for retried mutations that could create duplicate records or charges.
- Keep provider integrations behind adapters. Validate webhook signatures, timestamp windows, and idempotency before processing events.
- Never accept a client-supplied role, organization ID, price, verification result, or permission as authoritative without server-side checks.
- Avoid calling AI models on hot request paths when a deterministic database/rule-based result suffices. AI must not bypass authorization or publish/spend/send on its own without the applicable approval.

## 10. UI, design system, motion, and 3D strategy

### Visual direction

Create a premium, modern, trust-oriented real-estate product: strong typography, calm whitespace, clear property imagery, restrained accent color, consistent spacing, and highly legible price/location/verification information. Final brand colors and typography should be documented as design tokens after a deliberate brand decision, not chosen arbitrarily per page.

### Component and interaction system

- Use shadcn/ui and Radix primitives for accessible foundations; build reusable product-specific components on top.
- Use Tailwind tokens/CSS variables for color, type, spacing, radii, shadows, breakpoints, and elevation.
- Use CSS transitions and keyframes for simple hover, focus, reveal, and state changes.
- Use **Motion for React (formerly Framer Motion)** only for meaningful UI transitions and orchestrated sequences; keep it out of pages that do not need it.
- Use **GSAP** only if a specific complex timeline or scroll-linked sequence proves it is necessary; do not add it globally by default.
- Use **React Three Fiber / Three.js** only for a genuinely valuable, optional 3D experience (for example, a project/building explorer) after a performance prototype. It is not a default requirement for every page.
- Do not introduce multiple overlapping animation libraries for the same use case. Record the choice in an ADR before adding a large dependency.

### Motion rules

- Respect `prefers-reduced-motion`; provide a reduced-motion path for all nonessential animation.
- Avoid scroll-jacking, forced long intros, infinite decorative motion, and animations that delay access to search or contact actions.
- Keep transitions short and purposeful; use transform/opacity where possible to avoid layout thrashing.
- Animate only when it helps orientation, feedback, hierarchy, or product understanding. Core content must remain available if motion fails.
- Lazy-load noncritical animated sections and avoid hydration-heavy animation on public SEO pages.

### 3D decision gate

3D is **optional and evidence-based**, not a blanket visual target. Use it only if a measured prototype demonstrates a meaningful user benefit and passes mobile performance, accessibility, SEO, and graceful-fallback checks.

- Prefer static/interactive 2D plans, optimized galleries, SVG illustrations, and lightweight motion for the initial launch.
- If 3D is approved later, dynamically import the 3D viewer, load it only when visible or requested, compress models (for example, glTF/GLB with mesh/texture optimization), cap texture and polygon budgets, and provide a static image/plan fallback.
- Never put essential property facts, titles, prices, or indexable text only inside a WebGL canvas.
- If 3D materially harms LCP/INP/CLS, battery, memory, or accessibility, remove it or make it an explicit user-triggered enhancement.

## 11. SEO, GEO/AEO, and content quality

- Render important public pages on the server and ensure useful HTML content exists without client-side JavaScript.
- Define title/description templates, canonical URL rules, robots directives, pagination policy, XML sitemaps, robots.txt, Open Graph metadata, and breadcrumb/internal-link patterns.
- Use structured data only when page content qualifies and values are accurate; do not mark up fake ratings, prices, availability, or organization claims.
- Prevent indexation of account/dashboard/search-filter URL combinations that create duplicate or low-value pages.
- Use stable slugs, redirects for slug changes, correct status codes, and not-found pages for removed listings.
- Optimize images with responsive sizing, modern formats, explicit dimensions, lazy loading below the fold, and eager/high priority only for the actual LCP image when justified.
- Support useful editorial pages and real market/location content; avoid mass-generated thin location pages and unsupported market statistics.
- GEO/AEO means clear, verifiable answers and useful structured content—not keyword stuffing or unsupported AI-search promises.
- Measure Search Console, crawl health, index coverage, organic landing-page engagement, and Core Web Vitals after launch.

## 12. Performance and reliability targets

Set measurable targets during Phase 0 and test against representative mobile devices and realistic data. Baseline web-vitals goals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile where measurement volume supports it. Treat these as targets to measure, not a claim that the scaffold currently passes.

- Keep initial client JavaScript small; split dashboard-only code from public pages.
- Use responsive images, caching headers, CDN delivery, pagination, database indexes, and query-plan inspection.
- Avoid N+1 queries and unbounded list endpoints. Define API timeouts and cancellation behavior.
- Use queue workers for noninteractive media processing, notifications, indexing, imports, and scheduled tasks where useful.
- Add liveness/readiness checks, structured logs, error tracking, metrics, alerting, queue dead-letter handling, and safe retry policies.
- Run load tests against realistic listing volume and search/filter patterns before scaling infrastructure.
- Define backup RPO/RTO and test restoration; a successful backup job alone is not proof of recoverability.

## 13. Security, privacy, and trust

- Threat-model authentication, uploads, private documents, organization boundaries, admin actions, webhooks, search, and any AI/tool integrations.
- Use secure password/session handling, email/phone verification where appropriate, MFA for privileged roles, rate limits, abuse detection, and account/session revocation.
- Enforce authorization in every backend operation; test IDOR/BOLA and cross-tenant access explicitly.
- Protect against XSS, CSRF where applicable, SSRF, SQL injection, unsafe redirects, upload abuse, mass assignment, brute force, and webhook replay.
- Use least-privilege secrets and service accounts. Keep production credentials out of source control and logs.
- Maintain audit logs for verification decisions, role changes, sensitive exports, and privileged access.
- Provide user-facing report/fraud flows and a human-reviewed moderation process.
- Run dependency, secret, static analysis, and container scans in CI where supported. Resolve critical/high findings before production.
- Legal/privacy controls and data retention must be reviewed for each market before launch.

## 14. AI and automation extension policy

AI features are optional modules, not a dependency for basic marketplace functionality. Begin with constrained use cases such as natural-language search assistance or internal staff copilots only after data access and evaluation policies are ready.

- Use a provider-agnostic gateway, typed tools, per-tool authorization, tenant-scoped data, redaction, quotas, traceability, and cost limits.
- Read-only agents first. Require human approval for publishing, changing permissions, sending external messages, issuing refunds, or spending money.
- Never let a prompt override server permissions or tool allowlists. Treat listing descriptions, uploaded files, and external content as untrusted input.
- Do not call an LLM for every page view or search request if deterministic retrieval is adequate.
- Keep the agent runtime and worker deployment separate from public request handling where possible.

## 15. Advertising Platform — FUTURE ONLY / LOCKED PHASE

> **OWNER APPROVAL REQUIRED. DO NOT IMPLEMENT NOW.** This section preserves the long-term vision so the current marketplace architecture remains extensible. It is a planning specification, not authorization to create code, routes, UI, database tables, workers, billing logic, or algorithm implementations.

### 15.1 Timing and scope gate

- This is the **final major product phase**, after the core marketplace is launched, monitored, and stable.
- Do not begin any implementation, prototype branch, UI scaffold, database schema, API contract, campaign dashboard, ad creative editor, ad placement, delivery logic, or algorithm until the owner explicitly authorizes the Advertising Platform phase.
- A feature flag does not count as approval and does not make unapproved code acceptable.
- Until approval, maintain only this planning section. Do not create active `ads` modules/folders, routes, components, tests, ad workers, or ad-specific migrations.
- When approval arrives, first create a separate scoped implementation plan, security/threat review, billing/legal checklist, acceptance criteria, and architecture decision record. Then implement phase-by-phase with verified cumulative ZIP delivery.

### 15.2 Long-term product vision

A first-party advertising platform inspired by the control depth of major ad platforms, tailored to property listings and real-estate businesses. Advertisers should be able to create and manage campaigns, set budgets and schedules, choose eligible markets and placements, review creative previews, pause or stop campaigns, and understand results. Platform staff should have permission-scoped tools to create or manage approved promotions on behalf of eligible organizations with a complete audit trail.

### 15.3 Planned advertiser control levels

- **Campaign:** objective, campaign name/status, daily/lifetime/account spending limits, start/end dates, pause/resume/stop/duplicate, delivery status, and reporting.
- **Ad set / audience:** market/country/city, supported audience criteria, schedule, placement eligibility, frequency cap, and budget/bid strategy where the billing model supports it.
- **Creative:** image/banner or other approved media, headline/body, CTA, destination URL, variants, preview, moderation status, and version history.
- **Account/team:** spending limits, roles such as owner/manager/editor/analyst/billing, access expiry, approvals, and audit log.
- **Admin/staff:** granular permissions to create, edit, review, approve, pause, or report on campaigns; no implicit access to payment secrets or unrestricted financial operations.

### 15.4 Planned delivery and algorithm concepts

- Eligibility filtering must precede ranking: approved and active status, advertiser authorization, schedule, country/placement compatibility, budget availability, frequency cap, valid destination, moderation/legal rules, and inventory suitability.
- Start with deterministic, explainable delivery rules. A future ranking hypothesis may combine expected value, creative quality, contextual relevance, and pacing, but no formula is final or proven until evaluated on real, consent-compliant data.
- Fixed-duration/fixed-placement sponsorships should be treated as reserved inventory, not disguised as an auction.
- CPC/CPM or other auction models must wait until billing, click/impression validation, fraud detection, event idempotency, budget reservations, and reconciliation are independently verified.
- Hard spending limits must never be overridden by optimization. Automated optimization must not increase a user's authorized maximum budget without explicit opt-in and caps.
- Future AI optimization may suggest creative/targeting changes or use calibrated models/experiments only after sufficient data, quality checks, and human controls exist. No LLM on every ad impression.

### 15.5 Planned accounting and safety controls

- Use an auditable immutable financial ledger for charges, credits, refunds, adjustments, and reconciliation; money uses integer minor units and currency codes.
- Validate payment-provider webhooks, signatures, timestamps, and idempotency before changing billing state.
- Concurrent delivery must use safe budget reservations and transactional/atomic controls, not Redis counters alone as the financial source of truth.
- Define how in-flight events are treated after pause/stop; acknowledge pause quickly and reconcile valid events under a transparent written policy.
- Add fraud/invalid-traffic checks, frequency caps, creative moderation, destination validation, campaign audit history, and advertiser dispute/reporting flows.
- Sponsored content must be clearly labeled and distinguishable from organic search results. Ad UI must never obstruct essential tasks; dismiss controls must work and persist according to a documented policy.

### 15.6 Future architecture boundary

When approved, the planned domain may include campaign management, ad sets, creatives, placements, eligibility, targeting, ranking/auction, budget pacing, frequency caps, delivery, events, attribution, quality/fraud, moderation, billing/ledger, reconciliation, reporting, and optimization. The implementation may start as a modular domain inside the existing backend and use independently scalable workers only when justified. Do not prematurely split into microservices.

The public marketplace must remain useful if the future advertising system is unavailable. Organic ranking, listing access, core search, account security, and property enquiries must not depend on the ad engine.

## 16. Phased implementation roadmap and acceptance gates

### Phase 0 — Product discovery and architecture lock

**Deliver:** final launch scope, initial-market decision, user journeys, design tokens, data classification, threat model, country readiness checklist, analytics/privacy policy, architecture decisions, and measurable performance targets.

**Gate:** owner decisions recorded; risks and non-goals documented; no implementation assumptions disguised as confirmed requirements.

### Phase 1 — Engineering foundation

**Deliver:** workspace/package scripts, lint/format/typecheck/test/build, environment validation, local development instructions, CI pipeline, logging, health endpoints, database connection/migration workflow, error conventions, and independent deployment configuration.

**Gate:** clean install/build/checks; no secrets in repository; documented rollback and migration process.

### Phase 2 — Identity and authorization

**Deliver:** registration/login/recovery, sessions, profile, verification flows as chosen, organizations/memberships, roles/permissions, server-side guards/policies, audit events, and account security.

**Gate:** authentication tests pass; unauthorized and cross-organization access tests fail safely; privileged actions are audited.

### Phase 3 — Marketplace data and listing lifecycle

**Deliver:** locations, properties, media/documents, draft/submit/review/approve/publish/archive lifecycle, owner workspace, listing detail templates, enquiry/report flows, moderation, and seed data limited to synthetic examples.

**Gate:** listing lifecycle works end-to-end; private documents stay private; public pages expose only approved data.

### Phase 4 — Discovery, search, and public SEO

**Deliver:** home, buy/rent/land/commercial/stays as supported, search/filter/sort, property details, saved listings/searches, comparison, map with list fallback, metadata/canonicals/sitemaps, structured data, responsive image pipeline, and analytics consent decisions.

**Gate:** crawl/render audit; key pages work without client-only content dependency; accessibility and mobile performance checks recorded.

### Phase 5 — Developer projects and professional profiles

**Deliver:** developer/agency/agent profiles, project/building/unit models, inventory and availability, project submit/review/publish workflow, admin-created projects with explicit organization access, and relevant public detail pages.

**Gate:** tenant isolation passes; project and unit states are auditable; dynamic templates work with multiple records.

### Phase 6 — Enquiries, communications, and operational admin

**Deliver:** buyer requirements, leads/inquiries, viewing requests, notifications, complaint/fraud report queues, staff workspaces, permission matrix, admin operations, content management, and audit-log review.

**Gate:** only authorized roles can access each operation; notification retries are safe; moderation decisions are recorded.

### Phase 7 — Launch hardening and first-market release

**Deliver:** production environment, domain/HTTPS, CDN and media policy, backups and restore test, monitoring/alerts, rate limits, abuse controls, security review, load tests, legal review, support process, incident runbooks, and SEO launch checklist.

**Gate:** rollback and restore tested; critical/high security issues resolved or explicitly risk-accepted; key user journeys pass E2E; launch-market legal and operations checklist approved.

### Phase 8 — Post-launch stabilization and measured growth

**Deliver:** fix issues from real telemetry, improve search relevance and conversion paths, editorial content workflow, analytics dashboards, performance tuning, and prioritized accessibility/usability improvements.

**Gate:** decisions are based on reliable data; privacy/consent and opt-out controls are honored; no speculative scale-up without measurements.

### Phase 9 — Country-by-country expansion

**Deliver:** locale/currency/unit support, country-specific fields, market content, legal/payment/provider review, localized SEO, customer support readiness, and country launch controls.

**Gate:** each market independently passes the market-readiness checklist; no global switch activates an unreviewed market.

### Phase 10 — Optional AI/search intelligence

**Deliver only after separate approval:** AI-assisted search, internal copilots, scoped tools, evaluation suite, redaction, quotas, cost controls, trace logs, and approval workflows.

**Gate:** benchmark quality and cost; pass prompt-injection and authorization tests; safe fallback to non-AI functionality.

### Phase 11 — Advanced experience experiments (including optional 3D)

**Deliver only when justified:** prototype richer motion, interactive plans, or a dynamically loaded 3D project viewer; compare against a lightweight 2D baseline.

**Gate:** measurable user benefit and no unacceptable regression in mobile performance, accessibility, crawlability, memory, or battery use. If the gate fails, keep the lightweight 2D experience.

### Phase 12 — Advertising Platform / Ad Engine (FINAL PHASE, LOCKED; OWNER APPROVAL REQUIRED)

**Status:** `NOT AUTHORIZED — DO NOT IMPLEMENT` until explicit owner approval.

This phase begins only after the marketplace is launched and stable and the owner authorizes the work. It then gets its own detailed implementation plan and gates. Planned scope: campaign/ad-set/creative management, placement inventory, delivery, targeting, budget pacing, ranking/auction where justified, events/attribution, billing ledger, fraud/quality, moderation, reconciliation, reporting, and controlled optimization.

**Gate before any coding:** explicit owner approval recorded; pricing and billing policy chosen; legal/policy review complete; data/consent policy defined; architecture and threat model reviewed; load-test plan and acceptance tests agreed.

**Gate before production:** budget caps verified under concurrency; pause/stop propagation verified; ledger reconciles; event deduplication and fraud tests pass; sponsored disclosure/accessibility verified; admin permission and audit tests pass; load/latency and failure-mode tests pass.

## 17. Testing and definition of done

Every implemented phase must include relevant tests; test folders alone do not count.

- **Unit:** domain rules, validation, permission checks, formatting, state transitions.
- **Integration:** database constraints, repository queries, provider adapters, queue behavior, webhook idempotency where applicable.
- **E2E:** visitor browsing, registration, listing creation/submission/review, search, enquiry, project submission, and staff workflows.
- **Security:** cross-tenant access, IDOR/BOLA, injection, upload validation, auth abuse, rate limits, secrets scanning, dependency scanning.
- **Accessibility:** keyboard-only, focus management, labels/errors, contrast, reduced motion, semantic structure, screen-reader smoke checks.
- **Performance:** Core Web Vitals, API p95/p99, database query plans, queue lag, memory/event-loop lag, and realistic concurrency.
- **Recovery:** backup restore, migration rollback/recovery strategy, deployment rollback, queue replay/dead-letter handling.

A phase is done only when code, tests, documentation, migration/API changes, `STATUS.md`, and the cumulative ZIP are updated and verified. Report exactly which commands were run and which were not.

## 18. Release and handoff requirements

For every meaningful phase, provide:

1. Summary of scope completed and deliberately deferred.
2. File/module-level change summary.
3. Test/build/lint/typecheck results with truthful status.
4. Security, SEO, accessibility, performance, and migration notes relevant to the phase.
5. Updated `STATUS.md` and this plan if decisions changed.
6. Full cumulative ZIP of the entire repository, verified with an archive integrity check, plus exact download path.
7. Known gaps, blockers, and the next authorized phase.

## 19. Developer handoff: mandatory database instruction

> **Developer instruction:** Use Neon PostgreSQL Free as the initial hosted database for development and early testing. Use Prisma with version-controlled migrations. Keep the application PostgreSQL-portable and prepare a tested `pg_dump`/`pg_restore` path to a VPS-hosted PostgreSQL database. Do not switch to Supabase or another database provider without owner approval. Do not claim a Neon connection is configured unless the owner has provided credentials and the connection/migrations have actually been tested. Review Neon’s current official limits before production launch.

Useful official references (verify current details at implementation time):
- Neon pricing and plan limits: https://neon.com/pricing
- Neon migration documentation: https://neon.com/docs/import/migrate-from-neon
- PostgreSQL `pg_dump` / `pg_restore`: https://www.postgresql.org/docs/current/app-pgdump.html

## 20. Current repository status disclaimer

The current repository is a **planning/architecture scaffold**, not a functional or production-ready marketplace. Empty directories, route plans, types, and documentation do not mean features are implemented. Start at Phase 0/1, verify the actual repository, and implement sequentially. The Advertising Platform is intentionally excluded from the current implementation scope and remains locked in Phase 12 until explicit owner approval.
