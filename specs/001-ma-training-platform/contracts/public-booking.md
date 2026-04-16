# API Contract: Public Booking Inquiry

**Base URL**: `/api/v1`
**Auth**: None (public endpoint)
**Rate limit**: 5 requests per IP per 10 minutes

---

## POST /inquiries

Submit a booking inquiry for a course. The request is persisted to the database and two
independent email jobs are enqueued: one notifying the MA Training team, one confirming
receipt to the submitter.

### Request Body

```json
{
  "courseId": "clxyz...",
  "submitterName": "سارة المحمد",
  "companyName": "شركة النور للاستشارات",
  "email": "sara@alnour.com",
  "phone": "+966501234567",
  "attendeeCount": 5,
  "message": "نرغب في حضور الدورة في شهر مايو.",
  "locale": "ar"
}
```

### Request Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `courseId` | string | Yes | Must reference an active course |
| `submitterName` | string | Yes | 2–100 chars |
| `companyName` | string | Yes | 2–150 chars |
| `email` | string | Yes | Valid email format |
| `phone` | string | Yes | 9–20 chars, digits/spaces/+/- allowed |
| `attendeeCount` | integer | Yes | ≥ 1, ≤ 1000 |
| `message` | string | No | Max 1000 chars |
| `locale` | `"ar" \| "en"` | No | Default: `ar` |

### Response 201 — Created

```json
{
  "status": 201,
  "message": "تم استلام استفسارك بنجاح. سنتواصل معك قريبًا.",
  "data": {
    "inquiryId": "clinq..."
  }
}
```

### Response 200 — Duplicate (deduplicated within 60s window)

```json
{
  "status": 200,
  "message": "تم استلام استفسارك بنجاح. سنتواصل معك قريبًا.",
  "data": {
    "inquiryId": "clinq..."
  }
}
```

*Note: The client receives the same success UX. Only one record and one email set is created.*

### Response 400 — Validation Error

```json
{
  "status": 400,
  "message": "يرجى مراجعة البيانات المدخلة",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "البريد الإلكتروني غير صالح" },
    { "field": "attendeeCount", "message": "يجب أن يكون عدد المشاركين 1 على الأقل" }
  ]
}
```

### Response 404 — Course Not Found or Archived

```json
{
  "status": 404,
  "message": "الدورة غير متاحة حاليًا",
  "code": "COURSE_NOT_FOUND"
}
```

### Response 429 — Rate Limit Exceeded

```json
{
  "status": 429,
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Idempotency Implementation

The server computes:
```
idempotencyKey = sha256(email.toLowerCase() + courseId + floor(Date.now() / 60000))
```

On duplicate detection: the existing inquiry record is returned; no new DB write or email jobs
are created.
