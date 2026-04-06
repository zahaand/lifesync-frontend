# Tasks: Pre-release — Audit, Testing & Documentation

**Input**: Design documents from `/specs/007-pre-release/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This sprint IS about writing tests — test tasks are the core deliverables.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in all descriptions

---

## Phase 1: Setup

**Purpose**: Install test dependencies and create shared test infrastructure

- [ ] T001 Install Vitest and Testing Library dependencies: run `npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom` — adds unit/component test stack
- [ ] T002 Install MSW: run `npm install -D msw` — adds API mocking for unit tests
- [ ] T003 Install Playwright: run `npm install -D @playwright/test` then `npx playwright install chromium` — adds E2E test runner
- [ ] T004 Create vitest.config.ts in project root — configure: environment `jsdom`, setupFiles `['./src/test/setup.ts']`, globals `true`, resolve alias `@` → `./src`, coverage provider `v8` with include `['src/hooks/**', 'src/components/**', 'src/pages/**']` per research.md R-001
- [ ] T005 Create src/test/setup.ts — import `@testing-library/jest-dom/vitest` for matchers, import and configure MSW server from `./handlers`, add `beforeAll` (server.listen with `onUnhandledRequest: 'warn'`), `afterEach` (server.resetHandlers), `afterAll` (server.close) per research.md R-002
- [ ] T006 Create playwright.config.ts in project root — configure: testDir `./tests/e2e`, baseURL `http://localhost:5173`, browserName `chromium`, headless `true`, timeout `30000`, screenshot `only-on-failure`, trace `on-first-retry`, retries `0`, reporter `list` per research.md R-004

**Checkpoint**: Test infrastructure installed and configured — both `npx vitest run` and `npx playwright test` runnable (with no test files yet)

---

## Phase 2: Foundational (MSW Handlers)

**Purpose**: Create MSW request handlers — required by ALL unit/component tests in US1

**⚠️ CRITICAL**: US1 (Unit & Component Tests) cannot begin until MSW handlers are complete

- [ ] T007 [P] Create src/test/handlers/auth.ts — MSW handlers for POST /api/v1/auth/login (success 200 + error 401), POST /api/v1/auth/register (success 200 + error 409), POST /api/v1/auth/refresh (success 200 + error 401), POST /api/v1/auth/logout (success 200); export `authHandlers` array per contracts/msw-handlers.md
- [ ] T008 [P] Create src/test/handlers/habits.ts — MSW handlers for GET /api/v1/habits (paginated response), POST /api/v1/habits (success + 400 error), GET /api/v1/habits/:id, PATCH /api/v1/habits/:id, DELETE /api/v1/habits/:id, POST /api/v1/habits/:id/complete (success + 409 duplicate), DELETE /api/v1/habits/:id/complete/:logId, GET /api/v1/habits/:id/logs (paginated); export `habitsHandlers` array per contracts/msw-handlers.md
- [ ] T009 [P] Create src/test/handlers/goals.ts — MSW handlers for GET /api/v1/goals (paginated), POST /api/v1/goals, GET /api/v1/goals/:id (GoalDetail), PATCH /api/v1/goals/:id, DELETE /api/v1/goals/:id, POST /api/v1/goals/:id/progress (success + 400 for >100), milestones CRUD, linked-habits CRUD; export `goalsHandlers` array per contracts/msw-handlers.md
- [ ] T010 [P] Create src/test/handlers/users.ts — MSW handlers for GET /api/v1/users/me (success + 401), PATCH /api/v1/users/me (success + 400), DELETE /api/v1/users/me (success + 401); export `usersHandlers` array per contracts/msw-handlers.md
- [ ] T011 Create src/test/handlers/index.ts — combine all handler arrays into single `handlers` export: `[...authHandlers, ...habitsHandlers, ...goalsHandlers, ...usersHandlers]`; also export mock data factory functions (`createMockHabit`, `createMockGoal`, `createMockUser`, `createMockHabitLog`) per data-model.md
- [ ] T012 Create src/test/test-utils.tsx — export `createTestQueryClient()` (retry: false, gcTime: 0) and `createWrapper()` component wrapping `QueryClientProvider` for use in `renderHook` calls per research.md R-003

**Checkpoint**: MSW handlers ready — all API endpoints mocked with success + error variants, test utilities available

---

## Phase 3: User Story 1 — Unit & Component Test Suite (Priority: P1) 🎯 MVP

**Goal**: Automated unit tests for hooks and component tests for key UI, with 70%+ coverage on src/hooks/

**Independent Test**: Run `npx vitest run --coverage` — all tests pass, >= 70% coverage for src/hooks/

### Hook Tests

- [ ] T013 [P] [US1] Create src/hooks/__tests__/useAuth.test.ts — test `useLogin` (success: tokens stored, error: 401 message), `useLogout` (clears auth state), `useRegister` (success: returns user data) using MSW handlers and test-utils wrapper
- [ ] T014 [P] [US1] Create src/hooks/__tests__/useHabits.test.ts — test `useAllHabits` (returns paginated list), `useCompleteHabit` (optimistic update: completedToday flips to true immediately, rollback on error), `useUncompleteHabit` (optimistic rollback), `useCreateHabit`, `useUpdateHabit`, `useArchiveHabit` using MSW handlers
- [ ] T015 [P] [US1] Create src/hooks/__tests__/useGoals.test.ts — test `useAllGoals` (returns paginated list), `useGoalDetail` (returns detail with milestones), `useUpdateGoalProgress` (progress updates), `useCreateGoal`, `useDeleteGoal` using MSW handlers
- [ ] T016 [P] [US1] Create src/hooks/__tests__/useUsers.test.ts — test `useCurrentUser` (returns profile), `useUpdateProfile` (updates displayName), error handling (401 → unauthenticated) using MSW handlers
- [ ] T017 [P] [US1] Create src/hooks/__tests__/useHabitLogs.test.ts — test `useHabitLogs` (returns first page), pagination (`fetchNextPage` loads page 1), `hasNextPage` false when last page, disabled when habitId is null, using MSW handlers

### Component Tests

- [ ] T018 [P] [US1] Create src/components/__tests__/LoginPage.test.tsx — test form validation (empty fields show errors), successful submit (calls login API), error display (401 → error message rendered), loading state (button disabled during submit); render LoginPage within MemoryRouter + QueryClientProvider
- [ ] T019 [P] [US1] Create src/components/__tests__/HabitCard.test.tsx — test checkbox toggle (calls onComplete/onUncomplete), streak badge (renders "🔥 N day streak" when currentStreak > 0), mobile dropdown menu (MoreHorizontal button → DropdownMenu with Edit/History/Archive/Delete items), desktop inline buttons visible; mock useIsMobile
- [ ] T020 [P] [US1] Create src/components/__tests__/GoalCard.test.tsx — test progress bar width matches `progress` %, status badge ("ACTIVE" vs "COMPLETED" styling), selected state (highlighted border/bg), click handler (calls onClick with goal.id)
- [ ] T021 [P] [US1] Create src/components/__tests__/HabitFormModal.test.tsx — test form fields render (title, description, frequency), frequency toggle switches between DAILY/WEEKLY/CUSTOM, CUSTOM shows day picker with 7 day buttons, form submission calls create/update handler

### Coverage Verification

- [ ] T022 [US1] Run `npx vitest run --coverage` — verify >= 70% line coverage for src/hooks/ directory; fix any test failures or coverage gaps

**Checkpoint**: Unit & component test suite complete — all hooks and key components tested, 70%+ hooks coverage

---

## Phase 4: User Story 2 — E2E Test Suite (Priority: P1)

**Goal**: Playwright E2E tests covering full user flows across auth, habits, goals, profile, and mobile

**Independent Test**: Start frontend + backend, run `npx playwright test` — all specs pass

- [ ] T023 [US2] Create tests/e2e/auth.spec.ts — tests: register new user (unique username `test-{timestamp}-{random}`) → redirect to /dashboard; login with email → /dashboard; login with username → /dashboard; login wrong password → error message; logout → redirect to /login; protected route redirect → unauthenticated user navigates to /dashboard → redirected to /login; cleanup user in afterAll via DELETE /api/v1/users/me per contracts/e2e-test-plan.md
- [ ] T024 [US2] Create tests/e2e/habits.spec.ts — setup: register fresh user in beforeAll; tests: navigate to /habits, create DAILY habit → appears in list, create CUSTOM habit with specific days, complete habit (checkbox) → "Completed today", edit habit title → updated in list, archive habit → appears in Archived filter, restore habit → back to Active, delete archived habit → removed, filter Active tab → only active shown, search by name → filtered results; cleanup in afterAll per contracts/e2e-test-plan.md
- [ ] T025 [US2] Create tests/e2e/goals.spec.ts — setup: register fresh user in beforeAll; tests: navigate to /goals, create goal → appears in list, click goal → detail panel opens, update progress to 50% → progress bar updates, add milestone → appears in checklist, toggle milestone → completed state, set progress 100% → status Completed, delete goal → removed from list; cleanup in afterAll per contracts/e2e-test-plan.md
- [ ] T026 [US2] Create tests/e2e/profile.spec.ts — setup: register fresh user in beforeAll; tests: navigate to /profile, update display name → saved (Dashboard greeting reflects change), link Telegram Chat ID → saved successfully; cleanup in afterAll per contracts/e2e-test-plan.md
- [ ] T027 [US2] Create tests/e2e/mobile.spec.ts — setup: register fresh user in beforeAll, set viewport to 375x812; tests: hamburger button visible at 375px (sidebar hidden), open sidebar via hamburger → overlay slides from left, navigate via mobile sidebar → page changes and sidebar closes, goals: tap goal card → detail view opens full-screen, goals: tap "← Goals" back button → returns to list; cleanup in afterAll per contracts/e2e-test-plan.md

**Checkpoint**: E2E test suite complete — all user flows tested end-to-end

---

## Phase 5: User Story 3 — Postman Collection Update (Priority: P2)

**Goal**: Reorganize and complete the Postman collection with folder structure and missing requests

**Independent Test**: Open Postman collection — verify 5 folders, all requests present, negative tests return expected errors

- [ ] T028 [US3] Read current Postman collection structure via MCP `getCollection` (ID: 24414635-48166e11-cb1a-40dc-af79-58717bc2bfee) — document current state: request count, existing folder structure (if any), identify which of the 38 requests need to be moved
- [ ] T029 [US3] Create 5 folders in Postman collection via MCP: "Auth", "Users", "Habits", "Goals", "Admin" — using `createCollectionRequest` or collection update API per research.md R-005
- [ ] T030 [US3] Move existing requests into correct folders and add missing Auth requests: Login by username (POST /auth/login with username as identifier), verify Re-login after logout exists
- [ ] T031 [US3] Add missing Habits requests: Archive Habit (PATCH /habits/{id} body: `{isActive: false}`), Restore Habit (PATCH /habits/{id} body: `{isActive: true}`), negative test Create CUSTOM without days (POST /habits body: `{title, frequency: "CUSTOM"}` — expect 400)
- [ ] T032 [US3] Add missing Goals requests: List Goals filtered by status (GET /goals?status=ACTIVE), negative test Update Progress > 100 (POST /goals/{id}/progress body: `{progress: 150}` — expect 400)
- [ ] T033 [US3] Add missing Users requests: Delete Account (DELETE /users/me), add Admin folder with List Users 403 test (GET /users — expect 403 for regular user)
- [ ] T034 [US3] Verify final collection state via MCP `getCollection` — confirm >= 45 requests across 5 folders, zero requests at root level per spec SC-004

**Checkpoint**: Postman collection reorganized and complete — all endpoints covered with negative tests

---

## Phase 6: User Story 4 — README Documentation (Priority: P2)

**Goal**: Bilingual README.md with project overview, setup instructions, and architecture summary

**Independent Test**: Read README.md — verify English + Russian sections, all required content present, setup instructions are followable

- [ ] T035 [US4] Create README.md in project root — English section: project overview (what is LifeSync, link to lifesync-backend repo), features by sprint (Sprint 1: Auth/Routing/Layout, Sprint 2: Dashboard, Sprint 3: Habits + CRUD, Sprint 4: Goals + milestones, Sprint 5: Profile + Telegram, Sprint 6: Mobile adaptation + History drawer), tech stack table (TypeScript 5.9, React 19.2, React Router v7, React Query v5, Tailwind CSS v4, shadcn/ui Nova, Vite 8, Zustand, Axios, Lucide React), screenshots placeholder ("Screenshots coming soon"), local setup (prerequisites: Node 20+/npm, install: `npm install`, env: copy `.env.example` to `.env.local`, run: `npm run dev`), project structure (src/ directory tree with descriptions), architecture (5 constitution principles summarized), related: link to backend repo per research.md R-006
- [ ] T036 [US4] Add Russian section to README.md — equivalent content in Russian: Описание проекта, Функциональность по спринтам, Стек технологий, Скриншоты (placeholder), Локальный запуск, Структура проекта, Архитектура, Связанные проекты — separated from English section by horizontal rule per research.md R-006

**Checkpoint**: README complete — bilingual, all sections present

---

## Phase 7: User Story 5 — Pre-release Verification (Priority: P3)

**Goal**: Final codebase checks and .env.example creation

**Independent Test**: Run `npm run build`, `tsc -b`, `eslint .` — all clean. Check `.env.example` exists.

- [ ] T037 [P] [US5] Create .env.example in project root — list all required environment variables with placeholder values and descriptive comments: `VITE_API_BASE_URL=http://localhost:8080/api/v1 # Backend API base URL` (scan src/ for all `import.meta.env.VITE_*` references to ensure completeness) per spec FR-011
- [ ] T038 [P] [US5] Verify .gitignore includes `.env.local` — check existing .gitignore file, add `.env.local` entry if missing per spec FR-012
- [ ] T039 [US5] Run `npm run build` — verify zero errors and zero application-level warnings per spec FR-013
- [ ] T040 [US5] Run `npx tsc -b` — verify zero TypeScript errors across all files (including new test files) per spec FR-014
- [ ] T041 [US5] Run `npx eslint .` — verify zero new errors (pre-existing React Compiler warnings in GoalFormModal, HabitFormModal, LoginPage are acceptable) per spec FR-015

**Checkpoint**: Codebase passes all pre-release verification checks

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all deliverables

- [ ] T042 Run `npx vitest run --coverage` — confirm all unit/component tests pass and hooks coverage >= 70% per spec SC-001/SC-002
- [ ] T043 Verify Playwright tests are runnable: confirm `npx playwright test --list` shows all 5 spec files (auth, habits, goals, profile, mobile) per spec SC-003
- [ ] T044 Review git log — confirm clean commit history with conventional commit messages per spec US5 AS-6

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: T007-T010 can run in parallel; T011 depends on T007-T010; T012 independent
- **US1 (Phase 3)**: Depends on T005 (setup.ts) + T011 (handlers/index.ts) + T012 (test-utils.tsx)
- **US2 (Phase 4)**: Depends on T006 (playwright.config.ts) — independent of US1
- **US3 (Phase 5)**: No dependencies on other phases — can start after Phase 1
- **US4 (Phase 6)**: No dependencies — can start after Phase 1
- **US5 (Phase 7)**: Depends on US1 (test files must pass tsc/eslint)
- **Polish (Phase 8)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (Unit/Component Tests)**: Depends on Foundational phase (MSW handlers)
- **US2 (E2E Tests)**: Independent — needs only Playwright config from Setup
- **US3 (Postman Collection)**: Fully independent — no code dependencies
- **US4 (README)**: Fully independent — no code dependencies
- **US5 (Pre-release Verification)**: Depends on US1 (new test files must compile)

### Parallel Opportunities

**After Phase 1 completes, these can run in parallel:**
- Phase 2 (MSW handlers) + US2 setup (T023-T027) + US3 (Postman) + US4 (README)

**After Phase 2 completes:**
- US1 (all hook + component tests can run in parallel: T013-T021)

**Fully independent (can start anytime after Setup):**
- US3 (Postman) + US4 (README)

---

## Parallel Example: Phase 2 (MSW Handlers)

```
# All four handler files can be written simultaneously:
Task T007: src/test/handlers/auth.ts
Task T008: src/test/handlers/habits.ts
Task T009: src/test/handlers/goals.ts
Task T010: src/test/handlers/users.ts

# Then sequentially:
Task T011: src/test/handlers/index.ts (needs T007-T010)
```

## Parallel Example: US1 (Tests)

```
# All hook tests can run in parallel (different files):
Task T013: useAuth.test.ts
Task T014: useHabits.test.ts
Task T015: useGoals.test.ts
Task T016: useUsers.test.ts
Task T017: useHabitLogs.test.ts

# All component tests can run in parallel (different files):
Task T018: LoginPage.test.tsx
Task T019: HabitCard.test.tsx
Task T020: GoalCard.test.tsx
Task T021: HabitFormModal.test.tsx
```

## Parallel Example: Independent Stories

```
# These can all run in parallel (completely different systems):
US2: Playwright E2E tests (tests/e2e/*.spec.ts)
US3: Postman collection update (Postman MCP)
US4: README.md (project root)
```

---

## Implementation Strategy

### MVP First (US1 — Unit/Component Tests)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational MSW handlers (T007–T012)
3. Complete Phase 3: US1 — Hook + component tests (T013–T022)
4. **STOP and VALIDATE**: `npx vitest run --coverage` passes with 70%+ hooks coverage
5. This delivers automated test safety net for the codebase

### Incremental Delivery

1. Setup + Foundational → test infrastructure ready
2. US1 (Unit/Component Tests) → regression safety net (MVP!)
3. US2 (E2E Tests) → full user flow coverage
4. US3 (Postman) + US4 (README) → documentation complete
5. US5 (Pre-release Verification) → build/lint/type-check clean
6. Polish → release candidate ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Total: 44 tasks across 8 phases
- US1 has the most tasks (10 test files + 1 verification = 11 tasks) — it's the core deliverable
- US3 (Postman) uses MCP tools, not file creation — tasks describe MCP operations
- E2E tests (US2) require running frontend + backend — cannot be automated in CI without webServer config
- All test code in English, behavioral assertions only, no snapshots per spec FR-018
