# Tasks: Auth Pages, Routing & App Layout

**Input**: Design documents from `/specs/001-auth-routing-layout/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/auth-api.md, research.md

**Tests**: Not requested — manual verification per quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies and add required shadcn/ui components

- [ ] T001 Install new dependencies: `npm install zustand react-hook-form @hookform/resolvers zod`
- [ ] T002 Add required shadcn/ui components via CLI: Tabs, Input, Label, Card, Separator (into src/components/ui/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, auth store, API layer, and minimal routing shell that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Define auth types (`User`, `RegisterRequest`, `LoginRequest`, `TokenResponse`) and Zod validation schemas (`registerSchema`, `loginSchema`) in src/types/auth.ts — use `type` declarations (not `interface`), infer form types from Zod schemas; validation rules: email RFC format, password min 8 chars, username `^[a-z0-9_-]+$` 3–32 chars
- [ ] T004 [P] Create Zustand auth store in src/stores/authStore.ts — `accessToken` (memory only, NOT persisted), `refreshToken` + `user` persisted via Zustand `persist` middleware with `localStorage`; expose actions: `setTokens(access, refresh, user)`, `setAccessToken(token)`, `clearAuth()`, `getRefreshToken()`; derive `isAuthenticated` from `accessToken !== null || refreshToken !== null`
- [ ] T005 Create Axios instance in src/api/client.ts — configure `baseURL` from `import.meta.env.VITE_API_BASE_URL`, add request interceptor that attaches `Authorization: Bearer {accessToken}` from authStore on every request (skip if no token); do NOT add 401 refresh interceptor yet (deferred to US4)
- [ ] T006 Implement auth API functions in src/api/auth.ts — `register(data: RegisterRequest): Promise<void>`, `login(data: LoginRequest): Promise<TokenResponse>`, `refresh(refreshToken: string): Promise<TokenResponse>`, `logout(refreshToken: string): Promise<void>`; all functions use the Axios instance from src/api/client.ts; match request/response shapes from contracts/auth-api.md
- [ ] T007 Set up minimal App.tsx in src/App.tsx — wrap app in `QueryClientProvider` (create `QueryClient` instance) and `BrowserRouter`; define single route: `/login` renders a placeholder `<div>Login</div>`; catch-all `*` redirects to `/login`; remove existing empty App component and App.css import

**Checkpoint**: Foundation ready — types compile, store persists refreshToken, API client attaches Bearer header, router renders /login

---

## Phase 3: User Story 1 — New User Registration (Priority: P1) MVP

**Goal**: A new user can register via the Sign Up form; on success, the view switches to Sign In tab with a success message

**Independent Test**: Navigate to /login?tab=signup, fill in email + username + password, submit → see success message and auto-switch to Sign In tab

### Implementation for User Story 1

- [ ] T008 [US1] Implement `useRegister` mutation hook in src/hooks/useAuth.ts — use `useMutation` from `@tanstack/react-query` wrapping `authApi.register()`; on success (201): return success signal for the component to handle tab switch; on 409 error: parse `field` from response and set field-level error via React Hook Form `setError`; on 422: parse `errors` array and set field-level errors; expose `isPending` for submit button disable state
- [ ] T009 [US1] Build LoginPage with tabbed layout and Sign Up form in src/pages/LoginPage.tsx — use shadcn/ui Tabs (Sign In / Sign Up); manage active tab via URL search params (`?tab=signin` / `?tab=signup`, default `signin`); Sign Up tab: React Hook Form with Zod `registerSchema` resolver, three fields (email, username, password) using shadcn/ui Input + Label inside a Card; on submit: call `useRegister`; on success: switch tab to `signin` and show success message "Account created successfully. Please sign in." (use a state variable cleared on tab change); on validation error: show inline errors per field; FR-015: disable submit Button while `isPending`; FR-014: apply accent color #534AB7 to submit button and active tab indicator via Tailwind classes (e.g., `bg-[#534AB7]`)
- [ ] T010 [US1] Wire LoginPage into App.tsx route — replace placeholder `/login` route element with `<LoginPage />`

**Checkpoint**: Registration flow works end-to-end — form validates, API call fires, success/error states display correctly

---

## Phase 4: User Story 2 — Existing User Login (Priority: P1)

**Goal**: A registered user can sign in; on success, tokens are saved to authStore and the user is redirected to the returnUrl or /dashboard

**Independent Test**: Navigate to /login, enter valid credentials on Sign In tab, submit → tokens stored in authStore, browser redirects to /dashboard

### Implementation for User Story 2

- [ ] T011 [US2] Implement `useLogin` mutation hook in src/hooks/useAuth.ts — use `useMutation` wrapping `authApi.login()`; on success: call `authStore.setTokens(accessToken, refreshToken, user)`; on 401: set form error with hardcoded message "Invalid email or password" (FR-017); on 403: set form error with "Your account has been suspended. Please contact support." (FR-018); expose `isPending` for submit button disable state
- [ ] T012 [US2] Add Sign In form to LoginPage in src/pages/LoginPage.tsx — Sign In tab: React Hook Form with Zod `loginSchema` resolver, two fields (email, password) using shadcn/ui Input + Label inside a Card; on submit: call `useLogin`; on success: read `returnUrl` from URL search params, validate it is an internal path (starts with `/`, no `://` or `//` — FR-019), navigate to validated returnUrl or `/dashboard`; on error: display form-level error banner; FR-015: disable submit Button while `isPending`; FR-011: if user is already authenticated (check `authStore.isAuthenticated`), redirect to /dashboard on page load via `useEffect` + `useNavigate`

**Checkpoint**: Full login flow works — validation, API call, token storage, redirect to dashboard (or returnUrl)

---

## Phase 5: User Story 3 — Protected Route Access (Priority: P2)

**Goal**: Unauthenticated users are redirected to /login when accessing protected routes; authenticated users see pages within the Layout shell (sidebar + main area)

**Independent Test**: While unauthenticated, navigate to /dashboard → redirected to /login?returnUrl=/dashboard; login → redirected back to /dashboard with sidebar visible

### Implementation for User Story 3

- [ ] T013 [P] [US3] Create ProtectedRoute component in src/components/shared/ProtectedRoute.tsx — check `authStore.isAuthenticated`; if not authenticated: redirect to `/login?returnUrl={currentPath}` using `useNavigate` + `useLocation`; if authenticated: render `<Outlet />` (or children); use Zustand's `useStore` selector for reactivity
- [ ] T014 [P] [US3] Create Layout component in src/components/shared/Layout.tsx — sidebar (fixed left) + scrollable main content area using `<Outlet />`; sidebar contains: user display section (show `user.displayName ?? user.username` and `user.email` from authStore), static placeholder nav items ("Dashboard", "Settings" — non-functional links styled with Lucide icons: `LayoutDashboard`, `Settings`), and a logout button at the bottom (placeholder, wired in US5); style sidebar with Tailwind (e.g., `w-64 border-r bg-sidebar text-sidebar-foreground`); main area: `flex-1 p-6 overflow-auto`
- [ ] T015 [P] [US3] Create placeholder DashboardPage in src/pages/DashboardPage.tsx — simple page with heading "Dashboard" and subtitle "Welcome to LifeSync" to confirm authenticated access
- [ ] T016 [US3] Update App.tsx with full route configuration in src/App.tsx — nested route structure: public routes (`/login` → LoginPage), protected routes wrapped in `<ProtectedRoute>` → `<Layout>` → child routes (`/dashboard` → DashboardPage); catch-all `*` redirects to `/login`

**Checkpoint**: Route protection works — unauthenticated users bounce to /login, authenticated users see Layout with sidebar and dashboard content

---

## Phase 6: User Story 4 — Session Persistence Across Reloads (Priority: P2)

**Goal**: Authenticated sessions survive page refresh; expired access tokens are silently refreshed using the stored refresh token

**Independent Test**: Login, refresh the page → user remains on dashboard without re-login; wait for access token to expire → next API call silently refreshes

### Implementation for User Story 4

- [ ] T017 [US4] Add 401 refresh interceptor with mutex pattern to src/api/client.ts — add Axios response interceptor: on 401 (and request was NOT to `/auth/refresh` or `/auth/login`), check if a refresh is already in-flight (`let refreshPromise: Promise | null`); if yes, await it; if no, call `authApi.refresh(authStore.getRefreshToken())`, store the promise, on success call `authStore.setTokens()` and retry the original request with new accessToken; on refresh failure: call `authStore.clearAuth()` and redirect to `/login` via `window.location.href`; always clear `refreshPromise` in finally block
- [ ] T018 [US4] Implement auth rehydration on app load in src/App.tsx — on initial render, if `authStore.refreshToken` exists but `authStore.accessToken` is null (page reload scenario): call `authApi.refresh()` to obtain a new access token before rendering protected content; show a loading spinner (or blank screen) during rehydration; on failure: clear auth and let ProtectedRoute handle redirect; wrap rehydration in a top-level component or `useEffect` in App

**Checkpoint**: Session persists across reloads — refresh token in localStorage restores the session; concurrent 401s are deduplicated via mutex

---

## Phase 7: User Story 5 — User Logout (Priority: P3)

**Goal**: Authenticated user can log out; session is cleared and user is redirected to /login

**Independent Test**: While logged in, click logout in sidebar → redirected to /login, cannot access /dashboard

### Implementation for User Story 5

- [ ] T019 [US5] Implement `useLogout` mutation hook in src/hooks/useAuth.ts — use `useMutation` wrapping `authApi.logout(authStore.getRefreshToken())`; on success (or failure — always clear locally): call `authStore.clearAuth()`, navigate to `/login`; expose `isPending` to disable logout button during request
- [ ] T020 [US5] Wire logout button in Layout sidebar in src/components/shared/Layout.tsx — replace placeholder logout button with functional button using `useLogout` hook; show `LogOut` Lucide icon + "Log out" text; disable while `isPending`; position at bottom of sidebar

**Checkpoint**: Full logout flow works — API call invalidates server session, local state cleared, redirected to /login

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, cleanup, and consistency checks

- [ ] T021 [P] Verify accent color #534AB7 is applied consistently across auth page (submit buttons, active tab, links) in src/pages/LoginPage.tsx
- [ ] T022 [P] Create .env.example with `VITE_API_BASE_URL=http://localhost:8080/api` in project root
- [ ] T023 Run `tsc -b` and `eslint .` — fix any TypeScript or lint errors across all new files
- [ ] T024 Walk through quickstart.md verification steps (7 steps) end-to-end to confirm all flows work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001, T002) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — can start immediately after Phase 2
- **US2 (Phase 4)**: Depends on US1 (shares LoginPage.tsx) — must complete after Phase 3
- **US3 (Phase 5)**: Depends on Foundational — can start in parallel with US1/US2 (different files: ProtectedRoute, Layout, DashboardPage) but T016 (App.tsx routes) should come after T010
- **US4 (Phase 6)**: Depends on US2 (needs login working) and US3 (needs protected routes) — modifies src/api/client.ts and src/App.tsx
- **US5 (Phase 7)**: Depends on US3 (needs Layout sidebar) — modifies src/components/shared/Layout.tsx and src/hooks/useAuth.ts
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational)
        ├─► US1 (Registration) ─► US2 (Login) ─┐
        │                                        ├─► US4 (Session Persistence)
        └─► US3 (Protected Routes) ─────────────┘
              └─► US5 (Logout)
                    └─► Phase 8 (Polish)
```

### Within Each User Story

- Hook implementation before page/component wiring
- Types and schemas available from Foundational phase
- Story complete before moving to next priority (unless [P] on different files)

### Parallel Opportunities

- **Phase 2**: T003, T004 can run in parallel (different files)
- **Phase 3 + Phase 5 (partial)**: T013, T014, T015 (ProtectedRoute, Layout, DashboardPage) can run in parallel with US1 tasks since they're different files
- **Phase 7**: T019, T020 touch different files but T020 depends on T019's hook

---

## Parallel Example: Foundational Phase

```text
# These can run in parallel (different files):
T003: "Define auth types and Zod schemas in src/types/auth.ts"
T004: "Create Zustand auth store in src/stores/authStore.ts"

# Then sequentially (T005 needed before T006):
T005: "Create Axios instance in src/api/client.ts"
T006: "Implement auth API functions in src/api/auth.ts"
```

## Parallel Example: US3 Components

```text
# These can all run in parallel (different files):
T013: "Create ProtectedRoute in src/components/shared/ProtectedRoute.tsx"
T014: "Create Layout in src/components/shared/Layout.tsx"
T015: "Create DashboardPage in src/pages/DashboardPage.tsx"

# Then wire them together:
T016: "Update App.tsx with full route configuration"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install deps, add shadcn components)
2. Complete Phase 2: Foundational (types, store, API client, basic routing)
3. Complete Phase 3: User Story 1 (registration form)
4. **STOP and VALIDATE**: Register a user → success message → tab switches
5. Demo-ready: registration works independently

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Registration) → Test independently → MVP
3. US2 (Login) → Test independently → Auth flow complete
4. US3 (Protected Routes + Layout) → Test independently → App shell ready
5. US4 (Session Persistence) → Test independently → Production-grade auth
6. US5 (Logout) → Test independently → Full sprint complete
7. Polish → Final validation

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- No test tasks generated — manual verification per quickstart.md
- All imports MUST use `@/` path alias (constitution constraint)
- All types MUST use `type` not `interface` (constitution constraint)
- All UI components MUST use shadcn/ui primitives (constitution constraint)
- Commit after each task or logical group using Conventional Commits format
