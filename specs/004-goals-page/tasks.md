# Tasks: Goals Page — Full Goal Management

**Input**: Design documents from `/specs/004-goals-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/goals-api.md, quickstart.md

**Tests**: Not requested — validation via `tsc -b && eslint .`

**Organization**: Tasks grouped by user story (7 stories: US1-US7). P1 stories (US1-US3) form the MVP.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Includes exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install missing shadcn/ui components, create feature branch

- [x] T001 Check and install shadcn/ui Select component if missing via `npx shadcn@latest add select` (per research.md R8)
- [x] T002 Create feature branch `004-goals-page` from main via `git checkout -b 004-goals-page`

**Checkpoint**: Branch ready, all required shadcn/ui components available

---

## Phase 2: Foundational (Types, API, Hooks)

**Purpose**: Extend existing Sprint 2 types, API functions, and hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Extend Goal type with `description`, `linkedHabitIds`, `createdAt` fields; rename `name` → `title` in Goal and Milestone types; add GoalDetail, CreateGoalRequest, UpdateGoalRequest, UpdateGoalProgressRequest, CreateMilestoneRequest, UpdateMilestoneRequest, LinkHabitRequest, GoalHabitLink types in `src/types/goals.ts`
- [x] T004 Add API functions to `src/api/goals.ts`: getGoalDetail(id), createGoal, updateGoal, deleteGoal, updateGoalProgress, addMilestone, updateMilestone, deleteMilestone, linkHabit, unlinkHabit — all via apiClient, matching contracts/goals-api.md
- [x] T005 Add hooks to `src/hooks/useGoals.ts`: useAllGoals (query key `['goals']`, size:100, no status filter), useGoalDetail(goalId) with `enabled: !!goalId`, useCreateGoal, useUpdateGoal, useDeleteGoal, useUpdateGoalProgress, useAddMilestone, useUpdateMilestone, useDeleteMilestone, useLinkHabit, useUnlinkHabit — all mutations invalidate `['goals']` prefix on success with toast notifications
- [x] T006 Add `/goals` route to `src/App.tsx` wrapped in ProtectedRoute, lazy-loading GoalsPage

**Checkpoint**: Foundation ready — types compile, API functions defined, hooks wired, route registered

---

## Phase 3: User Story 1 — View Goals and Track Progress (Priority: P1) 🎯 MVP

**Goal**: Master-detail layout with goals list and detail panel showing progress, milestones, linked habits

**Independent Test**: Navigate to /goals, see goal cards with progress/status, click a goal to see detail panel with all sections

### Implementation for User Story 1

- [x] T007 [P] [US1] Create GoalCard component in `src/components/goals/GoalCard.tsx` — displays title, progress % (purple active / green completed), progress bar, deadline or "No deadline", status badge (Active/Completed), footer with "N habits linked" and "N of M milestones done". Accepts `goal`, `isSelected`, `onClick` props. Uses Card from shadcn/ui. Selected state: `border-2 border-[#534AB7]`
- [x] T008 [P] [US1] Create GoalEmptyState component in `src/components/goals/GoalEmptyState.tsx` — two variants: (1) no goals: "No goals yet" with create button, (2) no selection: "Select a goal to view details" placeholder
- [x] T009 [P] [US1] Create GoalProgress component in `src/components/goals/GoalProgress.tsx` — large progress %, progress bar, number Input (0-100), "Update" Button. Calls useUpdateGoalProgress on button click only. On success toast + cache refresh. Constrain input to integer 0-100. Progress bar color: #534AB7 for ACTIVE, #3B6D11 for COMPLETED
- [x] T010 [P] [US1] Create GoalMilestones component in `src/components/goals/GoalMilestones.tsx` — ordered checklist with Checkbox per milestone (green indicator when completed). Add milestone: text Input + "Add" Button (prevent empty). Delete milestone: × Button per row. Uses useAddMilestone, useUpdateMilestone, useDeleteMilestone hooks
- [x] T011 [P] [US1] Create GoalLinkedHabits component in `src/components/goals/GoalLinkedHabits.tsx` — list of linked habits with name + streak badge (bg-[#FAEEDA] text-[#854F0B]). Unlink Button per row. Link dropdown (Select) showing only unlinked active habits + "Link" Button. Cross-references linkedHabitIds with useAllHabits() cache. Uses useLinkHabit, useUnlinkHabit hooks. Disable dropdown when all active habits linked
- [x] T012 [US1] Create GoalDetail component in `src/components/goals/GoalDetail.tsx` — assembles goal title, description, edit Button, delete Button, GoalProgress, GoalMilestones, GoalLinkedHabits. Uses useGoalDetail(goalId) hook. Shows skeleton placeholder while loading (per FR-005). Receives goalId prop + callbacks for onEdit, onDelete
- [x] T013 [US1] Create GoalsPage in `src/pages/GoalsPage.tsx` — master-detail layout. Left column: header ("Goals", "N active · M completed" subtitle including zero-count), "+ New goal" Button, goals list using GoalCard. Right panel: GoalDetail when selectedGoalId set, GoalEmptyState when null. Uses useAllGoals() for list. Local state: selectedGoalId (useState<string|null>), filter tab, modal states

**Checkpoint**: US1 complete — user can view goals list, select a goal, see full detail with progress/milestones/linked habits

---

## Phase 4: User Story 2 — Create and Edit Goals (Priority: P1)

**Goal**: Create new goals and edit existing ones via modal form

**Independent Test**: Click "+ New goal", fill form, submit, see new goal in list. Click edit on a goal, change title, save, see update

### Implementation for User Story 2

- [x] T014 [US2] Create GoalFormModal component in `src/components/goals/GoalFormModal.tsx` — React Hook Form + Zod. Fields: title (required, 1-200 chars), description (optional, Textarea), targetDate (optional, date Input). Edit mode adds status Select (Active/Completed). Zod schema validates title length. Uses useCreateGoal / useUpdateGoal hooks. mode prop: 'create' | 'edit'. Pre-fills values in edit mode. Submit disabled + spinner while isPending
- [x] T015 [US2] Wire GoalFormModal into GoalsPage in `src/pages/GoalsPage.tsx` — "+ New goal" Button opens modal in create mode. Edit Button in GoalDetail opens modal in edit mode with current goal data. On success: close modal, toast, list refreshes via cache invalidation

**Checkpoint**: US2 complete — user can create and edit goals with form validation

---

## Phase 5: User Story 3 — Update Goal Progress (Priority: P1)

**Goal**: Manually update progress, auto-complete at 100%

**Independent Test**: Select goal, enter new progress, click Update, see bar/percentage update. Set to 100, verify COMPLETED status

### Implementation for User Story 3

- [x] T016 [US3] Verify GoalProgress component handles progress update flow end-to-end in `src/components/goals/GoalProgress.tsx` — ensure server-confirmed status change at 100% (not optimistic), progress editable on COMPLETED goals but does NOT reactivate. Input constrained to integer 0-100 (no decimals, no non-numeric). Disable Update Button while mutation is in flight

**Checkpoint**: US3 complete — progress updates work with auto-complete at 100%

---

## Phase 6: User Story 4 — Manage Milestones (Priority: P2)

**Goal**: Add, toggle, delete milestones within a goal

**Independent Test**: Select goal, add milestone via input, toggle checkbox, delete via × button

### Implementation for User Story 4

- [x] T017 [US4] Verify GoalMilestones component handles full milestone CRUD in `src/components/goals/GoalMilestones.tsx` — confirm add clears input on success, toggle updates visual indicator (green dot/check for completed), delete removes from list, empty submit prevented, all mutations invalidate cache. SortOrder not sent by frontend (backend auto-assigns)

**Checkpoint**: US4 complete — milestones fully manageable within goals

---

## Phase 7: User Story 5 — Link and Unlink Habits (Priority: P2)

**Goal**: Connect habits to goals, see streak badges, link/unlink

**Independent Test**: Select goal, link a habit from dropdown, see it with streak, unlink it

### Implementation for User Story 5

- [x] T018 [US5] Verify GoalLinkedHabits component handles full habit link/unlink flow in `src/components/goals/GoalLinkedHabits.tsx` — confirm dropdown excludes already-linked habits, dropdown shows only active habits, "All habits linked" state when none available, streak badge displays correctly, unlink removes from list and habit reappears in dropdown. Handle cold habits cache (useAllHabits triggers fetch if not cached)

**Checkpoint**: US5 complete — habits can be linked/unlinked with proper filtering

---

## Phase 8: User Story 6 — Filter Goals (Priority: P2)

**Goal**: Client-side filter tabs (All / Active / Completed)

**Independent Test**: Switch between tabs, verify only matching goals shown, detail clears when selected goal filtered out

### Implementation for User Story 6

- [x] T019 [P] [US6] Create GoalFilters component in `src/components/goals/GoalFilters.tsx` — three tabs: All / Active / Completed. Active tab: bg-[#EEEDFE] text-[#3C3489] border border-[#AFA9EC]. Inactive tab: bg-transparent text-[#666360] border border-[#E8E6DF]. Rounded-full pills. Accepts activeFilter and onFilterChange props
- [x] T020 [US6] Wire GoalFilters into GoalsPage in `src/pages/GoalsPage.tsx` — add filterTab state ('ALL' | 'ACTIVE' | 'COMPLETED', default 'ALL'). Filter pipeline: allGoals → filterByTab → render list. When selected goal disappears from filtered list, clear selectedGoalId (FR-018)

**Checkpoint**: US6 complete — filter tabs work with proper detail panel clearing

---

## Phase 9: User Story 7 — Delete a Goal (Priority: P2)

**Goal**: Permanently delete goals with confirmation dialog

**Independent Test**: Select goal, click delete, confirm in dialog, verify goal removed and detail clears

### Implementation for User Story 7

- [x] T021 [US7] Create GoalDeleteDialog component in `src/components/goals/GoalDeleteDialog.tsx` — AlertDialog with goal title in description, "This action cannot be undone" warning. Cancel and Delete buttons. Delete button: bg-red-500 text-white. Uses useDeleteGoal hook. On success: close dialog, toast, clear selectedGoalId
- [x] T022 [US7] Wire GoalDeleteDialog into GoalsPage in `src/pages/GoalsPage.tsx` — delete Button in GoalDetail triggers dialog. On confirm: goal removed, detail panel clears to placeholder

**Checkpoint**: US7 complete — goals can be permanently deleted with confirmation

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Field name migration in existing code, validation, cleanup

- [x] T023 Rename `name` → `title` in existing Goal and Milestone references across `src/types/goals.ts` (Sprint 2 code), `src/hooks/useGoals.ts`, `src/api/goals.ts`, and any Dashboard components that reference goal.name or milestone.name
- [x] T024 Update DashboardPage goal references in `src/pages/DashboardPage.tsx` — change goal.name → goal.title and milestone.name → milestone.title (same pattern as Sprint 3 habit.name → habit.title fix)
- [x] T025 Run `tsc -b` to verify zero TypeScript errors across entire project
- [x] T026 Run `npx eslint .` to verify zero lint errors
- [ ] T027 Run quickstart.md validation — manually walk through all 11 verification sections in `specs/004-goals-page/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — creates all core components
- **US2 (Phase 4)**: Depends on US1 (GoalsPage exists to wire modal into)
- **US3 (Phase 5)**: Depends on US1 (GoalProgress component exists)
- **US4 (Phase 6)**: Depends on US1 (GoalMilestones component exists)
- **US5 (Phase 7)**: Depends on US1 (GoalLinkedHabits component exists)
- **US6 (Phase 8)**: Depends on US1 (GoalsPage list rendering exists)
- **US7 (Phase 9)**: Depends on US1 (GoalDetail with delete button exists)
- **Polish (Phase 10)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Foundation → builds all core components. MUST complete first.
- **US2 (P1)**: Depends on US1 (needs GoalsPage to wire modal). Can run after US1.
- **US3 (P1)**: Depends on US1 (GoalProgress created in US1). Verification task only.
- **US4 (P2)**: Depends on US1 (GoalMilestones created in US1). Verification task only.
- **US5 (P2)**: Depends on US1 (GoalLinkedHabits created in US1). Verification task only.
- **US6 (P2)**: Depends on US1 (GoalsPage list exists). GoalFilters is parallel.
- **US7 (P2)**: Depends on US1 (GoalDetail exists). GoalDeleteDialog is parallel.

### Within User Story 1

- T007, T008, T009, T010, T011 are [P] — all create independent component files
- T012 depends on T009, T010, T011 (assembles sub-components)
- T013 depends on T007, T008, T012 (assembles page)

### Parallel Opportunities

- **Phase 2**: T003, T004, T005 touch different files — could be parallel but have logical dependencies (types → API → hooks)
- **Phase 3**: T007–T011 are fully parallel (5 independent component files)
- **Phase 8**: T019 (GoalFilters) can run parallel with US7's T021 (GoalDeleteDialog)

---

## Parallel Example: User Story 1

```bash
# Launch all independent components together:
Task: "GoalCard component in src/components/goals/GoalCard.tsx"          # T007
Task: "GoalEmptyState component in src/components/goals/GoalEmptyState.tsx"  # T008
Task: "GoalProgress component in src/components/goals/GoalProgress.tsx"  # T009
Task: "GoalMilestones component in src/components/goals/GoalMilestones.tsx"  # T010
Task: "GoalLinkedHabits component in src/components/goals/GoalLinkedHabits.tsx"  # T011

# Then sequentially:
Task: "GoalDetail assembles sub-components"  # T012 (depends on T009-T011)
Task: "GoalsPage assembles everything"       # T013 (depends on T007-T012)
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (types, API, hooks, route)
3. Complete Phase 3: US1 — View goals with master-detail layout
4. Complete Phase 4: US2 — Create/edit goals via modal
5. Complete Phase 5: US3 — Progress update verification
6. **STOP and VALIDATE**: Core goal management works end-to-end

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Master-detail layout with all sections (MVP core)
3. US2 → Create/edit modals (MVP complete)
4. US3 → Progress update verified (MVP validated)
5. US4 → Milestone management verified
6. US5 → Habit linking verified
7. US6 → Filter tabs added
8. US7 → Delete with confirmation added
9. Polish → Field migration, type check, lint, quickstart validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US3-US5 are verification tasks — components are built in US1 but need end-to-end verification
- Goal.name → Goal.title migration (T023-T024) is deferred to Polish phase to avoid breaking existing Sprint 2 code mid-implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Deferred checklist items (CHK002-CHK005, CHK007-CHK009, CHK012-CHK013, CHK015-CHK030) are addressed as implementation notes within relevant tasks
