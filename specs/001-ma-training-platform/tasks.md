---
description: "Task list for MA Training Platform implementation"
---

# Tasks: MA Training Platform

**Input**: Design documents from `specs/001-ma-training-platform/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅

**Tests**: Service-layer unit tests and integration tests are INCLUDED per constitution Principle VII
(TDD mandatory for service-layer functions). Frontend component snapshot tests are PROHIBITED.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on in-progress tasks)
- **[Story]**: Which user story this task belongs to (US1–US6)
- All file paths are relative to the repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository initialization, tooling, environment configuration, and CI/CD skeleton.
No user story work can begin until this phase is complete.

- [X] T001 Initialize pnpm workspaces at repository root with `package.json` and `pnpm-workspace.yaml` referencing `frontend/` and `backend/` packages
- [X] T002 [P] Initialize Nuxt.js 3 frontend project in `frontend/` with TypeScript strict (`nuxi init frontend`), configure `tsconfig.json` with `strict: true`
- [X] T003 [P] Initialize Express.js backend project in `backend/` with TypeScript strict; configure `backend/tsconfig.json` with `strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`
- [X] T004 Create `docker-compose.yml` at repository root with PostgreSQL 15 (port 5432, named volume) and Redis 7 (port 6379, named volume) services
- [X] T005 [P] Create `.env.example` files for `frontend/.env.example` and `backend/.env.example` with all required environment variable names and placeholder values (per `quickstart.md` section 3)
- [X] T006 [P] Configure Tailwind CSS in `frontend/` with `frontend/tailwind.config.ts`: enable RTL plugin (`tailwindcss-rtl` or built-in `rtl:`/`ltr:` variant support), configure Cairo and Tajawal Arabic fonts
- [X] T007 [P] Configure ESLint with TypeScript rules for `frontend/` (`@nuxtjs/eslint-config-typescript`) and `backend/` (`@typescript-eslint/eslint-plugin`) — zero-errors policy for both
- [X] T008 [P] Create GitHub Actions CI workflow at `.github/workflows/ci.yml` with parallel jobs: `type-check` (tsc --noEmit both workspaces), `lint` (ESLint both), `test-frontend` (Vitest), `test-backend` (Jest), `bundle-size` (size-limit); Lighthouse and axe jobs as stubs pending preview URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on. No user story work can begin
until this phase is complete.

**⚠️ CRITICAL**: No user story implementation can begin until Phase 2 is fully complete.

- [ ] T009 Define complete Prisma schema with all 14 models in `backend/prisma/schema.prisma`: Category, City, Instructor, Course, CourseSession, Workshop, WorkshopSession, BookingInquiry, ScheduleExportRequest, TrainerApplication, ContactMessage, NewsletterSubscriber, AdminUser, AuditLog — per `data-model.md` including all enums, indexes, and relations
- [ ] T010 Generate initial Prisma migration with `prisma migrate dev --name init` and verify it applies cleanly against the Docker PostgreSQL service
- [ ] T011 Create database seed in `backend/prisma/seed.ts`: 5 categories (AR+EN), 4 cities (AR+EN), 3 instructors, 10 sample courses with sessions, 2 workshops with sessions, 1 admin user (`admin@matraining.com` / bcrypt-hashed password)
- [ ] T012 [P] Create shared TypeScript type definitions in `backend/src/types/index.ts`: interfaces for all API request bodies, response shapes, and entity DTOs — these types will be re-exported to `frontend/types/index.ts`
- [ ] T013 [P] Set up Express application with global middleware in `backend/src/app.ts`: `cors` (configured origins), `express.json()`, helmet, compression; mount `/api/v1` router and error handler as last middleware
- [ ] T014 [P] Implement Zod request validation middleware in `backend/src/middleware/validate.ts`: generic factory `validate(schema)` that returns Express middleware validating `req.body` and calling `next()` or returning 400 with typed errors array
- [ ] T015 [P] Implement unified error handler middleware in `backend/src/middleware/errorHandler.ts`: catches all errors, returns `{ status, message, code, errors? }` shape; maps Zod errors to field-level error array; maps Prisma `P2002` (unique) to 409, `P2025` (not found) to 404
- [ ] T016 [P] Implement per-endpoint rate limit configurations in `backend/src/middleware/rateLimit.ts`: `publicMutationLimiter` (5 req/IP/10min for booking/contact/newsletter), `strictLimiter` (3 req/IP/10min for trainer applications)
- [ ] T017 Set up API route mounting in `backend/src/routes/index.ts`: mount all v1 routers under `/api/v1`; create `backend/src/app.ts` entry point with all middleware applied in correct order
- [ ] T018 [P] Configure BullMQ in `backend/src/queues/connection.ts` (Redis connection with retry strategy) and define queue name constants in `backend/src/queues/constants.ts`: `BOOKING_NOTIFICATION_QUEUE`, `BOOKING_CONFIRMATION_QUEUE`, `SCHEDULE_EXPORT_QUEUE`
- [ ] T019 [P] Configure SendGrid client singleton in `backend/src/email/client.ts`: initialize `@sendgrid/mail` with API key from env; export typed `sendEmail(to, subject, html, attachments?)` wrapper function
- [ ] T020 [P] Configure Cloudflare R2 client in `backend/src/storage/r2.ts`: initialize `@aws-sdk/client-s3` with R2 endpoint and credentials; export `uploadFile(buffer, key, contentType)` and `getSignedUrl(key, expiresIn)` functions
- [ ] T021 Implement admin JWT authentication service in `backend/src/services/admin/auth.service.ts`: `login(email, password)` → verify bcrypt hash, issue 15-min access token + 7-day refresh token stored in Redis; `refresh(token)` → validate Redis hash, rotate token; `logout(userId)` → delete Redis key
- [ ] T022 Implement admin auth routes in `backend/src/routes/v1/admin/auth.ts`: POST `/login`, POST `/refresh`, POST `/logout`; set httpOnly Secure SameSite=Strict cookie for refresh token; use Zod schema for login request body
- [ ] T023 [P] Implement JWT authentication middleware in `backend/src/middleware/authenticate.ts`: extract Bearer token from Authorization header, verify signature, attach `req.admin` with `{ id, email }`; return 401 with `code: "TOKEN_EXPIRED"` or `"TOKEN_INVALID"` on failure
- [ ] T024 [P] Configure `@nuxtjs/i18n` v9 in `frontend/nuxt.config.ts`: `strategy: 'prefix_except_default'`, `defaultLocale: 'ar'`, `locales: [{ code: 'ar', dir: 'rtl' }, { code: 'en', dir: 'ltr' }]`; configure `detectBrowserLanguage` with cookie persistence
- [ ] T025 [P] Create skeleton i18n translation files `frontend/i18n/ar.json` and `frontend/i18n/en.json` with all top-level section keys as empty objects (nav, courses, booking, schedule, workshops, trainer, contact, admin, common, errors) — content filled in Phase 7
- [ ] T026 [P] Create Nuxt default layout `frontend/layouts/default.vue` (`<script setup>`, `AppHeader` + router slot + `AppFooter`); set `<html :dir="$i18n.localeProperties.dir" :lang="$i18n.locale">` via `useHead` server-side
- [ ] T027 [P] Create Nuxt admin layout `frontend/layouts/admin.vue` with `AdminSidebar` + `AdminTopbar` + router slot; apply `definePageMeta({ layout: 'admin', middleware: 'admin-auth' })` convention
- [ ] T028 Create Nuxt server middleware `frontend/server/middleware/admin-auth.ts`: extract and verify JWT on every `/admin/*` SSR request (excluding `/admin/login`); redirect unauthenticated requests to `/admin/login`
- [ ] T029 Create Pinia admin auth store `frontend/stores/auth.ts`: state `{ admin, accessToken }`; actions `login()`, `logout()`, `refreshToken()`; axios interceptor that calls `refreshToken()` on 401 before retrying the failed request
- [ ] T030 [P] Create shared common UI components in `frontend/components/common/`: `AppButton.vue` (variants: primary/secondary/danger), `AppModal.vue` (accessible, keyboard-navigable, focus-trapped), `AppToast.vue` (success/error/info variants with auto-dismiss)

**Checkpoint**: Infrastructure ready. Database seeded. Admin auth functional. All user story work can now begin.

---

## Phase 3: User Story 1 — Course Discovery & Browsing (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse, filter, search, and view full details of courses on the public site.

**Independent Test**: Navigate to `http://localhost:3000`, click the courses navigation link, apply a category filter, open a course detail page — all without any login or form submission.

### Tests for User Story 1 (Service layer — required by constitution Principle VII)

> **Write tests FIRST; ensure they FAIL before implementing the service**

- [ ] T031 [P] [US1] Write Jest unit tests for `CourseService.list()` (filter combinations, cursor pagination, keyword search) in `backend/tests/unit/course.service.test.ts` — run against test DB, ensure they FAIL initially
- [ ] T032 [P] [US1] Write Jest integration tests for `GET /api/v1/courses` (filter params, pagination, 400 on invalid params) in `backend/tests/integration/courses.test.ts` — ensure they FAIL initially

### Implementation for User Story 1

- [ ] T033 [P] [US1] Implement `CategoryService.listActive()` in `backend/src/services/category.service.ts`; implement `GET /categories` route in `backend/src/routes/v1/categories.ts`
- [ ] T034 [P] [US1] Implement `CityService.listActive()` in `backend/src/services/city.service.ts`; implement `GET /cities` route in `backend/src/routes/v1/cities.ts`
- [ ] T035 [US1] Implement `CourseService` in `backend/src/services/course.service.ts`: `list({ locale, category, city, dateFrom, dateTo, q, cursor, take })` with Prisma filter composition + Redis 5-min cache keyed on serialized filter params; `getBySlug(slug, locale)` returning full detail with sessions and instructor
- [ ] T036 [US1] Implement public course routes in `backend/src/routes/v1/courses.ts`: `GET /courses` (with Zod query param validation) and `GET /courses/:slug`; wire `CourseService` methods; apply Redis cache invalidation on admin course mutations
- [ ] T037 [P] [US1] Create Prisma migration adding `tsvector` columns `searchVectorEn` and `searchVectorAr` to the `courses` table with GIN indexes and PostgreSQL triggers to auto-update them on insert/update
- [ ] T038 [P] [US1] Create `CourseCard.vue` in `frontend/components/courses/CourseCard.vue`: displays title (locale-aware), category, city, next session date, duration, cover image; all directional styles use `rtl:`/`ltr:` Tailwind variants; no inline strings (uses i18n keys)
- [ ] T039 [P] [US1] Create `CourseFilters.vue` in `frontend/components/courses/CourseFilters.vue`: category multiselect, city select, date range pickers, keyword search input; emits `filter-change` event; accessible (keyboard-navigable, ARIA labels)
- [ ] T040 [US1] Create courses listing SSR page `frontend/pages/[locale]/courses/index.vue`: `useAsyncData` for initial server fetch; `CourseFilters` + `CourseGrid` of `CourseCard` components; cursor-based pagination controls; shows result count; RTL-aware grid layout
- [ ] T041 [US1] Create course detail SSR page `frontend/pages/[locale]/courses/[slug].vue`: `useAsyncData` for full course data; renders title, description, learning outcomes, target audience, sessions table, instructor card, city, duration; 404 handling
- [ ] T042 [P] [US1] Create `useCourses` composable `frontend/composables/useCourses.ts`: wraps `useFetch('/api/v1/courses', { query })` with reactive filter params; exposes `courses`, `pagination`, `isLoading`, `applyFilters()`
- [ ] T043 [US1] Create Home page `frontend/pages/[locale]/index.vue`: hero section, featured courses section (SSR, top 6 courses), category navigation cards, call-to-action to full catalog; uses `useAsyncData` for featured courses
- [ ] T044 [US1] Verify T031 and T032 tests now PASS; verify `GET /courses` API returns data and courses listing page renders correctly in both Arabic (RTL) and English (LTR) locales via browser

**Checkpoint**: Course Discovery (US1) fully functional and independently testable. Visitors can browse, filter, and view courses. Admin can verify course data appears correctly via public site.

---

## Phase 4: User Story 2 — Course Booking Inquiry (Priority: P1)

**Goal**: Visitors can submit a booking inquiry on a course detail page and both the MA Training
team and the visitor receive confirmation emails.

**Independent Test**: Open a course detail page, complete the booking form, submit — verify an on-screen confirmation appears. Verify the MA Training team notification email job is in the BullMQ queue (Bull Board) and the visitor confirmation email job is enqueued separately.

### Tests for User Story 2 (required by constitution)

> **Write tests FIRST; ensure they FAIL before implementing the service**

- [ ] T045 [P] [US2] Write Jest unit tests for `InquiryService.create()` (idempotency key generation, duplicate detection logic) in `backend/tests/unit/inquiry.service.test.ts` — ensure they FAIL initially
- [ ] T046 [P] [US2] Write Jest integration tests for `POST /api/v1/inquiries` (happy path, deduplication, invalid courseId, missing required fields) in `backend/tests/integration/inquiries.test.ts` — ensure they FAIL initially

### Implementation for User Story 2

- [ ] T047 [P] [US2] Create Zod validation schema for booking inquiry request in `backend/src/schemas/inquiry.schema.ts`: all fields with rules from `contracts/public-booking.md`
- [ ] T048 [US2] Implement `InquiryService.create()` in `backend/src/services/inquiry.service.ts`: compute `idempotencyKey = sha256(email.toLowerCase() + courseId + floor(Date.now()/60000))`; check for existing record with that key; if duplicate return existing; otherwise `prisma.$transaction([createInquiry, enqueueJobs])`; DB write MUST succeed before BullMQ enqueue
- [ ] T049 [US2] Implement `POST /api/v1/inquiries` route in `backend/src/routes/v1/inquiries.ts`: apply `publicMutationLimiter`, `validate(inquirySchema)`, call `InquiryService.create()`; return 201 (new) or 200 (duplicate) per contract
- [ ] T050 [P] [US2] Create BullMQ booking notification job producer in `backend/src/queues/producers/booking.producer.ts`: `enqueueBookingNotification(inquiryId)` and `enqueueBookingConfirmation(inquiryId)` — enqueue to separate named queues with `jobId` = `booking-notif:{inquiryId}` and `booking-confirm:{inquiryId}` for idempotency
- [ ] T051 [P] [US2] Create BullMQ booking notification processor in `backend/src/queues/processors/booking-notification.processor.ts`: load inquiry + course from DB; check Redis idempotency key; send SendGrid email to MA Training team; update `notifEmailStatus` to `SENT`; on failure set `FAILED`
- [ ] T052 [P] [US2] Create BullMQ booking confirmation processor in `backend/src/queues/processors/booking-confirmation.processor.ts`: load inquiry from DB; check Redis idempotency key; send SendGrid confirmation email to visitor in their `locale`; update `confirmEmailStatus` to `SENT`
- [ ] T053 [P] [US2] Create bilingual email template functions in `backend/src/email/templates/booking-notification.ts` and `backend/src/email/templates/booking-confirmation.ts`: return `{ subject, html }` for `ar` and `en` locales; no inline RTL/LTR hardcoded — use locale param
- [ ] T054 [P] [US2] Create `BookingInquiryForm.vue` in `frontend/components/booking/BookingInquiryForm.vue`: all 6 fields (fullName, companyName, email, phone, attendeeCount, message); inline validation error display per field (not toast-only); locale-aware labels and error messages using i18n keys; RTL-safe form layout
- [ ] T055 [P] [US2] Create `useBookingInquiry` composable in `frontend/composables/useBookingInquiry.ts`: `submit(payload)` wrapper around `POST /api/v1/inquiries`; exposes `isSubmitting`, `isSuccess`, `error`; maps API `errors` array to field-level display
- [ ] T056 [US2] Integrate `BookingInquiryForm` into course detail page `frontend/pages/[locale]/courses/[slug].vue`: show form below course details; display `BookingConfirmation` component on success; preserve form data if network error occurs
- [ ] T057 [US2] Verify T045 and T046 tests now PASS; manually test full booking inquiry flow end-to-end: submit form → DB record created → both BullMQ jobs visible in Bull Board → email delivery logged

**Checkpoint**: Booking Inquiry (US2) fully functional. Visitors can submit inquiries; team receives notifications; visitors receive confirmations. Deduplication prevents duplicate emails.

---

## Phase 5: User Story 5 — Admin Content Management (Priority: P1)

**Goal**: The MA Training team can create, edit, archive, and restore all courses, workshops,
categories, and cities through the admin dashboard without developer involvement.

**Independent Test**: Log in to `http://localhost:3000/admin`, create a new bilingual course, verify it appears on the public courses listing page within 1 minute of saving — no code changes needed.

### Tests for User Story 5 (required by constitution)

> **Write tests FIRST; ensure they FAIL before implementing the services**

- [ ] T058 [P] [US5] Write Jest integration tests for admin course CRUD (auth guard on all routes, POST /admin/courses, PATCH /admin/courses/:id, PATCH /admin/courses/:id/status) in `backend/tests/integration/admin-courses.test.ts` — ensure they FAIL initially

### Implementation for User Story 5

- [ ] T059 [P] [US5] Implement `AuditService.log(adminId, action, entityType, entityId, diff)` in `backend/src/services/admin/audit.service.ts`: creates `AuditLog` record via Prisma; called inside service transactions
- [ ] T060 [P] [US5] Implement admin `CourseService` in `backend/src/services/admin/course.service.ts`: `list(status, cursor, take)`, `getById(id)`, `create(data)` (generates slug from titleEn), `update(id, data)`, `setStatus(id, status)` (guard: warn if ACTIVE inquiries exist on archive); each mutation calls `AuditService.log()`; mutations invalidate Redis course listing cache
- [ ] T061 [P] [US5] Implement admin course routes in `backend/src/routes/v1/admin/courses.ts`: `GET /admin/courses`, `POST /admin/courses`, `GET /admin/courses/:id`, `PATCH /admin/courses/:id`, `PATCH /admin/courses/:id/status`; all routes apply `authenticate` middleware; validate bodies with Zod schemas from `backend/src/schemas/admin/course.schema.ts`
- [ ] T062 [P] [US5] Implement admin `CategoryService` in `backend/src/services/admin/category.service.ts`: `list()`, `create(data)`, `update(id, data)` (guard: 409 if `isActive: false` and courses reference it); calls `AuditService.log()`
- [ ] T063 [P] [US5] Implement admin category routes in `backend/src/routes/v1/admin/categories.ts`: `GET`, `POST /admin/categories`, `PATCH /admin/categories/:id`; `authenticate` middleware; Zod validation
- [ ] T064 [P] [US5] Implement admin `CityService` in `backend/src/services/admin/city.service.ts`: `list()`, `create(data)`, `update(id, data)` (guard: 409 if `isActive: false` and courses reference it); calls `AuditService.log()`
- [ ] T065 [P] [US5] Implement admin city routes in `backend/src/routes/v1/admin/cities.ts`; apply same pattern as categories
- [ ] T066 [P] [US5] Implement admin `WorkshopService` in `backend/src/services/admin/workshop.service.ts`: mirrors `CourseService` using Workshop model and WorkshopSession; calls `AuditService.log()`
- [ ] T067 [P] [US5] Implement admin workshop routes in `backend/src/routes/v1/admin/workshops.ts`
- [ ] T068 [P] [US5] Implement file upload endpoint in `backend/src/routes/v1/admin/upload.ts`: `POST /admin/upload/image` — receive `multipart/form-data` via multer (memory storage), validate JPEG/PNG/WebP + max 5MB, convert to WebP via `sharp`, upload to R2, return `{ url }`; requires `authenticate` middleware
- [ ] T069 [P] [US5] Create `AdminDataTable.vue` in `frontend/components/admin/AdminDataTable.vue`: accepts `columns`, `rows`, `total`, `cursor` props; emits `page-change` and `sort-change`; server-side pagination (no client-side full-dataset filtering); keyboard-navigable rows; RTL-aware column alignment
- [ ] T070 [P] [US5] Create `AdminFormField.vue` in `frontend/components/admin/AdminFormField.vue`: renders AR and EN text inputs side-by-side for bilingual fields; accessible `<label>` for both; inline validation error display adjacent to failing field
- [ ] T071 [P] [US5] Create `AdminConfirmModal.vue` in `frontend/components/admin/AdminConfirmModal.vue`: wraps `AppModal`; renders action description, danger/confirm buttons; keyboard-accessible (Enter to confirm, Escape to cancel); focus-trapped while open
- [ ] T072 [P] [US5] Create `AdminStatusBadge.vue` in `frontend/components/admin/AdminStatusBadge.vue`: renders colored badge for entity status (ACTIVE/ARCHIVED/NEW/IN_PROGRESS/HANDLED/SENT/FAILED); locale-aware labels
- [ ] T073 [US5] Create admin dashboard overview page `frontend/pages/admin/index.vue`: counts for active courses, pending inquiries, new applications; links to each management section; uses server-side `useFetch` for stats
- [ ] T074 [US5] Create admin login page `frontend/pages/admin/login.vue` (no admin layout): email + password form; calls Pinia `auth.login()`; redirects to `/admin` on success; displays inline error on 401
- [ ] T075 [US5] Create admin courses list page `frontend/pages/admin/courses/index.vue`: `AdminDataTable` with status filter toggle; archive/restore action via `AdminConfirmModal`; "New Course" button; optimistic status update with rollback on API error
- [ ] T076 [US5] Create admin course create/edit form pages `frontend/pages/admin/courses/new.vue` and `frontend/pages/admin/courses/[id].vue`: bilingual fields via `AdminFormField`; category and city selects; sessions manager (add/remove date ranges); image upload via `POST /admin/upload/image`; Zod client-side validation mirrors server-side schema
- [ ] T077 [US5] Create admin categories and cities management pages `frontend/pages/admin/categories/index.vue` and `frontend/pages/admin/cities/index.vue`: inline-edit table rows; deactivation with `AdminConfirmModal`; displays 409 guard error inline
- [ ] T078 [US5] Create admin workshops list and create/edit pages in `frontend/pages/admin/workshops/` (mirrors courses pages, uses `durationHours` and `maxGroupSize` fields)
- [ ] T079 [US5] Verify T058 tests now PASS; manually test: create a course, verify it appears on public listing; archive a course, verify it disappears from public listing; verify audit log entry exists in DB

**Checkpoint**: Admin Content Management (US5) fully functional. The MA Training team can self-manage all course content without developer assistance.

---

## Phase 6: User Story 3 — Training Schedule Export by Email (Priority: P2)

**Goal**: Visitors on the Schedule page can request the full training schedule delivered as an
Excel file to their email inbox.

**Independent Test**: Submit the schedule export form with a name and email → receive confirmation message on screen → within 2 minutes receive an email with an attached `.xlsx` file containing course sessions.

### Tests for User Story 3 (required by constitution)

> **Write tests FIRST; ensure they FAIL before implementing**

- [ ] T080 [P] [US3] Write Jest unit tests for `ScheduleGenerator.generate()` (column headers in AR vs EN, RTL flag, empty data graceful handling) in `backend/tests/unit/schedule.generator.test.ts` — ensure they FAIL initially
- [ ] T081 [P] [US3] Write Jest integration tests for `GET /api/v1/schedule` and `POST /api/v1/schedule/export` (202 response, request record created, job enqueued) in `backend/tests/integration/schedule.test.ts` — ensure they FAIL initially

### Implementation for User Story 3

- [ ] T082 [P] [US3] Create Zod validation schema for schedule export request in `backend/src/schemas/schedule.schema.ts`: email (required, valid format), name (required, 2-100 chars), locale (optional, default `ar`)
- [ ] T083 [P] [US3] Implement `ScheduleGenerator.generate(locale)` in `backend/src/excel/schedule.generator.ts` using ExcelJS: fetch all upcoming CourseSession and WorkshopSession records; build worksheet with columns (title, category, city, startDate, endDate, duration); set `worksheet.views = [{ rightToLeft: true }]` for Arabic; format dates as `DD/MM/YYYY`; return `Buffer` — NOT a temp file
- [ ] T084 [P] [US3] Implement `ScheduleService` in `backend/src/services/schedule.service.ts`: `listUpcoming(dateFrom, dateTo, locale)` returns sessions for Schedule page display; `requestExport(email, name, locale)` creates `ScheduleExportRequest` record then enqueues job
- [ ] T085 [US3] Implement schedule routes in `backend/src/routes/v1/schedule.ts`: `GET /schedule` (query params: locale, dateFrom, dateTo); `POST /schedule/export` (validate body, call `ScheduleService.requestExport()`, return 202)
- [ ] T086 [P] [US3] Create schedule export job producer in `backend/src/queues/producers/schedule.producer.ts`: `enqueueScheduleExport(requestId)` — jobId = `schedule-export:{requestId}` for idempotency
- [ ] T087 [P] [US3] Create schedule export job processor in `backend/src/queues/processors/schedule-export.processor.ts`: load request from DB; check Redis idempotency key; call `ScheduleGenerator.generate(locale)` to get Buffer; if empty, send "no sessions" email; otherwise send email with Excel Buffer as attachment via SendGrid; update `jobStatus` to `SENT` or `FAILED`
- [ ] T088 [P] [US3] Create bilingual email template in `backend/src/email/templates/schedule-export.ts`: AR and EN variants for both the "schedule attached" email and the "no sessions found" email
- [ ] T089 [US3] Create Schedule SSR page `frontend/pages/[locale]/schedule.vue`: `useAsyncData` for upcoming sessions; displays sessions in a responsive table (course, city, dates); includes `ScheduleExportForm` component; RTL-aware table column order
- [ ] T090 [P] [US3] Create `ScheduleExportForm.vue` in `frontend/components/schedule/ScheduleExportForm.vue`: name and email inputs; inline validation; success confirmation replaces form on 202 response; accessible labels
- [ ] T091 [P] [US3] Create `useScheduleExport` composable in `frontend/composables/useScheduleExport.ts`: `requestExport(payload)` wraps `POST /api/v1/schedule/export`; exposes `isSubmitting`, `isSuccess`, `error`
- [ ] T092 [US3] Verify T080 and T081 tests now PASS; manually test full export flow: submit form → 202 response → Bull Board shows queued job → job processes → email received with `.xlsx` attachment containing correct bilingual headers

**Checkpoint**: Schedule Export (US3) fully functional. Visitors receive the training schedule Excel file in their inbox within 2 minutes of requesting.

---

## Phase 7: User Story 4 — Multilingual RTL/LTR Experience (Priority: P2)

**Goal**: All 9 public pages render correctly in Arabic (RTL) and English (LTR). The language
switcher is visible in the header on every page, and switching locale reflects immediately across
all content.

**Independent Test**: On any public page, click the language switcher — the page language and layout direction switches without a full page reload; the URL updates to reflect the new locale prefix; all text in the new language renders correctly.

### Implementation for User Story 4

- [ ] T093 [P] [US4] Complete all Arabic translation keys in `frontend/i18n/ar.json` for all public pages: navigation, courses listing, course detail, booking form and errors, schedule page, workshops, become-a-trainer form, about, contact form, newsletter widget, footer, common errors — zero inline strings in any `.vue` component
- [ ] T094 [P] [US4] Complete all English translation keys in `frontend/i18n/en.json` — mirrors the AR key structure; reviewed for natural English phrasing
- [ ] T095 [P] [US4] Implement `LanguageSwitcher.vue` in `frontend/components/common/LanguageSwitcher.vue`: button/toggle showing current locale flag/label; calls `useI18n().setLocale(code)`; preserves current route path in new locale; persists choice in cookie; accessible button with `aria-label` in both locales
- [ ] T096 [P] [US4] Audit and fix all Tailwind directional utilities across existing components (CourseCard, CourseFilters, BookingInquiryForm, ScheduleExportForm, AppHeader, AppFooter, AdminDataTable): replace any `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`, `float-left` with `rtl:`/`ltr:` Tailwind variants or logical properties (`ms-`, `me-`, `ps-`, `pe-`)
- [ ] T097 [P] [US4] Create Become a Trainer page `frontend/pages/[locale]/become-a-trainer.vue`: bilingual hero, trainer application form (fullName, email, phone, expertise, yearsExperience, bio, optional CV file upload); form submits to `POST /api/v1/trainer-applications`; implement `LeadService.createTrainerApplication()` in `backend/src/services/lead.service.ts` and route in `backend/src/routes/v1/leads.ts`
- [ ] T098 [P] [US4] Create Contact page `frontend/pages/[locale]/contact.vue`: bilingual contact form (senderName, email, subject, message); submits to `POST /api/v1/contact`; implement `LeadService.createContactMessage()` and route
- [ ] T099 [P] [US4] Create About page `frontend/pages/[locale]/about.vue` and Privacy Policy & Terms page `frontend/pages/[locale]/privacy.vue`: bilingual static content pages with locale-aware text rendering
- [ ] T100 [US4] Create Workshops listing page `frontend/pages/[locale]/workshops/index.vue`: SSR, `useAsyncData`, workshop cards grid; create Workshop detail page `frontend/pages/[locale]/workshops/[slug].vue`: full bilingual details + sessions; implement `GET /api/v1/workshops` and `GET /api/v1/workshops/:slug` routes and `WorkshopService` in `backend/src/services/workshop.service.ts`
- [ ] T101 [P] [US4] Implement newsletter subscription route `POST /api/v1/newsletter/subscribe` in `backend/src/routes/v1/leads.ts`; implement `LeadService.subscribeNewsletter()`; add newsletter widget component `frontend/components/common/NewsletterWidget.vue` embedded in AppFooter and home page
- [ ] T102 [US4] Add SEO metadata to all public pages: `useHead()` / `useSeoMeta()` with bilingual title, description, hreflang alternates (`/ar/`, `/en/`), Open Graph tags; add `robots.txt` (exclude `/admin/`, `/api/`) to `frontend/public/`

**Checkpoint**: Multilingual (US4) complete. All 9 public pages are bilingual, RTL-safe, and SEO-optimized. Language switcher works on every page.

---

## Phase 8: User Story 6 — Admin Lead Management (Priority: P2)

**Goal**: The MA Training team can view, filter, update, and export all incoming leads: booking
inquiries, trainer applications, contact messages, and newsletter subscribers.

**Independent Test**: Log in to admin, navigate to Inquiries → filter by status "NEW" → open any inquiry detail → see all submitted fields including email delivery status → change status to "IN_PROGRESS" → verify the updated status persists on page refresh.

### Implementation for User Story 6

- [ ] T103 [P] [US6] Implement admin `InquiryService` in `backend/src/services/admin/inquiry.service.ts`: `list(filters, cursor, take)` with status/course/date filters; `getById(id)` with full detail; `updateStatus(id, status, adminId)` → Prisma update + `AuditService.log()`
- [ ] T104 [P] [US6] Implement admin inquiry routes in `backend/src/routes/v1/admin/inquiries.ts`: `GET /admin/inquiries`, `GET /admin/inquiries/:id`, `PATCH /admin/inquiries/:id/status`; all with `authenticate` middleware
- [ ] T105 [P] [US6] Implement admin `ApplicationService` in `backend/src/services/admin/application.service.ts`: `list(status, cursor, take)`, `getById(id)` with `cvSignedUrl` generated via `R2.getSignedUrl(key, 3600)`, `updateStatus(id, status, adminId)` + audit
- [ ] T106 [P] [US6] Implement admin trainer application routes in `backend/src/routes/v1/admin/applications.ts`: `GET /admin/trainer-applications`, `GET /admin/trainer-applications/:id`, `PATCH /admin/trainer-applications/:id/status`
- [ ] T107 [P] [US6] Implement admin `ContactService` in `backend/src/services/admin/contact.service.ts`: `list(cursor, take)`, `getById(id)` (read-only); implement routes in `backend/src/routes/v1/admin/contacts.ts`
- [ ] T108 [P] [US6] Implement admin `SubscriberService` in `backend/src/services/admin/subscriber.service.ts`: `list(locale, cursor, take)`, `exportCsv()` → streams CSV via `fast-csv`, `deactivate(id)` + audit; implement routes in `backend/src/routes/v1/admin/subscribers.ts` including `GET /admin/subscribers/export` returning `text/csv`
- [ ] T109 [US6] Create admin inquiries list page `frontend/pages/admin/inquiries/index.vue`: `AdminDataTable` with status badge column; filter controls (status dropdown, date range); optimistic status update inline or via modal
- [ ] T110 [US6] Create admin inquiry detail page `frontend/pages/admin/inquiries/[id].vue`: all submitted fields; email delivery status (`notifEmailStatus`, `confirmEmailStatus`) displayed as `AdminStatusBadge`; status update dropdown with `AdminConfirmModal` for HANDLED
- [ ] T111 [P] [US6] Create admin trainer applications list page `frontend/pages/admin/trainer-applications/index.vue`: `AdminDataTable` with status filter; hasCv indicator; and detail page `frontend/pages/admin/trainer-applications/[id].vue` with bio, CV download link (signed URL), status update
- [ ] T112 [P] [US6] Create admin contact messages list page `frontend/pages/admin/contacts/index.vue`: `AdminDataTable` showing sender, subject, date preview; and detail page `frontend/pages/admin/contacts/[id].vue` with full message body
- [ ] T113 [P] [US6] Create admin newsletter subscribers list page `frontend/pages/admin/subscribers/index.vue`: `AdminDataTable` with locale filter; "Export CSV" button that calls `GET /admin/subscribers/export` and triggers browser download; deactivate subscriber with `AdminConfirmModal`

**Checkpoint**: Admin Lead Management (US6) fully functional. The MA Training team can process all incoming leads from the dashboard, update statuses, and export subscriber data.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Observability, performance budgets, accessibility enforcement, and deployment readiness.

- [ ] T114 [P] Configure Lighthouse CI budget file `.lighthouserc.json` with assertions: `first-contentful-paint ≤ 2500ms`, `largest-contentful-paint ≤ 2500ms`, `cumulative-layout-shift ≤ 0.1`, `seo ≥ 90`; update `.github/workflows/ci.yml` to run Lighthouse CI against Vercel preview URL on PRs
- [ ] T115 [P] Integrate `@axe-core/playwright` accessibility audit into CI: run against all 9 public page routes + admin login page on the preview deployment; fail CI on any critical or serious violation; update `.github/workflows/ci.yml`
- [ ] T116 [P] Configure `size-limit` in `frontend/package.json`: define main JS bundle threshold; add `size-limit` check to CI `bundle-size` job that fails if main bundle grows > 10% vs. base branch
- [ ] T117 [P] Mount Bull Board at `/admin/queues` in `backend/src/app.ts` (`@bull-board/express`) behind `authenticate` middleware; configure all 3 queues (BOOKING_NOTIFICATION, BOOKING_CONFIRMATION, SCHEDULE_EXPORT) as adapters
- [ ] T118 [P] Add sitemap.xml generation to Nuxt build: install `nuxt-simple-sitemap` or implement custom Nitro route at `/sitemap.xml`; include all public pages in both `/ar/` and `/en/` variants; exclude `/admin/*` and `/api/*`
- [ ] T119 [P] Configure Dependabot in `.github/dependabot.yml` for both npm workspaces (`frontend/` and `backend/`) and GitHub Actions; set weekly update schedule
- [ ] T120 [P] Write Vitest component tests for `BookingInquiryForm.vue` in `frontend/tests/components/BookingInquiryForm.test.ts`: verify inline validation errors appear adjacent to failing fields (not toast-only); verify form does not submit with missing required fields; verify locale-aware error messages
- [ ] T121 [P] Write Vitest composable tests for `useBookingInquiry` in `frontend/tests/composables/useBookingInquiry.test.ts`: mock `useFetch`; verify `isSuccess` becomes true on 201; verify field errors are mapped from API `errors` array
- [ ] T122 Add GitHub Actions deploy workflow `.github/workflows/deploy.yml`: on push to `main` — deploy frontend to Vercel, deploy backend to Railway, run `prisma migrate deploy` as a pre-traffic deployment step (BEFORE traffic switch, NOT in app startup)
- [ ] T123 Run `quickstart.md` validation end-to-end locally: complete setup from zero, seed DB, start both servers, create test course via admin, submit booking inquiry via public site, verify emails in BullMQ queue, verify schedule export generates valid Excel

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user story work
- **US1 Course Discovery (Phase 3)**: Depends on Phase 2 — no dependency on other user stories
- **US2 Booking Inquiry (Phase 4)**: Depends on Phase 2 + US1 (booking form lives on course detail page)
- **US5 Admin Content (Phase 5)**: Depends on Phase 2 only — can run in parallel with US1/US2
- **US3 Schedule Export (Phase 6)**: Depends on Phase 2 + US1 (schedule uses course session data)
- **US4 Multilingual (Phase 7)**: Depends on all prior phases (fills translation keys for all pages)
- **US6 Admin Leads (Phase 8)**: Depends on Phase 2 + US2 (inquiries exist after US2)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Phase 3)**: Can start immediately after Phase 2
- **US2 (Phase 4)**: Requires US1 complete (booking form on course detail page)
- **US5 (Phase 5)**: Can start in parallel with US1 after Phase 2 — no dependency on US1/US2
- **US3 (Phase 6)**: Can start after US1 (shares course/session data model)
- **US4 (Phase 7)**: Requires all pages to exist (fills in translation content)
- **US6 (Phase 8)**: Can start after US2 (needs inquiry data to exist)

### Parallel Opportunities by Phase

**Phase 2** (all run in parallel after T009/T010):
```
T012 (shared types) ║ T013 (Express app) ║ T014 (validate middleware)
T015 (error handler) ║ T016 (rate limiter) ║ T018 (BullMQ) ║ T019 (SendGrid)
T020 (R2 client) ║ T024 (@nuxtjs/i18n) ║ T025 (i18n files)
T026 (default layout) ║ T027 (admin layout) ║ T030 (common components)
```

**Phase 3 US1** (after T035 CourseService):
```
T033 (CategoryService + route) ║ T034 (CityService + route)
T038 (CourseCard) ║ T039 (CourseFilters) ║ T042 (useCourses composable)
```

**Phase 5 US5** (all admin services run in parallel):
```
T060 (CourseService) ║ T062 (CategoryService) ║ T064 (CityService)
T066 (WorkshopService) ║ T059 (AuditService) ║ T068 (file upload)
T069 (AdminDataTable) ║ T070 (AdminFormField) ║ T071 (AdminConfirmModal)
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: US1 — Course Discovery
4. Complete Phase 4: US2 — Booking Inquiry
5. **STOP and VALIDATE**: Public site works, courses browsable, inquiries submittable, emails delivered
6. Demo to MA Training team and gather feedback

### Incremental Delivery

| Milestone | Stories | What the MA Training team can do |
|-----------|---------|----------------------------------|
| M1 — Public MVP | US1 + US2 | Browse courses, submit booking inquiries |
| M2 — Admin Content | + US5 | Manage all course content independently |
| M3 — Schedule | + US3 | Generate and distribute schedule Excel |
| M4 — Full Site | + US4 | Full bilingual, all 9 pages live |
| M5 — Lead Ops | + US6 | Full lead management dashboard |

### Parallel Team Strategy

With 2 developers (after Phase 2 complete):
- **Dev A**: US1 (Course Discovery) → US2 (Booking) → US3 (Schedule)
- **Dev B**: US5 (Admin Content) → US6 (Admin Leads) → Polish

---

## Notes

- `[P]` = different files, no dependency on in-progress tasks — safe to parallelize
- `[Story]` label maps task to user story for independent delivery tracking
- All service-layer tests MUST be written before implementation (TDD per constitution Principle VII)
- Database mocking in integration tests is PROHIBITED — use `ma_training_test` database
- Commit after each logical task group or at checkpoint
- Verify tests FAIL before implementing; verify they PASS after implementing
- Each checkpoint validates the user story is independently functional before moving on
