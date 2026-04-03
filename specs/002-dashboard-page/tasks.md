# Tasks: Dashboard Page

**Input**: Design documents from `/specs/002-dashboard-page/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/habits-api.md, contracts/goals-api.md, research.md

**Tests**: Not requested — manual verification per quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and add required shadcn/ui components

- [ ] T001 Install new dependency: `npm install sonner`
- [ ] T002 Add required shadcn/ui components via CLI: `npx shadcn@latest add skeleton dialog checkbox progress badge sonner` (into src/components/ui/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and API layer that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Define habit types in src/types/habits.ts — `Habit` (id, name, frequency, status, completedToday, todayLogId, currentStreak), `HabitLog` (id, habitId, completedAt), `HabitPageResponse` (content: Habit[], totalElements, totalPages, number, size); use `type` declarations (not `interface`)
- [ ] T004 [P] Define goal types in src/types/goals.ts — `Goal` (id, name, progress, targetDate, status, milestones), `Milestone` (id, name, completed), `GoalPageResponse` (content: Goal[], totalElements, totalPages, number, size), `GoalStatus = "ACTIVE" | "COMPLETED"`; use `type` declarations (not `interface`)
- [ ] T005 [P] Create habits API functions in src/api/habits.ts — `getHabits(params?: {status?, page?, size?}): Promise<HabitPageResponse>` (GET /habits), `completeHabit(habitId: string): Promise<HabitLog>` (POST /habits/{id}/complete), `uncompleteHabit(habitId: string, logId: string): Promise<void>` (DELETE /habits/{id}/complete/{logId}); all functions use the Axios instance from src/api/client.ts
- [ ] T006 [P] Create goals API functions in src/api/goals.ts — `getGoals(params?: {status?, page?, size?, sort?}): Promise<GoalPageResponse>` (GET /goals); use the Axios instance from src/api/client.ts
- [ ] T007 Add `<Toaster />` component from sonner to src/App.tsx — import from `@/components/ui/sonner`, place inside `<QueryClientProvider>` alongside router; configure with `duration={3000}` for FR-007

**Checkpoint**: Foundation ready — types compile, API functions defined, Toaster integrated in app shell

---

## Phase 3: User Story 1 — Dashboard Overview with Stats (Priority: P1) MVP

**Goal**: Authenticated user sees personalized greeting, current date, and four summary stat cards

**Independent Test**: Log in → navigate to /dashboard → verify greeting matches time of day, date is correct, stat cards show data (or zero values)

### Implementation for User Story 1

- [ ] T008 [US1] Implement `useHabits` query hook in src/hooks/useHabits.ts — use `useQuery` with key `['habits', {status: 'ACTIVE'}]` wrapping `habitsApi.getHabits({status: 'ACTIVE', size: 100})`; size=100 to fetch all habits in one page; expose `data`, `isLoading`, `isError`, `refetch`
- [ ] T009 [US1] Implement `useGoals` query hook in src/hooks/useGoals.ts — use `useQuery` with key `['goals', params]` wrapping `goalsApi.getGoals(params)`; accept `{status, size, sort}` options; expose `data`, `isLoading`, `isError`, `refetch`
- [ ] T010 [US1] Implement `useGoalsSummary` derived hook in src/hooks/useGoals.ts — call `useGoals({status: 'ACTIVE', size: 5, sort: 'targetDate,asc'})` for active goals and `useGoals({status: 'COMPLETED', size: 1})` for completed count; derive `activeGoals` (content array), `activeCount` (totalElements), `completedCount` (totalElements); expose per-query loading/error states
- [ ] T011 [US1] Build DashboardPage top bar in src/pages/DashboardPage.tsx — replace placeholder content; add greeting section: compute time-of-day from `new Date().getHours()` (5–11 morning, 12–17 afternoon, 18–4 evening); read `user.username` from `useAuthStore` with fallback to greeting without name if null/empty (FR-001 edge case); format current date with `toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})` (FR-002); add "New habit" Button placeholder (wired in US4); layout: flex row with greeting/date left and button right
- [ ] T012 [US1] Build stats row in src/pages/DashboardPage.tsx — use `useHabits` and `useGoalsSummary`; compute: todayCompleted = habits.filter(h => h.completedToday).length, todayTotal = habits.length, bestStreak = max(currentStreak) with first-by-list-order tiebreak (FR-015); render 4 stat cards using shadcn/ui Card with bg-[#F5F4F0]; show Skeleton placeholders while loading (FR-011); show zero values if no data; show error state with retry button if request fails (FR-016); grid layout: `grid-cols-2 md:grid-cols-4 gap-4`

**Checkpoint**: Dashboard shows greeting, date, and 4 stat cards with real data from API (or loading skeletons / zero states)

---

## Phase 4: User Story 2 — Today's Habits Checklist (Priority: P1)

**Goal**: User sees habits list with checkboxes and can toggle completion with optimistic updates

**Independent Test**: Create habits via backend → navigate to dashboard → check/uncheck habits → verify checkbox state, streak badges, and error toast on failure

### Implementation for User Story 2

- [ ] T013 [US2] Implement `useCompleteHabit` mutation hook in src/hooks/useHabits.ts — use `useMutation` wrapping `habitsApi.completeHabit(habitId)`; implement optimistic update in `onMutate`: snapshot habits query cache, update target habit's `completedToday` to true and `todayLogId` to a temporary value; on `onError`: restore snapshot from context, show toast via `toast.error('Failed to complete habit', {duration: 3000})`; on `onSettled`: invalidate `['habits']` query to refetch
- [ ] T014 [US2] Implement `useUncompleteHabit` mutation hook in src/hooks/useHabits.ts — use `useMutation` wrapping `habitsApi.uncompleteHabit(habitId, logId)`; implement optimistic update in `onMutate`: snapshot habits query cache, update target habit's `completedToday` to false and `todayLogId` to null; on `onError`: restore snapshot, show `toast.error('Failed to uncomplete habit', {duration: 3000})`; on `onSettled`: invalidate `['habits']` query
- [ ] T015 [US2] Build "Today's habits" card in src/pages/DashboardPage.tsx — left column card; header: "Today's habits" title + "View all" link (`<Link to="/habits">`); list habits from `useHabits`; per habit row: shadcn Checkbox with `aria-label="Mark {habitName} as complete/incomplete"` (FR-017), habit name, streak Badge (bg-[#FAEEDA] text-[#854F0B]) showing "{currentStreak} days"; on checkbox change: if checking → call `useCompleteHabit`, if unchecking → call `useUncompleteHabit(habitId, todayLogId)`; if `completedToday=true && todayLogId=null` → disable checkbox and `console.warn` (edge case); show Skeleton while loading; show empty state "No habits yet. Create your first habit to get started." if no habits; show error state with retry if request fails (FR-016)

**Checkpoint**: Habits card shows interactive checklist; completing/uncompleting updates checkbox and stat cards reactively

---

## Phase 5: User Story 3 — Active Goals Overview (Priority: P2)

**Goal**: User sees active goals with progress bars, milestones, and status badges

**Independent Test**: Create goals with milestones via backend → navigate to dashboard → verify goals card shows progress, badges, milestones

### Implementation for User Story 3

- [ ] T016 [US3] Build "Active goals" card in src/pages/DashboardPage.tsx — right column card; header: "Active goals" title + "View all" link (`<Link to="/goals">`); list up to 5 goals from `useGoalsSummary().activeGoals`; per goal row: goal name, shadcn Progress bar (fill #534AB7 for ACTIVE, #3B6D11 for COMPLETED) with `aria-valuenow={progress}` `aria-valuemin={0}` `aria-valuemax={100}` (FR-017), progress percentage text, deadline (formatted date or "No deadline" if targetDate null), status Badge (ACTIVE: bg-[#EEEDFE] text-[#3C3489], COMPLETED: bg-[#EAF3DE] text-[#27500A]); milestones: if goal.milestones.length > 0, show first 3 with completion indicator (checkmark or empty circle), hide section if 0 milestones; show Skeleton while loading; show empty state "No active goals. Set a goal to start tracking your progress." if no goals; show error state with retry if request fails (FR-016)

**Checkpoint**: Goals card shows up to 5 goals with progress bars, badges, milestones, and empty/error states

---

## Phase 6: User Story 4 — Create Habit Entry Point (Priority: P3)

**Goal**: "New habit" button opens a stub modal indicating feature is coming soon

**Independent Test**: Click "New habit" → verify stub modal opens with title/message → close modal

### Implementation for User Story 4

- [ ] T017 [US4] Build stub "Create habit" modal in src/pages/DashboardPage.tsx — add shadcn Dialog controlled by local `useState<boolean>`; trigger: "New habit" Button (Plus icon from Lucide) in top bar; dialog content: DialogHeader with DialogTitle "Create habit", DialogDescription "Full habit creation coming soon", DialogFooter with Close Button (calls `setOpen(false)`); no form fields this sprint (FR-003)

**Checkpoint**: "New habit" button opens and closes stub modal correctly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, responsive layout, and consistency checks

- [ ] T018 [P] Ensure two-column layout is responsive in src/pages/DashboardPage.tsx — stats row: `grid-cols-2 md:grid-cols-4`; habits + goals cards: `grid-cols-1 lg:grid-cols-2`; stack on mobile, side-by-side on desktop (FR-014)
- [ ] T019 [P] Verify accent color #534AB7 and all badge/progress bar colours match FR-013 canonical tokens across DashboardPage
- [ ] T020 Run `npx tsc -b` and `npx eslint .` — fix any TypeScript or lint errors across all new files
- [ ] T021 Walk through quickstart.md verification steps (10 steps) end-to-end to confirm all flows work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001, T002) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — hooks + stats first
- **US2 (Phase 4)**: Depends on US1 (shares useHabits hook and DashboardPage.tsx)
- **US3 (Phase 5)**: Depends on US1 (shares useGoalsSummary hook and DashboardPage.tsx), can overlap with US2 on different sections
- **US4 (Phase 6)**: Depends on US1 (top bar already built) — adds modal to existing button
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational)
        ├─► US1 (Stats Overview) ─► US2 (Habits Checklist) ─┐
        │                                                     ├─► Phase 7 (Polish)
        └─► US1 ─► US3 (Goals Overview) ─────────────────────┘
              └─► US4 (Stub Modal) ──────────────────────────┘
```

### Within Each User Story

- Types and API functions available from Foundational phase
- Query hooks before page components (hooks provide data for rendering)
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 2**: T003, T004, T005, T006 can run in parallel (different files)
- **Phase 3**: T008, T009 can run in parallel (different hook files); T010 depends on T009
- **Phase 7**: T018, T019 can run in parallel (different concerns in same file but non-overlapping)

---

## Parallel Example: Foundational Phase

```text
# These can all run in parallel (different files):
T003: "Define habit types in src/types/habits.ts"
T004: "Define goal types in src/types/goals.ts"
T005: "Create habits API functions in src/api/habits.ts"
T006: "Create goals API functions in src/api/goals.ts"

# Then sequentially:
T007: "Add Toaster component to src/App.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install deps, add shadcn components)
2. Complete Phase 2: Foundational (types, API functions, Toaster)
3. Complete Phase 3: User Story 1 (greeting, date, stat cards)
4. **STOP and VALIDATE**: Dashboard shows greeting + 4 stat cards with real data
5. Demo-ready: stats overview works independently

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Stats Overview) → Test independently → MVP
3. US2 (Habits Checklist) → Test independently → Interactive habit tracking
4. US3 (Goals Overview) → Test independently → Full dashboard
5. US4 (Stub Modal) → Test independently → Entry point for Sprint 3
6. Polish → Final validation

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- No test tasks generated — manual verification per quickstart.md
- All imports MUST use `@/` path alias (constitution constraint)
- All types MUST use `type` not `interface` (constitution constraint)
- All UI components MUST use shadcn/ui primitives (constitution constraint)
- Commit after each task or logical group using Conventional Commits format
- Deferred from checklist: pagination (use size=100), concurrent toggles (React Query native), responsive layout (T018), cache strategy (React Query defaults), progress clamping (defensive in T016)
