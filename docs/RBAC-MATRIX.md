# Role-Based Access Control (RBAC)

## Design
Use permissions and policies, not only role-name checks. A user can hold multiple roles. Permissions are scoped to resource, organization, country/market, and action. Backend guards/policies are authoritative.

## Core roles
- Visitor
- Registered User
- Buyer/Renter
- Property Owner
- Agent
- Agency Owner / Agency Staff
- Developer Owner / Developer Staff
- Content Editor
- Listing Moderator
- Verification Reviewer
- Customer Support
- SEO/Marketing Operator
- AI Agent Operator (only when AI features are approved)
- Analyst (read-only, scoped)
- Platform Admin
- Super Admin / Security Admin

## Permission examples
- `property:create`, `property:read_own`, `property:update_own`, `property:submit`
- `project:create`, `project:update_own`, `project:submit`
- `listing:moderate`, `listing:publish`, `verification:review`
- `users:invite_staff`, `roles:assign_scoped`
- `ai:agent:configure`, `ai:agent:run`, `ai:agent:approve_action` (only after AI feature approval)
- `analytics:read_scoped`, `audit:read`, `security:manage`

## Separation of duties
Content moderation, verification, security administration, and finance-related operations should not be bundled into one broad role by default. Assign duties explicitly, scope them to the required organization/market, expire temporary access where possible, and audit privilege changes.

## Enforcement requirements
- Deny by default.
- Validate authorization on every API request and background job.
- Prevent insecure direct object reference (IDOR) and cross-organization data leakage.
- Re-check authorization when jobs execute, not just when they are queued.
- Require MFA or step-up authentication for sensitive admin actions.
- Log role changes, permission changes, impersonation, sensitive exports, and privileged operations.
- Test negative cases, not only allowed flows.

Advertising-specific roles and permissions are not part of the current implementation. They must be designed and reviewed in the final locked advertising phase after explicit owner approval.
