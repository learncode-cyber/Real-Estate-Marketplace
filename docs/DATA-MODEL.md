# Data Model Outline (Not a migration)

## Identity and tenancy
users, user_profiles, organizations, organization_members, roles, permissions, role_permissions, member_role_assignments, sessions, audit_logs.

## Geography
countries, country_domains, locales, currencies, regions, cities, localities.

## Marketplace
properties, property_translations, property_images, property_documents, property_features, property_status_history, verification_checks, developers, projects, buildings, units, inventory_snapshots, agents, agencies, buyer_requirements, requirement_matches, saved_properties, saved_searches, property_comparisons, inquiries, leads, lead_activities, viewings, messages, notifications.

## Optional core monetization
If a core-marketplace listing/subscription/payment model is approved, model its payment records, provider webhook events, ledger entries, invoices, refunds, and pricing versions explicitly. Do not add advertising-specific tables in the current phase.

## AI governance (only after separate approval)
agent_definitions, agent_versions, agent_runs, agent_tool_permissions, agent_approvals, agent_traces, agent_evaluations, agent_schedules, agent_budgets, agent_memory_records (only if approved by retention policy).

## Rules
- Use stable IDs and foreign keys; add tenant/organization scoping where applicable.
- Store money as integer minor units plus ISO currency; never use floating point for money.
- Use idempotency keys and unique provider event IDs for payment webhooks where a payment provider is integrated.
- Keep private documents in private object storage; database stores metadata and access policy.
- Add retention/deletion rules for personal data, agent traces, and uploaded documents.
- Add appropriate indexes and PostGIS strategy after query patterns are confirmed.
- This outline is not a production-ready Prisma schema; constraints, indexes, deletion rules and migrations must be designed and tested.

Advertising campaign, creative, placement, auction, event, budget-reservation, and ad-ledger tables are explicitly deferred to the final owner-approved phase. Do not create them now.
