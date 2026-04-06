# Quickstart: Pre-release Testing & Documentation

**Feature**: 007-pre-release
**Date**: 2026-04-06

## Prerequisites

- Node 20+, npm
- Backend running at http://localhost:8080 (for E2E tests only)
- Postman account with access to workspace `659bf1f3-4123-48da-8297-51562399f53c`

## Install Test Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom msw jsdom @vitest/coverage-v8
npm install -D @playwright/test
npx playwright install chromium
```

## Run Unit & Component Tests

```bash
# Run all tests
npx vitest run

# Run with coverage report
npx vitest run --coverage

# Run in watch mode (development)
npx vitest

# Run specific test file
npx vitest run src/hooks/__tests__/useHabits.test.ts
```

## Run E2E Tests

```bash
# Ensure frontend and backend are running first:
# Terminal 1: npm run dev (frontend at :5173)
# Terminal 2: backend at :8080

# Run all E2E specs
npx playwright test

# Run specific spec
npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# View test report
npx playwright show-report
```

## Pre-release Verification Commands

```bash
# TypeScript check
npx tsc -b

# ESLint check
npx eslint .

# Production build
npm run build

# All three in sequence
npx tsc -b && npx eslint . && npm run build
```

## Test Scenarios to Verify

### Unit/Component Tests (Vitest)

1. **Hook: useAuth** — login success, login error (401), logout clears tokens
2. **Hook: useHabits** — list habits, complete habit (optimistic update), uncomplete, error rollback
3. **Hook: useGoals** — list goals, get detail, update progress
4. **Hook: useUsers** — get current user, update profile
5. **Hook: useHabitLogs** — first page load, pagination (fetchNextPage)
6. **Component: LoginPage** — form validation (empty fields), submit with credentials, error display
7. **Component: HabitCard** — checkbox toggle fires onComplete, streak badge renders, mobile dropdown menu
8. **Component: GoalCard** — progress bar width matches progress %, status badge color, selected state
9. **Component: HabitFormModal** — frequency toggle switches, CUSTOM shows day picker

### E2E Tests (Playwright)

1. **Auth flow** — register → dashboard → logout → login → dashboard
2. **Habits CRUD** — create → complete → edit → archive → restore → delete
3. **Goals CRUD** — create → progress update → milestone → complete → delete
4. **Profile** — update display name → verify on dashboard
5. **Mobile** — hamburger → sidebar → navigate → goals list/detail toggle

### Postman Collection

1. Open collection — verify 5 folders, no root-level requests
2. Run Auth folder — all requests return expected status codes
3. Run negative tests — 400 responses for invalid inputs
4. Verify Archive/Restore Habit requests exist with correct body
5. Verify Delete Account request exists

### README

1. English section: overview, features, tech stack, setup, structure, architecture
2. Russian section: equivalent content in Russian
3. Setup instructions: follow them on a fresh clone — app should start
