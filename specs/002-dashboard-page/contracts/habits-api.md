# API Contract: Habits

**Feature**: 002-dashboard-page | **Base URL**: `/api/v1`

## GET /habits

Fetch paginated list of habits. Dashboard uses this to get all active habits with enriched fields.

**Query Parameters**:

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| status | string | — | Filter by status (e.g., `ACTIVE`) |
| page | number | 0 | Zero-based page number |
| size | number | 20 | Items per page |
| sort | string | — | Sort field,direction (e.g., `name,asc`) |

**Response** (200):

```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Morning meditation",
      "frequency": "DAILY",
      "status": "ACTIVE",
      "completedToday": true,
      "todayLogId": "uuid-or-null",
      "currentStreak": 5
    }
  ],
  "totalElements": 12,
  "totalPages": 1,
  "number": 0,
  "size": 20
}
```

## POST /habits/{id}/complete

Mark a habit as completed for today.

**Path Parameters**: `id` — habit UUID

**Request Body**: None (server uses today's date)

**Response** (201):

```json
{
  "id": "log-uuid",
  "habitId": "habit-uuid",
  "completedAt": "2026-04-04"
}
```

**Errors**:

| Status | Meaning |
|--------|---------|
| 404 | Habit not found |
| 409 | Already completed today |

## DELETE /habits/{id}/complete/{logId}

Remove today's completion log (unmark habit).

**Path Parameters**: `id` — habit UUID, `logId` — log UUID (from `todayLogId`)

**Response** (204): No content

**Errors**:

| Status | Meaning |
|--------|---------|
| 404 | Habit or log not found |
