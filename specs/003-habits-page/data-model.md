# Data Model: 003-habits-page

**Date**: 2026-04-05

## Existing Types (Sprint 2 — extend, do not rewrite)

### Habit (extend)

Current fields from `src/types/habits.ts`:

| Field          | Type                | Notes                |
|----------------|---------------------|----------------------|
| id             | string              | UUID                 |
| name           | string              |                      |
| frequency      | HabitFrequency      | DAILY/WEEKLY/CUSTOM  |
| status         | HabitStatus         | ACTIVE/PAUSED/ARCHIVED |
| completedToday | boolean             |                      |
| todayLogId     | string \| null      |                      |
| currentStreak  | number              |                      |

New fields to add (returned by backend, not yet typed):

| Field             | Type                  | Notes                                      |
|-------------------|-----------------------|--------------------------------------------|
| description       | string \| null        | Optional habit description                 |
| targetDaysOfWeek  | DayOfWeek[] \| null   | Only meaningful for CUSTOM frequency       |
| reminderTime      | string \| null        | HH:mm format (e.g. "07:30")               |
| isActive          | boolean               | true=active, false=archived                |

### HabitFrequency (unchanged)

`'DAILY' | 'WEEKLY' | 'CUSTOM'`

### HabitStatus (unchanged)

`'ACTIVE' | 'PAUSED' | 'ARCHIVED'`

### HabitLog (unchanged)

| Field       | Type   | Notes          |
|-------------|--------|----------------|
| id          | string | UUID           |
| habitId     | string | FK to Habit    |
| completedAt | string | ISO timestamp  |

### HabitPageResponse (unchanged)

| Field         | Type     | Notes            |
|---------------|----------|------------------|
| content       | Habit[]  | Paginated habits |
| totalElements | number   |                  |
| totalPages    | number   |                  |
| number        | number   | Current page     |
| size          | number   | Page size        |

## New Types

### DayOfWeek

```
'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
```

### CreateHabitRequest

| Field            | Type              | Required | Validation                        |
|------------------|-------------------|----------|-----------------------------------|
| name             | string            | Yes      | 1–200 characters                  |
| description      | string            | No       | Free text                         |
| frequency        | HabitFrequency    | Yes      | DAILY / WEEKLY / CUSTOM           |
| targetDaysOfWeek | DayOfWeek[]       | Conditional | Required for CUSTOM (min 1); omit for DAILY/WEEKLY |
| reminderTime     | string            | No       | HH:mm format                      |

### UpdateHabitRequest

Same fields as `CreateHabitRequest` but all optional (partial update). Also used for archive/restore via `{ isActive: boolean }`.

| Field            | Type              | Required | Notes                             |
|------------------|-------------------|----------|-----------------------------------|
| name             | string            | No       | 1–200 characters if provided      |
| description      | string            | No       |                                   |
| frequency        | HabitFrequency    | No       |                                   |
| targetDaysOfWeek | DayOfWeek[]       | No       | Required if frequency=CUSTOM      |
| reminderTime     | string            | No       | HH:mm format                      |
| isActive         | boolean           | No       | Used for archive (false) / restore (true) |

## State Transitions

```
[New] --POST /habits--> ACTIVE
ACTIVE --PATCH {isActive:false}--> ARCHIVED
ARCHIVED --PATCH {isActive:true}--> ACTIVE
ARCHIVED --DELETE /habits/{id}--> [Deleted]
```

Note: Only archived habits can be deleted. Active habits cannot be deleted directly.

## Client-Side Filter State (page-local, not persisted)

| State       | Type                               | Default  |
|-------------|--------------------------------------|----------|
| filterTab   | 'ALL' \| 'ACTIVE' \| 'ARCHIVED'    | 'ALL'    |
| searchQuery | string                              | ''       |

Filter pipeline: `allHabits → filterByTab → filterBySearch`
