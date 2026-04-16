# API Contract: Admin Content Management

**Base URL**: `/api/v1/admin`
**Auth**: `Authorization: Bearer <accessToken>` (required on all endpoints)
**Rate limit**: Standard (no special limits for authenticated admin)

---

## Courses

### GET /courses

List all courses (including archived) with pagination.

**Query Parameters**: `status` (`ACTIVE` | `ARCHIVED` | all), `cursor`, `take` (default 20)

**Response 200**:
```json
{
  "data": [
    {
      "id": "clxyz...",
      "titleEn": "Professional Project Management",
      "titleAr": "إدارة المشاريع الاحترافية",
      "slug": "project-management",
      "status": "ACTIVE",
      "category": { "nameAr": "إدارة المشاريع", "nameEn": "Project Management" },
      "city": { "nameAr": "الرياض", "nameEn": "Riyadh" },
      "createdAt": "2026-04-12T10:00:00Z",
      "updatedAt": "2026-04-12T10:00:00Z"
    }
  ],
  "pagination": { "nextCursor": "clnext...", "hasMore": true, "total": 47 }
}
```

---

### POST /courses

Create a new course.

**Request Body**:
```json
{
  "titleEn": "Professional Project Management",
  "titleAr": "إدارة المشاريع الاحترافية",
  "descriptionEn": "Full description in English...",
  "descriptionAr": "الوصف الكامل بالعربية...",
  "outcomesEn": "Participants will be able to...",
  "outcomesAr": "سيتمكن المشاركون من...",
  "targetAudienceEn": "Project managers and team leads",
  "targetAudienceAr": "مديرو المشاريع وقادة الفرق",
  "durationDays": 3,
  "priceRange": "Contact for pricing",
  "categoryId": "clcat...",
  "cityId": "clcit...",
  "instructorId": "clinst...",
  "coverImageUrl": "https://r2.matraining.com/courses/pm.webp",
  "sessions": [
    { "startDate": "2026-05-10", "endDate": "2026-05-12" }
  ]
}
```

**Response 201**: Full course object with generated `id` and `slug`.

---

### GET /courses/:id

Get full course detail (bilingual fields, sessions).

**Response 200**: Full course object.

---

### PATCH /courses/:id

Update course fields. Only provided fields are updated (partial update).

**Response 200**: Updated course object.

**Audit log entry**: `{ action: "UPDATE_COURSE", entityType: "Course", entityId, diff }`

---

### PATCH /courses/:id/status

Archive or restore a course.

**Request Body**:
```json
{ "status": "ARCHIVED" }
```

**Response 200**: `{ "id": "...", "status": "ARCHIVED" }`

**Guard**: Cannot archive a course with `status: ACTIVE` if inquiries reference it (warn only,
does not block — inquiries are historical records). Physical deletion is blocked.

---

### DELETE /courses/:id/sessions/:sessionId

Remove a specific course session.

**Response 204**: No body.

---

## Categories

### GET /admin/categories

List all categories (active and inactive).

### POST /admin/categories

```json
{ "nameEn": "Project Management", "nameAr": "إدارة المشاريع", "displayOrder": 1 }
```

### PATCH /admin/categories/:id

Update name, displayOrder, or `isActive` flag.

**Guard**: Cannot set `isActive: false` if courses reference this category.
Returns `409` with `code: "CATEGORY_HAS_ACTIVE_COURSES"`.

---

## Cities

### GET /admin/cities

List all cities.

### POST /admin/cities

```json
{ "nameEn": "Riyadh", "nameAr": "الرياض" }
```

### PATCH /admin/cities/:id

Update name or `isActive` flag.

**Guard**: Cannot deactivate if active courses reference this city.
Returns `409` with `code: "CITY_HAS_ACTIVE_COURSES"`.

---

## Workshops

Mirrors the Courses endpoints above under `/admin/workshops`. Request/response shapes are
identical except `durationHours` and `maxGroupSize` replace `durationDays`.

---

## File Upload

### POST /admin/upload/image

Upload a course or workshop cover image.

**Request**: `multipart/form-data` with field `file` (JPEG/PNG/WebP, max 5MB)

**Response 201**:
```json
{
  "url": "https://r2.matraining.com/courses/uuid-filename.webp"
}
```

The backend converts the uploaded image to WebP before storing in R2.
