# Frontend Routes and Page Purpose

This route catalogue defines intended product surfaces; the repository is a scaffold and these routes are not necessarily implemented. Every public route needs metadata, canonical URL strategy, loading/empty/error states, responsive behavior, and accessibility checks.

## Public routes
- `/`: discovery home, primary search, supported inventory categories, trust explanation.
- `/buy`, `/rent`, `/commercial`, `/land`, `/short-stays`: intent-specific entry pages only for inventory types supported at launch.
- `/search`, `/map`, `/compare`: discovery and comparison; map must have a list alternative.
- `/property/[slug]`: dynamic property detail template backed by approved database data.
- `/projects`, `/projects/[slug]`: developer project directory and dynamic project detail.
- `/developers`, `/developers/[slug]`: developer directory/profile.
- `/agents`, `/agents/[slug]`, `/agencies`, `/agencies/[slug]`: professional directory/profile.
- `/areas/[slug]`, `/countries`: location and country pages backed by real inventory and useful content.
- `/ai-search`: optional AI-assisted search, with ordinary-search fallback after separate approval.
- `/investment`, `/investment/calculator`, `/market-insights`: educational tools with transparent assumptions and sourced data.
- `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/help`, `/faq`, `/pricing`.
- Legal: terms, privacy, cookies, listing policy, and fraud/safety policy. Publish market-specific text only after qualified review.

## Auth/account
- `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/select-role`, `/onboarding`.
- `/account/profile`, `/account/security`, `/account/sessions`, `/account/notifications`.

## Dashboard areas
- Buyer: saved listings/searches, requirements, enquiries, viewing requests.
- Owner: listings, media/documents, verification, enquiries, viewing requests, listing analytics.
- Agent: inventory, leads, pipeline, clients, calendar/viewings.
- Agency: team, inventory, lead distribution, organization profile and allowed reports.
- Developer: projects, buildings, units, inventory, media, leads, review status.
- Admin: users, organizations, listings, projects, verification, moderation, fraud, countries, content, permissions, audit logs, feature flags and settings.

## Explicitly excluded from current scope
No advertiser Ads Manager, campaign/ad-set/creative editor, ad placements, sponsored listing components, ad algorithm, ad billing, or ad-specific admin/owner/agent/agency/developer dashboard pages. These are reserved for the final future phase in `PLANNING.md` and require explicit owner approval.
