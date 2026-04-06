# Data Model: Pre-release — Audit, Testing & Documentation

**Feature**: 007-pre-release
**Date**: 2026-04-06

## No New Entities

Sprint 7 introduces no new data types or entities. All existing types from `src/types/` are reused as-is in test files and MSW handlers.

## MSW Mock Data Shapes

MSW handlers return data matching existing TypeScript types. Below are the mock data shapes used across test handlers.

### Auth Mock Data

```
LoginRequest:    { identifier: string, password: string }
LoginResponse:   { accessToken: string, refreshToken: string }
RegisterRequest: { username: string, email: string, password: string }
RegisterResponse: { id: string, username: string, email: string }
RefreshRequest:  { refreshToken: string }
RefreshResponse: { accessToken: string, refreshToken: string }
```

Source types: `src/types/auth.ts`

### Habits Mock Data

```
Habit: {
  id: string, title: string, description: string | null,
  frequency: 'DAILY' | 'WEEKLY' | 'CUSTOM', customDays: string[] | null,
  isActive: boolean, currentStreak: number, longestStreak: number,
  completedToday: boolean, todayLogId: string | null,
  createdAt: string
}
HabitPageResponse: { content: Habit[], totalElements, totalPages, page, size }
HabitLog: { id, habitId, date, note, createdAt }
HabitLogPageResponse: { content: HabitLog[], totalElements, totalPages, page, size }
```

Source types: `src/types/habits.ts`, `src/types/habitLogs.ts`

### Goals Mock Data

```
Goal: {
  id: string, title: string, description: string | null,
  status: 'ACTIVE' | 'COMPLETED', progress: number,
  targetDate: string | null, createdAt: string
}
GoalDetail: Goal & {
  milestones: Milestone[], linkedHabitIds: string[]
}
Milestone: { id, title, completed }
GoalPageResponse: { content: Goal[], totalElements, totalPages, page, size }
```

Source types: `src/types/goals.ts`

### Users Mock Data

```
UserProfile: {
  id: string, username: string, email: string,
  displayName: string | null, telegramChatId: string | null,
  createdAt: string
}
```

Source types: `src/types/users.ts`

## Test Data Factory

Each MSW handler module exports factory functions for creating mock data with sensible defaults:

```
createMockHabit(overrides?)  → Habit
createMockGoal(overrides?)   → Goal
createMockUser(overrides?)   → UserProfile
createMockHabitLog(overrides?) → HabitLog
```

This allows tests to override specific fields while keeping defaults realistic.

## State Management (existing — no changes)

| State | Location | Test Approach |
|-------|----------|---------------|
| Auth tokens | authStore (Zustand + localStorage) | Mock localStorage in test setup |
| Server cache | React Query | Fresh QueryClient per test |
| UI state (modals, sidebar) | Component useState | Standard RTL rendering |
