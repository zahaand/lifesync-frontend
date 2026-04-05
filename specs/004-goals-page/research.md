# Research: 004-goals-page

**Date**: 2026-04-05

## R1: Query key strategy for goals list vs detail

**Decision**: Use query key `['goals']` (no status filter) for the Goals page list, fetching all goals in a single request with `size: 100`. Use `['goals', goalId]` for the detail endpoint (GET /goals/{id}). Keep existing Dashboard keys (`['goals', { status: 'ACTIVE', ... }]` and `['goals', { status: 'COMPLETED', ... }]`) unchanged.

**Rationale**: The Goals page needs all goals (active + completed) for client-side filtering. A separate detail key per goal avoids re-fetching the entire list when selecting a goal. Cache invalidation via `invalidateQueries({ queryKey: ['goals'] })` matches all keys as a prefix, keeping Dashboard and Goals page in sync.

**Alternatives considered**:
- Reuse Dashboard's filtered queries — would need two separate queries and merge results, more complex.
- Single query key for list and detail — detail endpoint returns `linkedHabitIds` not present in list response, so separate keys are necessary.

## R2: Master-detail state management

**Decision**: Use `useState<string | null>` for `selectedGoalId` in GoalsPage. When a goal card is clicked, set the ID. The detail panel renders `GoalDetail` when `selectedGoalId` is set, or a placeholder when null. Clear `selectedGoalId` on delete or when the selected goal is filtered out.

**Rationale**: Page-local state is sufficient (per constitution Principle III — global state only for cross-page concerns like auth). URL params (e.g., `/goals/:id`) were considered but add complexity without clear benefit since the detail panel is always co-rendered with the list.

**Alternatives considered**:
- URL-based selection (`/goals/:id`) — would enable deep linking but requires route refactoring and is over-engineering for an in-page panel.
- Zustand store — unnecessary for page-local state.

## R3: Goal detail data fetching strategy

**Decision**: When a goal is selected, call `GET /goals/{id}` via a `useGoalDetail(goalId)` hook with query key `['goals', goalId]`. This returns the full goal including `linkedHabitIds` (not present in list response). Cross-reference `linkedHabitIds` with `useAllHabits()` cache to resolve habit names and streaks. Milestones come from list cache (all inline, no cap).

**Rationale**: The list endpoint omits `linkedHabitIds`, so a detail call is required. Using React Query with `enabled: !!goalId` prevents unnecessary fetches. The habits cache from Sprint 3 (`['habits']`) is likely warm if the user visited `/habits`.

**Alternatives considered**:
- Fetch linked habits via dedicated `GET /goals/{id}/habits` — adds an extra endpoint call; cross-referencing with existing cache is cheaper.
- Embed all data in list response — not possible (backend doesn't include linkedHabitIds in list).

## R4: Milestone mutation pattern

**Decision**: Separate mutation hooks for add (`useAddMilestone`), toggle (`useUpdateMilestone`), and delete (`useDeleteMilestone`). Each invalidates `['goals']` on success (refreshes both list and detail caches). No optimistic updates for milestones (mutations are infrequent, latency acceptable).

**Rationale**: Milestones are sub-resources of goals. Invalidating the goals query prefix ensures the list (which includes inline milestones) and the detail cache both update. Optimistic updates would require complex cache manipulation for nested data with diminishing UX returns.

**Alternatives considered**:
- Optimistic updates for milestone toggle — complex (nested array in paginated response), low value (toggle is not as frequent as habit completion).
- Separate milestones query key — unnecessary since milestones are inline in goals response.

## R5: Linked habits dropdown filtering

**Decision**: The "Link habit" dropdown shows only active habits that are NOT already linked to the selected goal. Filter by: (1) `useAllHabits()` data filtered to `isActive === true`, then (2) exclude habits whose IDs appear in the goal's `linkedHabitIds` array. When all active habits are linked, disable the dropdown and show "All habits linked".

**Rationale**: Prevents duplicate links. Using the existing `['habits']` cache avoids additional API calls. The dropdown needs both habit title and ID for selection.

**Alternatives considered**:
- Show all habits including already-linked — confusing, could create duplicate links.
- Show name + streak in dropdown — unnecessary complexity; streak is visible after linking.

## R6: Progress update and auto-complete behavior

**Decision**: Progress updates via button click only (not on blur/enter). When progress is set to 100, the backend automatically sets status to COMPLETED — the frontend reflects this after server confirmation (not optimistic). Reducing progress below 100 on a COMPLETED goal does NOT reactivate it; reactivation requires explicit status change via the edit modal.

**Rationale**: Button-only update prevents accidental submissions while typing. Server-confirmed status change for the 100% case is safer than optimistic (status transition is a significant state change). Preventing auto-reactivation avoids accidental status changes.

**Alternatives considered**:
- Optimistic status change at 100% — risky; if server rejects, user sees confusing status flip.
- Auto-reactivate below 100 — user explicitly requested this NOT happen (clarification Q3).
- Submit on Enter — could add as enhancement; button-only is simplest for MVP.

## R7: Form management for create/edit goal modals

**Decision**: Reuse the React Hook Form + Zod pattern from Sprint 3's HabitFormModal. Single `GoalFormModal` component with `mode` prop ('create' | 'edit'). Edit mode adds a status selector (Active / Completed). Zod schema validates title (1-200 chars required), description (optional), targetDate (optional, YYYY-MM-DD format or empty string).

**Rationale**: Consistent with established project patterns. Shared modal reduces duplication. The status selector is edit-only because new goals are always ACTIVE.

**Alternatives considered**:
- Separate create/edit modals — nearly identical, harder to maintain.
- Date picker component — native `<input type="date">` via shadcn Input is sufficient for MVP.

## R8: Missing shadcn/ui components

**Decision**: Check if `select` (for status selector and habit linking dropdown) is installed. May need `npx shadcn@latest add select`. The `alert-dialog` component was already installed in Sprint 3.

**Rationale**: The habit-linking dropdown and edit modal status selector need a Select component. AlertDialog was installed in Sprint 3 for habit deletion and can be reused.

**Alternatives considered**:
- Use Button group for status selector — less accessible than proper Select.
- Use native `<select>` — violates constitution Principle V (shadcn/ui only).
