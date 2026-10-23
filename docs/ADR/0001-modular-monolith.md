# ADR 0001 — Start with a Modular Monolith

Status: Proposed

## Decision
Start with one NestJS backend organized into explicit modules, plus independently deployed frontend.
Use queue workers for asynchronous work. Do not start with many microservices.

## Reasons
- Lower operational complexity for the initial team.
- Shared authorization and transactions are easier to reason about.
- Modules can be extracted later based on measured scale or team boundaries.

## Consequences
- Enforce module boundaries, contracts and ownership.
- Monitor slow modules and queue bottlenecks.
- Avoid cross-module database access without explicit service/repository contracts.
