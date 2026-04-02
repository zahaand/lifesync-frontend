# Auth API Contract

**Branch**: `001-auth-routing-layout` | **Date**: 2026-04-02

This contract defines the expected backend API endpoints consumed by the frontend auth module. The frontend will code against these contracts; the backend must implement them.

## Base URL

Configured via environment variable `VITE_API_BASE_URL` (e.g., `http://localhost:8080/api`).

## Endpoints

### POST /auth/register

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass"
}
```

**Responses**:

| Status | Body    | Description                                  |
|--------|---------|----------------------------------------------|
| 201    | Empty or `{ "message": "..." }` | Account created successfully |
| 409    | `{ "field": "email", "message": "Email already in use" }` | Conflict — duplicate email or username |
| 422    | `{ "errors": [{ "field": "...", "message": "..." }] }` | Validation errors |

### POST /auth/login

Authenticate an existing user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepass"
}
```

**Responses**:

| Status | Body | Description |
|--------|------|-------------|
| 200    | `{ "accessToken": "...", "refreshToken": "...", "user": { "id": "...", "email": "...", "username": "...", "displayName": "..." } }` | Login successful |
| 401    | `{ "message": "Invalid credentials" }` | Wrong email or password (intentionally vague) |
| 403    | `{ "message": "Your account has been suspended. Please contact support." }` | User account is banned/suspended |

### POST /auth/refresh

Obtain a new token pair using a valid refresh token.

**Request**:
```json
{
  "refreshToken": "..."
}
```

**Responses**:

| Status | Body | Description |
|--------|------|-------------|
| 200    | `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }` | New token pair issued |
| 401    | `{ "message": "..." }` | Refresh token expired or invalid |

### POST /auth/logout

Invalidate the current session server-side.

**Headers**: `Authorization: Bearer {accessToken}`

**Request**:
```json
{
  "refreshToken": "..."
}
```

**Responses**:

| Status | Body  | Description           |
|--------|-------|-----------------------|
| 204    | Empty | Session invalidated   |

## Error Response Format

All error responses follow a consistent shape:

```typescript
// Single-field error (409)
type ConflictError = {
  field: string
  message: string
}

// Validation errors (422)
type ValidationError = {
  errors: Array<{
    field: string
    message: string
  }>
}

// Generic error (401, 403, 500)
type GenericError = {
  message: string
}
```

## Notes

- All endpoints accept and return `application/json`
- The `accessToken` is a short-lived JWT (expected lifetime: 15–30 minutes)
- The `refreshToken` is long-lived (expected lifetime: 7–30 days)
- The 401 login response intentionally does not reveal whether email or password was incorrect (anti-enumeration)
- The 409 conflict response includes the `field` key so the frontend can show the error under the correct form field
