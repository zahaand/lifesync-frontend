# Research: Pre-release — Audit, Testing & Documentation

**Feature**: 007-pre-release
**Date**: 2026-04-06

## R-001: Vitest + Vite 8 + React 19 Compatibility

**Decision**: Use Vitest 3.x (latest stable) with `@vitejs/plugin-react` for JSX transform and jsdom environment.

**Rationale**: Vitest is the native test runner for Vite projects. Vitest 3.x fully supports Vite 8 and React 19. No separate Babel/Jest configuration needed — Vitest reuses the Vite config for transforms.

**Alternatives considered**:
- Jest: Requires separate Babel/SWC config, doesn't reuse Vite pipeline, slower for Vite projects.
- Bun test: Immature React Testing Library support, not standard in ecosystem.

**Configuration approach**:
- `vitest.config.ts`: extends Vite config, adds `test.environment: 'jsdom'`, `test.setupFiles: ['./src/test/setup.ts']`, `test.globals: true`
- `src/test/setup.ts`: imports `@testing-library/jest-dom/vitest` for matcher extensions
- Path alias: `resolve.alias: { '@': path.resolve(__dirname, './src') }` (already in vite.config.ts, inherited by vitest)

## R-002: MSW 2.x Handler Pattern for React Query

**Decision**: Use MSW 2.x with `http` handlers (not legacy `rest` from MSW 1.x). Set up a shared `server` instance started in `beforeAll` / stopped in `afterAll`.

**Rationale**: MSW 2.x is the current major version. The `http.get()` / `http.post()` pattern replaces the old `rest.get()` / `rest.post()`. React Query hooks work transparently with MSW since MSW intercepts at the network level (Axios → fetch → MSW).

**Handler structure**:
```
src/test/handlers/
├── auth.ts    — POST /auth/login, POST /auth/register, POST /auth/refresh, POST /auth/logout
├── habits.ts  — GET/POST/PATCH/DELETE /habits, POST /habits/{id}/complete, DELETE /habits/{id}/complete/{logId}, GET /habits/{id}/logs
├── goals.ts   — GET/POST/PATCH/DELETE /goals, POST /goals/{id}/progress, milestones, linked-habits
└── users.ts   — GET/PATCH /users/me, DELETE /users/me
```

**Error simulation**: Override individual handlers per test using `server.use(http.get('/path', () => HttpResponse.json(errorBody, { status: 401 })))`. Reset with `server.resetHandlers()` in `afterEach`.

**MSW + Axios note**: MSW 2.x intercepts `fetch` by default. Axios in browser uses `XMLHttpRequest`. For jsdom environment, MSW 2.x handles both via `setupServer()` — no special adapter needed.

## R-003: Testing Library + React Query Test Patterns

**Decision**: Wrap tested components/hooks in a `QueryClientProvider` with a fresh `QueryClient` per test (retry: false, gcTime: 0). Use `renderHook` from `@testing-library/react` for hook tests.

**Rationale**: Each test needs an isolated QueryClient to prevent cache bleeding between tests. Setting `retry: false` ensures errors surface immediately instead of retrying. `gcTime: 0` prevents stale cache.

**Test wrapper pattern**:
```typescript
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  })
}

function createWrapper() {
  const queryClient = createTestQueryClient()
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

**Optimistic update testing**: For `useCompleteHabit`, verify:
1. Before mutation: habit.completedToday = false
2. After mutate() call: habit.completedToday = true (optimistic)
3. On MSW error response: habit.completedToday = false (rollback)

## R-004: Playwright E2E Configuration

**Decision**: Use Playwright with chromium only, headless by default, 30-second timeout, baseURL `http://localhost:5173`.

**Rationale**: Chromium covers the primary browser. Adding Firefox/WebKit would triple test time for minimal coverage gain pre-release. Headless for CI compatibility; headed mode available via `--headed` flag for debugging.

**Test isolation strategy**: Each `.spec.ts` file creates a fresh user via `POST /api/v1/auth/register` with a unique username (e.g., `test-{timestamp}-{random}`). All test data (habits, goals) is created within the test. Cleanup in `afterAll` via `DELETE /api/v1/users/me` which cascades all user data.

**Configuration**:
```
playwright.config.ts:
  testDir: './tests/e2e'
  timeout: 30000
  use:
    baseURL: 'http://localhost:5173'
    browserName: 'chromium'
    headless: true
    screenshot: 'only-on-failure'
    trace: 'on-first-retry'
  retries: 0
  reporter: 'list'
```

**No webServer config**: Frontend and backend must be running before tests start. This avoids Playwright managing server lifecycle (which adds complexity and hides startup failures).

## R-005: Postman MCP Update Strategy

**Decision**: Use the Postman MCP tools to update the existing collection in place (ID: `24414635-48166e11-cb1a-40dc-af79-58717bc2bfee`).

**Rationale**: The collection ID is already known to the team. Updating in place preserves collection history, avoids duplicate collections, and maintains existing Postman environment variable bindings.

**Approach**:
1. Read current collection structure via `getCollection`
2. Create 5 folders: Auth, Users, Habits, Goals, Admin
3. Move existing requests into correct folders
4. Add missing requests with proper HTTP method, URL, headers, body
5. Verify final state via `getCollection`

**Folder structure with request count**:
- Auth (~7): Register, Login email, Login username, Refresh, Logout, 401 test, Re-login
- Users (~5): Get Profile, Update Profile, Connect Telegram, Delete Account, 401 test
- Habits (~16): CRUD + Archive/Restore + Complete/Uncomplete + Logs + Streak + negative tests
- Goals (~16): CRUD + Progress + Milestones + Link/Unlink Habits + negative tests
- Admin (~1): List Users 403

## R-006: README Bilingual Structure

**Decision**: Single README.md with English section first, followed by Russian section. Use a horizontal rule and language headers to separate sections.

**Rationale**: Backend README follows this same pattern. A single file avoids sync issues between README.md and README.ru.md. GitHub renders the first section as the repo preview.

**Structure**:
```
# LifeSync Frontend

[English content]

---

# LifeSync Frontend (RU)

[Russian content — same structure]
```

**Screenshots**: Placeholder text "Screenshots coming soon" — actual captures deferred to post-release.
