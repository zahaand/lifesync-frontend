# Data Model: Profile Page + Smart Greeting

**Feature**: 005-profile-page | **Date**: 2026-04-05

## Entities

### UserProfile

Represents the full user profile returned by GET /users/me. Extends the existing auth `User` type with profile-specific fields.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| id | string (UUID) | User | From auth type |
| email | string | User | Read-only on profile |
| username | string | User | Editable, validated: `^[a-z0-9_-]+$`, 3-32 chars |
| displayName | string \| null | User | Read-only in Sprint 5 (not editable on profile) |
| telegramChatId | string \| null | UserProfile | Numeric string (`/^\d+$/`), null when not linked |

**TypeScript definition** (`src/types/users.ts`):
```typescript
import type { User } from '@/types/auth'

export type UserProfile = User & {
  telegramChatId: string | null
}
```

### UpdateUserRequest

Partial update payload for PATCH /users/me.

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| username | string (optional) | `^[a-z0-9_-]+$`, 3-32 chars | Only field editable in Sprint 5 |

**TypeScript definition**:
```typescript
export type UpdateUserRequest = {
  username?: string
}
```

### UpdateTelegramRequest

Payload for PUT /users/me/telegram.

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| telegramChatId | string | `/^\d+$/`, non-empty | Numeric string |

**TypeScript definition**:
```typescript
export type UpdateTelegramRequest = {
  telegramChatId: string
}
```

## Relationships

```
UserProfile (1) ──extends── User (from auth)
UserProfile.telegramChatId ──references── Telegram Bot API chat ID (external)
```

## Validation Schemas (Zod)

### Username Edit Schema

Reuses the existing `registerSchema.shape.username` pattern from `src/types/auth.ts`:

```typescript
export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens, and underscores'),
})
```

### Telegram Chat ID Schema

```typescript
export const updateTelegramSchema = z.object({
  telegramChatId: z
    .string()
    .min(1, 'Chat ID is required')
    .regex(/^\d+$/, 'Chat ID must contain only digits'),
})
```

## State Management

| Data | Store | Query Key | Notes |
|------|-------|-----------|-------|
| User profile | React Query | `['users', 'me']` | Primary source for telegramChatId, displayName |
| Auth user | authStore (Zustand) | N/A | Synced on username mutation for immediate sidebar update |
| Habits stats | React Query | `['habits']` | Reused from Dashboard — auto-fetches if cold |
| Goals stats | React Query | `['goals-active']`, `['goals-completed']` | Reused from Dashboard — auto-fetches if cold |
