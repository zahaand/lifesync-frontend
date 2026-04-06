# Tasks: Polish — Mobile Adaptation + Tech Debt

**Input**: Design documents from `/specs/006-polish-mobile-techdebt/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in all descriptions

---

## Phase 1: Setup

**Purpose**: Install new shadcn components and create shared utilities

- [ ] T001 Install shadcn Sheet component: run `npx shadcn@latest add sheet` — creates src/components/ui/sheet.tsx
- [ ] T002 Install shadcn DropdownMenu component: run `npx shadcn@latest add dropdown-menu` — creates src/components/ui/dropdown-menu.tsx
- [ ] T003 [P] Create `useIsMobile` hook in src/hooks/useMobile.ts — returns `{ isMobile: boolean, isTablet: boolean }` using `window.matchMedia` for breakpoints (< 768px mobile, 768–1023px tablet) per research.md R-005

**Checkpoint**: Sheet, DropdownMenu components and useIsMobile hook available for all stories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API layer, types, and React Query hook for habit logs — required by US2 and US5

**⚠️ CRITICAL**: US2 (History Drawer) cannot begin until this phase is complete

- [ ] T004 [P] Add `HabitLogPageResponse` type to src/types/habits.ts — fields: `content: HabitLog[]`, `totalElements: number`, `totalPages: number`, `number: number`, `size: number` per data-model.md
- [ ] T005 [P] Add `getHabitLogs` function to src/api/habits.ts — `GET /habits/${habitId}/logs` with params `{ page?: number, size?: number }`, returns `HabitLogPageResponse` per contracts/habit-logs-api.md
- [ ] T006 Add `useHabitLogs(habitId: string)` hook to src/hooks/useHabits.ts — use `useInfiniteQuery` with query key `['habits', habitId, 'logs']`, `getNextPageParam` from response `number < totalPages - 1`, invalidate on `completeHabit`/`uncompleteHabit` mutations per research.md R-003

**Checkpoint**: API layer and data-fetching hook ready for history drawer implementation

---

## Phase 3: User Story 1 — Mobile Navigation (Priority: P1) 🎯 MVP

**Goal**: Responsive sidebar — hamburger overlay on mobile, icon-only on tablet, unchanged on desktop

**Independent Test**: Resize browser to < 768px: sidebar hidden, hamburger button top-left opens Sheet overlay from left. Resize to 768–1024px: sidebar collapses to icon-only (w-16). Above 1024px: unchanged (w-64).

### Implementation for User Story 1

- [ ] T007 [US1] Refactor src/components/shared/Layout.tsx — implement three-mode responsive sidebar:
  - Import `Sheet`, `SheetContent`, `SheetTrigger` from src/components/ui/sheet, `Menu` icon from lucide-react, and `useIsMobile` from src/hooks/useMobile
  - Mobile (< 768px): Hide `<aside>`, add header bar with hamburger `<Button>` (Menu icon) in top-left, open sidebar content inside `<Sheet side="left">`; close on NavLink click via `onOpenChange`
  - Tablet (768–1024px): Render `<aside>` with `w-16` instead of `w-64`, hide nav labels (show icons only), hide user info section
  - Desktop (> 1024px): Keep existing `w-64` sidebar unchanged
  - Add `sidebarOpen` state (boolean) for mobile Sheet control
  - Main content: On mobile add top padding to account for header bar; on tablet adjust left margin for w-16 sidebar
- [ ] T008 [US1] Update sidebar NavLink rendering in src/components/shared/Layout.tsx — conditionally render `{item.label}` only when `!isTablet` (desktop mode); on tablet, wrap icon in a `title` attribute or Tooltip for accessibility per research.md R-001
- [ ] T009 [US1] Update sidebar user info section in src/components/shared/Layout.tsx — hide displayName/email block and show only LogOut icon button on tablet; on mobile, show full user info inside Sheet content

**Checkpoint**: Mobile navigation fully functional — users can navigate all pages on any viewport width

---

## Phase 4: User Story 2 — Habit Completion History Drawer (Priority: P1)

**Goal**: Side panel drawer showing paginated habit completion logs triggered by "History" button

**Independent Test**: Navigate to Habits page, click "History" button on any habit card — Sheet opens from right with log entries (date + time), "Load more" pagination works, empty state shows for habits with no history.

### Implementation for User Story 2

- [ ] T010 [US2] Create HabitHistoryDrawer component in src/components/habits/HabitHistoryDrawer.tsx:
  - Props: `habitId: string | null`, `open: boolean`, `onOpenChange: (open: boolean) => void`
  - Use `Sheet` (side="right") from src/components/ui/sheet
  - Use `useHabitLogs(habitId)` hook from src/hooks/useHabits.ts
  - Loading state: render `Skeleton` placeholder rows (3–5 rows) per FR-005
  - Error state: render error message with `Button` (Retry) that calls `refetch()` per FR-005
  - Empty state: render "No completions yet" message per FR-007
  - Log entries: display each as "MMM D, YYYY at HH:mm" using `toLocaleDateString`/`toLocaleTimeString` with `en-US` locale per research.md R-006
  - "Load more" `Button` at bottom: calls `fetchNextPage()`, disabled while `isFetchingNextPage` is true per FR-006/FR-014; hidden when `!hasNextPage`
  - Header: show habit title and close button
- [ ] T011 [US2] Add "History" button to HabitCard in src/components/habits/HabitCard.tsx:
  - Add `onHistory: (habitId: string) => void` callback prop
  - Add `History` icon button (Clock icon from lucide-react) to the action buttons area (desktop view)
  - Button calls `onHistory(habit.id)` on click
  - This button will also appear in the mobile DropdownMenu (handled in US5)
- [ ] T012 [US2] Integrate HabitHistoryDrawer in src/pages/HabitsPage.tsx:
  - Add `historyDrawerOpen` (boolean) and `historyHabitId` (string | null) state
  - Pass `onHistory` callback to each `HabitCard` that sets `historyHabitId` and opens drawer
  - Render `<HabitHistoryDrawer habitId={historyHabitId} open={historyDrawerOpen} onOpenChange={setHistoryDrawerOpen} />`

**Checkpoint**: Habit history drawer fully functional — users can view paginated completion logs for any habit

---

## Phase 5: User Story 3 — Dashboard Responsive Layout (Priority: P2)

**Goal**: Dashboard stats row and card columns reflow for mobile/tablet viewports

**Independent Test**: Open Dashboard at < 768px: stats row shows 2-column grid, cards stack to single column. At 768–1024px: layout adjusts proportionally. At > 1024px: unchanged.

### Implementation for User Story 3

- [ ] T013 [US3] Update stats row grid in src/pages/DashboardPage.tsx (StatsRow component) — the existing class `grid grid-cols-2 gap-3 md:grid-cols-4` already implements mobile-first 2-col → 4-col. Verify this is correct and adjust gap/padding if needed for mobile comfort (min 44px tap targets per SC-007)
- [ ] T014 [US3] Update two-column card grid in src/pages/DashboardPage.tsx (DashboardPage component) — the existing class `grid grid-cols-1 gap-5 lg:grid-cols-2` already stacks on mobile. Verify correctness, adjust padding for mobile: ensure p-4 on mobile vs p-6 on desktop for main content area
- [ ] T015 [US3] Adjust top bar layout in src/pages/DashboardPage.tsx — ensure greeting text and "New habit" button wrap gracefully on narrow screens (flex-wrap or stack vertically on mobile)

**Checkpoint**: Dashboard readable and usable on all viewport sizes

---

## Phase 6: User Story 4 — Goals Page Mobile Layout (Priority: P2)

**Goal**: Single-column list/detail toggle on mobile with back button and auto-return on delete

**Independent Test**: Open Goals at < 768px: only goal list shown. Tap a goal → full-screen detail with back button (← + "Back"). Tap back → returns to list. Delete goal → auto-returns to list. Tablet/desktop: existing grid layout preserved.

### Implementation for User Story 4

- [ ] T016 [US4] Refactor src/pages/GoalsPage.tsx for mobile list/detail toggle:
  - Import `useIsMobile` from src/hooks/useMobile.ts and `ArrowLeft` from lucide-react
  - On mobile (isMobile=true): conditionally render either the goals list OR the GoalDetail based on `effectiveSelectedId`
    - When `effectiveSelectedId` is null: show goals list full-width
    - When `effectiveSelectedId` is set: show GoalDetail full-screen
  - On tablet/desktop: keep existing `grid grid-cols-[380px_1fr]` layout unchanged
  - Remove `h-[calc(100vh-0px)]` on mobile — use `min-h-0` or auto height
- [ ] T017 [US4] Add back button to GoalDetail view on mobile in src/pages/GoalsPage.tsx:
  - When `isMobile` and `effectiveSelectedId` is set, render a back button above GoalDetail: `<Button variant="ghost">` with `<ArrowLeft />` icon and "Back" text label
  - Back button calls `setSelectedGoalId(null)` to return to list
- [ ] T018 [US4] Ensure auto-return to list on goal deletion in src/pages/GoalsPage.tsx — verify `handleDeleted` already calls `setSelectedGoalId(null)` (it does) — no code change needed if logic is correct, but confirm behavior on mobile viewport

**Checkpoint**: Goals page fully navigable on mobile — list → detail → back flow works

---

## Phase 7: User Story 5 — Habits Page Mobile Adjustments (Priority: P3)

**Goal**: Filter tabs horizontal scroll, HabitCard action buttons in DropdownMenu on mobile, spacing adjustments

**Independent Test**: Open Habits at < 768px: filter tabs scroll horizontally if overflowing. HabitCard shows "..." button that opens dropdown with Edit/Archive/Delete/History actions. Padding/spacing comfortable for touch.

### Implementation for User Story 5

- [ ] T019 [US5] Update filter tabs in src/components/habits/HabitFilters.tsx — wrap tab container in `overflow-x-auto flex-nowrap` with `scrollbar-hide` (or `-webkit-overflow-scrolling: touch`) to enable horizontal scroll on mobile per FR-011
- [ ] T020 [US5] Refactor HabitCard action buttons in src/components/habits/HabitCard.tsx for mobile:
  - Import `useIsMobile` from src/hooks/useMobile.ts
  - Import `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger` from src/components/ui/dropdown-menu and `MoreHorizontal` icon from lucide-react
  - On mobile: replace individual icon buttons with a single `MoreHorizontal` ("...") icon `Button` triggering a `DropdownMenu` containing items: Edit, Archive/Restore, Delete (if archived), History
  - On desktop: keep existing inline icon buttons and add History (Clock) button from T011
  - Each DropdownMenuItem calls the same handlers as the inline buttons per FR-012
- [ ] T021 [US5] Adjust spacing/padding in src/pages/HabitsPage.tsx — add mobile-appropriate padding: `px-4 md:px-6` on the page container, ensure minimum 44px tap target areas on interactive elements per SC-007

**Checkpoint**: Habits page polished for mobile touch interaction

---

## Phase 8: User Story 6 — Profile Page Mobile Adjustments (Priority: P3)

**Goal**: Profile page padding adjustments for comfortable mobile reading

**Independent Test**: Open Profile at < 768px: layout has comfortable padding, stats card remains 2-column, all content readable.

### Implementation for User Story 6

- [ ] T022 [US6] Adjust padding in src/pages/ProfilePage.tsx — update container class: add `px-4 md:px-0` for mobile side padding, verify `max-w-[680px]` works well on narrow screens (may need to be full-width on mobile with `max-w-full md:max-w-[680px]`)
- [ ] T023 [US6] Verify stats card grid in src/components/profile/StatsCard.tsx (or equivalent) — confirm 2-column grid is preserved on mobile per spec, adjust gap and padding for touch comfort if needed

**Checkpoint**: Profile page comfortable on mobile devices

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all viewports and code quality

- [ ] T024 [P] Run `npx tsc -b` — fix any TypeScript errors across all modified files
- [ ] T025 [P] Run `npx eslint .` — fix any lint warnings across all modified files
- [ ] T026 Cross-viewport regression test: manually verify all 5 pages at 320px, 375px, 768px, 1024px, 1440px widths per quickstart.md — confirm no horizontal overflow, no broken layouts, no desktop regressions (SC-001, SC-006)
- [ ] T027 Verify all interactive elements have minimum 44x44px tap targets on mobile (SC-007) — spot-check buttons, checkboxes, navigation links across all pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: T004–T005 can run in parallel; T006 depends on T004+T005
- **US1 (Phase 3)**: Depends on T001 (Sheet) + T003 (useIsMobile) — can start after Phase 1
- **US2 (Phase 4)**: Depends on T001 (Sheet) + T006 (useHabitLogs) — can start after Phase 2
- **US3 (Phase 5)**: No dependencies on other phases — can start after Phase 1
- **US4 (Phase 6)**: Depends on T003 (useIsMobile) — can start after Phase 1
- **US5 (Phase 7)**: Depends on T002 (DropdownMenu) + T003 (useIsMobile) + T011 (History button from US2)
- **US6 (Phase 8)**: No dependencies — can start after Phase 1
- **Polish (Phase 9)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (Mobile Nav)**: Independent — no cross-story dependencies
- **US2 (History Drawer)**: Independent — needs Foundational phase only
- **US3 (Dashboard)**: Independent — mostly verification of existing responsive classes
- **US4 (Goals Mobile)**: Independent — uses useIsMobile from Setup
- **US5 (Habits Adjustments)**: Depends on US2 T011 (History button on HabitCard) for DropdownMenu integration
- **US6 (Profile)**: Independent — isolated padding changes

### Parallel Opportunities

**After Phase 1 completes, these can run in parallel:**
- US1 (Mobile Nav) + US3 (Dashboard) + US4 (Goals Mobile) + US6 (Profile)

**After Phase 2 completes:**
- US2 (History Drawer) can start

**After US2 T011 completes:**
- US5 (Habits Adjustments) can start

---

## Parallel Example: Phase 1 + Phase 2

```
# All three can run simultaneously:
Task T001: Install shadcn Sheet
Task T002: Install shadcn DropdownMenu
Task T003: Create useIsMobile hook in src/hooks/useMobile.ts

# Then in Phase 2, two can run simultaneously:
Task T004: Add HabitLogPageResponse type in src/types/habits.ts
Task T005: Add getHabitLogs function in src/api/habits.ts

# Then sequentially:
Task T006: Add useHabitLogs hook in src/hooks/useHabits.ts (needs T004+T005)
```

## Parallel Example: User Stories after Foundational

```
# These four stories can run in parallel (different page files):
Task T007-T009: US1 — Layout.tsx
Task T013-T015: US3 — DashboardPage.tsx
Task T016-T018: US4 — GoalsPage.tsx
Task T022-T023: US6 — ProfilePage.tsx

# US2 can run in parallel with the above (different files):
Task T010: HabitHistoryDrawer.tsx (new file)
Task T011: HabitCard.tsx
Task T012: HabitsPage.tsx
```

---

## Implementation Strategy

### MVP First (US1 + US2 — both P1)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T006)
3. Complete Phase 3: US1 — Mobile Navigation (T007–T009)
4. Complete Phase 4: US2 — History Drawer (T010–T012)
5. **STOP and VALIDATE**: Navigate all pages on mobile, test history drawer
6. This delivers core mobile navigation + the only new feature

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 (Mobile Nav) → mobile-navigable app (MVP!)
3. US2 (History Drawer) → new feature delivered
4. US3 (Dashboard) + US4 (Goals) → key pages mobile-ready
5. US5 (Habits) + US6 (Profile) → full mobile polish
6. Polish → regression-free release candidate

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks generated — tests not requested in spec
- Total: 27 tasks across 9 phases
- shadcn CLI installs (T001, T002) must run before dependent component work
- Dashboard (US3) is largely verification — existing responsive classes may already work
