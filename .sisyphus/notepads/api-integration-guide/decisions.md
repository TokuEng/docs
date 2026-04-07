# Decisions — api-integration-guide

## [2026-04-07] Session Start
- Extend docs/openapi.json directly (accept drift with TGA's programmatic spec as tech debt)
- Single task (T3) handles ALL OpenAPI modifications to avoid merge conflicts
- Partner onboarding: placeholder "Contact Toku" — no actual credential details
- Auth docs: link to existing api/authentication.mdx, don't duplicate
- Webhook events: name + description + one example payload only (full schemas deferred)
- KAST is referenced only in callout blocks as named example; all prose uses generic "your platform"
- Out-of-scope domains: Reporting, Contractor Payments, Employee Self-Service, Employee Management
- Only external operations (from external-api-injectors.ts) are documented
- Preserved existing Authentication tag entry and appended the requested partner-facing Authentication tag block to keep the diff additive while satisfying the required tag set.
