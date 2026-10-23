# Deployment and Security Baseline

## Independent deployment
- Frontend hosting root: `frontend/`.
- Backend hosting root: `backend/`.
- Deploy each from its own CI workflow/environment.
- Database migrations run as a controlled backend release step, not from the frontend.
- Use distinct preview/staging/production credentials and isolated production environment approvals.

## Secrets
- Never commit `.env` files or credentials.
- `NEXT_PUBLIC_*` values are browser-visible and must never contain secrets.
- Keep database, Redis, payment, AI provider and storage credentials in server-side secret management.
- Rotate secrets and document incident procedures.

## Network
- HTTPS only; CDN/WAF/rate limits at edge.
- Private database and Redis; no public inbound access unless explicitly justified.
- Strict CORS allowlist; secure cookies and CSRF controls if cookie-based sessions are used.
- Apply request size limits, upload validation, SSRF protection, safe URL fetching, and outbound network controls.

## Application
- Deny-by-default authorization; test tenant boundaries and IDOR.
- MFA/step-up authentication for privileged operations.
- Secure session rotation/revocation, password reset and email/phone verification.
- Validate DTOs; parameterized queries; output encoding; CSP and security headers.
- Protect file uploads with content-type verification, size limits, malware scanning where available, and safe image processing.
- Audit admin actions, verification decisions, price changes, refunds, role changes and agent tool actions.

## CI/CD
- Separate frontend/backend workflows, least-privilege token permissions, pinned third-party actions, dependency and secret scanning, protected branches and deployment approvals.
- Do not expose production secrets to untrusted pull requests.
- Build/test/security gates must pass before deployment.

## Operations and payments
- Signed webhook validation, replay protection, idempotency and reconciliation for any approved payment integration.
- A browser redirect is not proof of payment.
- Separate permissions for refunds, price changes, and other sensitive financial operations.
- Centralized structured logs, metrics, alerts and error tracking with PII redaction.
- Backups encrypted and access-controlled; regularly test restoration.
- Incident response, rollback, key rotation and disaster-recovery runbooks.
- Test rate limiting, abuse, load, accessibility, payment idempotency and recovery.

Advertising-specific security, billing, and delivery controls are planned in `PLANNING.md` only and are not implementation authorization.
