# Research: 003-habits-page

**Date**: 2026-04-05

## R1: Query key strategy for all-habits fetch

**Decision**: Use query key `['habits']` (without status filter) for the Habits page, fetching all habits in a single request. The existing Dashboard uses `['habits', { status: 'ACTIVE' }]` which fetches only active habits.

**Rationale**: The Habits page needs both active and archived habits. Using a different query key (`['habits']` without status param) avoids cache conflicts with the Dashboard's filtered query. Both queries invalidate correctly when mutations call `invalidateQueries({ queryKey: ['habits'] })` since it matches both as a prefix.

**Alternatives considered**:
- Reuse the same `['habits', { status: 'ACTIVE' }]` key and add a second query for archived — more complex, two loading states to manage.
- Change Dashboard to also fetch all — unnecessary data for Dashboard.

## R2: Optimistic update pattern for complete/uncomplete on Habits page

**Decision**: Extend existing `useCompleteHabit` / `useUncompleteHabit` hooks to also optimistically update the `['habits']` cache (used by Habits page), in addition to the existing `['habits', { status: 'ACTIVE' }]` cache (used by Dashboard).

**Rationale**: Both caches may exist simultaneously if the user navigated from Dashboard to Habits. The `onMutate` callback needs to update both cache entries. The existing `invalidateQueries({ queryKey: ['habits'] })` in `onSettled` already covers both since `['habits']` is a prefix match.

**Alternatives considered**:
- Create separate hooks for Habits page — duplicates logic, violates DRY.
- Only update the page-specific cache — stale data visible if user navigates back.

## R3: Missing shadcn/ui components

**Decision**: Install `alert-dialog` and `textarea` via the shadcn CLI before implementation.

**Rationale**: AlertDialog is required for delete confirmation (FR-015). Textarea is required for the habit description field in create/edit modals (FR-010). Neither exists in the current `src/components/ui/` directory.

**Alternatives considered**:
- Use Dialog for confirmation — AlertDialog is semantically correct and provides better accessibility for destructive actions.
- Use Input with multiline — not standard; Textarea is the proper component.

## R4: Form management pattern for create/edit modals

**Decision**: Use React Hook Form + Zod schema validation, consistent with LoginPage pattern. Single `HabitFormModal` component reused for both create and edit, receiving an optional `habit` prop to determine mode.

**Rationale**: The project already uses `react-hook-form` + `@hookform/resolvers` + `zod`. A shared modal component avoids duplicating the identical form fields/validation for create vs edit.

**Alternatives considered**:
- Separate CreateModal/EditModal — nearly identical code, harder to maintain.
- Controlled state without RHF — inconsistent with existing patterns, no schema validation.

## R5: Client-side filtering architecture

**Decision**: Use React `useState` for filter tab and search query. Derive filtered lists with `useMemo` from the full habits data. Filter pipeline: status filter → search filter (AND logic).

**Rationale**: All filtering is client-side (per spec). `useMemo` ensures efficient re-computation only when inputs change. No need for a global store since filter state is page-local.

**Alternatives considered**:
- URL search params for filter state — possible but over-engineering for client-side-only filtering on a single page.
- Zustand store — unnecessary for page-local state per constitution (Principle III: global state only for cross-page concerns like auth).

## R6: Habit type extension for create/edit fields

**Decision**: Add `CreateHabitRequest`, `UpdateHabitRequest`, and `DayOfWeek` types to `src/types/habits.ts`. Extend the existing `Habit` type with optional fields `description`, `targetDaysOfWeek`, and `reminderTime` that the backend returns but Sprint 2 didn't need.

**Rationale**: The existing `Habit` type lacks fields needed for the edit modal pre-population. These fields exist on the backend response but weren't typed in Sprint 2 since the Dashboard didn't display them.

**Alternatives considered**:
- Separate `HabitDetail` type — adds unnecessary complexity; extending the existing type is simpler and backward-compatible.
