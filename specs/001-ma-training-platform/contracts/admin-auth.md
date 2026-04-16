# API Contract: Admin Authentication

**Base URL**: `/api/v1/admin/auth`
**Auth**: See individual endpoints

---

## POST /login

Authenticate an admin user. Returns short-lived access token + sets httpOnly refresh token cookie.

### Request Body

```json
{
  "email": "admin@matraining.com",
  "password": "••••••••"
}
```

### Response 200

```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "admin": {
      "id": "cladmin...",
      "email": "admin@matraining.com",
      "displayName": "Aziza"
    }
  }
}
```

**Set-Cookie header**:
```
refresh_token=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/admin/auth/refresh; Max-Age=604800
```

### Response 401

```json
{
  "status": 401,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

---

## POST /refresh

Exchange a valid refresh token cookie for a new access token + rotated refresh token.

### Auth: `Cookie: refresh_token=<token>`

### Response 200

```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Set-Cookie header**: New rotated refresh token (old one is invalidated in Redis).

### Response 401 — Token Invalid or Rotated

```json
{
  "status": 401,
  "message": "Session expired. Please log in again.",
  "code": "REFRESH_TOKEN_INVALID"
}
```

---

## POST /logout

Invalidate the refresh token. Access token expires naturally (15 min TTL).

### Auth: `Authorization: Bearer <accessToken>`

### Response 204

No body. Clears refresh token cookie and deletes from Redis.

---

## Authentication Flow for All Other Admin Endpoints

All admin endpoints (except `/login`) require:

```
Authorization: Bearer <accessToken>
```

On 401 response: the frontend Pinia auth store automatically attempts `/refresh`.
If refresh also fails: redirect to `/admin/login`.

**Nuxt server middleware** additionally validates the JWT on SSR render of all `/admin/*`
pages — a client-side expired token cannot render the page server-side.
