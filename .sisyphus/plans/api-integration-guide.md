# Partner Integration Guide — Documentation Plan

## TL;DR

> **Quick Summary**: Add a new top-level "Integration Guide" tab to the Mintlify docs site with prose workflow guides and auto-generated OpenAPI endpoint references for 6 core API domains (Auth, Payroll, EOR, Payslips, Webhooks, Stablecoin Funding) — enabling any partner to embed Toku's payroll/EOR platform.
> 
> **Deliverables**:
> - New "Integration Guide" tab in docs navigation with 6 domain guides + endpoint references
> - Updated `openapi.json` with ~35 new endpoint path definitions and component schemas for all 6 domains
> - Auto-generated interactive API playground pages via Mintlify's OpenAPI integration
> - Architecture overview page with integration patterns (iframe, SSO, headless API)
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: T1 → T2 → T3 → T5 (any domain) → T11 → T12 → F1-F4

---

## Context

### Original Request
Add a new documentation section to ~/docs/ (Mintlify site) that serves as a dedicated integration guide with API references, modeled after the KAST integration requirements PDF. The guide should be generic for any partner embedding Toku payroll/EOR, with KAST as an example use case. All APIs referenced in the KAST spec are already implemented in ~/TGA/.

### Interview Summary
**Key Discussions**:
- **Placement**: New top-level tab (not subgroup of existing API Reference)
- **Audience**: Generic partner guide — "your platform" language, KAST referenced as example
- **OpenAPI coverage**: Yes — update openapi.json to enable auto-generated endpoint pages
- **Scope**: Core 6 domains (Auth, Payroll, EOR, Payslips, Webhooks, Stablecoin Funding)

**Research Findings**:
- **Docs framework**: Mintlify with `docs.json` config, MDX pages, OpenAPI auto-generation
- **Existing tabs**: Home, Contractor, Payroll, TGA, API Reference (200+ pages)
- **OpenAPI spec**: `openapi.json` has 121 paths covering grants/wallets/custody — payroll/EOR/webhook domains are NOT documented
- **TGA implementations**: All 6 domains fully implemented with 134+ operations in `~/TGA/src/server/`
- **External API router**: `~/TGA/src/server/injectors/external-api-injectors.ts` is the sole authority for partner-facing operations
- **Two divergent OpenAPI specs**: `~/docs/openapi.json` (406KB, 121 paths, hand-written) vs `~/TGA/src/server/openapi.ts` (37KB, 8 paths, programmatic) — NOT synchronized

### Metis Review
**Identified Gaps** (addressed):
- **Operation count mismatch**: Plan originally used directory file counts, not external-api-injectors.ts registry. RESOLVED: Task 2 audits the actual external router.
- **OpenAPI drift**: Two specs out of sync. RESOLVED: Extend docs/openapi.json directly, accept drift as tech debt.
- **Partner onboarding gap**: No documentation for how partners get initial credentials. RESOLVED: Overview page includes onboarding section with placeholder for ops-provided details.
- **Merge conflict risk**: 14K-line openapi.json modified by multiple tasks. RESOLVED: Single task (T3) handles ALL OpenAPI modifications.
- **Auth docs duplication**: Existing api/authentication.mdx overlaps. RESOLVED: New guide links to existing auth docs, adds partner-specific token exchange flow.
- **operationId collision risk**: RESOLVED: All new operationIds prefixed by domain where needed.
- **Webhook payload scope**: Documenting 16 event types fully is a project in itself. RESOLVED: Event names + one example payload each; full schemas deferred.

---

## Work Objectives

### Core Objective
Create a self-contained "Integration Guide" documentation tab that enables any partner (like KAST) to understand and integrate with Toku's payroll/EOR platform through 6 API domains: Auth, Payroll, EOR, Payslips, Webhooks, and Stablecoin Funding.

### Concrete Deliverables
- `~/docs/integration-guide/` directory with ~40 MDX files
- Updated `~/docs/openapi.json` with ~35 new endpoint paths + component schemas
- Updated `~/docs/docs.json` with new "Integration Guide" tab and all page references
- Updated `~/docs/index.mdx` home page with Integration Guide card

### Definition of Done
- [ ] `npx mintlify build` succeeds with zero broken references
- [ ] All new endpoint MDX pages resolve their `openapi:` frontmatter against openapi.json
- [ ] Every page in `integration-guide/` is listed in `docs.json` navigation
- [ ] OpenAPI spec validates: `npx @apidevtools/swagger-cli validate openapi.json`

### Must Have
- New "Integration Guide" top-level tab visible in navigation
- Prose workflow guide for each of the 6 domains (Auth, Payroll, EOR, Payslips, Webhooks, Stablecoin Funding)
- Auto-generated endpoint reference pages for each externally-exposed operation
- Architecture overview page explaining integration options (iframe, SSO, headless)
- Webhook event type reference with example payloads

### Must NOT Have (Guardrails)
- **NO internal operations**: Only document operations registered in `external-api-injectors.ts`. Zero exceptions.
- **NO modifications to existing schemas**: Do not touch existing Grant, Wallet, Custody, Distribution schemas in openapi.json
- **NO duplicated auth docs**: Link to existing `api/authentication.mdx` for base auth concepts; only add partner-specific token exchange flow
- **NO invented example payloads**: All examples derived from actual TGA operation input/output types
- **NO prose bloat**: Max 200 lines per guide MDX, max 8 Steps per workflow section
- **NO KAST-specific language**: Write generically ("your platform"), use KAST only as a named example in callout blocks
- **NO scope expansion**: Do not document Reporting, Contractor Payments, Employee Self-Service, or Employee Management domains

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Mintlify CLI)
- **Automated tests**: Tests-after (OpenAPI validation + Mintlify build after each wave)
- **Framework**: Mintlify CLI (`mintlify build`) + swagger-cli for OpenAPI validation

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Documentation pages**: Use Bash (mintlify build) to verify pages render without errors
- **OpenAPI spec**: Use Bash (swagger-cli validate) to verify schema validity
- **Navigation**: Use Bash (grep/jq) to verify all pages are registered in docs.json
- **Content accuracy**: Use Bash (grep) to cross-reference OpenAPI operationIds against MDX frontmatter

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — 2 parallel):
├── Task 1: Directory scaffold + docs.json tab skeleton [quick]
└── Task 2: Audit external-api-injectors.ts → operation inventory [deep]

Wave 2 (OpenAPI — 1 task, depends on T1+T2):
└── Task 3: Add ALL component schemas + endpoint paths for 6 domains to openapi.json [deep]

Wave 3 (Domain Guides — 6 parallel, depends on T3):
├── Task 4: Auth domain — prose guide + endpoint MDX stubs [quick]
├── Task 5: Payroll domain — prose guide + endpoint MDX stubs [unspecified-high]
├── Task 6: EOR domain — prose guide + endpoint MDX stubs [unspecified-high]
├── Task 7: Payslips domain — prose guide + endpoint MDX stubs [unspecified-high]
├── Task 8: Webhooks domain — prose guide + event reference + endpoint MDX stubs [unspecified-high]
└── Task 9: Stablecoin Funding domain — prose guide + endpoint MDX stubs [unspecified-high]

Wave 4 (Polish & Verify — 3 parallel, depends on T4-T9):
├── Task 10: Integration Guide overview page finalization [writing]
├── Task 11: Home page card + final docs.json page references [quick]
└── Task 12: OpenAPI validation + Mintlify build + link verification [quick]

Wave FINAL (4 parallel reviews, then user okay):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high)
└── F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T3 | 1 |
| T2 | — | T3 | 1 |
| T3 | T1, T2 | T4-T9 | 2 |
| T4 | T3 | T10, T11 | 3 |
| T5 | T3 | T10, T11 | 3 |
| T6 | T3 | T10, T11 | 3 |
| T7 | T3 | T10, T11 | 3 |
| T8 | T3 | T10, T11 | 3 |
| T9 | T3 | T10, T11 | 3 |
| T10 | T4-T9 | F1-F4 | 4 |
| T11 | T4-T9 | F1-F4 | 4 |
| T12 | T4-T9 | F1-F4 | 4 |
| F1-F4 | T10-T12 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **2** — T1 → `quick`, T2 → `deep`
- **Wave 2**: **1** — T3 → `deep`
- **Wave 3**: **6** — T4 → `quick`, T5-T9 → `unspecified-high`
- **Wave 4**: **3** — T10 → `writing`, T11 → `quick`, T12 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Directory Scaffold + docs.json Tab Skeleton

  **What to do**:
  - Create directory structure under `~/docs/integration-guide/`:
    ```
    integration-guide/
    ├── overview.mdx              (placeholder — finalized in T10)
    ├── guides/
    │   ├── authentication.mdx    (placeholder for T4)
    │   ├── payroll.mdx           (placeholder for T5)
    │   ├── eor.mdx               (placeholder for T6)
    │   ├── payslips.mdx          (placeholder for T7)
    │   ├── webhooks.mdx          (placeholder for T8)
    │   └── stablecoin-funding.mdx (placeholder for T9)
    └── endpoints/
        ├── auth/
        ├── payroll/
        ├── eor/
        ├── payslips/
        ├── webhooks/
        └── stablecoin/
    ```
  - Add new tab to `~/docs/docs.json` in the `navigation.tabs` array (insert BEFORE the API Reference tab):
    ```json
    {
      "tab": "Integration Guide",
      "url": "integration-guide",
      "groups": [
        {
          "group": "Overview",
          "pages": ["integration-guide/overview"]
        },
        {
          "group": "Authentication",
          "pages": ["integration-guide/guides/authentication"]
        },
        {
          "group": "Payroll",
          "pages": ["integration-guide/guides/payroll"]
        },
        {
          "group": "EOR",
          "pages": ["integration-guide/guides/eor"]
        },
        {
          "group": "Payslips & Documents",
          "pages": ["integration-guide/guides/payslips"]
        },
        {
          "group": "Webhooks",
          "pages": ["integration-guide/guides/webhooks"]
        },
        {
          "group": "Stablecoin Funding",
          "pages": ["integration-guide/guides/stablecoin-funding"]
        }
      ]
    }
    ```
  - Each placeholder MDX file should have valid frontmatter:
    ```yaml
    ---
    title: "[Domain Name]"
    sidebarTitle: "[Short Name]"
    description: "Coming soon — [domain] integration guide"
    ---
    ```

  **Must NOT do**:
  - Do NOT add endpoint MDX files yet (they depend on OpenAPI spec from T3)
  - Do NOT add final page references to docs.json (T11 adds the endpoint pages)
  - Do NOT modify any existing tabs or pages

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File creation and JSON editing — straightforward, well-defined structure
  - **Skills**: []
    - No special skills needed — standard file operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3 (OpenAPI needs the directory structure)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `~/docs/docs.json:33-405` — Existing navigation tab structure. Follow the exact schema: `{ "tab": "Name", "url": "slug", "groups": [...] }`. The new tab should be inserted at line ~202 (before the API Reference tab).
  - `~/docs/tga/overview.mdx` — Example overview page with frontmatter pattern to follow
  - `~/docs/api/guides/best-practices.mdx` — Example guide page structure to follow for placeholder layout

  **API/Type References**:
  - None

  **External References**:
  - Mintlify navigation docs: https://mintlify.com/docs/settings/navigation

  **WHY Each Reference Matters**:
  - `docs.json` is the SOLE navigation config — the new tab MUST follow the exact JSON schema or Mintlify will fail to build
  - Existing overview/guide pages show the frontmatter conventions (title, sidebarTitle, description) that Mintlify expects

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Directory structure created correctly
    Tool: Bash
    Preconditions: ~/docs/ exists
    Steps:
      1. Run `find ~/docs/integration-guide -type f -name "*.mdx" | sort`
      2. Verify output contains at least 7 files (overview + 6 guides)
      3. Run `find ~/docs/integration-guide/endpoints -type d | sort`
      4. Verify 6 subdirectories exist (auth, payroll, eor, payslips, webhooks, stablecoin)
    Expected Result: 7 MDX placeholder files + 6 endpoint subdirectories
    Failure Indicators: Missing files or directories
    Evidence: .sisyphus/evidence/task-1-directory-structure.txt

  Scenario: docs.json has valid Integration Guide tab
    Tool: Bash
    Preconditions: docs.json updated
    Steps:
      1. Run `cat ~/docs/docs.json | python3 -m json.tool` to validate JSON syntax
      2. Run `grep -c '"Integration Guide"' ~/docs/docs.json`
      3. Verify the tab appears before "API Reference" in the file
    Expected Result: Valid JSON, "Integration Guide" tab present, positioned before API Reference
    Failure Indicators: JSON parse error, missing tab, wrong position
    Evidence: .sisyphus/evidence/task-1-docs-json-validation.txt

  Scenario: Placeholder pages have valid frontmatter
    Tool: Bash
    Preconditions: MDX files created
    Steps:
      1. For each MDX file in integration-guide/, verify it starts with `---` and contains `title:` and `sidebarTitle:`
      2. Run `grep -l "^title:" ~/docs/integration-guide/**/*.mdx | wc -l`
    Expected Result: All 7+ MDX files have valid YAML frontmatter with title and sidebarTitle
    Failure Indicators: Files missing frontmatter or using incorrect format
    Evidence: .sisyphus/evidence/task-1-frontmatter-check.txt
  ```

  **Commit**: YES (group 1)
  - Message: `docs(integration-guide): scaffold directory structure and navigation tab`
  - Files: `docs.json`, `integration-guide/**/*.mdx`
  - Pre-commit: `cat ~/docs/docs.json | python3 -m json.tool > /dev/null`

- [x] 2. Audit external-api-injectors.ts — Operation Inventory

  **What to do**:
  - Read `~/TGA/src/server/injectors/external-api-injectors.ts` to extract the COMPLETE list of partner-facing operations
  - For each of the 6 target domains (Auth, Payroll, EOR/HRIS, Payslips, Webhooks, Stablecoin/Token Payroll), identify:
    - Operation key (the string used in the router, e.g., `"createPayroll"`)
    - HTTP method (GET, POST, PUT, DELETE)
    - Operation class name and file path
  - For each operation, read the operation file to extract:
    - Input type/schema (Zod schema or TypeScript interface)
    - Output type/schema (response shape)
    - Required headers (e.g., `x-role-type`)
    - Auth requirements
  - Also read `~/TGA/src/server/services/webhooks/event-types.ts` to get the complete WebhookEventType enum
  - Save the inventory as a structured reference file at `~/docs/.sisyphus/drafts/operation-inventory.md`

  **Must NOT do**:
  - Do NOT document operations that are NOT in external-api-injectors.ts
  - Do NOT modify any TGA source files
  - Do NOT include operations from the 4 out-of-scope domains (Reporting, Contractors, Employee Self-Service, Employee Management) — but note them as "out of scope" for future reference

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Requires reading multiple files across the TGA codebase, understanding TypeScript types, and producing a structured inventory. Needs thorough analysis, not quick edits.
  - **Skills**: []
    - No special skills needed — standard file reading and analysis

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3 (OpenAPI spec needs exact operation list)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `~/TGA/src/server/injectors/external-api-injectors.ts` — THE source of truth for all partner-facing operations. This file registers every external API route. Read it completely — it maps operation keys to handler classes and HTTP methods.
  - `~/TGA/src/server/framework/base-operation.ts` — Base class for all operations. Understand the input/output schema pattern to know where to find types.
  - `~/TGA/src/server/framework/operation-handler-factory.ts` — Maps operations to HTTP methods (GET/POST/PUT/DELETE). Check how operations declare their method.

  **API/Type References**:
  - `~/TGA/src/server/services/webhooks/event-types.ts` — WebhookEventType enum with all 16 event types
  - `~/TGA/src/server/operations/payroll/*.ts` — Payroll operation classes with input/output schemas
  - `~/TGA/src/server/operations/hris/*.ts` — EOR/HRIS operation classes
  - `~/TGA/src/server/operations/hris/payslips.ts` — All payslip operations in one file
  - `~/TGA/src/server/operations/webhooks/*.ts` — Webhook management operations
  - `~/TGA/src/server/operations/token-payroll/*.ts` — Stablecoin/token payroll operations
  - `~/TGA/src/server/operations/admin/createApiToken.ts` — Auth token creation
  - `~/TGA/src/server/operations/admin/refreshApiToken.ts` — Auth token refresh

  **WHY Each Reference Matters**:
  - `external-api-injectors.ts` is the ONLY authority. If an operation isn't registered here, it's internal-only and must NOT be documented.
  - Operation files contain Zod schemas that define the exact request/response shapes needed for OpenAPI spec writing.
  - `event-types.ts` has the definitive list of webhook events — must match what we document.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Inventory file produced with all 6 domains
    Tool: Bash
    Preconditions: ~/TGA/ exists with source code
    Steps:
      1. Verify `~/docs/.sisyphus/drafts/operation-inventory.md` exists
      2. Grep for each domain header: "Auth", "Payroll", "EOR", "Payslips", "Webhooks", "Stablecoin"
      3. Verify each domain section lists at least 2 operations with: operation key, HTTP method, file path
    Expected Result: Inventory file with 6 domain sections, each listing operations with key/method/path
    Failure Indicators: Missing domains, operations without methods, empty sections
    Evidence: .sisyphus/evidence/task-2-inventory-completeness.txt

  Scenario: All listed operations exist in external-api-injectors.ts
    Tool: Bash
    Preconditions: Inventory file created
    Steps:
      1. Extract all operation keys from the inventory file
      2. For each key, grep in ~/TGA/src/server/injectors/external-api-injectors.ts
      3. Verify every key appears in the injectors file
    Expected Result: 100% of documented operations are in external-api-injectors.ts
    Failure Indicators: Any operation key NOT found in the injectors file
    Evidence: .sisyphus/evidence/task-2-operation-verification.txt

  Scenario: Webhook event types are complete
    Tool: Bash
    Preconditions: Inventory file created
    Steps:
      1. Count webhook event types in inventory file
      2. Count enum values in ~/TGA/src/server/services/webhooks/event-types.ts
      3. Compare — inventory should list ALL events (marking out-of-scope ones as such)
    Expected Result: All webhook event types from source code are accounted for in inventory
    Failure Indicators: Missing event types
    Evidence: .sisyphus/evidence/task-2-webhook-events.txt
  ```

  **Commit**: NO (this is a reference artifact, not docs content)

- [x] 3. Add OpenAPI Schemas + Endpoint Paths for All 6 Domains

  **What to do**:
  - Read the operation inventory from `~/docs/.sisyphus/drafts/operation-inventory.md` (produced by T2)
  - Read `~/docs/openapi.json` to understand existing patterns (PascalCase schemas, camelCase operationIds, `$ref` for schemas, standard error responses)
  - For EACH operation in the 6 target domains, add to `~/docs/openapi.json`:
    1. **Component schemas** in `components.schemas`: Input schema (request body) and Output schema (response body), derived from the TGA operation's Zod/TypeScript types
    2. **Path definition** in `paths`: Method, operationId matching the operation key, summary, description, requestBody (referencing input schema via `$ref`), responses (200 with output schema `$ref`, plus standard 401/403/429/500 error refs)
  - Follow EXACT patterns from existing entries. Example pattern for a POST endpoint:
    ```json
    "/createPayroll": {
      "post": {
        "operationId": "createPayroll",
        "summary": "Create a payroll run",
        "description": "Creates a new payroll run for the specified period and employees.",
        "tags": ["Payroll"],
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreatePayrollInput" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Payroll created successfully",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/CreatePayrollResponse" }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "403": { "$ref": "#/components/responses/Forbidden" },
          "429": { "$ref": "#/components/responses/RateLimited" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    }
    ```
  - Use these OpenAPI tags for grouping: `Authentication`, `Payroll`, `EOR`, `Payslips`, `Webhooks`, `Stablecoin Funding`
  - Add tag definitions to the top-level `tags` array in openapi.json
  - Ensure ALL operationIds are globally unique (no collision with existing 121 paths)

  **Must NOT do**:
  - Do NOT modify any existing paths or schemas in openapi.json — only ADD new ones
  - Do NOT invent field types — derive from actual TGA Zod schemas
  - Do NOT document operations not listed in the T2 inventory
  - Do NOT add more than the 6 target domain tags

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: This is the largest single task — requires reading ~35 TGA operation files to extract schemas, understanding Zod-to-OpenAPI translation, and carefully extending a 14K-line JSON file without breaking existing content. Requires deep analysis and meticulous attention to JSON structure.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (solo — serialized to avoid merge conflicts)
  - **Blocks**: Tasks 4-9 (all domain guide tasks need OpenAPI operationIds to exist)
  - **Blocked By**: Task 1 (directory structure), Task 2 (operation inventory)

  **References**:

  **Pattern References**:
  - `~/docs/openapi.json:1-100` — File header, servers array, security schemes, top-level structure. New paths and schemas must follow the exact same format.
  - `~/docs/openapi.json` — Search for any existing `"post"` path definition to see the exact response format, `$ref` patterns, and error response references used. Copy this pattern exactly.
  - `~/docs/openapi.json` — Search for `"components"` → `"schemas"` section to see how existing schemas define properties, required fields, types, enums, and examples.

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — The authoritative list of operations to document (from T2). Every operation here gets an OpenAPI path. No more, no less.
  - `~/TGA/src/server/operations/payroll/createPayroll.ts` — Example operation file. Read its input Zod schema to derive the OpenAPI request body schema.
  - `~/TGA/src/server/operations/hris/createHrisPerson.ts` — EOR onboarding input schema (complex, has many fields including employmentServiceType)
  - `~/TGA/src/server/operations/hris/payslips.ts` — All 5 payslip operations with their schemas
  - `~/TGA/src/server/operations/webhooks/createWebhookEndpoint.ts` — Webhook endpoint creation schema (url, events[], signingSecret)
  - `~/TGA/src/server/operations/token-payroll/createTokenPayroll.ts` — Stablecoin payroll creation schema
  - `~/TGA/src/server/services/webhooks/event-types.ts` — WebhookEventType enum — use as OpenAPI enum for the events field

  **External References**:
  - OpenAPI 3.0 spec: https://swagger.io/specification/

  **WHY Each Reference Matters**:
  - Existing openapi.json patterns MUST be followed exactly — inconsistent schema formatting will cause Mintlify rendering issues
  - TGA operation files contain the ACTUAL Zod schemas — these are the ground truth for request/response shapes
  - The operation inventory (T2) ensures we only document what's externally exposed

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: OpenAPI spec is valid after modifications
    Tool: Bash
    Preconditions: openapi.json modified with new schemas and paths
    Steps:
      1. Run `cd ~/docs && npx @apidevtools/swagger-cli validate openapi.json`
      2. Check exit code is 0
      3. Run `python3 -c "import json; json.load(open('openapi.json'))"` to verify valid JSON
    Expected Result: Valid OpenAPI 3.0 spec, exit code 0, valid JSON
    Failure Indicators: Validation errors, JSON parse errors, missing $ref targets
    Evidence: .sisyphus/evidence/task-3-openapi-validation.txt

  Scenario: All 6 domain tags present with correct paths
    Tool: Bash
    Preconditions: openapi.json updated
    Steps:
      1. Run `python3 -c "import json; spec=json.load(open('~/docs/openapi.json')); tags=set(); [tags.update(m.get('tags',[])) for p in spec['paths'].values() for m in p.values() if isinstance(m,dict)]; print(sorted(tags))"` 
      2. Verify output includes: Authentication, Payroll, EOR, Payslips, Webhooks, Stablecoin Funding
      3. Count new paths: `python3 -c "import json; spec=json.load(open('~/docs/openapi.json')); print(len(spec['paths']))"` — should be 121 + ~35 new = ~156
    Expected Result: All 6 tags present, path count increased by ~35
    Failure Indicators: Missing tags, path count unchanged or wrong
    Evidence: .sisyphus/evidence/task-3-domain-tags.txt

  Scenario: No existing paths or schemas were modified
    Tool: Bash
    Preconditions: openapi.json updated, git tracking
    Steps:
      1. Run `cd ~/docs && git diff openapi.json | head -200` to review changes
      2. Verify diff only shows additions (lines starting with `+`), not modifications to existing content
      3. Specifically check that Grant, Wallet, Custody, Distribution schemas are unchanged
    Expected Result: Only additions, no modifications to existing schemas
    Failure Indicators: Modified lines in existing schema sections
    Evidence: .sisyphus/evidence/task-3-no-existing-modifications.txt

  Scenario: Schema accuracy spot-check — createPayroll
    Tool: Bash
    Preconditions: openapi.json has CreatePayrollInput schema
    Steps:
      1. Extract required fields from openapi.json's CreatePayrollInput schema
      2. Read ~/TGA/src/server/operations/payroll/createPayroll.ts input schema
      3. Compare required fields — they must match
    Expected Result: OpenAPI schema required fields match TGA Zod schema required fields
    Failure Indicators: Missing fields, wrong types, extra fields not in source
    Evidence: .sisyphus/evidence/task-3-schema-accuracy.txt
  ```

  **Commit**: YES (group 2)
  - Message: `docs(openapi): add schemas and paths for payroll/EOR/payslips/webhooks/stablecoin/auth domains`
  - Files: `openapi.json`
  - Pre-commit: `cd ~/docs && npx @apidevtools/swagger-cli validate openapi.json`

- [x] 4. Auth Domain — Prose Guide + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/authentication.mdx` — a prose guide covering:
    - Partner authentication flow: how a partner backend obtains a scoped API token
    - Token lifecycle: creation, refresh, 7-day grace period on old tokens, revocation
    - Token scoping: business entity, user role (admin, payroll manager, employee)
    - Required headers: `Authorization: Bearer <token>`, `x-role-type`
    - Rate limiting: 100 req/min per IP (link to existing `api/errors.mdx` for full error reference)
    - Partner onboarding placeholder: "Contact Toku to provision your organization and obtain initial credentials"
  - Use `<Steps>` component for the token exchange workflow
  - Include curl examples for token creation and refresh
  - Link to existing `api/authentication.mdx` for base concepts (do NOT duplicate)
  - Create endpoint MDX stub files in `~/docs/integration-guide/endpoints/auth/`:
    - `create-api-token.mdx` with frontmatter `openapi: "POST /createUserAPIToken"`
    - `refresh-api-token.mdx` with frontmatter `openapi: "POST /refreshUserAPIToken"`
  - Update `~/docs/docs.json` — add endpoint pages to the Authentication group

  **Must NOT do**:
  - Do NOT rewrite the existing authentication guide content — link to it
  - Do NOT exceed 200 lines for the prose guide
  - Do NOT include KAST-specific credential details

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small domain — only 2 endpoints + 1 guide page. Straightforward content writing.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5-9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3 (OpenAPI operationIds must exist)

  **References**:

  **Pattern References**:
  - `~/docs/api/authentication.mdx` — Existing auth docs to link to, NOT duplicate. Read this to understand what's already covered and what's missing for partner-specific flows.
  - `~/docs/api/guides/custody-setup.mdx` — Multi-step guide pattern with `<Steps>` component. Follow this structure for the token exchange workflow.
  - `~/docs/api/endpoints/authentication/create-api-token.mdx` — Existing endpoint stub pattern: just YAML frontmatter with `openapi:` directive.

  **API/Type References**:
  - `~/docs/openapi.json` — Search for `createUserAPIToken` and `refreshUserAPIToken` paths (added by T3) to verify operationIds match the MDX frontmatter.

  **WHY Each Reference Matters**:
  - Existing auth docs define what NOT to duplicate — the new guide adds partner-specific context on top
  - Endpoint stub pattern must match exactly for Mintlify to auto-generate the API playground

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth guide page has correct structure and content
    Tool: Bash
    Preconditions: authentication.mdx written
    Steps:
      1. Verify ~/docs/integration-guide/guides/authentication.mdx exists and has valid frontmatter
      2. Grep for "<Steps>" component usage
      3. Grep for link to existing auth docs: "api/authentication"
      4. Count lines: `wc -l ~/docs/integration-guide/guides/authentication.mdx` — must be <= 200
      5. Grep for curl examples
    Expected Result: Valid MDX with Steps component, link to existing auth docs, under 200 lines, has curl examples
    Failure Indicators: Missing frontmatter, no Steps component, no link to existing docs, exceeds 200 lines
    Evidence: .sisyphus/evidence/task-4-auth-guide.txt

  Scenario: Auth endpoint stubs have correct OpenAPI frontmatter
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. Verify ~/docs/integration-guide/endpoints/auth/create-api-token.mdx contains `openapi: "POST /createUserAPIToken"`
      2. Verify ~/docs/integration-guide/endpoints/auth/refresh-api-token.mdx contains `openapi: "POST /refreshUserAPIToken"`
      3. Verify these operationIds exist in openapi.json
    Expected Result: Both files exist with correct OpenAPI frontmatter matching openapi.json operationIds
    Failure Indicators: Wrong operationId, missing files, operationId not in openapi.json
    Evidence: .sisyphus/evidence/task-4-auth-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add auth domain guide and endpoint stubs`
  - Files: `integration-guide/guides/authentication.mdx`, `integration-guide/endpoints/auth/*.mdx`, `docs.json`

- [x] 5. Payroll Domain — Prose Guide + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/payroll.mdx` — a prose guide covering:
    - Payroll run lifecycle: create → calculate → approve → fund → disburse → payslips → filing
    - Off-cycle runs: bonuses, corrections, termination pay
    - Multi-currency: contract in local currency, funding in stablecoin
    - Draft payroll management: list, update, delete
    - Payroll configuration and employee selection
    - Funding request flow (cross-reference to Stablecoin Funding guide)
  - Use `<Steps>` component for the payroll lifecycle and a mermaid diagram for the state machine
  - Include curl examples for creating a payroll run and checking status
  - Create endpoint MDX stub files in `~/docs/integration-guide/endpoints/payroll/` — one per payroll operation in the T2 inventory (likely ~5 external operations: createPayroll, getPayroll, getAllPayroll, updatePayrollState, validateAndCalculateEmployeePayrollData)
  - Update `~/docs/docs.json` — add endpoint pages to the Payroll group

  **Must NOT do**:
  - Do NOT document internal payroll operations not in external-api-injectors.ts
  - Do NOT include jurisdiction-specific tax calculation details (that's Toku's engine, not partner-facing)
  - Do NOT exceed 200 lines for the prose guide

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Medium complexity — ~5 endpoints, stateful lifecycle to describe, mermaid diagram needed
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 6-9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3 (OpenAPI operationIds must exist)

  **References**:

  **Pattern References**:
  - `~/docs/api/guides/grant-lifecycle.mdx` — Lifecycle guide pattern with state transitions. Follow this structure for payroll lifecycle.
  - `~/docs/api/guides/distribution-workflow.mdx` — Workflow guide with sequential steps. Follow this for payroll run flow.
  - `~/docs/api/endpoints/grants/list-grants.mdx` — Endpoint stub pattern for auto-generated pages.

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — Payroll section for exact operation keys and HTTP methods
  - `~/docs/openapi.json` — Payroll-tagged paths (added by T3) for operationId verification
  - `~/TGA/src/server/operations/payroll/createPayroll.ts` — Payroll run creation flow and input fields (for accurate guide content)
  - `~/TGA/src/server/operations/payroll/updatePayrollState.ts` — State transitions (draft → approved → completed → failed) for lifecycle diagram

  **WHY Each Reference Matters**:
  - Grant lifecycle guide shows how to document a stateful entity with state transitions — payroll follows the same pattern
  - TGA operation files reveal the actual state machine and field names — guides must use real field names, not invented ones

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Payroll guide covers complete lifecycle
    Tool: Bash
    Preconditions: payroll.mdx written
    Steps:
      1. Verify ~/docs/integration-guide/guides/payroll.mdx exists with valid frontmatter
      2. Grep for lifecycle states: "create", "approve", "complete" (or equivalent)
      3. Grep for "<Steps>" or mermaid diagram usage
      4. Verify line count <= 200
    Expected Result: Complete lifecycle coverage, visual diagram, under 200 lines
    Failure Indicators: Missing lifecycle states, no diagram, exceeds limit
    Evidence: .sisyphus/evidence/task-5-payroll-guide.txt

  Scenario: Payroll endpoint stubs match OpenAPI operationIds
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. List all files in ~/docs/integration-guide/endpoints/payroll/
      2. Extract `openapi:` frontmatter from each file
      3. Verify each operationId exists in openapi.json under the Payroll tag
    Expected Result: All endpoint stubs reference valid operationIds
    Failure Indicators: operationId mismatch, missing files
    Evidence: .sisyphus/evidence/task-5-payroll-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add payroll domain guide and endpoint stubs`
  - Files: `integration-guide/guides/payroll.mdx`, `integration-guide/endpoints/payroll/*.mdx`, `docs.json`

- [x] 6. EOR Domain — Prose Guide + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/eor.mdx` — a prose guide covering:
    - EOR concept: Toku as legal employer for jurisdictions where partner has no entity
    - Employee onboarding flow: create person → onboarding steps → document upload → activation
    - Contract management: amendments, terminations
    - Profile updates and employee data management
    - Co-branded experience: white-label onboarding within partner platform
    - Role mapping: admin vs payroll manager vs employee
  - Use `<Steps>` component for the onboarding flow
  - Include curl examples for creating an EOR employee and checking onboarding progress
  - Create endpoint MDX stub files in `~/docs/integration-guide/endpoints/eor/` — one per EOR/HRIS operation in the T2 inventory
  - Update `~/docs/docs.json` — add endpoint pages to the EOR group

  **Must NOT do**:
  - Do NOT document internal HRIS admin operations not in external-api-injectors.ts
  - Do NOT include jurisdiction-specific compliance details
  - Do NOT exceed 200 lines

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Medium-high complexity — ~12 external operations, multi-step onboarding flow
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4-5, 7-9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `~/docs/api/guides/custody-setup.mdx` — Multi-step setup guide pattern. EOR onboarding follows a similar progressive setup flow.
  - `~/docs/integrations/adp.mdx` — Integration guide with step-by-step instructions and screenshots. Follow this progressive disclosure pattern.

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — EOR/HRIS section for exact operation keys
  - `~/docs/openapi.json` — EOR-tagged paths (added by T3)
  - `~/TGA/src/server/operations/hris/createHrisPerson.ts` — Onboarding input schema (includes `employmentServiceType: 'EOR'` field)
  - `~/TGA/src/server/operations/hris/onboarding/getOnboardingProgress.ts` — Onboarding step tracking
  - `~/TGA/src/server/config/onboarding/shared-steps.ts` — Onboarding step definitions

  **WHY Each Reference Matters**:
  - `createHrisPerson.ts` reveals the EOR-specific fields (employmentServiceType, entity selection) that the guide must explain
  - Onboarding config shows the actual step sequence that the guide's `<Steps>` must mirror

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: EOR guide covers onboarding flow
    Tool: Bash
    Preconditions: eor.mdx written
    Steps:
      1. Verify ~/docs/integration-guide/guides/eor.mdx exists with valid frontmatter
      2. Grep for "onboard" or "Onboarding" content
      3. Grep for "<Steps>" component
      4. Verify line count <= 200
    Expected Result: Guide covers onboarding flow with Steps component, under 200 lines
    Failure Indicators: Missing onboarding content, no Steps, exceeds limit
    Evidence: .sisyphus/evidence/task-6-eor-guide.txt

  Scenario: EOR endpoint stubs match OpenAPI operationIds
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. List all files in ~/docs/integration-guide/endpoints/eor/
      2. Extract `openapi:` frontmatter, verify each operationId in openapi.json
    Expected Result: All stubs reference valid EOR-tagged operationIds
    Failure Indicators: operationId mismatch
    Evidence: .sisyphus/evidence/task-6-eor-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add EOR domain guide and endpoint stubs`
  - Files: `integration-guide/guides/eor.mdx`, `integration-guide/endpoints/eor/*.mdx`, `docs.json`

- [x] 7. Payslips Domain — Prose Guide + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/payslips.mdx` — a prose guide covering:
    - Payslip generation: automatic after payroll run completion
    - Multi-step file upload flow: (1) get presigned URL via createHrisPayslipFileUpload, (2) upload PDF to S3, (3) create payslip record via createHrisPayslip referencing fileID
    - Retrieval: list payslips for org, list for specific employee role, download via presigned URL
    - White-label branding: legal employer name required, partner branding where permissible
    - Content: earnings, deductions, contributions, YTD, leave balances, statutory IDs
    - Currency display: contract currency (e.g., SGD) even when payout is USDC
    - History and corrections: full archive with audit trail, amended payslips
    - Webhook notification: `payslip.generated` event fires on creation
  - Use `<Steps>` for the file upload workflow
  - Include curl examples for listing payslips and getting a download URL
  - Create endpoint MDX stubs in `~/docs/integration-guide/endpoints/payslips/` (5 operations: createHrisPayslip, getHrisPayslipsForOrg, getHrisPayslipsForRoleInOrg, getHrisPayslipDownloadUrl, createHrisPayslipFileUpload)
  - Update `~/docs/docs.json` — add endpoint pages to the Payslips group

  **Must NOT do**:
  - Do NOT include actual S3 bucket names or internal storage details
  - Do NOT exceed 200 lines

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-step upload flow needs careful explanation; 5 endpoints with file handling
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4-6, 8-9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `~/docs/api/guides/wallet-verification-flow.mdx` — Multi-step flow guide pattern (similar to the upload→create two-step)

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — Payslips section for exact operation keys
  - `~/TGA/src/server/operations/hris/payslips.ts` — All 5 payslip operations in one file — read for exact input/output shapes and the file upload flow
  - `~/docs/openapi.json` — Payslips-tagged paths (added by T3)

  **WHY Each Reference Matters**:
  - `payslips.ts` is the SINGLE file with all payslip operations — it defines the exact two-step upload pattern that the guide must explain accurately

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Payslips guide explains file upload flow
    Tool: Bash
    Preconditions: payslips.mdx written
    Steps:
      1. Verify file exists with valid frontmatter
      2. Grep for "upload" or "presigned" — must explain the two-step flow
      3. Grep for "<Steps>" component
      4. Verify line count <= 200
    Expected Result: Guide explains upload flow with Steps, under 200 lines
    Failure Indicators: Missing upload flow explanation
    Evidence: .sisyphus/evidence/task-7-payslips-guide.txt

  Scenario: 5 payslip endpoint stubs created
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. Count files in ~/docs/integration-guide/endpoints/payslips/
      2. Verify each has valid openapi: frontmatter matching openapi.json
    Expected Result: 5 endpoint stubs with valid operationIds
    Failure Indicators: Wrong count, invalid operationIds
    Evidence: .sisyphus/evidence/task-7-payslips-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add payslips domain guide and endpoint stubs`
  - Files: `integration-guide/guides/payslips.mdx`, `integration-guide/endpoints/payslips/*.mdx`, `docs.json`

- [x] 8. Webhooks Domain — Prose Guide + Event Reference + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/webhooks.mdx` — a prose guide covering:
    - Webhook overview: HTTPS delivery, HMAC-SHA256 signing, exponential backoff with 3 retries
    - Endpoint management: register URL, select event types, manage signing secret
    - Signature verification: how to verify `x-tga-signature` header (with code example in Node.js/Python)
    - Event type reference table listing ALL 16 event types with:
      - Event name (e.g., `payroll_run.created`)
      - Description (one line)
      - When it fires
      - One example payload (simplified JSON — not full schema)
    - Delivery guarantees: at-least-once, idempotency recommendations
    - Retry logic: 1s → 2s → 4s backoff, 10s timeout per attempt
    - Delivery log: how to query webhook delivery history for debugging
    - Mark which events are in-scope for the 6 documented domains vs out-of-scope (GRANT_*, DISTRIBUTION_* are out of scope for this guide)
  - Use a markdown table for the event type reference
  - Include a code block showing HMAC signature verification
  - Create endpoint MDX stubs in `~/docs/integration-guide/endpoints/webhooks/` (4 operations: createWebhookEndpoint, listWebhookEndpoints, deleteWebhookEndpoint, listWebhookDeliveries)
  - Update `~/docs/docs.json` — add endpoint pages to the Webhooks group

  **Must NOT do**:
  - Do NOT document full payload schemas for each event type (deferred to future work)
  - Do NOT expose internal webhook infrastructure details (Safe, Fireblocks, DocuSign, Persona receivers)
  - Do NOT exceed 200 lines (the event table may push close — prioritize conciseness)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex domain — 16 event types to document, signature verification code examples, retry logic explanation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4-7, 9)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `~/docs/api/guides/best-practices.mdx` — Reference guide pattern with tables and code examples. Follow this for the event type reference table.

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — Webhooks section for operation keys and full event type list
  - `~/TGA/src/server/services/webhooks/event-types.ts` — WebhookEventType enum — the DEFINITIVE list of all event types. Use exact enum values.
  - `~/TGA/src/server/services/webhooks/webhook-dispatcher.ts` — Dispatcher implementation showing HMAC-SHA256 signing logic, retry counts, backoff intervals, timeout values. Use these EXACT values in the docs.
  - `~/TGA/src/server/operations/webhooks/createWebhookEndpoint.ts` — Input schema for endpoint registration (url, events, signingSecret fields)
  - `~/docs/openapi.json` — Webhooks-tagged paths (added by T3)

  **WHY Each Reference Matters**:
  - `event-types.ts` is the ONLY source of truth for event names — the guide must use these exact strings
  - `webhook-dispatcher.ts` has the actual retry intervals (1s, 2s, 4s) and timeout (10s) — documentation must match implementation exactly
  - The signing logic in the dispatcher shows how HMAC is computed — the verification code example must be the inverse of this

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Webhook guide covers all critical topics
    Tool: Bash
    Preconditions: webhooks.mdx written
    Steps:
      1. Verify file exists with valid frontmatter
      2. Grep for "HMAC" or "signature" — must explain verification
      3. Grep for event type names (at least 5 different events mentioned)
      4. Grep for "retry" or "backoff" — must explain retry logic
      5. Verify line count <= 200
    Expected Result: Covers signing, events, retries — all under 200 lines
    Failure Indicators: Missing critical sections
    Evidence: .sisyphus/evidence/task-8-webhooks-guide.txt

  Scenario: Event types match source code
    Tool: Bash
    Preconditions: webhooks.mdx written
    Steps:
      1. Extract event type names from webhooks.mdx
      2. Extract event types from ~/TGA/src/server/services/webhooks/event-types.ts
      3. Verify all documented events exist in source code (no invented events)
    Expected Result: Every documented event type exists in the source enum
    Failure Indicators: Events in docs not in source, or events misspelled
    Evidence: .sisyphus/evidence/task-8-event-types-match.txt

  Scenario: 4 webhook endpoint stubs created
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. Count files in ~/docs/integration-guide/endpoints/webhooks/
      2. Verify each has valid openapi: frontmatter
    Expected Result: 4 endpoint stubs with valid operationIds
    Failure Indicators: Wrong count, invalid operationIds
    Evidence: .sisyphus/evidence/task-8-webhook-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add webhooks domain guide, event reference, and endpoint stubs`
  - Files: `integration-guide/guides/webhooks.mdx`, `integration-guide/endpoints/webhooks/*.mdx`, `docs.json`

- [x] 9. Stablecoin Funding Domain — Prose Guide + Endpoint MDX Stubs

  **What to do**:
  - Write `~/docs/integration-guide/guides/stablecoin-funding.mdx` — a prose guide covering:
    - Funding flow: Toku sends funding request → partner transfers on-chain → Toku confirms → Toku disburses → reconciliation
    - Token payroll creation: initiating a stablecoin payroll run
    - Settlement computation: calculating pending settlement amounts
    - Settlement approval: approving settlements for on-chain execution
    - Payroll breakdown: viewing per-employee breakdown of token payroll
    - State management: tracking token payroll states through the lifecycle
    - Supported chains and stablecoins (use `~/docs/snippets/supported-stablecoins.mdx` snippet if available)
    - Reconciliation: settlement reports for inflows, outflows, FX, fees
  - Use `<Steps>` for the end-to-end funding flow
  - Include curl examples for creating a token payroll and checking settlement status
  - Create endpoint MDX stubs in `~/docs/integration-guide/endpoints/stablecoin/` (7 operations: createTokenPayroll, getAllTokenPayrolls, getTokenPayrollByID, updateTokenPayrollState, computePendingSettlements, approveTokenPayrollSettlements, getTokenPayrollBreakdown)
  - Update `~/docs/docs.json` — add endpoint pages to the Stablecoin Funding group

  **Must NOT do**:
  - Do NOT expose Fireblocks/Anchorage custody implementation details
  - Do NOT include wallet addresses or chain-specific config
  - Do NOT exceed 200 lines

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 7 endpoints with a multi-step settlement flow; requires understanding of stablecoin payment concepts
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4-8)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `~/docs/api/guides/distribution-workflow.mdx` — Distribution/settlement workflow pattern. Stablecoin funding follows a similar create → approve → settle flow.

  **API/Type References**:
  - `~/docs/.sisyphus/drafts/operation-inventory.md` — Stablecoin section for exact operation keys
  - `~/TGA/src/server/operations/token-payroll/createTokenPayroll.ts` — Token payroll creation input schema
  - `~/TGA/src/server/operations/token-payroll/computePendingSettlements.ts` — Settlement computation flow
  - `~/TGA/src/server/operations/token-payroll/approveTokenPayrollSettlements.ts` — Settlement approval flow
  - `~/TGA/src/server/operations/token-payroll/getTokenPayrollBreakdown.ts` — Breakdown output schema
  - `~/docs/snippets/supported-stablecoins.mdx` — Reusable snippet for supported chains/tokens (if applicable)
  - `~/docs/openapi.json` — Stablecoin Funding-tagged paths (added by T3)

  **WHY Each Reference Matters**:
  - Distribution workflow guide shows the approved pattern for documenting settlement lifecycles — stablecoin funding mirrors this pattern
  - Token payroll operations reveal the actual state machine and input fields

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Stablecoin guide covers funding lifecycle
    Tool: Bash
    Preconditions: stablecoin-funding.mdx written
    Steps:
      1. Verify file exists with valid frontmatter
      2. Grep for "funding" or "settlement" — must explain the end-to-end flow
      3. Grep for "<Steps>" component
      4. Verify line count <= 200
    Expected Result: Complete funding lifecycle with Steps, under 200 lines
    Failure Indicators: Missing lifecycle explanation
    Evidence: .sisyphus/evidence/task-9-stablecoin-guide.txt

  Scenario: 7 stablecoin endpoint stubs created
    Tool: Bash
    Preconditions: Endpoint MDX files created
    Steps:
      1. Count files in ~/docs/integration-guide/endpoints/stablecoin/
      2. Verify each has valid openapi: frontmatter
    Expected Result: 7 endpoint stubs with valid operationIds
    Failure Indicators: Wrong count, invalid operationIds
    Evidence: .sisyphus/evidence/task-9-stablecoin-endpoints.txt
  ```

  **Commit**: YES (group 3)
  - Message: `docs(integration-guide): add stablecoin funding domain guide and endpoint stubs`
  - Files: `integration-guide/guides/stablecoin-funding.mdx`, `integration-guide/endpoints/stablecoin/*.mdx`, `docs.json`

- [x] 10. Integration Guide Overview Page Finalization

  **What to do**:
  - Rewrite `~/docs/integration-guide/overview.mdx` (replacing the T1 placeholder) with:
    - Title: "Integration Guide" with description: "Embed Toku's payroll, EOR, and stablecoin payment platform into your product"
    - Architecture overview: explain the 3 integration options (iframe, SSO redirect, headless API) with a brief description of each — reference KAST as a named example in a callout
    - `<CardGroup cols={2}>` linking to each of the 6 domain guides with icons and short descriptions
    - Partner onboarding section: "Getting Started" with steps to (1) contact Toku, (2) receive org credentials, (3) create API token, (4) configure webhooks, (5) start integrating
    - Quick reference table: domains, what each covers, link to guide
    - Rate limiting note: 100 req/min per IP, link to api/errors.mdx
    - Sandbox/testing note: placeholder for environment details ("Contact Toku for sandbox access")
  - Use `<CardGroup>`, `<Card>`, and `<Steps>` components following existing patterns

  **Must NOT do**:
  - Do NOT write KAST-specific content outside of callout/example blocks
  - Do NOT exceed 200 lines
  - Do NOT duplicate domain content — only link to domain guide pages

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: This is primarily a content writing task — synthesizing 6 domain guides into a coherent overview page
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11, 12)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4-9 (needs all domain guides to link to)

  **References**:

  **Pattern References**:
  - `~/docs/index.mdx` — Home page pattern with CardGroup and Cards linking to sections. Follow this pattern for the domain link cards.
  - `~/docs/tga/overview.mdx` — Product overview page pattern with getting-started steps.
  - `~/docs/api/overview.mdx` — API overview page pattern with quick reference.

  **WHY Each Reference Matters**:
  - The home page shows how CardGroup is used for navigation cards — follow exactly for the 6 domain cards
  - The API overview shows how to introduce an API section — follow for integration guide intro

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Overview page has all 6 domain cards
    Tool: Bash
    Preconditions: overview.mdx finalized
    Steps:
      1. Grep for "<Card" in ~/docs/integration-guide/overview.mdx
      2. Count occurrences — should be 6 (one per domain)
      3. Verify each card links to the correct guide path
    Expected Result: 6 Card components linking to all domain guides
    Failure Indicators: Missing cards, wrong links
    Evidence: .sisyphus/evidence/task-10-overview-cards.txt

  Scenario: Overview mentions integration options
    Tool: Bash
    Preconditions: overview.mdx finalized
    Steps:
      1. Grep for "iframe" or "embed" — Option A
      2. Grep for "SSO" or "redirect" — Option B
      3. Grep for "headless" or "API" — Option C
    Expected Result: All 3 integration options mentioned
    Failure Indicators: Missing integration options
    Evidence: .sisyphus/evidence/task-10-integration-options.txt
  ```

  **Commit**: YES (group 4)
  - Message: `docs(integration-guide): finalize overview page with architecture and domain links`
  - Files: `integration-guide/overview.mdx`

- [x] 11. Home Page Card + Final docs.json Navigation Update

  **What to do**:
  - Update `~/docs/index.mdx` — add a `<Card>` in the main CardGroup linking to the Integration Guide:
    ```mdx
    <Card title="Integration Guide" icon="plug" href="/integration-guide/overview">
      Embed Toku payroll, EOR, and stablecoin payments into your platform
    </Card>
    ```
  - Update `~/docs/docs.json` — add ALL endpoint MDX pages to their respective groups in the Integration Guide tab. For each domain group, add the endpoint pages after the guide page:
    ```json
    {
      "group": "Payroll",
      "pages": [
        "integration-guide/guides/payroll",
        "integration-guide/endpoints/payroll/create-payroll",
        "integration-guide/endpoints/payroll/get-payroll",
        ...
      ]
    }
    ```
  - Verify every MDX file in `~/docs/integration-guide/` has a corresponding entry in docs.json — ZERO orphaned pages

  **Must NOT do**:
  - Do NOT modify existing cards on the home page — only ADD the new one
  - Do NOT rearrange existing navigation tab order

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple JSON and MDX edits — adding card and page references
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 12)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4-9 (need all endpoint MDX files to exist)

  **References**:

  **Pattern References**:
  - `~/docs/index.mdx` — Existing Card components in the home page CardGroup. Add the new card following the same icon and href pattern.
  - `~/docs/docs.json` — The API Reference tab groups (lines ~202-405) show how endpoint pages are listed under their group. Follow this pattern for each domain's endpoints.

  **WHY Each Reference Matters**:
  - The home page card pattern must match existing cards for visual consistency
  - The docs.json endpoint listing pattern must match exactly or Mintlify won't render the sidebar correctly

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No orphaned pages in integration-guide
    Tool: Bash
    Preconditions: All MDX files created, docs.json updated
    Steps:
      1. Count all MDX files: `find ~/docs/integration-guide -name "*.mdx" | wc -l`
      2. Count docs.json references: `grep -c "integration-guide/" ~/docs/docs.json`
      3. Compare counts — they must match
    Expected Result: File count equals docs.json reference count
    Failure Indicators: Counts don't match (orphaned or missing pages)
    Evidence: .sisyphus/evidence/task-11-no-orphans.txt

  Scenario: Home page has Integration Guide card
    Tool: Bash
    Preconditions: index.mdx updated
    Steps:
      1. Grep for "Integration Guide" in ~/docs/index.mdx
      2. Verify href points to "/integration-guide/overview"
    Expected Result: Card present with correct link
    Failure Indicators: Missing card, wrong href
    Evidence: .sisyphus/evidence/task-11-home-card.txt
  ```

  **Commit**: YES (group 4)
  - Message: `docs(integration-guide): add home page card and finalize navigation references`
  - Files: `index.mdx`, `docs.json`

- [x] 12. OpenAPI Validation + Mintlify Build Verification

  **What to do**:
  - Run full OpenAPI spec validation: `cd ~/docs && npx @apidevtools/swagger-cli validate openapi.json`
  - Run Mintlify build: `cd ~/docs && npx mintlify build`
  - Verify all endpoint MDX `openapi:` frontmatter references resolve to actual operationIds in openapi.json:
    - Extract all `openapi:` values from `integration-guide/endpoints/**/*.mdx`
    - For each, verify the operationId exists in openapi.json paths
  - Verify no broken internal links across all new MDX files
  - Fix any issues found — update files as needed
  - Save all verification output as evidence

  **Must NOT do**:
  - Do NOT modify existing pages outside integration-guide/ to fix issues
  - Do NOT suppress or ignore build warnings

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Validation and verification — running commands and checking output, fixing any small issues
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 11)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4-9

  **References**:

  **External References**:
  - swagger-cli: https://github.com/APIDevTools/swagger-cli — OpenAPI validation tool
  - Mintlify build: `npx mintlify build` validates all pages, links, and OpenAPI references

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: OpenAPI spec is valid
    Tool: Bash
    Preconditions: All T3 changes in place
    Steps:
      1. Run `cd ~/docs && npx @apidevtools/swagger-cli validate openapi.json`
      2. Check exit code is 0
    Expected Result: Valid spec, exit 0
    Failure Indicators: Validation errors
    Evidence: .sisyphus/evidence/task-12-openapi-valid.txt

  Scenario: Mintlify build succeeds
    Tool: Bash
    Preconditions: All MDX files and docs.json updated
    Steps:
      1. Run `cd ~/docs && npx mintlify build`
      2. Check exit code is 0
      3. Check output for any warnings or errors
    Expected Result: Successful build, zero broken refs
    Failure Indicators: Build failure, broken references, missing pages
    Evidence: .sisyphus/evidence/task-12-mintlify-build.txt

  Scenario: All endpoint frontmatter resolves
    Tool: Bash
    Preconditions: All endpoint MDX files created + openapi.json updated
    Steps:
      1. Extract all `openapi:` values from integration-guide/endpoints/**/*.mdx
      2. For each operationId, verify it exists in openapi.json
    Expected Result: 100% resolution — every MDX openapi: matches an operationId
    Failure Indicators: Any unresolved operationId
    Evidence: .sisyphus/evidence/task-12-frontmatter-resolution.txt
  ```

  **Commit**: NO (verification only — fixes committed inline if needed)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (check file exists, grep for content). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npx @apidevtools/swagger-cli validate ~/docs/openapi.json`. Run `npx mintlify build` in ~/docs/. Review all new MDX files for: broken links, missing frontmatter, empty pages, inconsistent formatting. Check OpenAPI schemas for: missing required fields, incorrect types, empty descriptions. Verify no AI slop: excessive comments, generic descriptions ("This endpoint does things"), placeholder text.
  Output: `OpenAPI [PASS/FAIL] | Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start Mintlify dev server (`npx mintlify dev`). Navigate to Integration Guide tab. Verify: tab appears in nav, all 6 domain groups visible in sidebar, each guide page renders with content, each endpoint page shows OpenAPI playground, webhook event reference table renders. Test: clicking through all pages, verifying no 404s, checking mobile responsiveness. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Pages [N/N render] | Navigation [PASS/FAIL] | Playground [N/N functional] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", verify actual output matches spec. Check: only 6 domains documented (no scope creep into Reporting/Contractors/etc), only external operations documented (cross-reference against external-api-injectors.ts), no modifications to existing openapi.json schemas, no KAST-specific language outside callout blocks. Flag any unaccounted files.
  Output: `Tasks [N/N compliant] | Scope [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Commit | Message | Files | Pre-commit |
|--------|---------|-------|------------|
| 1 | `docs(integration-guide): scaffold directory structure and navigation tab` | docs.json, integration-guide/**/*.mdx (empty) | — |
| 2 | `docs(openapi): add schemas and paths for payroll/EOR/payslips/webhooks/stablecoin/auth domains` | openapi.json | `npx @apidevtools/swagger-cli validate openapi.json` |
| 3 | `docs(integration-guide): add domain guides for auth, payroll, EOR, payslips, webhooks, stablecoin` | integration-guide/**/*.mdx | `npx mintlify build` |
| 4 | `docs(integration-guide): finalize overview page, home card, and navigation` | index.mdx, docs.json, integration-guide/overview.mdx | `npx mintlify build` |

---

## Success Criteria

### Verification Commands
```bash
npx @apidevtools/swagger-cli validate ~/docs/openapi.json  # Expected: valid, exit 0
cd ~/docs && npx mintlify build                              # Expected: success, zero broken refs
grep -r "^openapi:" ~/docs/integration-guide/                # Expected: every entry matches an operationId in openapi.json
find ~/docs/integration-guide -name "*.mdx" | wc -l          # Expected: ~40 files
```

### Final Checklist
- [ ] "Integration Guide" tab visible in Mintlify navigation
- [ ] All 6 domains have prose guide pages with workflow steps
- [ ] All externally-exposed endpoints have auto-generated reference pages
- [ ] OpenAPI spec is valid (swagger-cli)
- [ ] Mintlify builds successfully
- [ ] No orphaned pages (every MDX in docs.json)
- [ ] No KAST-specific language outside callout examples
- [ ] No internal operations documented
- [ ] No existing schemas modified
