# Data Model: 004-goals-page

**Date**: 2026-04-05

## Existing Types (Sprint 2 — extend, do not rewrite)

### Goal (extend)

Current fields from `src/types/goals.ts`:

| Field       | Type             | Notes               |
|-------------|------------------|----------------------|
| id          | string           | UUID                 |
| title       | string           | Goal title           |
| progress    | number           | 0-100                |
| targetDate  | string \| null   | YYYY-MM-DD or null   |
| status      | GoalStatus       | ACTIVE / COMPLETED   |
| milestones  | Milestone[]      | Inline, no cap       |

New fields to add (returned by backend detail endpoint, not yet typed):

| Field            | Type              | Notes                                       |
|------------------|-------------------|-----------------------------------------------|
| description      | string \| null    | Optional goal description                    |
| linkedHabitIds   | string[]          | Only in GET /goals/{id} detail response      |
| createdAt        | string            | ISO timestamp                                |

> **Note**: `linkedHabitIds` is NOT present in GET /goals list response. It is only returned by the GET /goals/{id} detail endpoint. The list response includes all milestones inline with no cap.

### GoalDetail (new — extends Goal with detail-only fields)

Used for the response from GET /goals/{id}. Contains all Goal fields plus `linkedHabitIds`.

| Field            | Type              | Notes                                       |
|------------------|-------------------|-----------------------------------------------|
| (all Goal fields)| —                 | Same as Goal                                 |
| linkedHabitIds   | string[]          | Habit IDs linked to this goal                |

### Milestone (unchanged)

| Field     | Type    | Notes              |
|-----------|---------|---------------------|
| id        | string  | UUID                |
| title     | string  | Milestone title     |
| completed | boolean | Completion status   |

> **Note**: Milestones are ordered by their position in the array (server returns them in sortOrder). The frontend does not manage sortOrder directly — new milestones are appended by the backend.

### GoalStatus (unchanged)

`'ACTIVE' | 'COMPLETED'`

### GoalPageResponse (unchanged)

| Field         | Type     | Notes            |
|---------------|----------|------------------|
| content       | Goal[]   | Paginated goals  |
| totalElements | number   |                  |
| totalPages    | number   |                  |
| number        | number   | Current page     |
| size          | number   | Page size        |

## New Types

### CreateGoalRequest

| Field       | Type           | Required | Validation                  |
|-------------|----------------|----------|-----------------------------|
| title       | string         | Yes      | 1-200 characters            |
| description | string         | No       | Free text                   |
| targetDate  | string         | No       | YYYY-MM-DD format           |

### UpdateGoalRequest

All fields optional (partial update). Also used for status change.

| Field       | Type           | Required | Notes                       |
|-------------|----------------|----------|-----------------------------|
| title       | string         | No       | 1-200 characters if provided |
| description | string         | No       |                             |
| targetDate  | string         | No       | YYYY-MM-DD format           |
| status      | GoalStatus     | No       | ACTIVE / COMPLETED          |

### UpdateGoalProgressRequest

| Field    | Type   | Required | Validation |
|----------|--------|----------|------------|
| progress | number | Yes      | 0-100      |

### CreateMilestoneRequest

| Field | Type   | Required | Validation         |
|-------|--------|----------|--------------------|
| title | string | Yes      | Non-empty string   |

### UpdateMilestoneRequest

| Field     | Type    | Required | Notes                    |
|-----------|---------|----------|--------------------------|
| completed | boolean | Yes      | Toggle completion status |

### LinkHabitRequest

| Field   | Type   | Required | Notes      |
|---------|--------|----------|------------|
| habitId | string | Yes      | Habit UUID |

### GoalHabitLink

Response from POST /goals/{id}/habits.

| Field     | Type   | Notes         |
|-----------|--------|---------------|
| id        | string | Link UUID     |
| goalId    | string | FK to Goal    |
| habitId   | string | FK to Habit   |
| createdAt | string | ISO timestamp |

## State Transitions

```
[New] --POST /goals--> ACTIVE (progress: 0)
ACTIVE --PATCH progress=100--> COMPLETED (auto by backend)
ACTIVE --PATCH {status:COMPLETED}--> COMPLETED (explicit via edit modal)
COMPLETED --PATCH {status:ACTIVE}--> ACTIVE (explicit via edit modal)
COMPLETED --PATCH progress<100--> COMPLETED (status unchanged, only progress updates)
Any --DELETE /goals/{id}--> [Deleted]
```

## Client-Side Filter State (page-local, not persisted)

| State          | Type                              | Default |
|----------------|-----------------------------------|---------|
| filterTab      | 'ALL' \| 'ACTIVE' \| 'COMPLETED' | 'ALL'   |
| selectedGoalId | string \| null                    | null    |

Filter pipeline: `allGoals → filterByTab → render list`

## Query Key Strategy

| Key                              | Source                  | Used by                |
|----------------------------------|-------------------------|------------------------|
| `['goals']`                      | GET /goals (size: 100)  | GoalsPage list         |
| `['goals', goalId]`             | GET /goals/{id}         | GoalDetail panel       |
| `['goals', { status: 'ACTIVE', ... }]` | GET /goals (filtered) | Dashboard (unchanged) |
| `['goals', { status: 'COMPLETED', ... }]` | GET /goals (filtered) | Dashboard (unchanged) |
| `['habits']`                     | GET /habits (size: 100) | Linked habits cross-ref |
