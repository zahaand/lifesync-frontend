# API Contracts: Habits

**Date**: 2026-04-05  
**Base URL**: `{VITE_API_BASE_URL}`  
**Auth**: Bearer token (via Axios interceptor)

## Existing Endpoints (Sprint 2 — no changes)

### GET /api/v1/habits

Fetch all habits (active + archived). Returns paginated response.

**Query Params** (all optional):
- `status`: string — filter by status (not used on Habits page; used by Dashboard with `ACTIVE`)
- `page`: number — page index (0-based)
- `size`: number — page size (default 20, Habits page uses 100)

**Response**: `HabitPageResponse`

### POST /api/v1/habits/{id}/complete

Mark habit as completed today.

**Response**: `HabitLog` (contains `id` used as `todayLogId`)

### DELETE /api/v1/habits/{id}/complete/{logId}

Remove today's completion.

**Response**: 204 No Content

## New Endpoints (Sprint 3)

### POST /api/v1/habits

Create a new habit.

**Request Body**: `CreateHabitRequest`
```json
{
  "name": "Morning Run",
  "description": "30 min jog around the park",
  "frequency": "CUSTOM",
  "targetDaysOfWeek": ["MONDAY", "WEDNESDAY", "FRIDAY"],
  "reminderTime": "07:30"
}
```

Rules:
- `name`: required, 1–200 chars
- `frequency`: required, one of DAILY / WEEKLY / CUSTOM
- `targetDaysOfWeek`: omit for DAILY/WEEKLY; required for CUSTOM (min 1)
- `description`, `reminderTime`: optional

**Response**: `Habit` (the created habit)  
**Errors**: 400 (validation), 401 (unauthorized)

### PATCH /api/v1/habits/{id}

Update habit fields or archive/restore.

**Request Body**: `UpdateHabitRequest` (partial — only send changed fields)

For editing:
```json
{
  "name": "Evening Run",
  "frequency": "DAILY"
}
```

For archiving:
```json
{
  "isActive": false
}
```

For restoring:
```json
{
  "isActive": true
}
```

**Response**: `Habit` (the updated habit)  
**Errors**: 400 (validation), 404 (not found), 401 (unauthorized)

### DELETE /api/v1/habits/{id}

Permanently delete a habit. Only allowed for archived habits.

**Response**: 204 No Content  
**Errors**: 400 (habit is still active), 404 (not found), 401 (unauthorized)
