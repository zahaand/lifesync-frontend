# API Contract: Habit Completion Logs

**Feature**: 006-polish-mobile-techdebt (TD-002)  
**Date**: 2026-04-06

## GET /api/v1/habits/{habitId}/logs

Retrieve paginated completion log entries for a specific habit.

### Path Parameters

| Parameter | Type   | Required | Description            |
|-----------|--------|----------|------------------------|
| habitId   | string | Yes      | UUID of the habit      |

### Query Parameters

| Parameter | Type   | Default | Description                     |
|-----------|--------|---------|---------------------------------|
| page      | number | 0       | Page index (0-based)            |
| size      | number | 20      | Number of entries per page       |

### Success Response (200)

```json
{
  "content": [
    {
      "id": "uuid-string",
      "habitId": "uuid-string",
      "date": "2026-04-05",
      "note": null,
      "createdAt": "2026-04-05T14:30:00Z"
    }
  ],
  "totalElements": 42,
  "totalPages": 3,
  "page": 0,
  "size": 20
}
```

**Ordering**: Entries sorted by `completedAt` descending (most recent first).

### Error Responses

| Status | Condition                    | Body                          | Frontend Handling              |
|--------|------------------------------|-------------------------------|-------------------------------|
| 401    | Not authenticated            | Standard auth error           | Redirect to login (interceptor) |
| 404    | Habit not found or not owned | `{ "message": "Not found" }` | Close drawer, show toast       |
| 500    | Server error                 | `{ "message": "Internal server error" }` | Show error state with Retry button |

### Frontend Integration

- **API function**: `habitLogsApi.getHabitLogs(habitId, params)` in `src/api/habitLogs.ts`
- **Hook**: `useHabitLogs(habitId)` in `src/hooks/useHabitLogs.ts` using `useInfiniteQuery`
- **Query key**: `['habits', habitId, 'logs']`
- **Invalidation**: On habit complete/uncomplete mutations (existing `completeHabit` / `uncompleteHabit`)
