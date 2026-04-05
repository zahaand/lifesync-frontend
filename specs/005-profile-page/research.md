# Research: Profile Page + Smart Greeting

**Feature**: 005-profile-page | **Date**: 2026-04-05

## R1: useCurrentUser Hook — Query Key and Caching Strategy

**Decision**: Create `useCurrentUser` hook with query key `['users', 'me']` and `staleTime: 5 * 60 * 1000` (5 minutes).

**Rationale**: The user profile rarely changes during a session. A 5-minute stale time prevents unnecessary refetches while ensuring reasonably fresh data. The Dashboard greeting and Profile page both consume this hook — deduplication is automatic via React Query.

**Alternatives considered**:
- `staleTime: 0` (always refetch) — unnecessary network traffic for rarely-changing data.
- `staleTime: Infinity` (never refetch) — too aggressive; wouldn't pick up server-side changes (e.g., admin-set displayName).
- Reuse authStore user instead of a query — authStore `User` type lacks `telegramChatId`. A dedicated query also keeps server state in React Query per constitution Principle II.

## R2: Dual-Store Sync on Username Mutation

**Decision**: On successful PATCH /users/me, perform both:
1. `queryClient.invalidateQueries({ queryKey: ['users', 'me'] })` — refresh the React Query cache
2. Update `authStore.user` with the response data — immediate sidebar/greeting update

**Rationale**: React Query invalidation triggers a background refetch but doesn't guarantee instant UI update for components reading from authStore (Layout sidebar, Dashboard greeting fallback). Updating authStore synchronously in the `onSuccess` callback ensures all consumers see the new username immediately.

**Implementation**: The mutation's `onSuccess` receives the updated user profile from the server response. Call `useAuthStore.getState().setUser(updatedUser)` — a new action added to authStore that updates only the `user` field without replacing tokens. Since authStore persists `user` to localStorage, the change survives page reloads.

**Alternatives considered**:
- Only invalidate React Query, subscribe Layout/Dashboard to `['users', 'me']` — would require refactoring Layout to use useCurrentUser instead of authStore, breaking the established pattern from Sprint 1.
- Only update authStore, skip React Query — violates Principle II (server state must be in React Query).

## R3: UserProfile Type — Extending Auth User

**Decision**: Create a `UserProfile` type in `src/types/users.ts` that extends the auth `User` type with `telegramChatId: string | null`.

**Rationale**: The auth `User` type (`id`, `email`, `username`, `displayName`) is used across the app and stored in authStore. The profile endpoint returns additional fields (`telegramChatId`) that are only relevant on the Profile page. Extending rather than duplicating keeps types DRY.

**Implementation**:
```typescript
import type { User } from '@/types/auth'

export type UserProfile = User & {
  telegramChatId: string | null
}
```

**Alternatives considered**:
- Add `telegramChatId` to the auth `User` type — pollutes the auth type with profile-specific data; authStore would need to handle a field it never receives from login/refresh endpoints.
- Create a completely separate `UserProfile` type without extending — duplicates id/email/username/displayName fields, increasing maintenance burden.

## R4: Delete Account — State Cleanup Sequence

**Decision**: On successful DELETE /users/me:
1. `authStore.clearAuth()` — removes tokens and user from localStorage
2. `queryClient.clear()` — removes all cached data (habits, goals, user profile)
3. `navigate('/login')` — redirect via React Router

**Rationale**: Clearing only auth state would leave stale cached data for a deleted user. `queryClient.clear()` is a full cache wipe, which is appropriate since the user no longer exists. Navigation must happen after state cleanup to prevent re-renders with invalid state.

**Alternatives considered**:
- `queryClient.invalidateQueries()` instead of `clear()` — would trigger refetches that fail with 401, causing unnecessary errors. Full clear is cleaner.
- Redirect via `window.location.href = '/login'` — works but bypasses React Router, causing a full page reload. Using `navigate()` is more consistent with the SPA pattern.

## R5: Telegram Chat ID — Client-Side Validation

**Decision**: Validate `telegramChatId` on the client with `/^\d+$/` before submitting PUT /users/me/telegram. Show inline validation error for non-numeric input.

**Rationale**: Telegram chat IDs are numeric strings (e.g., "123456789"). Client-side validation provides immediate feedback and prevents unnecessary server roundtrips. The backend also validates (returns 400 for invalid format), serving as a safety net.

**Implementation**: Use Zod schema: `z.string().regex(/^\d+$/, 'Chat ID must contain only digits').min(1, 'Chat ID is required')`.

**Alternatives considered**:
- No client-side validation, rely on backend 400 — worse UX (slower feedback, generic error toast).
- Allow any string, let backend validate — same issue, plus the input could contain spaces or letters that are obviously wrong.

## R6: Smart Greeting — Fallback Strategy

**Decision**: Dashboard greeting uses this priority:
1. `displayName` from `useCurrentUser()` data (if loaded and non-null/non-empty)
2. `username` from `authStore.user` (always available synchronously)

**Rationale**: `useCurrentUser` may still be loading on initial Dashboard render. The authStore username is available immediately (persisted in localStorage). This provides instant greeting without a loading state, while upgrading to displayName once the profile query resolves.

**Implementation**: No loading spinner for the greeting. The greeting text simply swaps from username to displayName when the query completes — this is a graceful enhancement, not a blocking dependency.

**Alternatives considered**:
- Show skeleton for greeting while loading — over-engineered for a text swap; creates a flash of loading state on every Dashboard visit.
- Only use authStore data, never fetch /users/me on Dashboard — would never show displayName, defeating the purpose of US2.
