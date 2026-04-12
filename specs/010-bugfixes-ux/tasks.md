# Tasks: Bug Fixes, UX Improvements & Onboarding Tooltips

**Input**: Design documents from `/specs/010-bugfixes-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and add shadcn/ui components required by multiple user stories

- [X] T001 Install date-fns as direct dependency via `npm install date-fns`
- [X] T002 Install shadcn/ui Calendar component via `npx shadcn@latest add calendar` into src/components/ui/calendar.tsx
- [X] T003 Install shadcn/ui AlertDialog component via `npx shadcn@latest add alert-dialog` into src/components/ui/alert-dialog.tsx

**Checkpoint**: New dependencies and UI primitives are available for all user stories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add all new translation keys needed across user stories

**⚠️ CRITICAL**: Translation keys must exist before UI components reference them

- [X] T004 [P] Add password hint, username hint, and error keys to src/locales/en/auth.json (~3 keys: register.passwordHint, register.usernameHint, error.registrationFailed)
- [X] T005 [P] Add unsaved changes dialog keys to src/locales/en/habits.json (~4 keys: form.unsavedChanges.title, form.unsavedChanges.description, form.unsavedChanges.keepEditing, form.unsavedChanges.discard)
- [X] T006 [P] Add unsaved changes dialog, date picker placeholder, and tooltip keys to src/locales/en/goals.json (~10 keys: form.unsavedChanges.title, form.unsavedChanges.description, form.unsavedChanges.keepEditing, form.unsavedChanges.discard, form.pickDate, tooltip.goalsHeading, tooltip.goalsHeadingLabel, tooltip.milestones, tooltip.milestonesLabel, tooltip.linkedHabits, tooltip.linkedHabitsLabel)
- [X] T007 [P] Add Russian translations for all new auth keys to src/locales/ru/auth.json (mirror T004 keys: register.passwordHint = "Минимум 8 символов", register.usernameHint, error.registrationFailed)
- [X] T008 [P] Add Russian translations for all new habits keys to src/locales/ru/habits.json (mirror T005 keys)
- [X] T009 [P] Add Russian translations for all new goals keys to src/locales/ru/goals.json (mirror T006 keys)

**Checkpoint**: All translation keys exist in EN and RU — UI tasks can now reference them

---

## Phase 3: User Story 1 — Registration Password Hint (Priority: P1) 🎯 MVP

**Goal**: Show a clear static hint below the password field explaining the actual backend requirement (minimum 8 characters). Parse and display backend 400 errors. Password complexity validation deferred to TD-003.

**Independent Test**: Open registration form → see "Minimum 8 characters" hint below password field; submit short password → see backend error message

### Implementation for User Story 1

- [X] T010 [US1] ~~REMOVED — no .refine() checks needed~~ No changes to Zod schema — existing `min(8)` validation in registerSchema in src/types/auth.ts is already correct
- [X] T011 [US1] Add backend 400 error handling in useRegister mutation in src/hooks/useAuth.ts — parse `{ message }` from error response body, call `setError('root', { message })` for status 400; fall back to generic translated error if no message field
- [X] T012 [US1] Add static password hint below password field in RegisterForm in src/pages/LoginPage.tsx — always visible, not a dynamic indicator. Use `t('auth:register.passwordHint')` key. EN: "Minimum 8 characters" / RU: "Минимум 8 символов"

**Checkpoint**: Password hint visible in both languages; backend errors parsed and displayed

---

## Phase 4: User Story 2 — Username Normalization (Priority: P1)

**Goal**: Normalize username to lowercase before submission and show a hint explaining case-insensitivity

**Independent Test**: Register with "TestUser" → network request sends "testuser"; hint visible below field

### Implementation for User Story 2

- [X] T013 [P] [US2] Add `.transform(v => v.toLowerCase())` to username field in registerSchema in src/types/auth.ts
- [X] T014 [P] [US2] Add `.transform(v => v.toLowerCase().trim())` to email field in registerSchema in src/types/auth.ts
- [X] T015 [US2] Add username case-insensitivity hint below username field in RegisterForm in src/pages/LoginPage.tsx using `t('auth:register.usernameHint')` key (already wired)

**Checkpoint**: Username normalized to lowercase, email trimmed+lowercased, hint visible in both languages

---

## Phase 5: User Story 3 — Unsaved Changes Confirmation (Priority: P1)

**Goal**: Prevent silent data loss by showing a confirmation dialog when closing a partially filled form modal

**Independent Test**: Open habit form → type title → click X → see "Discard changes?" dialog; empty form closes immediately

### Implementation for User Story 3

- [X] T016 [P] [US3] Add unsaved changes guard to HabitFormModal in src/components/habits/HabitFormModal.tsx — intercept Dialog `onOpenChange(false)`, check `watch('title').trim().length > 0`, show AlertDialog with discard/keep options using translation keys from habits namespace
- [X] T017 [P] [US3] Add unsaved changes guard to GoalFormModal in src/components/goals/GoalFormModal.tsx — same pattern as T016 but using goals namespace translation keys

**Checkpoint**: Both modals show confirmation when title has content; empty forms close immediately

---

## Phase 6: User Story 4 — Goal Mutations Cache Invalidation (Priority: P1)

**Goal**: Goal detail and list views update immediately after mutations without page refresh

**Independent Test**: Link a habit to a goal → linked habits section updates immediately; update progress → progress bar updates

### Implementation for User Story 4

- [X] T018 [US4] Investigate cache invalidation in src/hooks/useGoals.ts — all 9 mutations already call `invalidateQueries({ queryKey: ['goals'] })` on success. No missing invalidation found. No fix needed.

**Checkpoint**: All goal mutations (link, unlink, progress, create, update, delete, milestones) cause immediate UI refresh

---

## Phase 7: User Story 5 — Locale-Aware Date Picker (Priority: P2)

**Goal**: Replace native date input with shadcn/ui Calendar that respects the app's i18n language setting

**Independent Test**: Set app to English → open goal form date picker → see English month/day names; switch to Russian → see Russian names

### Implementation for User Story 5

- [X] T019 [US5] Replace `<Input type="date">` with Popover + Calendar pattern in GoalFormModal in src/components/goals/GoalFormModal.tsx — locale-aware via date-fns, format as YYYY-MM-DD, placeholder via `t('goals:form.pickDate')`, pre-select existing date in edit mode

**Checkpoint**: Date picker shows locale-aware month/day names, dates formatted correctly for backend

---

## Phase 8: User Story 6 — Ghost Button Fix (Priority: P2)

**Goal**: Eliminate visual artifacts (ghost/duplicate buttons) in AccountCard during and after save mutation

**Independent Test**: Edit display name → click Save → observe single button during mutation, clean state after completion

### Implementation for User Story 6

- [X] T020 [US6] Fix ghost button in src/components/profile/AccountCard.tsx — root cause: buttons always rendered with `disabled={!isDirty}` caused flash during isPending→reset() transition. Fix: only render buttons when `isDirty`; added `min-w-[120px]` to Save button to prevent layout shift.

**Checkpoint**: No ghost/duplicate buttons visible during or after profile save

---

## Phase 9: User Story 7 — Login Email/Identifier Normalization (Priority: P2)

**Goal**: Normalize login identifier to lowercase and trim whitespace before submission

**Independent Test**: Login with "Test@Example.com" for account registered as "test@example.com" → login succeeds

### Implementation for User Story 7

- [X] T021 [US7] Add `.transform(v => v.toLowerCase().trim())` to identifier field in loginSchema in src/types/auth.ts

**Checkpoint**: Login identifier lowercased and trimmed before submission

---

## Phase 10: User Story 8 — Onboarding Tooltips (Priority: P3)

**Goal**: Add contextual info tooltips explaining Goals, Milestones, and Linked Habits concepts

**Independent Test**: Hover info icons on Goals page and goal detail → see translated tooltip content; keyboard-accessible

### Implementation for User Story 8

- [X] T022 [P] [US8] Add info icon + Tooltip next to "Goals" heading in src/pages/GoalsPage.tsx
- [X] T023 [P] [US8] Add info icon + Tooltip next to "Milestones" section title in src/components/goals/GoalMilestones.tsx
- [X] T024 [P] [US8] Add info icon + Tooltip next to "Linked Habits" section title in src/components/goals/GoalLinkedHabits.tsx

**Checkpoint**: Three tooltips visible, accessible via hover/tap/keyboard, translated in both languages

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all changes

- [X] T025 [P] Run `tsc --noEmit` — zero type errors
- [X] T026 [P] Run `npm test` — all 55 tests pass (10 files)
- [X] T027 Run `npm run build` — zero errors (chunk size warning pre-existing)
- [ ] T028 Run quickstart.md verification scenarios (BUG-001 through UX-001) end-to-end — requires manual browser testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — install deps first
- **Foundational (Phase 2)**: Can start after Setup; translation keys BLOCK UI tasks
- **US1 (Phase 3)**: Depends on Phase 2 (translation keys); T010 removed (no schema changes), T011–T012 are independent
- **US2 (Phase 4)**: Depends on Phase 2; T013/T014 modify src/types/auth.ts (coordinate with T010)
- **US3 (Phase 5)**: Depends on Phase 1 (AlertDialog) + Phase 2 (translation keys)
- **US4 (Phase 6)**: Depends on Phase 2 only — independent investigation
- **US5 (Phase 7)**: Depends on Phase 1 (Calendar, date-fns) + Phase 2 (translation keys)
- **US6 (Phase 8)**: No translation dependency — can start after Phase 1
- **US7 (Phase 9)**: Depends on Phase 2; T021 modifies src/types/auth.ts (coordinate with T010/T013/T014)
- **US8 (Phase 10)**: Depends on Phase 2 (translation keys)
- **Polish (Phase 11)**: Depends on all previous phases

### Shared File Coordination: src/types/auth.ts

Tasks T013, T014, and T021 modify `src/types/auth.ts` (T010 removed — no schema changes needed). Execute in order:
1. T013 + T014 (register transforms) → T021 (login transform)

### User Story Independence

- **US1–US4** (P1): All independent of each other except shared auth.ts file
- **US5–US7** (P2): All independent of each other and of P1 stories
- **US8** (P3): Fully independent of all other stories

### Parallel Opportunities

- **Phase 2**: All 6 translation tasks (T004–T009) run in parallel
- **Phase 4**: T013 and T014 run in parallel (different schema fields)
- **Phase 5**: T016 and T017 run in parallel (different components)
- **Phase 10**: T022, T023, T024 run in parallel (different components)
- **Phase 11**: T025 and T026 run in parallel

---

## Parallel Example: User Story 3

```bash
# Launch both unsaved changes guard implementations in parallel:
Task: "Add unsaved changes guard to HabitFormModal in src/components/habits/HabitFormModal.tsx"
Task: "Add unsaved changes guard to GoalFormModal in src/components/goals/GoalFormModal.tsx"
```

## Parallel Example: User Story 8

```bash
# Launch all three tooltip implementations in parallel:
Task: "Add info tooltip next to Goals heading in src/pages/GoalsPage.tsx"
Task: "Add info tooltip next to Milestones in src/components/goals/GoalMilestones.tsx"
Task: "Add info tooltip next to Linked Habits in src/components/goals/GoalLinkedHabits.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1–4, P1)

1. Complete Phase 1: Setup (install deps + UI components)
2. Complete Phase 2: Foundational (all translation keys)
3. Complete Phases 3–6: User Stories 1–4 (P1 bugs)
4. **STOP and VALIDATE**: Run quickstart.md BUG-001 through BUG-004
5. Deploy/demo if ready — core bugs are fixed

### Incremental Delivery

1. Setup + Foundational → deps and translations ready
2. US1–US4 (P1 bugs) → critical bug fixes validated → Deploy
3. US5–US7 (P2 UX) → date picker, ghost button, login normalization → Deploy
4. US8 (P3 onboarding) → tooltips → Deploy
5. Polish → type check, tests, build, end-to-end verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- src/types/auth.ts is modified by 3 tasks (T013, T014, T021) — execute sequentially to avoid conflicts
- Investigation tasks (T018, T020) may expand into additional fixes during implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
