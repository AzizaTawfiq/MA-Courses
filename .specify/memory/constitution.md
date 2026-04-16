<!--
  Sync Impact Report
  ==================
  Version change: [template] → 1.0.0 (INITIAL RATIFICATION — template fully resolved)
  Modified principles: N/A — initial fill from template
  Added sections:
    - Core Principles I–XII (12 principles)
    - Performance & Quality Standards (threshold table + version pinning)
    - Development Workflow & CI/CD (branch strategy, review requirements, DoD)
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    ✅ .specify/templates/plan-template.md — Constitution Check section already generic;
       align "Performance Goals" and "Constraints" fields with Principles VIII & XII thresholds
    ✅ .specify/templates/spec-template.md — FR/SC patterns align with principles;
       add note that FR items must reference WCAG (Principle IX) for any UI story
    ✅ .specify/templates/tasks-template.md — task categories cover testing (Principle VII),
       observability (Principle VI), and CI/CD (Principle XII); no structural changes needed
    ⚠  .specify/templates/commands/ — no command files present; skip
  Follow-up TODOs:
    - TODO(REPOSITORY_URL): Add actual GitHub repository URL to PRD Section 1 when finalized
    - TODO(LOAD_TEST_GATE): Define and configure load-test GitHub Actions job for API p95 gate
    - TODO(BULLMQ_DASHBOARD): Decide on Bull Board vs. custom monitoring endpoint before Sprint 2
-->

# MA Training Platform Constitution

## Core Principles

### I. Vue.js 3 + Nuxt.js 3 SSR Component Architecture

All frontend components MUST be written using the Vue 3 Composition API with `<script setup>`
syntax. Components MUST follow a strict single-responsibility structure: presentational components
(in `components/`) handle display only; page-level logic lives in `pages/` or composables in
`composables/`. Nuxt.js 3 SSR MUST be the rendering strategy for all public-facing pages to ensure
SEO crawlability and Core Web Vitals compliance. Client-only rendering (`<ClientOnly>`) is reserved
for widgets that genuinely cannot render server-side. Auto-imports MUST be used for components,
composables, and Nuxt utilities — manual import of auto-importable modules is PROHIBITED.

**Non-negotiable rules**:
- Options API is PROHIBITED in all new code
- `defineProps` and `defineEmits` MUST use TypeScript generic syntax — runtime-only validators
  without types are PROHIBITED
- Components exceeding 200 lines of template + script MUST be decomposed into smaller units
- Server-side data fetching MUST use `useFetch` or `useAsyncData` — `onMounted` fetch calls for
  initial page data are PROHIBITED
- Layout components in `layouts/` MUST NOT contain business logic or direct API calls

**Rationale**: SSR is non-negotiable for Lighthouse SEO ≥ 90 and Arabic/English hreflang
correctness. Composition API enforces composable reuse and avoids the `this`-context pitfalls
that caused regressions in Options API codebases.

### II. TypeScript Strict Mode (Frontend & Backend)

TypeScript MUST be enabled with `strict: true` in `tsconfig.json` across the entire codebase —
both Nuxt.js frontend and Express.js backend. The `any` type is PROHIBITED without an inline
`// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment explaining the specific
exception. All API response shapes and shared domain types MUST have typed interfaces in a
`shared/types/` package (or Nuxt `types/` directory) shared between frontend and backend.
Backend Express route handlers MUST use typed `Request<Params, ResBody, ReqBody, Query>` generics.
Runtime validation at API boundaries MUST use Zod schemas — TypeScript compile-time types alone
do NOT guarantee runtime safety.

**Non-negotiable rules**:
- `noImplicitAny`, `strictNullChecks`, and `exactOptionalPropertyTypes` MUST be `true`
- All exported functions MUST have explicit return type annotations (no inferred-only exports)
- Zod schemas MUST be co-located with their corresponding TypeScript type (`z.infer<typeof schema>`)
- `unknown` MUST be used instead of `any` when handling untyped external data (API responses,
  JSON.parse results)
- TypeScript compilation (`tsc --noEmit`) MUST be a blocking CI gate with zero errors

**Rationale**: Strict TypeScript eliminates an entire class of runtime null-reference and
type-mismatch errors. Shared types between frontend and backend prevent API contract drift
— the primary cause of integration bugs in full-stack TypeScript projects.

### III. Multilingual RTL/LTR Consistency (Arabic / English)

The platform MUST support Arabic (RTL) and English (LTR) at full feature parity. Every UI
component MUST be reviewed in both locales before a PR is approved. Tailwind CSS `rtl:` and
`ltr:` variants MUST be used for all directional spacing and alignment — hardcoded `margin-left`,
`padding-right`, `text-align: left`, or `float: left` without their RTL counterparts are
PROHIBITED. i18n translation keys MUST follow the naming convention `section.component.key`
(e.g., `courses.card.enrollButton`). Inline text strings in `.vue` components are PROHIBITED.
Locale-aware formatting of dates, numbers, and currencies MUST use the `Intl` browser API
configured per locale (`ar-EG` or `en-US` as appropriate).

**Non-negotiable rules**:
- `<html dir="rtl" lang="ar">` MUST be set when the active locale is Arabic; `dir="ltr" lang="en"`
  for English — this MUST be applied server-side in Nuxt to avoid hydration mismatch
- Hreflang tags for `/en/` and `/ar/` MUST be present in `<head>` on every SSR-rendered page
- Arabic translation strings MUST be reviewed by a native Arabic speaker before production release
  — machine-translated strings are NOT acceptable for user-facing content
- Arabic-compatible typefaces (Cairo or Tajawal) MUST be loaded via Nuxt font optimization with
  `font-display: swap` to prevent layout shift
- RTL layout MUST maintain correct logical reading order for screen readers (left-to-right DOM
  order is PROHIBITED for Arabic content)

**Rationale**: The core differentiator of MA Training is its Arabic-first experience for MENA
corporate clients. Any RTL layout breakage or translation gap directly undermines brand trust and
the business case for the platform.

### IV. REST API Design & Express.js Structure

Express.js API routes MUST follow RESTful conventions: plural nouns for resource names, correct
HTTP verbs (GET/POST/PUT/PATCH/DELETE), and consistent HTTP status codes (200, 201, 400, 401,
403, 404, 409, 422, 500). API versioning MUST use the `/api/v1/` URL prefix for all routes.
Routes MUST be organized in feature-based router files (e.g., `src/routes/courses.ts`) — a
single monolithic routes file is PROHIBITED. Middleware (authentication, rate-limiting, logging)
MUST be applied at the router or app level, never duplicated inside individual handlers. All
request bodies and query parameters MUST be validated with Zod schemas before any business logic
executes. Error responses MUST conform to the unified shape:
`{ status: number, message: string, code: string, errors?: ZodIssue[] }`.

**Non-negotiable rules**:
- Business logic MUST live in a service layer (`src/services/`) — route handlers are thin
  orchestration only
- All API endpoints MUST be documented with request/response type contracts in `specs/[feature]/contracts/`
- 4xx responses MUST include a machine-readable `code` field (e.g., `"BOOKING_DUPLICATE"`) for
  frontend i18n error messaging
- Rate limiting (express-rate-limit) MUST be applied to all public mutation endpoints:
  booking inquiry, contact form, newsletter subscription, trainer application
- CORS MUST be explicitly configured — wildcard `*` origin is PROHIBITED in production

**Rationale**: Consistent API structure prevents contract drift between frontend and backend teams
and ensures the validation-first approach catches bad data before it reaches the database.

### V. PostgreSQL + Prisma Data Integrity

All database operations MUST go through Prisma Client. Raw SQL (`$queryRaw`, `$executeRaw`) is
permitted only for complex analytical queries unavailable via Prisma's query API and MUST include
a code comment explaining why Prisma is insufficient. Prisma schema MUST define explicit
`@@relation` names, `onDelete` cascade behavior, and `@@index` annotations for all foreign key
fields and common query filters. Schema migrations MUST be generated via `prisma migrate dev`
and committed to the repository — manual schema alterations applied directly to any environment
are PROHIBITED. Soft-delete patterns using `deletedAt DateTime?` MUST be used for all
user-visible content entities (Course, Instructor, Inquiry, Workshop); physical deletion is
reserved for administrative purge operations only.

**Non-negotiable rules**:
- Every Prisma model MUST include `createdAt DateTime @default(now())` and
  `updatedAt DateTime @updatedAt` fields
- Multi-step write operations (e.g., create inquiry + enqueue job) MUST use `prisma.$transaction`
  to guarantee atomicity
- `prisma/seed.ts` MUST be maintained with representative seed data for local development and
  test database setup
- Connection pooling MUST be configured via Prisma Data Proxy or PgBouncer — default Prisma
  connection behavior is NOT acceptable under production traffic
- Prisma migration files MUST NOT be modified after they have been applied to any shared environment

**Rationale**: Data integrity is foundational to the booking inquiry flow — a lost inquiry due
to a failed transaction is a direct business loss. Prisma's schema-first approach also serves
as the canonical documentation of the data model.

### VI. BullMQ Email Job Reliability

All email delivery — booking inquiry notifications, schedule export emails, contact form
confirmations, newsletter confirmations — MUST be processed through BullMQ queues backed by Redis.
Synchronous email sending inside HTTP request handlers is PROHIBITED. Every job MUST include retry
configuration with exponential backoff: minimum 3 attempts, initial delay 2 seconds, max delay 30
seconds. Failed jobs that exhaust retries MUST be moved to a named dead-letter queue and MUST
produce a structured log entry at `ERROR` level with job ID, payload summary, and failure reason.
Job payloads MUST be typed via TypeScript interfaces. Email templates MUST support Arabic and
English content, selected based on the `locale` field stored in the job payload.

**Non-negotiable rules**:
- Queue names MUST be defined as exported constants in `src/queues/constants.ts` — inline string
  literals in queue definitions are PROHIBITED
- Job handlers MUST be idempotent: re-processing the same job ID MUST NOT send duplicate emails
  (use idempotency keys or check for prior delivery in the database)
- A BullMQ monitoring interface (Bull Board or equivalent) MUST be available behind admin
  authentication for operational visibility of queue health
- Email delivery MUST complete within 2 minutes of job enqueue under normal operational load
- The booking inquiry database record MUST be persisted BEFORE the BullMQ job is enqueued —
  job failure MUST NOT result in an unrecorded inquiry

**Rationale**: Email jobs are the primary business-critical output of the platform. A booking
inquiry email that fails to deliver is an invisible lost lead. The queue-first pattern decouples
the user's HTTP experience from email latency and provides retry resilience.

### VII. Testing Standards (Vitest & Jest)

Frontend unit and component tests MUST use Vitest with Vue Test Utils. Backend unit and integration
tests MUST use Jest. Minimum coverage thresholds MUST be enforced in CI: 80% line coverage for
all service-layer modules, 70% overall project coverage. Unit tests MUST be co-located with source
files (`*.test.ts` or `*.spec.ts`). Integration tests MUST live in `tests/integration/` and MUST
use a dedicated test database — not mocked Prisma clients. All booking inquiry and schedule export
flows MUST have integration tests covering the full path: HTTP request → database write → BullMQ
enqueue → job processor execution (with mocked SMTP transport only).

**Non-negotiable rules**:
- New service-layer functions MUST have tests written before implementation (TDD — Red-Green-Refactor)
- Mocking the Prisma Client or database is PROHIBITED in integration tests; use a test PostgreSQL
  instance seeded via `prisma/seed.ts`
- CI MUST fail with a non-zero exit code if coverage drops below thresholds on a PR
- Snapshot tests are PROHIBITED — they mask regressions behind stale baselines
- Vue component tests MUST test user-visible behavior (rendered text, emitted events, slot output),
  NOT internal implementation details (method calls, data properties)

**Rationale**: A test suite that mocks the database is testing the mock, not the product. Given
that Prisma and PostgreSQL behavior is core to the booking flow, integration tests must run
against real infrastructure to be meaningful.

### VIII. Performance Requirements

The platform MUST meet the following measurable performance targets on every release candidate,
verified via automated tooling in CI:

| Metric | Target | Tool |
|--------|--------|------|
| LCP (mobile, 4G throttled) | < 2.5 seconds | Lighthouse CI |
| API response time p95 | < 500 ms | k6 / autocannon load gate |
| Lighthouse SEO score | ≥ 90 | Lighthouse CI |
| Core Web Vitals CLS | < 0.1 | Lighthouse CI |
| Core Web Vitals INP | < 200 ms | Lighthouse CI |
| JS bundle size growth per PR | ≤ 10% increase | bundlesize / size-limit |

Images MUST be served in WebP or AVIF format with responsive `srcset` attributes. Third-party
scripts MUST be loaded with `defer` or `async` — render-blocking scripts are PROHIBITED. SSR
page HTML MUST be fully hydrated within 3 seconds on a mid-range mobile device (Moto G Power
benchmark). Nuxt's built-in image optimization (`@nuxt/image`) MUST be used for all
content images.

**Non-negotiable rules**:
- Lighthouse CI MUST run on every PR targeting `main` with a budget configuration file committed
  to the repository
- A JS bundle size regression alert MUST block merge if the main bundle grows > 10% in a single PR
- Arabic/English font loading MUST use `font-display: swap` with `size-adjust` fallback metrics
  to prevent CLS from font swap
- The Courses Listing page with 50+ course cards MUST render first meaningful paint in < 1.5s
  on desktop (SSR advantage must be preserved — no client-side-only catalog rendering)

**Rationale**: Performance is the second key differentiator after bilingual support. The target
audience (MENA corporate HR managers) frequently accesses training sites on mobile devices with
variable connectivity. LCP < 2.5s is the Google Core Web Vitals threshold for "good" — missing
it directly harms SEO rankings.

### IX. WCAG 2.1 AA Accessibility

All public-facing pages and admin dashboard interfaces MUST conform to WCAG 2.1 Level AA.
Every interactive element (buttons, links, form controls, modals) MUST be keyboard-navigable
and MUST display a visible focus indicator (not suppressed by `outline: none` without a
replacement style). Form inputs MUST have an associated `<label>` element — `placeholder`
text alone as the only label is PROHIBITED. Color contrast MUST meet 4.5:1 for normal text
and 3:1 for large text (≥ 18pt or ≥ 14pt bold). RTL Arabic layouts MUST maintain correct
logical reading order for screen readers. ARIA attributes MUST be used only where semantic
HTML is insufficient — adding `role="button"` to a `<button>` element or `aria-label` that
duplicates visible text are examples of ARIA misuse that MUST be corrected.

**Non-negotiable rules**:
- `axe-core` automated accessibility audit MUST be integrated into CI (e.g., via
  `@axe-core/playwright` or `jest-axe`) and MUST pass with zero critical or serious violations
- All non-decorative images MUST have descriptive `alt` text provided in both Arabic and English
  translations; decorative images MUST use `alt=""`
- The active language MUST be declared via `lang` attribute on `<html>` matching the rendered
  locale (`lang="ar"` or `lang="en"`)
- The admin dashboard MUST be fully operable without a mouse (Tab, Enter, Escape, arrow keys)
- Touch targets on mobile MUST be at least 44×44 CSS pixels

**Rationale**: WCAG 2.1 AA compliance is both a legal consideration in several MENA markets
and a practical necessity — many corporate users access training portals from locked-down
enterprise environments where keyboard-only or assistive technology usage is common.

### X. Admin Dashboard UX Consistency

The admin dashboard MUST use a consistent, shared internal component library for all recurring
UI patterns: data tables, modal dialogs, inline-edit forms, status badges, confirmation dialogs,
and toast notifications. All CRUD interfaces MUST implement optimistic UI updates with automatic
rollback on API failure — full-page refreshes for in-place edits are PROHIBITED. Data tables
displaying course listings, inquiries, or leads MUST implement server-side sorting, filtering,
and cursor-based pagination — client-side filtering of full datasets fetched in one request is
PROHIBITED. Destructive actions (delete, archive, bulk-reject) MUST require an explicit
confirmation modal with action description. Where content exists in both Arabic and English,
both values MUST be displayed side by side in the admin interface for editorial verification.

**Non-negotiable rules**:
- Admin route protection MUST be enforced server-side (session validation in Nuxt server
  middleware) — client-side route guards alone are insufficient and MUST NOT be relied upon
- Every admin mutation (create, update, delete, status change) MUST produce an immutable audit
  log entry: `{ actor, action, entityType, entityId, timestamp, diff }`
- Form validation errors MUST appear inline adjacent to the failing field — toast-only validation
  feedback is PROHIBITED
- The inquiries/leads data table MUST load and render within 1 second for datasets up to
  10,000 rows (server-side pagination MUST be implemented before this threshold is reached)
- Admin UI MUST support both RTL and LTR display following the same locale-switching mechanism
  as the public site

**Rationale**: The admin dashboard is the operational nerve center for the MA Training team.
Inconsistent UX or missing audit trails create operational risk and reduce trust in the system
as the content catalog grows.

### XI. Booking Inquiry & Schedule Export Flow Reliability

The booking inquiry form MUST implement server-side idempotency: duplicate submissions from the
same user for the same course within a 60-second window MUST be detected and deduplicated — the
user receives a success response but only one inquiry record is created and one email is sent.
On a valid submission: the inquiry MUST be persisted to PostgreSQL first; the BullMQ notification
job is enqueued only after a successful database write. The confirmation email to the user and
the notification email to the MA Training team MUST be dispatched as independent BullMQ jobs
so that failure of one does not block the other. Schedule export requests MUST generate the
Excel (`.xlsx`) file server-side using a dedicated service before attaching it to the email job
— client-side spreadsheet generation is PROHIBITED.

**Non-negotiable rules**:
- The booking inquiry HTTP endpoint MUST return a response to the user within 3 seconds
  (database write + job enqueue only; email delivery is asynchronous)
- Server-side validation MUST be applied to all inquiry form fields regardless of client-side
  validation state — client validation is UX convenience only
- Schedule export jobs MUST handle an empty result set gracefully: send a "no sessions found"
  email with guidance rather than throwing an error or delivering an empty file
- Email delivery status for each inquiry (pending / sent / failed) MUST be visible and filterable
  in the admin dashboard
- Inquiry deduplication keys MUST include: user email + course ID + date window (not just IP)

**Rationale**: The booking inquiry and schedule export flows are the two highest-value user
journeys on the platform. Unreliable email delivery or data loss in these flows directly maps
to lost business revenue for MA Training.

### XII. CI/CD Quality Gates via GitHub Actions

All code changes MUST pass a mandatory GitHub Actions CI pipeline before merge to `main`. The
pipeline MUST enforce all of the following gates in sequence (or in parallel where independent):

1. TypeScript compilation: `tsc --noEmit` with zero errors
2. ESLint: zero errors (warnings are allowed but tracked)
3. Vitest (frontend): all tests pass, coverage thresholds met
4. Jest (backend): all tests pass, coverage thresholds met
5. Lighthouse CI: SEO ≥ 90, LCP < 2.5s, CLS < 0.1 on key pages
6. axe-core accessibility audit: zero critical/serious violations
7. Bundle size check: main JS bundle growth ≤ 10% vs. base branch

Deployment to the production environment MUST occur only from `main` after all gates pass.
Preview deployments MUST be generated automatically for every PR targeting `main` and the
preview URL MUST be posted as a PR comment.

**Non-negotiable rules**:
- Branch protection rules on `main` MUST require all status checks to pass before merge —
  PRs MUST NOT be merged manually while CI is failing
- The full CI pipeline MUST complete in under 15 minutes; steps MUST be parallelized
  (frontend tests, backend tests, and Lighthouse can run concurrently)
- All secrets (database URLs, Redis URLs, email API keys, deployment tokens) MUST be stored
  in GitHub Actions encrypted secrets — committed `.env` files with real secrets are a
  security violation and MUST be immediately rotated
- Database migration steps MUST run as a separate, explicit deployment job after application
  deployment — migrations bundled with app startup (e.g., `prisma migrate deploy` in entrypoint)
  are PROHIBITED in production
- Dependabot MUST be enabled for both npm and GitHub Actions dependency updates

**Rationale**: The CI pipeline is the contractual enforcement mechanism for all other principles.
Without automated gates, principle compliance degrades to convention — and conventions fail
under deadline pressure.

## Performance & Quality Standards

### Measurable Thresholds (All Environments)

| Metric | Threshold | Enforcement Point |
|--------|-----------|-------------------|
| LCP — mobile, 4G simulated | < 2.5 s | Lighthouse CI — blocks merge |
| API response time p95 | < 500 ms | Load test job on release builds |
| Lighthouse SEO score | ≥ 90 | Lighthouse CI — blocks merge |
| Core Web Vitals CLS | < 0.1 | Lighthouse CI — blocks merge |
| Core Web Vitals INP | < 200 ms | Lighthouse CI — warning |
| WCAG axe-core critical violations | 0 | axe CI step — blocks merge |
| Test coverage — service layer | ≥ 80 % | Jest/Vitest coverage gate |
| Test coverage — overall | ≥ 70 % | Jest/Vitest coverage gate |
| Email delivery latency | < 2 min | BullMQ monitoring alert |
| Admin table load (10 K rows) | < 1 s | Integration test assertion |
| Booking inquiry HTTP response | < 3 s | Integration test assertion |

### Technology Version Requirements

| Technology | Minimum Version | Notes |
|------------|----------------|-------|
| Node.js | 20 LTS | Pin in `.nvmrc` and GitHub Actions |
| Vue.js | 3.x | Composition API only |
| Nuxt.js | 3.x | SSR mode required |
| TypeScript | 5.x | `strict: true` mandatory |
| Prisma | Pin minor | Upgrades require migration test run |
| BullMQ | Pin minor | Upgrades require queue drain test |
| PostgreSQL | 15+ | Target production version |

## Development Workflow & CI/CD

### Branch Strategy

- `main`: production-ready, fully protected, requires all CI gates + 1 reviewer approval
- Feature branches: `NNN-feature-name` format per PRD-001 convention
- No direct commits to `main` under any circumstances (enforced via branch protection)
- Hotfix branches: `hotfix/description` — MUST still pass all CI gates before merge

### Code Review Requirements

- All PRs MUST have at least 1 team member approval before merge
- Reviewers MUST verify constitution compliance using the PR checklist template
- PRs that modify the Prisma schema MUST include the migration file and rollback notes
- PRs that modify booking inquiry or email job flows MUST include BullMQ integration test evidence
- PRs with Lighthouse or axe regressions are BLOCKED regardless of reviewer approval

### Definition of Done

A feature is considered DONE when ALL of the following are true:

1. All CI gates pass (TypeScript, ESLint, tests, Lighthouse, axe, bundle size)
2. RTL (Arabic) and LTR (English) layouts are visually verified via PR preview deployment
3. API request/response contract is documented in `specs/[feature]/contracts/`
4. Admin dashboard reflects new content or lead data where applicable
5. Booking or email flows have integration test coverage if the feature touches those paths
6. The PR has been reviewed, approved, and merged to `main`

## Governance

This constitution is the authoritative governance document for the MA Training Platform. It
supersedes all informal team agreements, Slack decisions, and verbal understandings about
development practice. It is binding on all contributors: frontend developers, backend developers,
QA engineers, and the project owner.

**Amendment Procedure**:
1. Open a PR modifying `.specify/memory/constitution.md` with a written rationale for the change
2. Amendments require approval from the project owner (Aziza) plus at least 1 additional team member
3. MAJOR version bumps (principle removal or backward-incompatible redefinition) require a
   migration plan documenting how existing non-compliant code will be brought into compliance
4. All amendments MUST update the `CONSTITUTION_VERSION` and `LAST_AMENDED_DATE` fields

**Compliance Review**:
- Constitution compliance is reviewed at the start of each development sprint
- Any deliberate deviation from a principle MUST be documented in the PR description as an
  explicit exception with justification — undocumented deviations are violations
- Three or more violations of the same principle in a sprint trigger a mandatory team retrospective

**Versioning Policy**:
- MAJOR: A principle is removed, or redefined in a way that invalidates prior compliant code
- MINOR: A new principle or major section is added; existing compliant code remains valid
- PATCH: Wording clarifications, threshold adjustments, or formatting refinements with no
  behavioral change

**Version**: 1.0.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12
