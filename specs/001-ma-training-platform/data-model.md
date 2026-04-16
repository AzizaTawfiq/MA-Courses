# Data Model: MA Training Platform

**Phase 1 Output** | **Date**: 2026-04-12
**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Entity Overview

```
Category ──< Course >── CourseSession
                │
City ───────────┤
                │
Instructor ─────┘
                │
         BookingInquiry

Workshop >── WorkshopSession

TrainerApplication
ContactMessage
NewsletterSubscriber
ScheduleExportRequest
AdminUser
AuditLog
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Reference Data ───────────────────────────────────────────────────────────

model Category {
  id          String   @id @default(cuid())
  nameEn      String
  nameAr      String
  slug        String   @unique
  displayOrder Int     @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  courses     Course[]

  @@index([isActive])
  @@map("categories")
}

model City {
  id        String   @id @default(cuid())
  nameEn    String
  nameAr    String
  slug      String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courses     Course[]
  workshops   Workshop[]

  @@index([isActive])
  @@map("cities")
}

model Instructor {
  id        String   @id @default(cuid())
  nameEn    String
  nameAr    String
  bioEn     String?
  bioAr     String?
  photoUrl  String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courses   Course[]
  workshops Workshop[]

  @@map("instructors")
}

// ─── Course ───────────────────────────────────────────────────────────────────

model Course {
  id                String        @id @default(cuid())
  titleEn           String
  titleAr           String
  slug              String        @unique
  descriptionEn     String        @db.Text
  descriptionAr     String        @db.Text
  outcomesEn        String        @db.Text
  outcomesAr        String        @db.Text
  targetAudienceEn  String?
  targetAudienceAr  String?
  durationDays      Int
  priceRange        String?       // e.g. "Contact for pricing" or "3,500–5,000 SAR"
  coverImageUrl     String?

  categoryId        String
  category          Category      @relation(fields: [categoryId], references: [id])

  cityId            String
  city              City          @relation(fields: [cityId], references: [id])

  instructorId      String?
  instructor        Instructor?   @relation(fields: [instructorId], references: [id])

  status            CourseStatus  @default(ACTIVE)
  searchVectorEn    Unsupported("tsvector")? // GIN index for EN full-text search
  searchVectorAr    Unsupported("tsvector")? // GIN index for AR full-text search

  sessions          CourseSession[]
  inquiries         BookingInquiry[]

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  deletedAt         DateTime?     // soft-delete

  @@index([categoryId])
  @@index([cityId])
  @@index([status])
  @@index([deletedAt])
  @@map("courses")
}

enum CourseStatus {
  ACTIVE
  ARCHIVED
}

model CourseSession {
  id        String   @id @default(cuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  startDate DateTime @db.Date
  endDate   DateTime @db.Date
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
  @@index([startDate])
  @@map("course_sessions")
}

// ─── Workshop ─────────────────────────────────────────────────────────────────

model Workshop {
  id               String          @id @default(cuid())
  titleEn          String
  titleAr          String
  slug             String          @unique
  descriptionEn    String          @db.Text
  descriptionAr    String          @db.Text
  outcomesEn       String          @db.Text
  outcomesAr       String          @db.Text
  durationHours    Int
  maxGroupSize     Int?
  coverImageUrl    String?

  cityId           String
  city             City            @relation(fields: [cityId], references: [id])

  instructorId     String?
  instructor       Instructor?     @relation(fields: [instructorId], references: [id])

  status           WorkshopStatus  @default(ACTIVE)

  sessions         WorkshopSession[]

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  deletedAt        DateTime?

  @@index([cityId])
  @@index([status])
  @@map("workshops")
}

enum WorkshopStatus {
  ACTIVE
  ARCHIVED
}

model WorkshopSession {
  id         String   @id @default(cuid())
  workshopId String
  workshop   Workshop @relation(fields: [workshopId], references: [id], onDelete: Cascade)
  date       DateTime @db.Date
  timeStart  String?  // "09:00"
  timeEnd    String?  // "17:00"
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([workshopId])
  @@map("workshop_sessions")
}

// ─── Booking Inquiry ──────────────────────────────────────────────────────────

model BookingInquiry {
  id                String          @id @default(cuid())
  courseId          String
  course            Course          @relation(fields: [courseId], references: [id])

  submitterName     String
  companyName       String
  email             String
  phone             String
  attendeeCount     Int
  message           String?         @db.Text
  locale            String          @default("ar")  // "ar" | "en"

  status            InquiryStatus   @default(NEW)
  idempotencyKey    String          @unique // email + courseId + 60s window hash
  notifEmailStatus  EmailJobStatus  @default(PENDING)
  confirmEmailStatus EmailJobStatus @default(PENDING)

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([courseId])
  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@map("booking_inquiries")
}

enum InquiryStatus {
  NEW
  IN_PROGRESS
  HANDLED
}

enum EmailJobStatus {
  PENDING
  SENT
  FAILED
}

// ─── Schedule Export Request ───────────────────────────────────────────────────

model ScheduleExportRequest {
  id         String          @id @default(cuid())
  email      String
  name       String
  locale     String          @default("ar")
  jobStatus  EmailJobStatus  @default(PENDING)
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt

  @@index([email])
  @@index([createdAt])
  @@map("schedule_export_requests")
}

// ─── Leads ────────────────────────────────────────────────────────────────────

model TrainerApplication {
  id            String              @id @default(cuid())
  fullName      String
  email         String
  phone         String
  expertise     String
  yearsExperience Int
  bio           String?             @db.Text
  cvFileUrl     String?             // R2 signed URL path
  locale        String              @default("ar")
  status        ApplicationStatus   @default(NEW)
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  @@index([status])
  @@index([createdAt])
  @@map("trainer_applications")
}

enum ApplicationStatus {
  NEW
  REVIEWED
  SHORTLISTED
  REJECTED
}

model ContactMessage {
  id        String   @id @default(cuid())
  senderName String
  email     String
  subject   String
  message   String   @db.Text
  locale    String   @default("ar")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
  @@map("contact_messages")
}

model NewsletterSubscriber {
  id         String   @id @default(cuid())
  email      String   @unique
  name       String?
  locale     String   @default("ar")
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([isActive])
  @@map("newsletter_subscribers")
}

// ─── Admin ────────────────────────────────────────────────────────────────────

model AdminUser {
  id           String     @id @default(cuid())
  email        String     @unique
  passwordHash String
  displayName  String
  isActive     Boolean    @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  auditLogs    AuditLog[]

  @@map("admin_users")
}

model AuditLog {
  id          String   @id @default(cuid())
  adminId     String
  admin       AdminUser @relation(fields: [adminId], references: [id])
  action      String   // e.g. "CREATE_COURSE", "UPDATE_INQUIRY_STATUS"
  entityType  String   // e.g. "Course", "BookingInquiry"
  entityId    String
  diff        Json?    // JSON diff of before/after state
  timestamp   DateTime @default(now())

  @@index([adminId])
  @@index([entityType, entityId])
  @@index([timestamp])
  @@map("audit_logs")
}
```

---

## Validation Rules

### Course

| Field | Rule |
|-------|------|
| `titleEn` / `titleAr` | Required, min 5 chars, max 200 chars |
| `slug` | Unique, URL-safe, auto-generated from `titleEn` if not provided |
| `descriptionEn` / `descriptionAr` | Required, min 50 chars |
| `durationDays` | Required, integer ≥ 1, ≤ 365 |
| `categoryId` / `cityId` | Required, must reference active record |
| `coverImageUrl` | Optional, must be a valid R2 URL if provided |

### BookingInquiry

| Field | Rule |
|-------|------|
| `email` | Required, valid email format |
| `phone` | Required, min 9 digits, accepts international format |
| `attendeeCount` | Required, integer ≥ 1, ≤ 1,000 |
| `courseId` | Required, must reference an active (non-archived) course |
| `idempotencyKey` | Server-generated: `sha256(email + courseId + floor(unixtime/60))` |

### TrainerApplication

| Field | Rule |
|-------|------|
| `email` | Required, valid email |
| `yearsExperience` | Required, integer ≥ 0, ≤ 50 |
| `cvFileUrl` | Optional; if uploaded, must be PDF, max 5MB |

### NewsletterSubscriber

| Field | Rule |
|-------|------|
| `email` | Required, unique, valid email |
| `locale` | Must be `"ar"` or `"en"` |

---

## State Transitions

### BookingInquiry.status

```
NEW → IN_PROGRESS → HANDLED
NEW → HANDLED (direct)
```
Admin can move any inquiry backward for correction (no terminal state).

### Course.status / Workshop.status

```
ACTIVE ←→ ARCHIVED
```
Restore (ARCHIVED → ACTIVE) allowed; physical deletion blocked if inquiries exist.

### TrainerApplication.status

```
NEW → REVIEWED → SHORTLISTED
NEW → REVIEWED → REJECTED
SHORTLISTED → REJECTED
```

---

## Database Indexes Summary

| Index | Purpose |
|-------|---------|
| `courses(categoryId)` | Filter courses by category |
| `courses(cityId)` | Filter courses by city |
| `courses(status)` | Exclude archived courses from public listing |
| `courses(deletedAt)` | Soft-delete filter |
| `course_sessions(startDate)` | Date range filtering |
| `booking_inquiries(email, courseId)` | Idempotency lookup |
| `booking_inquiries(status)` | Admin lead management filters |
| `audit_logs(entityType, entityId)` | Per-entity audit history |
| GIN on `courses.searchVectorEn` | Full-text search EN |
| GIN on `courses.searchVectorAr` | Full-text search AR |
