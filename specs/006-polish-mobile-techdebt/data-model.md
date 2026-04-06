# Data Model: Polish — Mobile Adaptation + Tech Debt

**Feature**: 006-polish-mobile-techdebt  
**Date**: 2026-04-06

## Existing Entities (No Changes)

### Habit
Already defined in `src/types/habits.ts`. No modifications needed.

### HabitLog
Defined in `src/types/habitLogs.ts`:
```
id: string                    — UUID, used as logId
habitId: string               — UUID of the parent habit
date: string                  — YYYY-MM-DD, completion date
note: string | null           — optional note (nullable)
createdAt: string             — ISO 8601 timestamp, used for HH:mm time display
```
Used by the history drawer to display individual completion entries.

## New Types

### HabitLogPageResponse
Paginated response for habit completion logs. Mirrors the existing `HabitPageResponse` pattern.

```
content: HabitLog[]        — array of log entries for the requested page
totalElements: number      — total number of log entries across all pages
totalPages: number         — total number of pages
page: number               — current page index (0-based)
size: number               — page size (default: 20)
```

**Relationships**: Each `HabitLog` belongs to one `Habit` (via `habitId`). The response is scoped to a single habit (requested by habit ID in the URL path).

**Validation rules**: None on frontend — the backend controls pagination bounds and returns 404 for invalid habit IDs.

## State Management

### Client State (React state, no new stores)

| State | Location | Purpose |
|-------|----------|---------|
| `sidebarOpen` | Layout.tsx (useState) | Controls mobile sidebar overlay visibility |
| `historyDrawerOpen` | HabitsPage.tsx (useState) | Controls habit history drawer visibility |
| `historyHabitId` | HabitsPage.tsx (useState) | Which habit's history to display |
| `selectedGoalId` | GoalsPage.tsx (existing) | Already exists; used for mobile list/detail toggle |

### Server State (React Query)

| Query Key | Hook | Endpoint | Caching |
|-----------|------|----------|---------|
| `['habits', habitId, 'logs']` | `useHabitLogs(habitId)` | GET /api/v1/habits/{id}/logs | `useInfiniteQuery`, pages accumulated, invalidated on habit complete/uncomplete |
