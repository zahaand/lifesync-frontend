# MSW Handler Contracts

**Feature**: 007-pre-release
**Date**: 2026-04-06

## Overview

MSW (Mock Service Worker) handlers intercept HTTP requests during Vitest tests. Each handler file maps to a backend API domain. All handlers use MSW 2.x `http` namespace (not legacy `rest`).

**Base URL**: `/api/v1` (relative — MSW matches path patterns)

## src/test/handlers/auth.ts

| Method | Path | Success (200) | Error Variants |
|--------|------|---------------|----------------|
| POST | /auth/login | `{ accessToken, refreshToken }` | 401: invalid credentials |
| POST | /auth/register | `{ id, username, email }` | 409: username/email taken |
| POST | /auth/refresh | `{ accessToken, refreshToken }` | 401: invalid refresh token |
| POST | /auth/logout | 200 (empty) | — |

## src/test/handlers/habits.ts

| Method | Path | Success | Error Variants |
|--------|------|---------|----------------|
| GET | /habits | `HabitPageResponse` | 401: unauthorized |
| POST | /habits | `Habit` (created) | 400: missing title; 400: CUSTOM without days |
| GET | /habits/:id | `Habit` | 404: not found |
| PATCH | /habits/:id | `Habit` (updated) | 404: not found |
| DELETE | /habits/:id | 204 | 404: not found |
| POST | /habits/:id/complete | `{ logId }` | 409: already completed today |
| DELETE | /habits/:id/complete/:logId | 204 | 404: log not found |
| GET | /habits/:id/logs | `HabitLogPageResponse` (paginated) | 404: habit not found |

## src/test/handlers/goals.ts

| Method | Path | Success | Error Variants |
|--------|------|---------|----------------|
| GET | /goals | `GoalPageResponse` | 401: unauthorized |
| POST | /goals | `Goal` (created) | 400: missing title |
| GET | /goals/:id | `GoalDetail` | 404: not found |
| PATCH | /goals/:id | `Goal` (updated) | 404: not found |
| DELETE | /goals/:id | 204 | 404: not found |
| POST | /goals/:id/progress | `Goal` (updated progress) | 400: progress > 100 |
| POST | /goals/:id/milestones | `Milestone` (created) | 404: goal not found |
| PATCH | /goals/:id/milestones/:mid | `Milestone` (updated) | 404: not found |
| DELETE | /goals/:id/milestones/:mid | 204 | 404: not found |
| POST | /goals/:id/linked-habits | 204 | 409: already linked |
| DELETE | /goals/:id/linked-habits/:hid | 204 | 404: not linked |
| GET | /goals/:id/linked-habits | `string[]` (habit IDs) | 404: goal not found |

## src/test/handlers/users.ts

| Method | Path | Success | Error Variants |
|--------|------|---------|----------------|
| GET | /users/me | `UserProfile` | 401: unauthorized |
| PATCH | /users/me | `UserProfile` (updated) | 400: invalid fields |
| DELETE | /users/me | 204 | 401: unauthorized |

## Handler Setup Pattern

```typescript
// src/test/handlers/index.ts — combines all handlers
export const handlers = [
  ...authHandlers,
  ...habitsHandlers,
  ...goalsHandlers,
  ...usersHandlers,
]
```

```typescript
// src/test/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Error Override Pattern

Tests that need specific error responses override per-test:

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '@/test/setup'

test('shows error on 401', async () => {
  server.use(
    http.get('*/api/v1/habits', () =>
      HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    )
  )
  // ... test code
})
```
