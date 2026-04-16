# API Contract: Admin Lead Management

**Base URL**: `/api/v1/admin`
**Auth**: `Authorization: Bearer <accessToken>` (required on all endpoints)

---

## Booking Inquiries

### GET /inquiries

List all booking inquiries with filtering and pagination.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `NEW \| IN_PROGRESS \| HANDLED` | Filter by status |
| `courseId` | string | Filter by specific course |
| `dateFrom` | `YYYY-MM-DD` | Submitted on or after |
| `dateTo` | `YYYY-MM-DD` | Submitted on or before |
| `cursor` | string | Pagination cursor |
| `take` | integer | Page size. Default: 20, Max: 100 |

**Response 200**:
```json
{
  "data": [
    {
      "id": "clinq...",
      "submitterName": "سارة المحمد",
      "companyName": "شركة النور",
      "email": "sara@alnour.com",
      "phone": "+966501234567",
      "attendeeCount": 5,
      "course": { "id": "clxyz...", "titleAr": "إدارة المشاريع", "titleEn": "Project Management" },
      "status": "NEW",
      "notifEmailStatus": "SENT",
      "confirmEmailStatus": "SENT",
      "createdAt": "2026-04-12T10:00:00Z"
    }
  ],
  "pagination": { "nextCursor": "clnext...", "hasMore": true, "total": 142 }
}
```

---

### GET /inquiries/:id

Get full inquiry detail including message text.

**Response 200**: Full inquiry object including `message` field.

---

### PATCH /inquiries/:id/status

Update inquiry status.

**Request Body**:
```json
{ "status": "IN_PROGRESS" }
```

**Response 200**: `{ "id": "...", "status": "IN_PROGRESS", "updatedAt": "..." }`

**Audit log entry**: `{ action: "UPDATE_INQUIRY_STATUS", entityType: "BookingInquiry", entityId, diff: { status: { from: "NEW", to: "IN_PROGRESS" } } }`

---

## Trainer Applications

### GET /trainer-applications

List all trainer applications.

**Query Parameters**: `status` (`NEW` | `REVIEWED` | `SHORTLISTED` | `REJECTED`), `cursor`, `take`

**Response 200**:
```json
{
  "data": [
    {
      "id": "clapp...",
      "fullName": "أحمد الشمري",
      "email": "ahmed@email.com",
      "phone": "+966551234567",
      "expertise": "إدارة المشاريع وPMP",
      "yearsExperience": 12,
      "status": "NEW",
      "hasCv": true,
      "createdAt": "2026-04-10T08:00:00Z"
    }
  ],
  "pagination": { "nextCursor": null, "hasMore": false, "total": 7 }
}
```

### GET /trainer-applications/:id

Get full application including bio and CV signed URL.

**Response 200**:
```json
{
  "data": {
    "id": "clapp...",
    "fullName": "أحمد الشمري",
    "email": "ahmed@email.com",
    "phone": "+966551234567",
    "expertise": "إدارة المشاريع وPMP",
    "yearsExperience": 12,
    "bio": "خبرة 12 عامًا في ...",
    "cvSignedUrl": "https://r2.matraining.com/trainer-applications/uuid.pdf?token=...",
    "status": "NEW",
    "createdAt": "2026-04-10T08:00:00Z"
  }
}
```

### PATCH /trainer-applications/:id/status

```json
{ "status": "SHORTLISTED" }
```

**Response 200**: Updated application status.

---

## Contact Messages

### GET /contacts

List all contact messages (read-only).

**Query Parameters**: `cursor`, `take`

**Response 200**:
```json
{
  "data": [
    {
      "id": "clmsg...",
      "senderName": "خالد الدوسري",
      "email": "khaled@company.com",
      "subject": "استفسار عن برامج التدريب",
      "messagePreview": "أرغب في معرفة المزيد عن ...",
      "createdAt": "2026-04-11T14:00:00Z"
    }
  ],
  "pagination": { "nextCursor": null, "hasMore": false, "total": 23 }
}
```

### GET /contacts/:id

Get full message body.

---

## Newsletter Subscribers

### GET /subscribers

List all active subscribers.

**Query Parameters**: `locale` (`ar` | `en`), `cursor`, `take`

**Response 200**:
```json
{
  "data": [
    {
      "id": "clsub...",
      "email": "user@company.com",
      "name": "منى الحربي",
      "locale": "ar",
      "isActive": true,
      "createdAt": "2026-03-15T09:00:00Z"
    }
  ],
  "pagination": { "nextCursor": "...", "hasMore": true, "total": 312 }
}
```

### GET /subscribers/export

Export subscriber list as CSV.

**Response 200**: `Content-Type: text/csv; charset=utf-8`

```csv
email,name,locale,subscribedAt
user@company.com,منى الحربي,ar,2026-03-15T09:00:00Z
```

### PATCH /subscribers/:id

Deactivate a subscriber (soft-delete).

```json
{ "isActive": false }
```

**Response 200**: `{ "id": "...", "isActive": false }`
