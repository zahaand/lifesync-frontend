# Feature Specification: Pre-release — Audit, Testing & Documentation

**Feature Branch**: `007-pre-release`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "Sprint 7: Pre-release — full audit, testing, and documentation"

## Clarifications

### Session 2026-04-06

- Q: E2E test data strategy — fresh user per run, pre-existing account, or per spec file? → A: Fresh user per spec file — each `.spec.ts` creates its own user (register) and deletes it (DELETE /users/me) in afterAll for full isolation between test files.
- Q: MSW handler scope — happy paths only, or include error states? → A: Happy paths + error states — MSW mocks success AND error responses (401, 400, 404, network error) for tested endpoints.
- Q: Postman collection — update existing in place or create new? → A: Update in place — reorganize the existing collection (ID: 24414635-48166e11-cb1a-40dc-af79-58717bc2bfee), adding folders and missing requests directly.
- Q: README screenshots — actual captures, mockups, or skip? → A: Skip screenshots for now — add placeholder text "Screenshots coming soon", capture after release.
- Q: CI workflow — add GitHub Actions in Sprint 7 or defer? → A: Defer CI to deploy stage — no `.github/workflows/` in Sprint 7.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unit & Component Test Suite (Priority: P1)

A developer sets up and runs automated unit and component tests for the LifeSync frontend. They install Vitest with jsdom, Testing Library, and MSW for API mocking. MSW handlers simulate backend endpoints used by tested hooks/components — both success responses and error states (401, 400, 404, network errors) — so tests never call the real backend. The developer writes hook tests covering login/logout/token-refresh, habit CRUD with optimistic updates, goal CRUD with progress tracking, user profile updates, and habit log pagination. They also write component tests for LoginPage (form validation, submission, error display), HabitCard (checkbox toggle, streak badge, action menu), GoalCard (progress bar, status badge, selection), and HabitFormModal (form fields, frequency toggle, CUSTOM day picker). Running `vitest --coverage` produces a report showing 70%+ coverage for hooks and key components.

**Why this priority**: Automated tests are the foundation of release confidence — without them, no other pre-release activity (E2E, documentation) can confirm the application works correctly. Hook tests catch regression in business logic; component tests catch rendering and interaction bugs.

**Independent Test**: Run `npx vitest run --coverage` — all tests pass, coverage report shows >= 70% for `src/hooks/` and tested components.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** the developer runs `npm install` and `npx vitest run`, **Then** all unit and component tests pass with zero failures.
2. **Given** the MSW handlers are configured, **When** a hook test calls an API function, **Then** MSW intercepts the request and returns the mocked response without hitting the real backend.
3. **Given** the test suite is complete, **When** the developer runs `npx vitest run --coverage`, **Then** the coverage report shows >= 70% line coverage for `src/hooks/` and tested component files.
4. **Given** a hook test for `useCompleteHabit`, **When** the mutation is triggered, **Then** the test verifies optimistic UI update occurs immediately and rollback happens on server error.
5. **Given** a component test for LoginPage, **When** the user submits invalid credentials, **Then** the test verifies an error message is rendered.

---

### User Story 2 - E2E Test Suite (Priority: P1)

A developer sets up Playwright and writes end-to-end tests that exercise real user flows through the application running in a browser. Each spec file creates its own fresh user (register at start, DELETE /users/me in afterAll) for full isolation — no shared test accounts or pre-existing data dependencies. Tests cover authentication (register, login by email, login by username, wrong password error, logout, protected route redirect), habits (create DAILY/CUSTOM, complete, edit, archive, restore, delete, filter, search), goals (create, view detail, update progress, milestones, complete, delete), profile (update display name, link Telegram), and mobile navigation (hamburger menu, sidebar overlay, goals list/detail toggle). All E2E tests run against `http://localhost:5173` with the backend at `http://localhost:8080`.

**Why this priority**: E2E tests validate that the full application works as users experience it — they catch integration issues between frontend, routing, and backend that unit tests cannot detect. Essential for release sign-off.

**Independent Test**: Start frontend (`npm run dev`) and backend, then run `npx playwright test` — all specs pass across auth, habits, goals, profile, and mobile flows.

**Acceptance Scenarios**:

1. **Given** the frontend and backend are running locally, **When** the developer runs `npx playwright test`, **Then** all E2E test specs pass.
2. **Given** the auth E2E tests, **When** a user registers with valid credentials, **Then** they are redirected to `/dashboard` and the greeting shows their name.
3. **Given** the habits E2E tests, **When** a user creates a DAILY habit and checks the checkbox, **Then** the habit shows "Completed today" and the streak increments.
4. **Given** the goals E2E tests, **When** a user updates progress to 100%, **Then** the goal status changes to "Completed".
5. **Given** the mobile E2E tests at 375px viewport, **When** the hamburger button is tapped, **Then** the sidebar overlay slides in from the left.
6. **Given** a user is not authenticated, **When** they navigate to `/dashboard`, **Then** they are redirected to `/login`.

---

### User Story 3 - Postman Collection Update (Priority: P2)

A QA engineer or developer opens the LifeSync Postman collection and finds all API endpoints organized into logical folders (Auth, Users, Habits, Goals, Admin). Missing requests have been added (Archive Habit, Restore Habit, List Goals by status, Delete Account, Login by username, and negative test cases for Create CUSTOM habit without days and Update progress > 100). All 38+ requests are moved out of the root level into the correct folders. Each request has a descriptive name, correct HTTP method, URL, headers, and example body. The collection is usable for both manual API testing and automated Postman test runs.

**Why this priority**: The Postman collection is the primary tool for backend API verification and regression testing. An incomplete, unorganized collection slows down QA and makes it easy to miss broken endpoints before release.

**Independent Test**: Open the Postman collection — verify folder structure matches spec, all listed requests exist with correct method/URL/body, and negative test cases return expected error codes.

**Acceptance Scenarios**:

1. **Given** the updated Postman collection, **When** a developer opens it, **Then** all requests are organized into 5 folders: Auth, Users, Habits, Goals, Admin.
2. **Given** the Habits folder, **When** the developer inspects the requests, **Then** Archive Habit (PATCH isActive: false) and Restore Habit (PATCH isActive: true) are present.
3. **Given** the Goals folder, **When** the developer runs "List Goals Active Only", **Then** the request includes `?status=ACTIVE` query parameter.
4. **Given** the negative test requests, **When** "Create CUSTOM habit without days" is sent, **Then** the response is 400 Bad Request.
5. **Given** the negative test requests, **When** "Update progress > 100" is sent, **Then** the response is 400 Bad Request.
6. **Given** the Auth folder, **When** "Login by username" is sent with a username as identifier, **Then** the response returns a valid JWT token.
7. **Given** the Users folder, **When** "Delete Account" is sent, **Then** the request uses DELETE /users/me.

---

### User Story 4 - README Documentation (Priority: P2)

A new developer (or external reviewer) visits the lifesync-frontend GitHub repository and reads the README.md. They find a clear bilingual (English + Russian) overview of the project: what LifeSync is, the feature set delivered across Sprints 1-6, the tech stack, a "Screenshots coming soon" placeholder (actual captures deferred to post-release), local setup instructions (prerequisites, install, env config, run commands), a directory structure overview with brief descriptions, and the 5 architecture principles from the constitution. The README links to the companion lifesync-backend repository. The English section appears first, followed by the equivalent Russian section.

**Why this priority**: README is the first thing anyone sees when visiting the repository. A clear README with setup instructions reduces onboarding friction and demonstrates project maturity for pre-release.

**Independent Test**: Read README.md — verify it contains all listed sections in both English and Russian, links are valid, setup instructions work on a fresh clone.

**Acceptance Scenarios**:

1. **Given** the README.md file, **When** a developer reads it, **Then** it contains an English section followed by a Russian section with equivalent content.
2. **Given** the English section, **When** the developer looks for setup instructions, **Then** prerequisites (Node 20+, npm), install command (`npm install`), `.env.local` configuration, and run command (`npm run dev`) are documented.
3. **Given** the tech stack section, **When** the developer reads it, **Then** all major technologies are listed: TypeScript, React 19, React Router v7, React Query v5, Tailwind CSS v4, shadcn/ui, Vite 8.
4. **Given** the architecture section, **When** the developer reads it, **Then** all 5 constitution principles are summarized (API isolation, React Query, component-logic separation, type safety, design system fidelity).
5. **Given** the features section, **When** the developer reads it, **Then** features from all 6 sprints are listed (Auth, Dashboard, Habits, Goals, Profile, Mobile adaptation + History drawer).

---

### User Story 5 - Pre-release Verification (Priority: P3)

A developer performs final pre-release checks on the codebase. They verify that `.env.example` exists with all required environment variables documented (with placeholder values and comments). They confirm `.gitignore` includes `.env.local`. They run `npm run build` and confirm zero errors and warnings. They run `tsc -b` with zero TypeScript errors. They run `eslint .` with zero errors (warnings from pre-existing React Compiler issues are acceptable). They review the git log to confirm a clean, logical commit history. The codebase is ready for release tagging.

**Why this priority**: Pre-release verification is the final gate before tagging a release. While important, it depends on all other work being complete and is largely a checklist of validation commands.

**Independent Test**: Run the 4 commands (`npm run build`, `tsc -b`, `eslint .`, `git log --oneline`) and verify clean output. Check `.env.example` exists and `.gitignore` covers `.env.local`.

**Acceptance Scenarios**:

1. **Given** the `.env.example` file, **When** a developer reads it, **Then** all required variables are listed with placeholder values and explanatory comments.
2. **Given** the `.gitignore` file, **When** a developer checks it, **Then** `.env.local` is listed as an ignored pattern.
3. **Given** the developer runs `npm run build`, **When** the build completes, **Then** there are zero errors and zero warnings in the output.
4. **Given** the developer runs `npx tsc -b`, **When** the check completes, **Then** there are zero TypeScript errors.
5. **Given** the developer runs `npx eslint .`, **When** the check completes, **Then** there are zero new errors (pre-existing React Compiler warnings are acceptable).
6. **Given** the git history, **When** the developer runs `git log --oneline`, **Then** the commit history is clean with conventional commit messages.

---

### Edge Cases

- What happens when MSW handlers are not properly configured for a test? The test should fail with a clear "unhandled request" error from MSW, not silently pass or hang.
- What happens when Playwright tests run without the backend? Tests should fail fast with a connection refused error, not hang waiting for responses.
- What happens when the developer runs E2E tests on a database with pre-existing data? Each spec file creates its own isolated user and cleans up via DELETE /users/me in afterAll, so pre-existing data does not interfere.
- What happens when `npm run build` produces warnings from dependencies (not application code)? Dependency warnings are acceptable and do not block release; only application-level errors block.
- What happens when the Postman collection is imported into a different workspace? Environment variables (baseUrl, token) should be parameterized so the collection works in any workspace.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST include a Vitest configuration (`vitest.config.ts`) with jsdom environment and Testing Library + jest-dom setup in `src/test/setup.ts`.
- **FR-002**: MSW handlers MUST simulate backend API endpoints used by tested hooks/components, returning both success responses and error states (401 unauthorized, 400 bad request, 404 not found, network errors).
- **FR-003**: Unit tests MUST cover hooks: `useAuth` (login, logout, refresh), `useHabits` (list, complete with optimistic update + rollback), `useGoals` (list, detail, progress update), `useUsers` (current user, profile update), `useHabitLogs` (pagination).
- **FR-004**: Component tests MUST cover: LoginPage (form validation, submit, error), HabitCard (checkbox, streak, action menu), GoalCard (progress, status, selection), HabitFormModal (fields, frequency, CUSTOM days).
- **FR-005**: Test coverage for `src/hooks/` directory MUST be >= 70% line coverage. Hooks contain all business logic and are the primary test target. Overall project coverage is not required.
- **FR-006**: Playwright MUST be configured with `baseURL: http://localhost:5173`, chromium browser, and 30-second timeout.
- **FR-007**: E2E tests MUST cover: authentication flows (register, login email, login username, wrong password, logout, protected redirect), habit CRUD flows, goal CRUD flows, profile updates, and mobile navigation at 375px viewport. Each spec file MUST create a fresh user (register) and delete it (DELETE /users/me) in afterAll for full test isolation. If a spec file fails mid-run, the afterAll cleanup still executes via Playwright's built-in afterAll guarantee. Orphaned test accounts are acceptable and can be cleaned manually.
- **FR-008**: The Postman collection MUST be reorganized into 5 folders (Auth, Users, Habits, Goals, Admin) with all requests moved from root level.
- **FR-009**: The Postman collection MUST include missing requests: Archive Habit, Restore Habit, List Goals by status, Delete Account, Login by username, and negative tests (CUSTOM habit without days — 400, progress > 100 — 400).
- **FR-010**: README.md MUST contain bilingual (English + Russian) sections covering: project overview, features by sprint, tech stack, screenshots placeholder ("Screenshots coming soon" — actual captures deferred to post-release), local setup, project structure, architecture principles, and link to backend repo.
- **FR-011**: The `.env.example` file MUST list all required environment variables with placeholder values and descriptive comments.
- **FR-012**: The `.gitignore` file MUST include `.env.local`.
- **FR-013**: `npm run build` MUST complete with zero errors and zero application-level warnings.
- **FR-014**: `npx tsc -b` MUST complete with zero TypeScript errors.
- **FR-015**: `npx eslint .` MUST complete with zero errors (pre-existing warnings from React Compiler are acceptable).
- **FR-016**: All unit and component tests MUST NOT call the real backend — MSW MUST intercept all HTTP requests during test execution.
- **FR-017**: Test files MUST follow naming conventions: `*.test.ts` / `*.test.tsx` for unit/component tests, `*.spec.ts` for E2E tests.
- **FR-018**: All test code MUST be written in English with no snapshot tests — behavioral assertions only.

### Key Entities

- **Test Suite (Vitest)**: Collection of unit and component test files in `src/hooks/__tests__/` and `src/components/__tests__/`, using MSW for API mocking.
- **E2E Suite (Playwright)**: Collection of end-to-end test specs in `tests/e2e/`, running against live frontend + backend.
- **Postman Collection**: Organized API request set for manual and automated backend testing (Collection ID: `24414635-48166e11-cb1a-40dc-af79-58717bc2bfee`, Workspace ID: `659bf1f3-4123-48da-8297-51562399f53c`).
- **README**: Bilingual project documentation file at repository root.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npx vitest run` passes with zero test failures.
- **SC-002**: `npx vitest run --coverage` shows >= 70% line coverage for `src/hooks/` and tested component files.
- **SC-003**: `npx playwright test` passes all E2E specs when frontend and backend are running locally.
- **SC-004**: The Postman collection contains >= 45 organized requests across 5 folders with zero requests at root level.
- **SC-005**: README.md is readable, bilingual, and a new developer can set up the project locally by following its instructions alone.
- **SC-006**: `npm run build`, `tsc -b`, and `eslint .` all pass clean (zero errors).
- **SC-007**: `.env.example` contains all variables referenced in the codebase with descriptive comments.

## Assumptions

- Sprints 1-6 code is fully merged to main and stable — no active development on feature branches during Sprint 7.
- The backend is available locally at `http://localhost:8080/api/v1` for E2E test execution.
- The Postman workspace and collection are accessible via the provided IDs (collection: `24414635-48166e11-cb1a-40dc-af79-58717bc2bfee`, workspace: `659bf1f3-4123-48da-8297-51562399f53c`).
- Vitest with jsdom and Testing Library is compatible with the current Vite 8 + React 19 setup.
- MSW 2.x is used (not 1.x) — handler setup follows the `http.get()` / `http.post()` pattern, not the legacy `rest.get()` pattern.
- Playwright tests run in headless chromium by default; headed mode is used only for debugging.
- The lifesync-backend GitHub repository exists and can be linked from the README.
- Screenshots for README are deferred to post-release — README uses "Screenshots coming soon" placeholder.
- Pre-existing ESLint warnings (React Hook Form + React Compiler incompatibility in GoalFormModal, HabitFormModal, LoginPage) are known and acceptable for release.
- No new features or code changes are introduced in Sprint 7 — only tests, documentation, and verification.
- Test file locations: unit/component tests in `src/hooks/__tests__/*.test.ts` and `src/components/__tests__/*.test.tsx`; MSW handlers in `src/test/handlers/*.ts`; Vitest setup in `src/test/setup.ts`; E2E tests in `tests/e2e/*.spec.ts`; Playwright config in `playwright.config.ts` (root).
- MSW is configured with `onUnhandledRequest: 'warn'` — unhandled requests log a warning but do not fail tests. This prevents false failures from background React Query refetches not covered by handlers.
