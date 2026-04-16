# API Contract: Public Courses

**Base URL**: `/api/v1`
**Auth**: None (public endpoints)
**Content-Type**: `application/json`

---

## GET /courses

Returns a paginated list of active courses with optional filters.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | `"ar" \| "en"` | No | Response language. Default: `ar` |
| `category` | string | No | Category slug to filter by |
| `city` | string | No | City slug to filter by |
| `dateFrom` | `YYYY-MM-DD` | No | Filter sessions starting on or after this date |
| `dateTo` | `YYYY-MM-DD` | No | Filter sessions starting on or before this date |
| `q` | string | No | Full-text keyword search |
| `cursor` | string | No | Pagination cursor (opaque string from prior response) |
| `take` | integer | No | Page size. Default: 12, Max: 48 |

### Response 200

```json
{
  "data": [
    {
      "id": "clxyz...",
      "title": "إدارة المشاريع الاحترافية",
      "slug": "project-management",
      "description": "وصف مختصر ...",
      "category": {
        "id": "clcat...",
        "name": "إدارة المشاريع",
        "slug": "project-management"
      },
      "city": {
        "id": "clcit...",
        "name": "الرياض",
        "slug": "riyadh"
      },
      "instructor": {
        "id": "clinst...",
        "name": "م. أحمد الصالح"
      },
      "coverImageUrl": "https://r2.matraining.com/courses/xyz.webp",
      "nextSessionDate": "2026-05-10",
      "durationDays": 3
    }
  ],
  "pagination": {
    "nextCursor": "clnext...",
    "hasMore": true,
    "total": 87
  }
}
```

### Response 400 — Invalid filter

```json
{
  "status": 400,
  "message": "Invalid query parameters",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "dateFrom", "message": "Must be a valid date in YYYY-MM-DD format" }
  ]
}
```

---

## GET /courses/:slug

Returns the full detail of a single active course.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Course slug |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `"ar" \| "en"` | Response language. Default: `ar` |

### Response 200

```json
{
  "data": {
    "id": "clxyz...",
    "title": "إدارة المشاريع الاحترافية",
    "slug": "project-management",
    "description": "وصف تفصيلي ...",
    "outcomes": "سيتمكن المشاركون من ...",
    "targetAudience": "مديرو المشاريع ...",
    "durationDays": 3,
    "priceRange": "تواصل معنا للتسعير",
    "coverImageUrl": "https://r2.matraining.com/courses/xyz.webp",
    "category": { "id": "clcat...", "name": "إدارة المشاريع", "slug": "project-management" },
    "city": { "id": "clcit...", "name": "الرياض", "slug": "riyadh" },
    "instructor": {
      "id": "clinst...",
      "name": "م. أحمد الصالح",
      "bio": "خبرة 15 عامًا في ...",
      "photoUrl": "https://r2.matraining.com/instructors/ahmed.webp"
    },
    "sessions": [
      { "id": "clses...", "startDate": "2026-05-10", "endDate": "2026-05-12" }
    ]
  }
}
```

### Response 404

```json
{
  "status": 404,
  "message": "Course not found",
  "code": "COURSE_NOT_FOUND"
}
```

---

## GET /categories

Returns all active categories.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `"ar" \| "en"` | Response language. Default: `ar` |

### Response 200

```json
{
  "data": [
    { "id": "clcat...", "name": "إدارة المشاريع", "slug": "project-management", "displayOrder": 1 }
  ]
}
```

---

## GET /cities

Returns all active cities.

### Response 200

```json
{
  "data": [
    { "id": "clcit...", "nameAr": "الرياض", "nameEn": "Riyadh", "slug": "riyadh" }
  ]
}
```
