# API Contract: Public Lead Forms

**Base URL**: `/api/v1`
**Auth**: None (public endpoints)
**Rate limit**: 3 requests per IP per 10 minutes (all mutation endpoints below)

---

## POST /trainer-applications

Submit a trainer application.

### Request Body (multipart/form-data)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | string | Yes | 2–100 chars |
| `email` | string | Yes | Valid email |
| `phone` | string | Yes | 9–20 chars |
| `expertise` | string | Yes | 5–200 chars |
| `yearsExperience` | integer | Yes | 0–50 |
| `bio` | string | No | Max 2000 chars |
| `cvFile` | file | No | PDF only, max 5MB |
| `locale` | `"ar" \| "en"` | No | Default: `ar` |

### Response 201

```json
{
  "status": 201,
  "message": "تم استلام طلبك بنجاح. سنتواصل معك قريبًا.",
  "data": { "applicationId": "clapp..." }
}
```

### Response 400

```json
{
  "status": 400,
  "message": "يرجى مراجعة البيانات المدخلة",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "cvFile", "message": "يُقبل ملف PDF فقط بحجم أقصاه 5 ميجابايت" }
  ]
}
```

---

## POST /contact

Submit a contact message.

### Request Body

```json
{
  "senderName": "خالد الدوسري",
  "email": "khaled@company.com",
  "subject": "استفسار عن برامج التدريب",
  "message": "أرغب في معرفة المزيد عن ...",
  "locale": "ar"
}
```

### Request Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `senderName` | string | Yes | 2–100 chars |
| `email` | string | Yes | Valid email |
| `subject` | string | Yes | 5–200 chars |
| `message` | string | Yes | 10–2000 chars |
| `locale` | `"ar" \| "en"` | No | Default: `ar` |

### Response 201

```json
{
  "status": 201,
  "message": "تم استلام رسالتك. سنرد عليك قريبًا.",
  "data": { "messageId": "clmsg..." }
}
```

---

## POST /newsletter/subscribe

Subscribe to the newsletter.

### Request Body

```json
{
  "email": "user@company.com",
  "name": "منى الحربي",
  "locale": "ar"
}
```

### Request Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email, unique |
| `name` | string | No | Max 100 chars |
| `locale` | `"ar" \| "en"` | No | Default: `ar` |

### Response 201

```json
{
  "status": 201,
  "message": "تم اشتراكك بنجاح في النشرة الإخبارية.",
  "data": { "subscriberId": "clsub..." }
}
```

### Response 409 — Already Subscribed

```json
{
  "status": 409,
  "message": "هذا البريد الإلكتروني مشترك بالفعل.",
  "code": "ALREADY_SUBSCRIBED"
}
```
