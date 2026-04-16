# Research: MA Training Platform

**Phase 0 Output** | **Date**: 2026-04-12
**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## 1. File Storage: AWS S3 vs. Cloudflare R2

**Decision**: Cloudflare R2

**Rationale**:
- R2 is S3-compatible (same SDK — `@aws-sdk/client-s3`), so switching cost is zero
- R2 charges zero egress fees; S3 charges ~$0.09/GB egress — meaningful for course images
  served on every page load
- R2 integrates with Cloudflare CDN automatically for edge caching of static assets
- Railway (backend host) to Cloudflare R2 has lower latency than Railway to AWS S3 (us-east)
  for MENA-targeting deployments

**Alternatives considered**:
- AWS S3: More mature ecosystem and IAM granularity; rejected due to egress cost and no
  built-in CDN for the chosen deployment topology
- Local disk: Not viable — Vercel/Railway deployments are ephemeral, no persistent disk

**Implementation note**: Use `@aws-sdk/client-s3` with the R2 endpoint URL. Store the
`CLOUDFLARE_R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` in Railway
environment secrets.

---

## 2. Admin Authentication: JWT with Refresh Token Rotation

**Decision**: Short-lived access token (15min) + long-lived refresh token (7 days)
stored in `httpOnly` cookies with `SameSite=Strict`

**Rationale**:
- httpOnly cookies prevent XSS theft of tokens (contrast with localStorage)
- SameSite=Strict blocks CSRF for state-mutating endpoints
- Refresh token rotation: each use of the refresh token issues a new one and invalidates
  the old one (stored in Redis with a hash for O(1) lookup and revocation)
- Constitution Principle X requires server-side validation — Express middleware validates
  the JWT on every API call; Nuxt server middleware validates on every SSR render of
  `/admin/*` pages

**Alternatives considered**:
- Session-based auth (express-session + Redis): Simpler but adds Redis round-trip overhead
  on every request; JWT validation is stateless and faster for the read-heavy admin dashboard
- LocalStorage JWT: Rejected — XSS vulnerability; httpOnly cookies are required

**Token storage in Redis**: `refresh_token:{userId}` → `{ tokenHash, issuedAt, expiresAt }`.
On logout: delete the key. On rotation: replace with new hash. Compromised token (old hash
used after rotation) triggers session revocation.

---

## 3. Multilingual SSR: @nuxtjs/i18n Configuration

**Decision**: `@nuxtjs/i18n` v9 with `prefix_except_default` strategy, default locale `ar`

**Rationale**:
- MA Training is Arabic-first; setting `ar` as the default means `/ar/courses` also works
  as `/courses` (no redirect tax for the primary audience)
- English is accessed via `/en/courses` explicitly
- `prefix_except_default` provides clean Arabic URLs while still generating correct hreflang
  for both locales in the SSR `<head>`
- The `dir` attribute (`rtl`/`ltr`) and `lang` attribute are set server-side in `app.vue`
  by reading `useI18n().locale` — no client-side flash

**Alternatives considered**:
- `prefix` strategy (prefix for all locales): Cleaner symmetry but creates redirect for
  Arabic-first users; rejected for UX and SEO reasons
- Subdomain strategy (`ar.matraining.com`): More complex DNS and cookie sharing; rejected
  as overengineered for this scale

**RTL implementation**: Tailwind CSS configured with `darkMode: 'class'` + custom RTL plugin.
All directional utilities use `rtl:` / `ltr:` variants. The `<html>` element `dir` attribute
is updated in a Nuxt plugin on locale switch (server-rendered first, hydrated on client).

---

## 4. BullMQ Queue Architecture for Email Jobs

**Decision**: Three named queues — `BOOKING_NOTIFICATION`, `BOOKING_CONFIRMATION`,
`SCHEDULE_EXPORT`

**Rationale**:
- Separating booking notification (to MA Training team) and confirmation (to user) as
  independent jobs means one failure cannot block the other (constitution Principle XI)
- Separate queues allow independent concurrency and priority tuning
- Schedule export is a heavier job (generates Excel file) and benefits from its own concurrency
  limit (max 3 concurrent) to avoid memory pressure

**Retry configuration** (all queues):
```
attempts: 3
backoff: { type: 'exponential', delay: 2000 }
removeOnComplete: { count: 100 }
removeOnFail: false  // Keep in dead-letter queue for investigation
```

**Idempotency**: Each job payload includes a `jobKey` (e.g.,
`booking-notif:{inquiryId}:{type}`) stored in Redis with a 24-hour TTL. Before sending,
the processor checks for the key; if found, it skips and marks success (prevents duplicate
emails on retry).

**Monitoring**: Bull Board (`@bull-board/express`) mounted at `/admin/queues` behind JWT
authentication middleware in Express.

---

## 5. Excel Schedule Generation with ExcelJS

**Decision**: Server-side generation using ExcelJS with streaming write to a Buffer,
then attached to SendGrid email as base64

**Rationale**:
- Server-side generation is mandated by constitution Principle XI (client-side generation prohibited)
- ExcelJS supports RTL worksheet direction (`worksheet.views = [{ rightToLeft: true }]`) for
  Arabic exports
- Buffer approach (not temp file) avoids filesystem state on ephemeral Railway instances
- File is generated fresh per request — no caching of potentially stale schedule data

**Excel structure**:
- Columns: Course Title, Category, City, Start Date, End Date, Duration (Days)
- Arabic worksheet: column headers in Arabic, `rightToLeft: true`
- English worksheet: column headers in English, standard LTR
- Both locales: dates formatted as `DD/MM/YYYY`, locale-specific column widths

**Alternatives considered**:
- xlsx library: Lighter weight but no RTL worksheet support; rejected
- Pre-generated file cached in R2: Stale data risk if admin updates schedule; rejected for
  correctness reasons (acceptable since volume is low — O(1) generation per request)

---

## 6. Course Filtering & Search Performance

**Decision**: Server-side filtering via Prisma `where` clauses + full-text search via
PostgreSQL `tsvector` on course title and description fields

**Rationale**:
- Prisma filter composition (`category`, `city`, `dateRange`) maps cleanly to SQL `WHERE`
  clauses; no external search engine needed at this scale (~2,000 courses)
- PostgreSQL full-text search with `tsvector` columns (GIN index) is sufficient for keyword
  search at the expected data volume; eliminates Elasticsearch/Meilisearch operational overhead
- Arabic full-text search requires `arabic` dictionary in PostgreSQL (`ALTER TEXT SEARCH`);
  English uses `english` dictionary; separate `tsvector` columns per locale

**Caching**: Redis cache with 5-minute TTL for the courses listing response per filter
combination (serialized filter params as cache key). Cache is invalidated on any admin
course mutation.

**Pagination**: Cursor-based pagination (`take` + `cursor` in Prisma) for performance on
large datasets; page number UI maps to cursor server-side.

---

## 7. Deployment Architecture

**Decision**: Vercel (Nuxt.js 3 frontend) + Railway (Express.js API + PostgreSQL + Redis)

**Rationale**:
- Vercel has first-class Nuxt.js 3 support with SSR edge functions and automatic preview
  deployments per PR — satisfying constitution Principle XII preview deployment requirement
- Railway provides managed PostgreSQL and Redis on the same private network (no egress
  between app and DB), reducing latency and connection overhead
- Both support environment-specific secrets and GitHub Actions deployment triggers

**Environment strategy**:
- `main` branch → production (Vercel production + Railway production service)
- PR branches → preview (Vercel preview URL + Railway staging service)
- Local development → `.env` files (never committed; `.env.example` is committed)

**Prisma migrations in CI/CD**: Migrations run as a dedicated Railway deploy hook
(`prisma migrate deploy`) triggered after the new backend image is deployed but before
traffic is switched — NOT bundled with app startup.

---

## 8. Trainer Application CV Upload

**Decision**: Optional PDF upload via multipart form, stored in Cloudflare R2, max 5MB

**Rationale**:
- The spec assumption marks file upload as "nice-to-have" in v1 — including it avoids a
  future migration and the operational overhead is low (low submission volume, ~10-50/month)
- PDF only (not Word/image) simplifies server-side validation (`mimetype: application/pdf`)
- 5MB limit is sufficient for a CV PDF and aligns with SendGrid attachment limits
- R2 key format: `trainer-applications/{uuid}/{filename-sanitized}.pdf`
- Signed URL for admin access (1-hour expiry) generated on demand — files are not public

**Alternatives considered**:
- Text-only bio field: Spec assumption; rejecting to implement upload for better UX
- Store in database as BLOB: Rejected — bloats PostgreSQL, unsuitable for binary at scale

---

## 9. Nuxt.js 3 + Express.js API Integration Pattern

**Decision**: Nuxt.js 3 server acts as a proxy to the Express.js API in production;
in development, Nuxt uses `nitro.devProxy` to forward `/api/*` calls to `localhost:3001`

**Rationale**:
- Avoids CORS configuration in production (Nuxt edge function and Express API share a
  domain boundary; the browser never calls the Express API directly)
- Simplifies auth cookie handling — `httpOnly` cookies set by Express are in the same
  domain context as Nuxt pages

**Alternative considered**: Direct browser → Express API calls with CORS enabled. Rejected
because it exposes the backend API URL publicly and complicates cookie/auth patterns.

---

## 10. CI/CD Gate Configuration

**GitHub Actions pipeline steps** (parallelized where possible):

| Job | Steps | Blocks merge |
|-----|-------|-------------|
| `type-check` | `tsc --noEmit` (frontend + backend) | Yes |
| `lint` | ESLint zero errors (frontend + backend) | Yes |
| `test-frontend` | Vitest + coverage ≥ 70% overall, 80% composables | Yes |
| `test-backend` | Jest + Supertest + coverage ≥ 70% overall, 80% services | Yes |
| `lighthouse` | Lighthouse CI: SEO ≥ 90, LCP < 2.5s, CLS < 0.1 | Yes |
| `axe` | axe-core via Playwright: 0 critical violations | Yes |
| `bundle-size` | size-limit: main JS bundle growth ≤ 10% | Yes |

**Pipeline duration target**: < 15 minutes (type-check, lint run in parallel with tests;
Lighthouse and axe run after successful deploy to preview URL).
