# Tasks: Habits Page — Full Habit Management

**Input**: Design documents from `/specs/003-habits-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/habits-api.md

**Tests**: No test framework configured — tests not included. Validation via `tsc -b && eslint .`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Install missing shadcn/ui components and create directory structure

- [x] T001 Install shadcn/ui alert-dialog component via `npx shadcn@latest add alert-dialog` into src/components/ui/alert-dialog.tsx
- [x] T002 [P] Install shadcn/ui textarea component via `npx shadcn@latest add textarea` into src/components/ui/textarea.tsx
- [x] T003 Create directory src/components/habits/ for feature-specific components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, API functions, and hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Extend Habit type and add new types (DayOfWeek, CreateHabitRequest, UpdateHabitRequest) in src/types/habits.ts — add fields: description (string | null), targetDaysOfWeek (DayOfWeek[] | null), reminderTime (string | null), isActive (boolean). Keep existing fields unchanged. DayOfWeek = 'MONDAY' | 'TUESDAY' | ... | 'SUNDAY'. CreateHabitRequest: name (required), description?, frequency, targetDaysOfWeek? (required for CUSTOM, omit for DAILY/WEEKLY), reminderTime?. UpdateHabitRequest: all fields optional + isActive? for archive/restore.
- [x] T005 Add createHabit, updateHabit, deleteHabit functions to src/api/habits.ts — createHabit: POST /habits with CreateHabitRequest body, returns Habit. updateHabit: PATCH /habits/{id} with UpdateHabitRequest body, returns Habit. deleteHabit: DELETE /habits/{id}, returns void.
- [x] T006 Add useAllHabits hook in src/hooks/useHabits.ts — query key ['habits'] (no status filter), calls habitsApi.getHabits({ size: 100 }), returns all active + archived habits. Keep existing useHabits() hook unchanged (Dashboard still uses it).
- [x] T007 Add /habits route to src/App.tsx — import HabitsPage from @/pages/HabitsPage, add `<Route path="/habits" element={<HabitsPage />} />` inside the ProtectedRoute + Layout wrapper, matching the existing /dashboard route pattern.

**Checkpoint**: Foundation ready — types, API layer, data hook, and routing in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — View and Track Habits (Priority: P1) 🎯 MVP

**Goal**: Display all habits organized into Active/Archived sections with completion toggling via checkbox

**Independent Test**: Navigate to /habits → see habit list with sections and counts → toggle checkboxes → verify optimistic updates

### Implementation for User Story 1

- [x] T008 [US1] Create HabitEmptyState component in src/components/habits/HabitEmptyState.tsx — displays a centered message encouraging the user to create their first habit when the habit list is empty. Use shadcn/ui Card, Button (links to create action), and Lucide icon. Accept an optional variant prop for "no results" (search/filter empty) vs "no habits" (zero habits).
- [x] T009 [US1] Create HabitCard component in src/components/habits/HabitCard.tsx — renders a single habit row as a shadcn/ui Card with: Checkbox (disabled if archived, checked if completedToday), habit name (line-through + muted text if completedToday), frequency pill Badge (DAILY/WEEKLY/CUSTOM), status text ("Completed today" / "Not done yet"), streak badge with fire emoji (hidden if currentStreak === 0), edit Button (icon), archive/restore Button (icon), delete Button (icon, shown only if !isActive). Accept props: habit (Habit), onComplete, onUncomplete, onEdit, onArchive, onRestore, onDelete. Apply design tokens: archived row opacity-60 bg-[#F5F4F0], streak badge bg-[#FAEEDA] text-[#854F0B].
- [x] T010 [US1] Update useCompleteHabit and useUncompleteHabit in src/hooks/useHabits.ts — extend onMutate to also optimistically update the ['habits'] query cache (in addition to existing ['habits', { status: 'ACTIVE' }] cache). Extend onError rollback to restore both caches. The existing onSettled invalidateQueries({ queryKey: ['habits'] }) already covers both as prefix match — no change needed there.
- [x] T011 [US1] Create HabitsPage in src/pages/HabitsPage.tsx — page header: title "Habits", subtitle "N active · M archived" computed from useAllHabits data split by isActive. "+ New habit" Button with Plus icon (wire to modal in US2, stub as no-op for now). Section headers: "ACTIVE — N" (uppercase, text-[11px] tracking-wider text-[#9E9B94]), "ARCHIVED — M" (hidden if count is 0). Map habits to HabitCard components. Wire onComplete/onUncomplete to existing useCompleteHabit/useUncompleteHabit hooks. Show HabitEmptyState when zero habits. Show loading skeleton while data is loading.

**Checkpoint**: At this point, navigating to /habits shows the full habit list with sections, counts, completion toggling, and optimistic updates. The page is fully functional for viewing and daily tracking.

---

## Phase 4: User Story 2 — Create a New Habit (Priority: P1)

**Goal**: Users can create new habits via a modal form with validation

**Independent Test**: Click "+ New habit" → fill form → submit → see new habit in active section with success toast

### Implementation for User Story 2

- [x] T012 [US2] Add useCreateHabit hook in src/hooks/useHabits.ts — useMutation wrapping habitsApi.createHabit. onSuccess: invalidate ['habits'] queries, show toast.success("Habit created"). onError: show toast.error("Failed to create habit").
- [x] T013 [US2] Create HabitFormModal component in src/components/habits/HabitFormModal.tsx — shadcn/ui Dialog with React Hook Form + Zod validation. Fields: name Input (required, 1–200 chars, Zod z.string().min(1).max(200)), description Textarea (optional), frequency segmented control using three Buttons or Tabs (DAILY/WEEKLY/CUSTOM), targetDaysOfWeek checkboxes (7 day checkboxes, visible only when frequency=CUSTOM, Zod refinement: required min 1 when CUSTOM), reminderTime time Input (optional, HH:mm pattern). Props: open (boolean), onOpenChange, mode ('create' | 'edit'), habit? (Habit for edit pre-fill), onSubmit (form data). On submit in create mode: call useCreateHabit, close modal on success. Strip targetDaysOfWeek from payload when frequency is DAILY or WEEKLY.
- [x] T014 [US2] Wire "+ New habit" button in src/pages/HabitsPage.tsx — add useState for createModalOpen, pass to HabitFormModal with mode="create". On modal success callback: modal closes itself via onOpenChange(false).

**Checkpoint**: Users can now create habits. Combined with US1, this is a complete MVP — users can create habits and track daily completion.

---

## Phase 5: User Story 3 — Edit an Existing Habit (Priority: P2)

**Goal**: Users can edit any habit (active or archived) via a pre-filled modal

**Independent Test**: Click edit button on a habit → see pre-filled form → change name → save → see updated name in list

### Implementation for User Story 3

- [x] T015 [US3] Add useUpdateHabit hook in src/hooks/useHabits.ts — useMutation wrapping habitsApi.updateHabit (accepts { id: string, data: UpdateHabitRequest }). onSuccess: invalidate ['habits'] queries, show toast.success("Habit updated"). onError: show toast.error("Failed to update habit").
- [x] T016 [US3] Wire edit button in src/pages/HabitsPage.tsx — add useState for editingHabit (Habit | null). When HabitCard onEdit fires, set editingHabit. Render HabitFormModal with mode="edit", habit={editingHabit}, open={editingHabit !== null}. On submit in edit mode: call useUpdateHabit with habit id + form data. On success/close: set editingHabit to null.

**Checkpoint**: Users can edit any habit. The HabitFormModal from US2 is reused in edit mode with pre-filled values.

---

## Phase 6: User Story 4 — Filter and Search Habits (Priority: P2)

**Goal**: Users can filter by status tab and search by name, with AND logic and persistent search

**Independent Test**: Switch between All/Active/Archived tabs → type in search → verify combined filtering works → switch tab → search persists

### Implementation for User Story 4

- [x] T017 [US4] Create HabitFilters component in src/components/habits/HabitFilters.tsx — row containing: filter tabs (All / Active / Archived) using shadcn/ui Tabs component with custom styling (active tab: bg-[#EEEDFE] text-[#3C3489] border border-[#AFA9EC]), and a search Input with search icon (Lucide Search). Props: activeFilter ('ALL' | 'ACTIVE' | 'ARCHIVED'), onFilterChange, searchQuery (string), onSearchChange. Search input uses controlled value.
- [x] T018 [US4] Add client-side filtering logic in src/pages/HabitsPage.tsx — add useState for filterTab (default 'ALL') and searchQuery (default ''). Add useMemo that takes all habits from useAllHabits and applies: 1) filter by isActive based on tab (ALL=no filter, ACTIVE=isActive true, ARCHIVED=isActive false), 2) filter by searchQuery (case-insensitive name.toLowerCase().includes()). Render HabitFilters between header and habit list. Pass filtered lists to section rendering. Show HabitEmptyState variant="no-results" when filters produce empty results but habits exist.

**Checkpoint**: Users can filter and search their habits. Search persists across tab switches. Empty state shown when no results match.

---

## Phase 7: User Story 5 — Archive, Restore, and Delete Habits (Priority: P2)

**Goal**: Users can archive active habits, restore archived habits, and permanently delete archived habits with confirmation

**Independent Test**: Archive a habit → verify it moves to archived section → restore it → verify it returns → delete an archived habit → confirm → verify removal

### Implementation for User Story 5

- [x] T019 [US5] Add useDeleteHabit hook in src/hooks/useHabits.ts — useMutation wrapping habitsApi.deleteHabit (accepts habitId string). onSuccess: invalidate ['habits'] queries, show toast.success("Habit deleted"). onError: show toast.error("Failed to delete habit").
- [x] T020 [US5] Create HabitDeleteDialog component in src/components/habits/HabitDeleteDialog.tsx — shadcn/ui AlertDialog with title "Delete habit", description "This action cannot be undone. This will permanently delete the habit and all its data." AlertDialogAction (destructive variant) and AlertDialogCancel buttons. Props: open (boolean), onOpenChange, habitName (string), onConfirm callback.
- [x] T021 [US5] Wire archive, restore, and delete actions in src/pages/HabitsPage.tsx — Archive: on HabitCard onArchive, call useUpdateHabit with { id, data: { isActive: false } }, toast success "Habit archived". Restore: on HabitCard onRestore, call useUpdateHabit with { id, data: { isActive: true } }, toast success "Habit restored". Delete: add useState for deletingHabit (Habit | null), on HabitCard onDelete set it, render HabitDeleteDialog, on confirm call useDeleteHabit, on close/success reset deletingHabit to null. Subtitle counts update automatically via query invalidation.

**Checkpoint**: Full habit lifecycle is now complete. Users can create, track, edit, archive, restore, and delete habits.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T022 [P] Verify all design tokens are applied correctly across components — streak badge (bg-[#FAEEDA] text-[#854F0B]), archived rows (opacity-60 bg-[#F5F4F0]), archived pill (bg-[#F1EFE8] text-[#5F5E5A]), filter tabs (active: bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]), section headers (text-[11px] uppercase tracking-wider text-[#9E9B94])
- [x] T023 [P] Run build validation: `tsc -b && eslint .` — fix any TypeScript errors or lint warnings. Ensure zero errors.
- [x] T024 Run quickstart.md verification checklist — navigate to /habits, create a habit, toggle completion, edit, archive, restore, delete, filter, search. Confirm all flows work end-to-end.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
  - US1 (P1): No dependencies on other stories
  - US2 (P1): Depends on US1 (needs HabitsPage to wire the button)
  - US3 (P2): Depends on US2 (reuses HabitFormModal in edit mode)
  - US4 (P2): Depends on US1 (adds filtering to existing HabitsPage)
  - US5 (P2): Depends on US1 + US3 (uses useUpdateHabit from US3 for archive/restore)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational
    ↓
Phase 3: US1 — View & Track (P1) 🎯 MVP
    ↓         ↘
Phase 4: US2 — Create (P1)    Phase 6: US4 — Filter & Search (P2)
    ↓
Phase 5: US3 — Edit (P2)
    ↓
Phase 7: US5 — Archive/Restore/Delete (P2)
    ↓
Phase 8: Polish
```

### Within Each User Story

- Types and API before hooks
- Hooks before components
- Components before page integration
- Core implementation before wiring

### Parallel Opportunities

- T001 and T002 (shadcn installs) can run in parallel
- T004 and T005 (types and API) can run in parallel (different files)
- T008 and T009 (EmptyState and Card components) can run in parallel
- T022 and T023 (design tokens and build validation) can run in parallel
- US4 (Filter & Search) can run in parallel with US2 (Create) after US1 is complete

---

## Parallel Example: Phase 2 Foundation

```
# These can run in parallel (different files):
T004: "Extend types in src/types/habits.ts"
T005: "Add API functions in src/api/habits.ts"

# Then sequentially:
T006: "Add useAllHabits hook in src/hooks/useHabits.ts" (depends on T004, T005)
T007: "Add /habits route in src/App.tsx" (depends on HabitsPage existing)
```

## Parallel Example: User Story 1

```
# These can run in parallel (different files):
T008: "Create HabitEmptyState in src/components/habits/HabitEmptyState.tsx"
T009: "Create HabitCard in src/components/habits/HabitCard.tsx"

# Then sequentially:
T010: "Update optimistic hooks in src/hooks/useHabits.ts"
T011: "Create HabitsPage in src/pages/HabitsPage.tsx" (depends on T008, T009, T010)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (install shadcn components)
2. Complete Phase 2: Foundational (types, API, hooks, route)
3. Complete Phase 3: US1 — View & Track Habits
4. **STOP and VALIDATE**: Navigate to /habits, verify list renders, toggle checkboxes
5. Complete Phase 4: US2 — Create a New Habit
6. **STOP and VALIDATE**: Create a habit, verify it appears in the active section
7. Deploy/demo if ready — users can create and track habits daily

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → View & track habits → Validate
3. US2 → Create habits → Validate (MVP complete!)
4. US3 → Edit habits → Validate
5. US4 → Filter & search → Validate
6. US5 → Archive/restore/delete → Validate (full feature complete!)
7. Polish → Design tokens, build check, E2E walkthrough

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks generated (no test framework configured)
- Design tokens from approved mockup are applied in component tasks and verified in Polish phase
