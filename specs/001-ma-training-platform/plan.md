# Implementation Plan: MA Training Platform

**Branch**: `001-ma-training-platform` | **Date**: 2026-04-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-ma-training-platform/spec.md`

## Summary

Build a modern, multilingual (Arabic RTL / English LTR) corporate training website for MA Training
that serves two audiences: (1) public visitors who browse, filter, and inquire about courses, and
(2) the MA Training team who manage all content and leads through a back-office admin dashboard.
The platform uses Nuxt.js 3 for SSR, Express.js for the API, PostgreSQL + Prisma for data,
BullMQ for async email jobs, and @nuxtjs/i18n for bilingual support.

## Technical Context

**Language/Version**: TypeScript 5.x (strict) · Node.js 20.12+ LTS
**Primary Dependencies**:
- Frontend: Nuxt.js 3, Vue.js 3 (Composition API), Pinia, Tailwind CSS, @nuxtjs/i18n
- Backend: Express.js, Prisma ORM, BullMQ, ExcelJS, SendGrid, jsonwebtoken
- Infra: Redis (cache + queue), PostgreSQL 15, AWS S3 / Cloudflare R2

**Storage**: PostgreSQL 15 (primary data) · Redis (BullMQ queues + session cache) ·
Cloudflare R2 (file uploads: course images, CV attachments)

**Testing**: Vitest + Vue Test Utils (frontend) · Jest + Supertest (backend/API integration)

**Target Platform**: Server-side rendered web application (Vercel for frontend · Railway for
backend + PostgreSQL + Redis)

**Project Type**: Full-stack SSR web application (public site + admin dashboard)

**Performance Goals**:
- LCP < 2.5s on mobile (4G throttled) — enforced by Lighthouse CI
- API response time p95 < 500ms for all public endpoints
- Lighthouse SEO ≥ 90 on Home, Courses Listing, Course Detail, Schedule pages
- Email job delivery within 2 minutes of enqueue
- Admin inquiries table render < 1s for 10,000 rows

**Constraints**:
- No online payment or user accounts on the public site
- Booking inquiry is the only conversion mechanism
- All UI must render correctly in Arabic (RTL) and English (LTR)
- Admin dashboard requires server-side JWT validation per request
- BullMQ jobs must be idempotent; DB write precedes job enqueue

**Scale/Scope**:
- 9 public pages + admin dashboard
- ~500 courses at launch, growing to ~2,000 over 2 years
- ~50 admin-managed entities (courses, workshops, categories, cities)
- Expected public traffic: 1,000–5,000 unique visitors/day at launch
- Expected leads volume: 50–200 booking inquiries/month

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Vue.js 3 + Nuxt.js 3 SSR Architecture | ✅ PASS | Nuxt.js 3 SSR confirmed; `<script setup>` + Composition API required in all components |
| II. TypeScript Strict Mode | ✅ PASS | `strict: true` in both `nuxt.config.ts` tsconfig and backend tsconfig; Zod at all API boundaries |
| III. Multilingual RTL/LTR Consistency | ✅ PASS | @nuxtjs/i18n with `/ar/` and `/en/` prefixed routes; `dir` set server-side in Nuxt |
| IV. REST API + Express.js Structure | ✅ PASS | All routes under `/api/v1/`; service layer separation; unified error shape |
| V. PostgreSQL + Prisma Data Integrity | ✅ PASS | Prisma ORM over PostgreSQL 15; soft-delete pattern; transactions for multi-step writes |
| VI. BullMQ Email Job Reliability | ✅ PASS | BullMQ + Redis; 3-retry exponential backoff; DB write before enqueue |
| VII. Testing Standards | ✅ PASS | Vitest (frontend) + Jest/Supertest (backend); integration tests against real DB |
| VIII. Performance Requirements | ✅ PASS | Lighthouse CI configured; bundle size gate in GitHub Actions |
| IX. WCAG 2.1 AA Accessibility | ✅ PASS | axe-core in CI; keyboard navigation required |
| X. Admin Dashboard UX Consistency | ⚠ REVIEW | JWT auth validated server-side in Nuxt middleware AND Express — client guards are supplementary only |
| XI. Booking Inquiry & Schedule Export | ✅ PASS | DB-first, idempotent, async email, < 3s HTTP response |
| XII. CI/CD Quality Gates | ✅ PASS | GitHub Actions: tsc, ESLint, Vitest, Jest, Lighthouse CI, axe, bundle-size |

**Principle X clarification**: JWT is validated on every request in Express middleware AND in Nuxt
server middleware — client-side route guards in Vue are supplementary UI-only. This satisfies
"server-side session validation."

*Post-Phase 1 re-check*: All gates pass. File upload scope (Cloudflare R2) confirmed in research.

## Project Structure

### Documentation (this feature)

```text
specs/001-ma-training-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── public-courses.md
│   ├── public-booking.md
│   ├── public-schedule.md
│   ├── public-leads.md
│   ├── admin-auth.md
│   ├── admin-content.md
│   └── admin-leads.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/                          # Nuxt.js 3 application
├── assets/
│   ├── css/
│   │   └── main.css               # Tailwind base + custom utilities
│   └── fonts/                     # Cairo, Tajawal (Arabic)
├── components/
│   ├── common/                    # AppHeader, AppFooter, LanguageSwitcher,
│   │                              # AppButton, AppModal, AppToast
│   ├── courses/                   # CourseCard, CourseFilters, CourseDetail,
│   │                              # CourseGrid, CoursePagination
│   ├── booking/                   # BookingInquiryForm, BookingConfirmation
│   ├── schedule/                  # ScheduleTable, ScheduleExportForm
│   ├── admin/                     # AdminDataTable, AdminSidebar, AdminBreadcrumb,
│   │                              # AdminStatusBadge, AdminConfirmModal,
│   │                              # AdminFormField, AdminAuditLog
│   └── forms/                     # BaseInput, BaseSelect, BaseTextarea,
│                                  # BaseFileUpload, FormValidationError
├── composables/
│   ├── useCourses.ts
│   ├── useBookingInquiry.ts
│   ├── useScheduleExport.ts
│   ├── useAdminAuth.ts
│   └── useToast.ts
├── layouts/
│   ├── default.vue                # Public site layout (header + footer)
│   └── admin.vue                  # Admin dashboard layout (sidebar + topbar)
├── middleware/
│   ├── admin-auth.global.ts       # Server-side JWT validation for /admin routes
│   └── locale-redirect.global.ts  # Redirect bare URLs to /en/ or /ar/
├── pages/
│   ├── [locale]/
│   │   ├── index.vue              # Home
│   │   ├── courses/
│   │   │   ├── index.vue          # Courses listing
│   │   │   └── [slug].vue         # Course detail
│   │   ├── schedule.vue
│   │   ├── workshops/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── become-a-trainer.vue
│   │   ├── about.vue
│   │   ├── contact.vue
│   │   └── privacy.vue
│   └── admin/
│       ├── index.vue              # Dashboard overview
│       ├── login.vue
│       ├── courses/
│       │   ├── index.vue
│       │   ├── new.vue
│       │   └── [id].vue
│       ├── workshops/             # (mirrors courses structure)
│       ├── categories/
│       ├── cities/
│       ├── inquiries/
│       │   ├── index.vue
│       │   └── [id].vue
│       ├── trainer-applications/
│       ├── contacts/
│       └── subscribers/
├── plugins/
│   └── axios.ts                   # Axios instance with auth headers
├── public/
│   └── robots.txt
├── server/
│   └── middleware/
│       └── admin-auth.ts          # Nuxt server middleware: validates JWT on /admin API calls
├── stores/
│   ├── auth.ts                    # Pinia: admin auth state + refresh token logic
│   ├── courses.ts
│   └── ui.ts                      # Toast, modal, loading states
├── types/
│   └── index.ts                   # Shared TypeScript types (re-exported from backend)
├── i18n/
│   ├── ar.json
│   └── en.json
├── tests/
│   ├── components/                # Vitest component tests
│   └── composables/               # Vitest composable tests
├── nuxt.config.ts
└── tsconfig.json                  # strict: true

backend/                           # Express.js API
├── src/
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── courses.ts
│   │   │   ├── workshops.ts
│   │   │   ├── categories.ts
│   │   │   ├── cities.ts
│   │   │   ├── inquiries.ts
│   │   │   ├── schedule.ts
│   │   │   ├── leads.ts           # trainer-applications, contact, newsletter
│   │   │   └── admin/
│   │   │       ├── auth.ts
│   │   │       ├── courses.ts
│   │   │       ├── workshops.ts
│   │   │       ├── categories.ts
│   │   │       ├── cities.ts
│   │   │       ├── inquiries.ts
│   │   │       ├── applications.ts
│   │   │       ├── contacts.ts
│   │   │       └── subscribers.ts
│   │   └── index.ts               # Mount /api/v1
│   ├── services/
│   │   ├── course.service.ts
│   │   ├── workshop.service.ts
│   │   ├── inquiry.service.ts
│   │   ├── schedule.service.ts
│   │   ├── lead.service.ts
│   │   └── admin/
│   │       ├── auth.service.ts
│   │       └── audit.service.ts
│   ├── middleware/
│   │   ├── authenticate.ts        # JWT validation middleware
│   │   ├── validate.ts            # Zod request validation middleware
│   │   ├── rateLimit.ts           # Per-endpoint rate limiting
│   │   └── errorHandler.ts        # Unified error response shape
│   ├── queues/
│   │   ├── constants.ts           # Queue name constants
│   │   ├── connection.ts          # Redis + BullMQ connection setup
│   │   ├── processors/
│   │   │   ├── booking-notification.processor.ts
│   │   │   ├── booking-confirmation.processor.ts
│   │   │   └── schedule-export.processor.ts
│   │   └── producers/
│   │       ├── booking.producer.ts
│   │       └── schedule.producer.ts
│   ├── email/
│   │   ├── client.ts              # SendGrid client singleton
│   │   └── templates/
│   │       ├── booking-notification.ts
│   │       ├── booking-confirmation.ts
│   │       └── schedule-export.ts
│   ├── storage/
│   │   └── r2.ts                  # Cloudflare R2 client (S3-compatible)
│   ├── excel/
│   │   └── schedule.generator.ts  # ExcelJS schedule builder
│   ├── schemas/
│   │   ├── inquiry.schema.ts      # Zod schemas for request validation
│   │   ├── schedule.schema.ts
│   │   ├── lead.schema.ts
│   │   └── admin/
│   │       ├── course.schema.ts
│   │       └── auth.schema.ts
│   ├── types/
│   │   └── index.ts               # Shared interfaces (also consumed by frontend)
│   └── app.ts                     # Express app setup
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── tests/
    ├── integration/
    │   ├── inquiries.test.ts
    │   ├── schedule.test.ts
    │   └── admin-courses.test.ts
    └── unit/
        ├── inquiry.service.test.ts
        └── schedule.generator.test.ts

.github/
└── workflows/
    ├── ci.yml                     # PR gate: tsc, lint, test, Lighthouse, axe, bundle-size
    └── deploy.yml                 # Deploy to Vercel (frontend) + Railway (backend)
```

**Structure Decision**: Full-stack web application with separate `frontend/` (Nuxt.js 3) and
`backend/` (Express.js) directories at the repository root. This separation enables independent
deployment: Vercel for the frontend (SSR edge functions) and Railway for the Node.js API,
PostgreSQL, and Redis. Shared TypeScript types are exported from `backend/src/types/` and
consumed by `frontend/types/`.

## Complexity Tracking

> No constitution violations requiring justification. All principles satisfied by the chosen stack.
