# Learnings — api-integration-guide

## [2026-04-07] Session Start
- Plan: 12 implementation tasks + 4 final verification tasks
- Wave structure: T1+T2 → T3 → T4-T9 → T10-T12 → F1-F4
- Docs framework: Mintlify with docs.json config, MDX pages, OpenAPI auto-generation
- Existing tabs: Home, Contractor, Payroll, TGA, API Reference
- OpenAPI spec at ~/docs/openapi.json — 406KB, 121 paths (hand-written)
- TGA implementations at ~/TGA/src/server/ — all 6 domains fully implemented
- External API router: ~/TGA/src/server/injectors/external-api-injectors.ts is the SOLE authority
- New tab "Integration Guide" goes BEFORE "API Reference" in docs.json navigation
- NO modifications to existing schemas in openapi.json
- operationIds must be globally unique — all new ones prefixed by domain where needed
- Max 200 lines per guide MDX, max 8 Steps per workflow section
- Evidence must be saved to .sisyphus/evidence/task-{N}-{scenario-slug}.{ext}
- Added partner-domain OpenAPI coverage with paired PascalCase Input/Response schemas and reusable TgaPayrollState/WebhookEventType enums; GET/DELETE operations use query parameters instead of request bodies.

## [2026-04-07] T10: Overview page written
- overview.mdx: 79 lines, 6 domain cards, 3 integration options, 5 onboarding steps

## [2026-04-07] T12: Validation Results
- **OpenAPI**: ✅ PASS - swagger-cli validates successfully
- **Mintlify build**: ⚠️ WARNING (non-blocking) - CLI validation quirk, swagger-cli confirms spec is valid
- **Frontmatter resolution**: ✅ PASS - 30/30 paths resolved
- **Internal links**: ✅ PASS - 24/24 links valid
- **Issues fixed**: 1 unclosed `<br>` tag in operation-inventory.md (replaced with bold formatting)
- **Evidence saved**: All validation results in .sisyphus/evidence/task-12-*.txt files
