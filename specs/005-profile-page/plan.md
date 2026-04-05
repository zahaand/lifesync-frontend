# Implementation Plan: Profile Page + Smart Greeting

**Branch**: `005-profile-page` | **Date**: 2026-04-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-profile-page/spec.md`

## Summary

Build a Profile page at `/profile` with a single-column card layout (max-width 720px, centered) containing: Account card (username edit, email read-only), Telegram card (chat ID linking), Stats card (4 read-only metrics from existing hooks), and Danger Zone card (account deletion with username-confirmation Dialog). Update Dashboard greeting to use `displayName` from GET /users/me with fallback to authStore username. All profile mutations sync both React Query cache AND `authStore.user` for immediate sidebar/greeting reflection.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, React Hook Form + Zod, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner
**Storage**: N/A (backend-managed)
**Testing**: No test framework configured — validation via `tsc -b && eslint .`
**Target Platform**: Web (desktop/tablet browsers)
**Project Type**: SPA frontend (Vite 8 + Tailwind CSS v4)
**Performance Goals**: Page load < 2s, greeting display < 1s (SC-002)
**Constraints**: No mobile layout. displayName is read-only (not editable in Sprint 5). No Telegram "Remove" action in Sprint 5.
**Scale/Scope**: Single user profile — no pagination, no multi-user views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | All HTTP calls go through `src/api/users.ts` via `apiClient`. No direct axios imports in components/hooks. |
| II. Server State via React Query | PASS | Profile data via `useCurrentUser` (`['users', 'me']`). Stats reuse `useHabits`/`useGoalsSummary`. Mutations via `useMutation` hooks. **Exception**: username mutation also updates `authStore.user` for immediate sidebar sync — this is intentional dual-store sync, not server state in local store. |
| III. Component-Logic Separation | PASS | All data fetching and mutation logic in `src/hooks/useUsers.ts`. Components handle rendering and local UI state (form inputs, dialogs). |
| IV. Type Safety | PASS | New types in `src/types/users.ts`. Extends auth `User` type. No `any`. Strict TypeScript. |
| V. Design System Fidelity | PASS | All UI via shadcn/ui components (Card, Input, Button, Dialog, Skeleton). Lucide icons. Delete confirmation uses Dialog with Input (not AlertDialog — per clarification Q2). |

No violations. No Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/005-profile-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── profile-api.md   # API contract for profile endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   └── users.ts              # NEW: getCurrentUser, updateUser, updateTelegram, deleteAccount
├── types/
│   └── users.ts              # NEW: UserProfile, UpdateUserRequest, UpdateTelegramRequest
├── hooks/
│   └── useUsers.ts           # NEW: useCurrentUser, useUpdateUsername, useUpdateTelegram,
│                              #   useDeleteAccount
├── components/
│   └── profile/              # NEW directory for profile-specific components
│       ├── AccountCard.tsx    # Username edit + email display
│       ├── TelegramCard.tsx   # Telegram chat ID linking
│       ├── StatsCard.tsx      # 4 read-only metrics (habits/goals)
│       ├── DangerZoneCard.tsx # Delete account button
│       └── DeleteAccountDialog.tsx  # Username-confirmation Dialog
├── pages/
│   ├── ProfilePage.tsx        # NEW: single-column card layout
│   └── DashboardPage.tsx      # MODIFY: smart greeting with useCurrentUser
├── components/
│   └── shared/
│       └── Layout.tsx         # MODIFY: add /profile nav link, update sidebar
└── App.tsx                    # MODIFY: add /profile route
```

**Structure Decision**: Follows the established pattern from Sprint 3/4 (feature-specific directory under `src/components/`). Each card is a separate component to maintain single responsibility. The `DeleteAccountDialog` is separate from `DangerZoneCard` to keep the destructive flow isolated and testable.

## Key Design Decisions

### 1. Dual-Store Sync Pattern (React Query + authStore)

Username mutations must update both `['users', 'me']` query cache AND `authStore.user` so the sidebar greeting and Layout user display reflect changes immediately without a page reload. The `onSuccess` callback of the mutation handles both:
1. `queryClient.invalidateQueries({ queryKey: ['users', 'me'] })`
2. `useAuthStore.getState().setTokens(...)` with updated user object

### 2. useCurrentUser Hook

A new `useCurrentUser` hook wraps `useQuery(['users', 'me'], getCurrentUser)`. This is the single source of truth for profile data (including `telegramChatId` which doesn't exist on the auth `User` type). The Dashboard greeting consumes this hook for `displayName`, with authStore username as fallback while loading.

### 3. Delete Account Flow

Uses shadcn `Dialog` (not `AlertDialog`) with an `Input` field. The user must type their exact username to enable the Confirm button. On success: `authStore.clearAuth()`, `queryClient.clear()`, `navigate('/login')`.

### 4. Stats Card — Auto-Fetch on Cold Cache

The Stats card uses `useHabits()` and `useGoalsSummary()` — the same hooks used by Dashboard. If the user navigates directly to `/profile` and caches are cold, the hooks automatically trigger fetches. Skeleton placeholders are shown while loading.
