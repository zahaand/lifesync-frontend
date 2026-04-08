# Tasks: Dark Mode & User Menu Update

**Input**: Design documents from `/specs/008-dark-mode-user-menu/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Unit tests for themeStore are included (new store requires coverage).

**Organization**: Tasks grouped by user story. US1 and US2 share foundational work (themeStore + FOCT script). US3 is the menu update. US4 covers all hardcoded color dark variants.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Branch is already created. No additional setup needed — all dependencies (Zustand, Lucide React, Tailwind CSS v4) are already in the project. Dark mode CSS variables already defined in `src/index.css`.

*(No tasks — proceed to Phase 2)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the themeStore and FOCT-prevention script that ALL user stories depend on.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T001 Create Zustand theme store (WITHOUT persist middleware) in `src/stores/themeStore.ts`. Export `type Theme = 'light' | 'dark'` and `useThemeStore` with state `theme` and action `toggleTheme()`. On store creation: read `localStorage.getItem('lifesync-theme')`, validate value is `'light'` or `'dark'`, fall back to `window.matchMedia('(prefers-color-scheme: dark)').matches`, then fall back to `'light'`. `toggleTheme()` must: flip theme, write to localStorage key `lifesync-theme`, and toggle `.dark` class on `document.documentElement`. Wrap localStorage access in try/catch for private browsing. Follow existing pattern from `src/stores/authStore.ts` (use `type` not `interface`, `@/` imports).

- [ ] T002 Add inline `<script>` to `index.html` inside `<head>`, BEFORE the `<script type="module" src="/src/main.tsx">` tag. The script must: (1) try reading `localStorage.getItem('lifesync-theme')`, (2) if value is `'dark'` → add `'dark'` class to `document.documentElement`, (3) if value is not `'light'` and not `'dark'` (missing/invalid) → check `window.matchMedia('(prefers-color-scheme: dark)').matches`, if true add `'dark'` class, (4) wrap in try/catch so localStorage errors default to light mode silently. The localStorage key `lifesync-theme` MUST match the key in `src/stores/themeStore.ts`.

- [ ] T003 Write unit tests for themeStore in `src/stores/__tests__/themeStore.test.ts`. Test cases: (1) initializes to `'light'` when no localStorage and no OS preference, (2) initializes to `'dark'` when localStorage has `'dark'`, (3) initializes from OS `prefers-color-scheme: dark` when localStorage empty, (4) `toggleTheme()` flips `'light'` → `'dark'` and vice versa, (5) `toggleTheme()` writes to localStorage, (6) `toggleTheme()` adds/removes `.dark` class on `document.documentElement`, (7) invalid localStorage value (e.g., `'blue'`) falls back to OS preference then light. Use Vitest, mock `localStorage` and `matchMedia`. Follow pattern from `src/hooks/__tests__/useAuth.test.ts`.

**Checkpoint**: themeStore works, inline script prevents FOCT, tests pass. Run `npm test` to verify all 46+ tests pass.

---

## Phase 3: User Story 1 — Toggle Dark Mode (Priority: P1) MVP

**Goal**: User can toggle between light and dark mode from the user chip menu, and ALL pages render correctly in both modes.

**Independent Test**: Toggle theme via user chip menu → all pages display correctly in dark mode.

### Implementation for User Story 1

- [ ] T004 [US1] Update `UserChip` component in `src/components/shared/Layout.tsx`: (1) import `Sun`, `Moon` from `lucide-react` and `useThemeStore` from `@/stores/themeStore`, (2) read `theme` and `toggleTheme` from the store, (3) replace the Profile `DropdownMenuItem` (the one with `<User>` icon and `navigate('/profile')`) with a theme toggle `DropdownMenuItem` that calls `toggleTheme()` on click, displays `Moon` icon + "Dark mode" text when `theme === 'light'`, and `Sun` icon + "Light mode" text when `theme === 'dark'`, (4) keep the Log out `DropdownMenuItem` unchanged, (5) remove the `DropdownMenuSeparator` between old Profile and Log out, (6) remove `User` icon import from lucide-react if no longer used, remove `useNavigate` import if no longer used in `UserChip`.

- [ ] T005 [US1] Add `dark:` variants to sidebar in `src/components/shared/Layout.tsx`: (1) avatar background `bg-[#EEF2FF]` → add `dark:bg-[#534AB7]/20`, (2) active nav item `bg-[#EEEDFE]` → add `dark:bg-[#534AB7]/20`, (3) active nav item `text-[#534AB7]` — keep unchanged (readable on dark), (4) logo text `text-[#534AB7]` — keep unchanged, (5) version label `text-muted-foreground/50` → add `dark:text-muted-foreground/70` for better legibility, (6) mobile top bar `border-[#E8E6DF]` → add `dark:border-border`.

- [ ] T006 [P] [US1] Add `dark:` variants to `src/pages/LoginPage.tsx`: (1) main container `bg-[#F1EFE8]` → replace with `bg-background` (uses CSS variable, auto-adapts to dark), (2) form container `bg-white` → add `dark:bg-card`, (3) border `border-[#C7C4BB]` → add `dark:border-border`, (4) tab borders and backgrounds — active tab `bg-[#534AB7] text-[#EEEDFE]` stays (readable), inactive tab `bg-white text-[#666360] hover:bg-[#F5F4F0]` → add `dark:bg-card dark:text-muted-foreground dark:hover:bg-accent`, (5) input fields: `text-[#2C2C2A]` → add `dark:text-foreground`, `placeholder:text-[#9E9B94]` → add `dark:placeholder:text-muted-foreground`, `border-[#C7C4BB]` → add `dark:border-border`, `bg-[#F5F4F0]` (filled state) → add `dark:bg-accent`, `bg-white` (empty state) → add `dark:bg-card`, `focus:border-[#534AB7] focus:ring-[#534AB7]` — keep (brand color), (6) submit button `bg-[#534AB7] hover:bg-[#3C3489] text-[#EEEDFE]` — keep (brand), (7) success message `text-[#085041] bg-[#E1F5EE] border-[#9FE1CB]` → add `dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800`, (8) link colors `text-[#534AB7]` — keep (brand).

- [ ] T007 [P] [US1] Add `dark:` variants to `src/pages/DashboardPage.tsx` (~40 hardcoded colors). Apply the color mapping from plan.md §D5: text colors (`#2C2C2A` → `dark:text-foreground`, `#666360` → `dark:text-muted-foreground`, `#9E9B94` ��� `dark:text-muted-foreground`), backgrounds (`#F5F4F0` → `dark:bg-accent`, `bg-white` → `dark:bg-card`), borders (`#E8E6DF` → `dark:border-border`, `#C7C4BB` → `dark:border-border`), status badges (streak amber `text-[#854F0B] bg-[#FAEEDA]` → `dark:text-amber-300 dark:bg-amber-900/30`, completed green `text-[#3B6D11] bg-[#EAF3DE]` → `dark:text-green-400 dark:bg-green-900/30`). Keep all `#534AB7` and `#1D9E75` unchanged.

- [ ] T008 [P] [US1] Add `dark:` variants to `src/pages/HabitsPage.tsx` (5 hardcoded colors). Same mapping as T007.

- [ ] T009 [P] [US1] Add `dark:` variants to `src/pages/GoalsPage.tsx` (7 hardcoded colors). Same mapping as T007.

- [ ] T010 [P] [US1] Add `dark:` variants to `src/pages/ProfilePage.tsx` (1 hardcoded color). Same mapping as T007.

- [ ] T011 [P] [US1] Add `dark:` variants to habit components: `src/components/habits/HabitCard.tsx` (4 colors), `src/components/habits/HabitEmptyState.tsx` (5 colors), `src/components/habits/HabitHistoryDrawer.tsx` (11 colors), `src/components/habits/HabitFilters.tsx` (4 colors), `src/components/habits/HabitFormModal.tsx` (12 colors). Apply same color mapping. Streak badge: `text-[#854F0B] bg-[#FAEEDA]` → `dark:text-amber-300 dark:bg-amber-900/30`.

- [ ] T012 [P] [US1] Add `dark:` variants to goal components: `src/components/goals/GoalCard.tsx` (9 colors), `src/components/goals/GoalEmptyState.tsx` (4 colors), `src/components/goals/GoalDetail.tsx` (5 colors), `src/components/goals/GoalMilestones.tsx` (10 colors), `src/components/goals/GoalLinkedHabits.tsx` (8 colors), `src/components/goals/GoalProgress.tsx` (6 colors), `src/components/goals/GoalFilters.tsx` (2 colors), `src/components/goals/GoalFormModal.tsx` (6 colors). Apply same color mapping. Done-today/completed: emerald/green variants per plan.md §D5.

- [ ] T013 [P] [US1] Add `dark:` variants to profile components: `src/components/profile/AccountCard.tsx` (13 colors), `src/components/profile/StatsCard.tsx` (8 colors), `src/components/profile/TelegramCard.tsx` (6 colors), `src/components/profile/DangerZoneCard.tsx` (2 colors), `src/components/profile/DeleteAccountDialog.tsx` (5 colors). Apply same color mapping.

**Checkpoint**: Toggle theme via user chip → all pages display correctly in dark mode. Run `npx tsc --noEmit` (zero errors) and `npm test` (all tests pass).

---

## Phase 4: User Story 2 — Theme Persistence Across Sessions (Priority: P1)

**Goal**: Selected theme persists across browser sessions with zero flash on reload.

**Independent Test**: Select dark mode → close tab → reopen → app loads in dark mode with no white flash.

### Implementation for User Story 2

- [ ] T014 [US2] Verify FOCT prevention end-to-end: (1) run `npm run dev`, (2) toggle to dark mode, (3) hard-refresh (Cmd+Shift+R) — verify no white flash, (4) close tab and reopen — verify dark mode loads instantly, (5) clear localStorage → reload — verify OS preference is applied (or light mode if no OS preference), (6) set localStorage to `'invalid'` → reload — verify fallback to OS preference then light. This is a manual verification task — document pass/fail in checklist.

**Checkpoint**: Theme persists correctly across sessions, no FOCT on any page.

---

## Phase 5: User Story 3 — Updated User Chip Menu (Priority: P2)

**Goal**: User chip dropdown shows theme toggle + log out. No Profile item. Same on desktop and mobile.

**Independent Test**: Open user chip menu on desktop (1280px) and mobile (375px) → verify exactly two items.

### Implementation for User Story 3

*(User chip menu changes are already implemented in T004. This phase is verification only.)*

- [ ] T015 [US3] Verify user chip menu on desktop (1280px viewport): (1) click user chip at bottom of sidebar, (2) verify menu shows "Dark mode" with Moon icon (in light mode) or "Light mode" with Sun icon (in dark mode), (3) verify "Log out" item present, (4) verify NO "Profile" item exists, (5) click theme toggle — verify theme switches, (6) verify menu closes after toggle click.

- [ ] T016 [US3] Verify user chip menu on mobile (375px viewport): (1) open mobile Sheet, (2) tap user chip, (3) verify same menu items as desktop (theme toggle + log out, no Profile), (4) click theme toggle — verify theme switches.

**Checkpoint**: Menu is correct on both viewports with exactly two items.

---

## Phase 6: User Story 4 — Custom Color Readability (Priority: P2)

**Goal**: Streak badge (amber) and done-today badge (emerald) are clearly readable in dark mode.

**Independent Test**: Toggle to dark mode → navigate to habits/goals pages → verify badge readability.

### Implementation for User Story 4

*(Badge dark variants are already implemented in T011 and T012. This phase is verification only.)*

- [ ] T017 [US4] Verify custom color readability in dark mode: (1) toggle to dark mode, (2) navigate to Habits page — verify streak badge (amber) has sufficient contrast, (3) navigate to Goals page — verify done-today/completed badges (emerald/green) have sufficient contrast, (4) verify primary purple `#534AB7` (logo, active nav, buttons) displays correctly on dark backgrounds, (5) verify green `#1D9E75` elements display correctly in dark mode.

**Checkpoint**: All custom-colored elements are readable in dark mode.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories.

- [ ] T018 Run `npx tsc --noEmit` — verify zero TypeScript errors
- [ ] T019 Run `npm test` — verify all 46+ tests pass (existing + new themeStore tests)
- [ ] T020 Visual audit at 1280px desktop: navigate all pages (login, dashboard, habits, goals, profile) in both light and dark mode — verify no missed hardcoded colors, no readability issues
- [ ] T021 Visual audit at 375px mobile: same page audit on mobile viewport — verify sidebar Sheet, user chip menu, and all pages render correctly in both modes
- [ ] T022 FOCT final check: hard-refresh on each page in dark mode — verify no white flash on any page

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Skipped — no setup needed
- **Phase 2 (Foundational)**: T001 → T002 (script must use same localStorage key as store) → T003 (tests for store)
- **Phase 3 (US1)**: Depends on Phase 2. T004-T005 (Layout changes) then T006-T013 (all [P] — parallel across different files)
- **Phase 4 (US2)**: Depends on Phase 2 + T004 (needs toggle in UI). T014 is manual verification.
- **Phase 5 (US3)**: Depends on T004 (menu already updated). T015-T016 are verification.
- **Phase 6 (US4)**: Depends on T011, T012 (badge variants). T017 is verification.
- **Phase 7 (Polish)**: Depends on all previous phases.

### User Story Dependencies

- **US1 (Toggle Dark Mode)**: Depends on Phase 2 only. This is the MVP.
- **US2 (Persistence)**: Depends on Phase 2 (store + script handle persistence). Mostly verification.
- **US3 (Menu Update)**: Implemented as part of US1 (T004). Verification only.
- **US4 (Color Readability)**: Implemented as part of US1 (T011, T012). Verification only.

### Parallel Opportunities

Within Phase 3, after T004+T005 complete:
- T006, T007, T008, T009, T010, T011, T012, T013 can ALL run in parallel (different files, no dependencies)

Within Phase 2:
- T001 must complete before T002 (shared localStorage key)
- T003 can run after T001

---

## Parallel Example: Phase 3 (US1 Implementation)

```bash
# After T004 + T005 (Layout.tsx) complete, launch ALL page/component updates in parallel:
Task T006: "Add dark: variants to src/pages/LoginPage.tsx"
Task T007: "Add dark: variants to src/pages/DashboardPage.tsx"
Task T008: "Add dark: variants to src/pages/HabitsPage.tsx"
Task T009: "Add dark: variants to src/pages/GoalsPage.tsx"
Task T010: "Add dark: variants to src/pages/ProfilePage.tsx"
Task T011: "Add dark: variants to habit components"
Task T012: "Add dark: variants to goal components"
Task T013: "Add dark: variants to profile components"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T003) — themeStore + FOCT script + tests
2. Complete Phase 3: US1 (T004-T013) — toggle + all dark variants
3. **STOP and VALIDATE**: Toggle works, all pages render in dark mode, tests pass
4. US2/US3/US4 are mostly verification at this point

### Incremental Delivery

1. T001-T003 → Store + script ready (persistence + FOCT already working)
2. T004-T005 → Menu updated, sidebar dark mode working (US3 done)
3. T006-T013 → All pages/components dark mode ready (US1 + US4 done)
4. T014-T017 → Verification passes (US2 confirmed)
5. T018-T022 → Final polish and full audit

---

## Notes

- 203 hardcoded color occurrences across 24 files need `dark:` variants
- shadcn/ui components (Dialog, Toast, Skeleton, Sheet, Card, Input, Button, DropdownMenu) auto-adapt — no changes needed
- Brand colors `#534AB7` and `#1D9E75` stay unchanged in both modes
- All `dark:` variants use inline Tailwind classes — no CSS variable refactor
- localStorage key `lifesync-theme` must be identical in both `index.html` inline script and `themeStore.ts`
