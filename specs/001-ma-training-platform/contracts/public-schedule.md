# API Contract: Public Schedule & Workshops

**Base URL**: `/api/v1`
**Auth**: None (public endpoints)

---

## GET /schedule

Returns upcoming course and workshop sessions for display on the Schedule page.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `"ar" \| "en"` | Response language. Default: `ar` |
| `dateFrom` | `YYYY-MM-DD` | Start of date range. Default: today |
| `dateTo` | `YYYY-MM-DD` | End of date range. Default: 6 months from today |

### Response 200

```json
{
  "data": {
    "courses": [
      {
        "courseId": "clxyz...",
        "title": "إدارة المشاريع الاحترافية",
        "slug": "project-management",
        "category": "إدارة المشاريع",
        "city": "الرياض",
        "startDate": "2026-05-10",
        "endDate": "2026-05-12",
        "durationDays": 3
      }
    ],
    "workshops": [
      {
        "workshopId": "clwrk...",
        "title": "ورشة القيادة الفعّالة",
        "slug": "effective-leadership-workshop",
        "city": "جدة",
        "date": "2026-05-20",
        "durationHours": 8
      }
    ]
  }
}
```

---

## POST /schedule/export

Request the full training schedule as an Excel file delivered to the user's email inbox.

### Request Body

```json
{
  "email": "hr@company.com",
  "name": "نورة العبدالله",
  "locale": "ar"
}
```

### Request Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email format |
| `name` | string | Yes | 2–100 chars |
| `locale` | `"ar" \| "en"` | No | Default: `ar` |

### Response 202 — Accepted

```json
{
  "status": 202,
  "message": "سيتم إرسال جدول التدريب إلى بريدك الإلكتروني خلال دقيقتين.",
  "data": {
    "requestId": "clreq..."
  }
}
```

### Response 400 — Validation Error

```json
{
  "status": 400,
  "message": "يرجى مراجعة البيانات المدخلة",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "البريد الإلكتروني غير صالح" }
  ]
}
```

---

## GET /workshops

Returns a paginated list of active workshops.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `locale` | `"ar" \| "en"` | Response language. Default: `ar` |
| `city` | string | City slug filter |
| `cursor` | string | Pagination cursor |
| `take` | integer | Page size. Default: 12, Max: 48 |

### Response 200

```json
{
  "data": [
    {
      "id": "clwrk...",
      "title": "ورشة القيادة الفعّالة",
      "slug": "effective-leadership-workshop",
      "description": "وصف مختصر ...",
      "durationHours": 8,
      "maxGroupSize": 20,
      "coverImageUrl": "https://r2.matraining.com/workshops/xyz.webp",
      "city": { "name": "جدة", "slug": "jeddah" },
      "nextSessionDate": "2026-05-20"
    }
  ],
  "pagination": {
    "nextCursor": "clnext...",
    "hasMore": false,
    "total": 8
  }
}
```

---

## GET /workshops/:slug

Returns the full detail of a single active workshop.

### Response 200

```json
{
  "data": {
    "id": "clwrk...",
    "title": "ورشة القيادة الفعّالة",
    "slug": "effective-leadership-workshop",
    "description": "وصف تفصيلي ...",
    "outcomes": "سيتعلم المشاركون ...",
    "durationHours": 8,
    "maxGroupSize": 20,
    "coverImageUrl": "https://r2.matraining.com/workshops/xyz.webp",
    "city": { "name": "جدة", "slug": "jeddah" },
    "instructor": { "name": "م. فاطمة الزهراني", "bio": "..." },
    "sessions": [
      { "id": "clwses...", "date": "2026-05-20", "timeStart": "09:00", "timeEnd": "17:00" }
    ]
  }
}
```
