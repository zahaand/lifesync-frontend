# Quickstart: 003-habits-page

**Branch**: `003-habits-page`

## Prerequisites

- Node 20+
- Backend running at `VITE_API_BASE_URL` with habits CRUD endpoints available

## Setup

```bash
git checkout 003-habits-page
npm install
```

## New shadcn/ui Components Required

Before implementing, install missing components:

```bash
npx shadcn@latest add alert-dialog textarea
```

## Files to Create / Modify

### New files

| File | Purpose |
|------|---------|
| `src/pages/HabitsPage.tsx` | Main habits page component |
| `src/components/habits/HabitCard.tsx` | Individual habit row/card component |
| `src/components/habits/HabitFormModal.tsx` | Shared create/edit modal with form |
| `src/components/habits/HabitDeleteDialog.tsx` | AlertDialog confirmation for delete |
| `src/components/habits/HabitFilters.tsx` | Filter tabs + search input bar |
| `src/components/habits/HabitEmptyState.tsx` | Empty state when no habits or no search results |

### Modified files

| File | Change |
|------|--------|
| `src/types/habits.ts` | Add `DayOfWeek`, `CreateHabitRequest`, `UpdateHabitRequest`; extend `Habit` with description, targetDaysOfWeek, reminderTime, isActive |
| `src/api/habits.ts` | Add `createHabit()`, `updateHabit()`, `deleteHabit()` |
| `src/hooks/useHabits.ts` | Add `useAllHabits()`, `useCreateHabit()`, `useUpdateHabit()`, `useDeleteHabit()`; update optimistic caches to cover `['habits']` key |
| `src/App.tsx` | Add `/habits` route inside protected layout |

## Development

```bash
npm run dev        # Start dev server
npm run build      # Type-check + build
npm run lint       # ESLint check
```

## Verification Checklist

1. Navigate to `/habits` — page loads with habit list
2. Create a new habit via "+ New habit" button
3. Toggle completion checkbox — immediate visual update
4. Edit a habit — modal pre-fills, saves changes
5. Archive a habit — moves to archived section
6. Restore an archived habit — moves back to active
7. Delete an archived habit — confirmation dialog, then removed
8. Filter by tab (All/Active/Archived) and search by name
9. Verify `tsc -b && eslint .` passes with zero errors
