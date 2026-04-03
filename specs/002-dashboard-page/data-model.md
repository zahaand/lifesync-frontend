# Data Model: Dashboard Page

**Feature**: 002-dashboard-page | **Date**: 2026-04-04

## Entities

### Habit

Represents an active trackable behavior. The backend enriches the list response with today's completion status and current streak.

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Unique identifier |
| name | string | Display name |
| frequency | string | Always "DAILY" this sprint |
| status | "ACTIVE" | Only active habits shown on dashboard |
| completedToday | boolean | True if habit has a log for today (server-side date) |
| todayLogId | string (UUID) \| null | Log ID needed for DELETE uncomplete; null if not completed |
| currentStreak | number | Consecutive days of completion |

### HabitLog

Returned by POST /habits/{id}/complete. Needed to store `todayLogId` after optimistic completion.

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Log identifier (used for DELETE uncomplete) |
| habitId | string (UUID) | Associated habit |
| completedAt | string (ISO date) | Date of completion |

### Goal

Represents a longer-term objective. The list endpoint includes milestones inline.

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Unique identifier |
| name | string | Display name |
| progress | number | 0–100 percentage, computed by backend |
| targetDate | string (ISO date) \| null | Optional deadline; null sorts last |
| status | "ACTIVE" \| "COMPLETED" | Goal status |
| milestones | Milestone[] | First 3 milestones inline from list endpoint |

### Milestone

Sub-step within a goal.

| Field | Type | Notes |
|-------|------|-------|
| id | string (UUID) | Unique identifier |
| name | string | Display name |
| completed | boolean | Whether this milestone is done |

### Paginated Response Wrapper

Both habits and goals endpoints return paginated responses.

| Field | Type | Notes |
|-------|------|-------|
| content | T[] | Array of items (Habit[] or Goal[]) |
| totalElements | number | Total items matching query |
| totalPages | number | Total pages |
| number | number | Current page (0-based) |
| size | number | Page size |

## Relationships

```text
Habit  ──1:N──  HabitLog     (one habit has many logs; todayLogId references today's log)
Goal   ──1:N──  Milestone    (one goal has many milestones; max 3 returned inline)
```

## Derived / Computed Values (frontend)

| Value | Source | Computation |
|-------|--------|-------------|
| Today's habits X / Y | Habit[] | X = count where completedToday === true; Y = total habit count |
| Best streak | Habit[] | max(currentStreak) across all habits; first by list order on tie |
| Active goals count | Goal[] (status=ACTIVE) | totalElements from paginated response |
| Completed goals count | Goal[] (status=COMPLETED) | totalElements from paginated response |
| Time-of-day greeting | Client clock | hour 5–11 → morning, 12–17 → afternoon, 18–4 → evening |

## Type Files

- `src/types/habits.ts` — Habit, HabitLog, HabitPageResponse
- `src/types/goals.ts` — Goal, Milestone, GoalPageResponse
