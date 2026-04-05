# API Contracts: Goals

**Date**: 2026-04-05  
**Base URL**: `{VITE_API_BASE_URL}`  
**Auth**: Bearer token (via Axios interceptor)

## Existing Endpoints (Sprint 2 — no changes)

### GET /api/v1/goals

Fetch goals. Returns paginated response with milestones inline (no cap).

**Query Params** (all optional):
- `status`: string — filter by status (ACTIVE / COMPLETED). Dashboard uses this; Goals page omits it.
- `page`: number — page index (0-based)
- `size`: number — page size (default 20, Goals page uses 100)
- `sort`: string — sort field (Dashboard uses `targetDate,asc`)

**Response**: `GoalPageResponse`

**Note**: List response does NOT include `linkedHabitIds`. Milestones are included inline with no cap.

## New Endpoints (Sprint 4)

### GET /api/v1/goals/{id}

Fetch full goal detail including linkedHabitIds.

**Response**: `GoalDetail` (Goal + linkedHabitIds)
```json
{
  "id": "uuid",
  "name": "Learn TypeScript",
  "description": "Master TS for frontend development",
  "progress": 65,
  "targetDate": "2026-06-15",
  "status": "ACTIVE",
  "milestones": [
    { "id": "uuid", "name": "Complete TS handbook", "completed": true },
    { "id": "uuid", "name": "Build a project", "completed": false }
  ],
  "linkedHabitIds": ["habit-uuid-1", "habit-uuid-2"],
  "createdAt": "2026-04-01T10:00:00Z"
}
```

**Errors**: 404 (not found), 401 (unauthorized)

### POST /api/v1/goals

Create a new goal.

**Request Body**: `CreateGoalRequest`
```json
{
  "title": "Learn TypeScript",
  "description": "Master TS for frontend development",
  "targetDate": "2026-06-15"
}
```

Rules:
- `title`: required, 1-200 chars
- `description`, `targetDate`: optional

**Response**: `Goal` (the created goal)  
**Errors**: 400 (validation), 401 (unauthorized)

### PATCH /api/v1/goals/{id}

Update goal fields or change status.

**Request Body**: `UpdateGoalRequest` (partial — only send changed fields)

For editing:
```json
{
  "title": "Master TypeScript",
  "description": "Updated description"
}
```

For status change (reactivation):
```json
{
  "status": "ACTIVE"
}
```

**Response**: `Goal` (the updated goal)  
**Errors**: 400 (validation), 404 (not found), 401 (unauthorized)

### DELETE /api/v1/goals/{id}

Permanently delete a goal.

**Response**: 204 No Content  
**Errors**: 404 (not found), 401 (unauthorized)

### PATCH /api/v1/goals/{id}/progress

Update goal progress. If progress reaches 100, backend automatically sets status to COMPLETED.

**Request Body**: `UpdateGoalProgressRequest`
```json
{
  "progress": 75
}
```

Rules:
- `progress`: required, integer 0-100

**Response**: `Goal` (the updated goal with new progress and potentially updated status)  
**Errors**: 400 (invalid progress value), 404 (not found), 401 (unauthorized)

### POST /api/v1/goals/{id}/milestones

Add a new milestone to a goal.

**Request Body**: `CreateMilestoneRequest`
```json
{
  "title": "Complete chapter 1"
}
```

Rules:
- `title`: required, non-empty

**Response**: `Milestone` (the created milestone)  
**Errors**: 400 (validation), 404 (goal not found), 401 (unauthorized)

### PATCH /api/v1/goals/{id}/milestones/{milestoneId}

Toggle milestone completion.

**Request Body**: `UpdateMilestoneRequest`
```json
{
  "completed": true
}
```

**Response**: `Milestone` (the updated milestone)  
**Errors**: 404 (not found), 401 (unauthorized)

### DELETE /api/v1/goals/{id}/milestones/{milestoneId}

Delete a milestone.

**Response**: 204 No Content  
**Errors**: 404 (not found), 401 (unauthorized)

### POST /api/v1/goals/{id}/habits

Link a habit to a goal.

**Request Body**: `LinkHabitRequest`
```json
{
  "habitId": "habit-uuid"
}
```

**Response**: `GoalHabitLink`
```json
{
  "id": "link-uuid",
  "goalId": "goal-uuid",
  "habitId": "habit-uuid",
  "createdAt": "2026-04-05T12:00:00Z"
}
```

**Errors**: 400 (already linked / habit not found), 404 (goal not found), 401 (unauthorized)

### DELETE /api/v1/goals/{id}/habits/{habitId}

Unlink a habit from a goal.

**Response**: 204 No Content  
**Errors**: 404 (link not found), 401 (unauthorized)
