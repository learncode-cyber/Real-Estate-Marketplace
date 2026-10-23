# ADR 0003 — Governed AI Agents

Status: Proposed

## Decision
Add agents through a registry and controlled runtime. Tool capabilities are allowlisted and permission-scoped.
External side effects and money-affecting actions require approval.

## Consequences
- Agent prompts, tool schemas, versions, traces, evaluations and costs are auditable.
- Adding a reviewed agent template can be a configuration task; new tools require code review and deployment.
