# Data Model: Auth Pages, Routing & App Layout

**Branch**: `001-auth-routing-layout` | **Date**: 2026-04-02

## Entities

### User

Represents the authenticated user's profile as returned by the backend.

| Field       | Type   | Constraints                        | Notes                          |
|-------------|--------|------------------------------------|--------------------------------|
| id          | string | Required, unique                   | Backend-assigned UUID          |
| email       | string | Required, unique, RFC email format | Used for login                 |
| username    | string | Required, unique, `^[a-z0-9_-]+$`, 3–32 chars | Display identifier |
| displayName | string | Optional                           | Shown in sidebar if present, fallback to username |

### AuthState (client-side store)

Represents the in-memory + persisted auth session.

| Field        | Type          | Persisted       | Notes                                      |
|--------------|---------------|------------------|--------------------------------------------|
| accessToken  | string | null | No (memory only)  | Short-lived JWT; cleared on page unload    |
| refreshToken | string | null | Yes (localStorage) | Long-lived; used to obtain new accessToken |
| user         | User | null   | Yes (localStorage) | Cached user profile from last login        |
| isAuthenticated | boolean    | Derived          | `true` when `accessToken !== null OR refreshToken !== null` |

**State transitions**:
- **Unauthenticated** → Login success → **Authenticated** (both tokens + user set)
- **Authenticated** → Access token expired → **Refreshing** (refresh call in-flight) → **Authenticated** (new access token)
- **Authenticated** → Refresh token expired/invalid → **Unauthenticated** (all cleared, redirect to /login)
- **Authenticated** → Logout → **Unauthenticated** (all cleared, redirect to /login)
- **Page reload** → refreshToken in localStorage? → Call refresh → **Authenticated** (new access token + user restored)

### RegisterRequest

Data submitted for account creation.

| Field    | Type   | Validation                              |
|----------|--------|-----------------------------------------|
| email    | string | Required, RFC email format              |
| username | string | Required, `^[a-z0-9_-]+$`, 3–32 chars  |
| password | string | Required, minimum 8 characters          |

### LoginRequest

Data submitted for authentication.

| Field    | Type   | Validation                 |
|----------|--------|----------------------------|
| email    | string | Required, RFC email format |
| password | string | Required, non-empty        |

### TokenResponse

Backend response on successful login or token refresh.

| Field        | Type   | Notes                    |
|--------------|--------|--------------------------|
| accessToken  | string | Short-lived JWT          |
| refreshToken | string | Long-lived refresh token |
| user         | User   | User profile data        |

## Relationships

```
RegisterRequest ──POST /auth/register──► 201 (no body, or confirmation)
LoginRequest ────POST /auth/login──────► TokenResponse
refreshToken ───POST /auth/refresh────► TokenResponse (new pair)
accessToken ────POST /auth/logout─────► 204 (session cleared server-side)
```

## Validation Rules Summary

| Field    | Rule                          | Where enforced     |
|----------|-------------------------------|--------------------|
| email    | RFC 5322 format               | Frontend (Zod) + Backend |
| username | `^[a-z0-9_-]+$`, 3–32 chars  | Frontend (Zod) + Backend |
| password | Minimum 8 characters          | Frontend (Zod) + Backend |
