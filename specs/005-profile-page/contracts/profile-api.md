# API Contract: Profile Endpoints

**Feature**: 005-profile-page | **Date**: 2026-04-05
**Base URL**: `/api/v1`

## Endpoints

### GET /users/me

Returns the current user's full profile.

**Auth**: Bearer token required

**Response 200**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "john_doe",
  "displayName": "John Doe",
  "telegramChatId": "123456789"
}
```

**Fields**:
| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | string (UUID) | No | |
| email | string | No | |
| username | string | No | |
| displayName | string | Yes | null if not set |
| telegramChatId | string | Yes | null if not linked, numeric string |

**Error responses**:
- 401 Unauthorized — invalid/expired token (handled by interceptor)

---

### PATCH /users/me

Updates the current user's profile fields.

**Auth**: Bearer token required

**Request body**:
```json
{
  "username": "new_username"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| username | string | No | `^[a-z0-9_-]+$`, 3-32 chars |

**Response 200**: Returns the updated `UserProfile` (same shape as GET /users/me).

**Error responses**:
- 400 Bad Request — validation failure (invalid username format/length)
- 409 Conflict — username already taken

**409 response body**:
```json
{
  "field": "username",
  "message": "Username is already taken"
}
```

---

### PUT /users/me/telegram

Links or updates the user's Telegram chat ID.

**Auth**: Bearer token required

**Request body**:
```json
{
  "telegramChatId": "123456789"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| telegramChatId | string | Yes | Numeric string (`/^\d+$/`) |

**Response 200**: Returns the updated `UserProfile` (same shape as GET /users/me).

**Error responses**:
- 400 Bad Request — invalid telegramChatId format

---

### DELETE /users/me

Permanently deletes the current user's account and all associated data.

**Auth**: Bearer token required

**Request body**: None

**Response 204**: No content — account deleted successfully.

**Error responses**:
- 401 Unauthorized — invalid/expired token
- 500 Internal Server Error — deletion failed

**Frontend behavior on success**:
1. `authStore.clearAuth()`
2. `queryClient.clear()`
3. `navigate('/login')`

## API Function Mapping

| Function | Method | Endpoint | Request Type | Response Type |
|----------|--------|----------|--------------|---------------|
| `getCurrentUser` | GET | /users/me | — | `UserProfile` |
| `updateUser` | PATCH | /users/me | `UpdateUserRequest` | `UserProfile` |
| `updateTelegram` | PUT | /users/me/telegram | `UpdateTelegramRequest` | `UserProfile` |
| `deleteAccount` | DELETE | /users/me | — | `void` |

## React Query Hook Mapping

| Hook | Query Key | API Function | Notes |
|------|-----------|--------------|-------|
| `useCurrentUser` | `['users', 'me']` | `getCurrentUser` | staleTime: 5min |
| `useUpdateUsername` | — (mutation) | `updateUser` | Invalidates `['users', 'me']`, syncs authStore |
| `useUpdateTelegram` | — (mutation) | `updateTelegram` | Invalidates `['users', 'me']` |
| `useDeleteAccount` | — (mutation) | `deleteAccount` | Clears all state, redirects |
