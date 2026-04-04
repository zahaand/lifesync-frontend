# API Contract: Goals

**Feature**: 002-dashboard-page | **Base URL**: `/api/v1`

## GET /goals

Fetch paginated list of goals. Dashboard makes two calls:
1. Active goals (top 5 for display card)
2. Completed goals (count only for stats card)

**Query Parameters**:

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| status | string | — | Filter by status (`ACTIVE` or `COMPLETED`) |
| page | number | 0 | Zero-based page number |
| size | number | 20 | Items per page |
| sort | string | — | Sort field,direction (e.g., `targetDate,asc`) |

**Response** (200):

```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Run a marathon",
      "progress": 65,
      "targetDate": "2026-06-15",
      "status": "ACTIVE",
      "milestones": [
        {
          "id": "uuid",
          "name": "Run 10km without stopping",
          "completed": true
        },
        {
          "id": "uuid",
          "name": "Complete half-marathon",
          "completed": false
        }
      ]
    }
  ],
  "totalElements": 8,
  "totalPages": 2,
  "number": 0,
  "size": 5
}
```

**Notes**:
- `milestones` array contains up to 3 milestones per goal (backend caps)
- `milestones` is empty array `[]` if goal has no milestones
- `targetDate` is null if no deadline is set; nulls sort last when `sort=targetDate,asc`
- For the completed goals stats card, only `totalElements` is needed (content can be ignored; use `size=1` to minimize payload)
