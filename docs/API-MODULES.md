# Backend API Module Map

Base prefix: `/api/v1`. Use DTO validation, typed responses, pagination, rate limits and authorization policies. This document is a module map, not an implemented API contract.

## Current/core marketplace modules
- auth, users, roles, permissions, organizations, organization-members
- countries, locations, currencies
- properties, property-media, property-documents, verification
- developers, projects, buildings, units, agents, agencies
- search, saved-searches, comparisons, buyer-requirements
- inquiries, leads, viewings, messaging, notifications
- subscriptions, billing, payments, webhooks only when required by an approved core-marketplace business model
- moderation, fraud, reviews, complaints, content, analytics, imports, audit, admin
- feature-flags, navigation-config

## Optional AI governance modules
- agent-registry, agent-runtime, agent-orchestration, agent-tools
- agent-memory, agent-evaluations, agent-approvals, agent-analytics
- agent-schedules, agent-cost-controls, agent-audit

## API rules
- Do not add endpoint examples for future features until their phase is authorized and scoped.
- Validate all input server-side, enforce resource and organization permissions, and use consistent pagination/error contracts.
- Use idempotency for retryable mutations and verify provider webhook signatures before processing events.

## Explicitly deferred
All advertising endpoints—including campaigns, creatives, placements, ad delivery/events, reporting, pricing, and admin advertising operations—are excluded from the current API. They may be designed and implemented only in the final locked phase after explicit owner approval, as described in `../PLANNING.md`.
