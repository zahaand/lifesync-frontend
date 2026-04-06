# Implementation Plan: Pre-release — Audit, Testing & Documentation

**Branch**: `007-pre-release` | **Date**: 2026-04-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-pre-release/spec.md`

## Summary

Sprint 7 adds automated testing infrastructure (Vitest unit/component + Playwright E2E), reorganizes the Postman API collection, creates bilingual README documentation, and performs pre-release verification. No application code changes — tests, docs, and tooling only.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: Vite 8, React Router v7, TanStack React Query v5, Axios, Zustand, shadcn/ui, Lucide React, Sonner
**Storage**: N/A (frontend only — backend at http://localhost:8080/api/v1)
**Testing**: Vitest 1.x (unit/component) + Playwright 1.x (E2E) — NEW for this sprint
**Target Platform**: Modern browsers (Chrome, Safari, Firefox), mobile viewports down to 320px
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: Vitest run < 60s, Playwright suite < 5 min
**Constraints**: MSW 2.x for API mocking (no real backend calls in unit tests); Playwright requires live backend for E2E
**Scale/Scope**: 5 hooks to test, 4 components to test, 5 E2E spec files, 1 Postman collection (~45 requests), 1 README

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. API-Layer Isolation | **PASS** | No new API calls. Tests mock existing `src/api/` layer via MSW. |
| II. Server State via React Query | **PASS** | Tests verify React Query hooks — no new server state management. |
| III. Component-Logic Separation | **PASS** | No new components or hooks. Tests validate existing separation. |
| IV. Type Safety (NON-NEGOTIABLE) | **PASS** | Test files in TypeScript with strict mode. No `any` types. |
| V. Design System Fidelity | **PASS** | No UI changes. Component tests render existing shadcn/ui components. |
| Technology Constraints — Vite | **PASS** | Vitest is native Vite integration. No additional bundlers. |
| Technology Constraints — Tailwind | **N/A** | No styling changes. |
| Technology Constraints — Imports | **PASS** | Test files use `@/` path alias via vitest resolve config. |
| Technology Constraints — Language | **PASS** | All test code in English. |
| Technology Constraints — Dependencies | **PASS** | New deps justified: vitest (test runner), @testing-library (component rendering), msw (API mocking), playwright (E2E), jsdom (DOM env) — all standard testing stack. |

**Gate result**: PASS — all principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/007-pre-release/
├── plan.md              # This file
├── research.md          # Phase 0: testing stack decisions
├── data-model.md        # Phase 1: test data models (MSW mock shapes)
├── quickstart.md        # Phase 1: how to run tests
├── contracts/           # Phase 1: MSW handler contracts
└── tasks.md             # Phase 2: task breakdown (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/                 # Existing API layer (tested via MSW)
├── components/          # Existing components (component tests)
│   ├── __tests__/       # NEW: component test files
│   ├── goals/
│   ├── habits/
│   ├── profile/
│   ├── shared/
│   └── ui/
├── hooks/               # Existing hooks (unit tests)
│   └── __tests__/       # NEW: hook test files
├── pages/               # Existing pages (LoginPage component test)
├── stores/              # Existing stores
├── test/                # NEW: test infrastructure
│   ├── setup.ts         # jest-dom matchers + MSW server setup
│   └── handlers/        # MSW request handlers
│       ├── auth.ts
│       ├── habits.ts
│       ├── goals.ts
│       └── users.ts
├── types/               # Existing types (shared by tests)
└── lib/                 # Existing utilities

tests/
└── e2e/                 # NEW: Playwright E2E specs
    ├── auth.spec.ts
    ├── habits.spec.ts
    ├── goals.spec.ts
    ├── profile.spec.ts
    └── mobile.spec.ts

vitest.config.ts         # NEW: Vitest configuration
playwright.config.ts     # NEW: Playwright configuration
.env.example             # NEW: Environment variable documentation
README.md                # NEW: Bilingual project documentation
```

**Structure Decision**: Test infrastructure follows co-location pattern for unit/component tests (`__tests__/` directories inside `src/hooks/` and `src/components/`) and a separate `tests/e2e/` directory for Playwright specs. MSW handlers centralized in `src/test/handlers/` for reuse across all test files.

## Complexity Tracking

No constitution violations — table not needed.
