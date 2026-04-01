<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Modified principles: N/A (initial version)
  Added sections:
    - Core Principles (5 principles)
    - Technology Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ compatible (no constitution-specific refs)
    - .specify/templates/tasks-template.md ✅ compatible (no constitution-specific refs)
    - .specify/templates/commands/ — no command files found
  Follow-up TODOs: none
-->

# LifeSync Frontend Constitution

## Core Principles

### I. API-Layer Isolation

All HTTP communication with the backend MUST pass through dedicated
functions in `src/api/`. Components and hooks MUST NOT import or call
`axios` directly. The Axios instance in `src/api/` is the single point
for base URL configuration, Bearer token attachment, and 401/refresh
interceptor logic.

**Rationale**: Centralizing network calls prevents token-handling bugs,
enforces consistent error handling, and makes backend contract changes
a single-file update.

### II. Server State via React Query

All data fetched from the API MUST be managed through TanStack React
Query (`@tanstack/react-query`). Components MUST NOT store API response
data in `useState` or global stores. Cache invalidation, background
refetching, and loading/error states MUST be handled by React Query
hooks defined in `src/hooks/`.

**Rationale**: React Query provides deduplication, caching, and
background sync out of the box. Duplicating server state into local
state leads to stale data and synchronization bugs.

### III. Component-Logic Separation

Business logic and data-fetching MUST live in custom hooks inside
`src/hooks/`. React components MUST only handle rendering and local UI
state (modals, toggles, form inputs). Global client state (auth tokens,
current user) MUST live in `src/stores/authStore.ts` backed by
localStorage.

**Rationale**: Keeping logic in hooks makes it reusable across pages,
testable in isolation, and prevents components from becoming monolithic.

### IV. Type Safety (NON-NEGOTIABLE)

TypeScript `strict: true` MUST remain enabled. The `any` type is
forbidden — all values MUST have explicit or inferred types. Object
shapes MUST use `type` declarations (not `interface`). All types
mirroring backend DTOs MUST live in `src/types/`. Only `const` and
`let` are permitted — `var` is forbidden.

**Rationale**: Strict typing catches integration bugs at compile time,
especially mismatches between frontend types and backend API contracts.

### V. Design System Fidelity

All UI components MUST use shadcn/ui (Nova preset) and Radix primitives
from `src/components/ui/`. Files in `src/components/ui/` MUST NOT be
manually edited — they are managed by the `shadcn` CLI. Custom shared
components live in `src/components/shared/`. The accent color `#534AB7`
and the "Calm & Focused" visual language MUST be maintained. Icons MUST
come from Lucide React. The Figma file is the design source of truth.

**Rationale**: Consistent use of the design system ensures visual
coherence, accessibility via Radix, and prevents style drift between
pages.

## Technology Constraints

- **Build**: Vite 8 with `@tailwindcss/vite` plugin. No other CSS
  preprocessors or bundlers.
- **Styling**: Tailwind CSS v4 utility classes only. No inline `style`
  attributes except for truly dynamic values (e.g., progress bars).
- **Routing**: React Router v6. All routes defined declaratively.
  Protected routes MUST use the `ProtectedRoute` wrapper component.
- **Imports**: All imports MUST use the `@/` path alias. Relative
  imports (`../`) are forbidden except within the same directory.
- **Language**: All user-facing text (labels, buttons, placeholders,
  error messages) MUST be in English.
- **Dependencies**: New dependencies require justification. Prefer
  existing stack capabilities over adding new libraries.

## Development Workflow

- **Branch naming**: `{NNN}-{feature-slug}` for SDD sprints,
  `{type}/{short-desc}` for fixes.
- **Commits**: Conventional Commits format. English type prefix,
  Russian body. Example:
  ```
  feat: добавлена страница авторизации
  ```
- **Sprint cadence**: 5 sprints planned for MVP delivery
  (Auth → Dashboard → Habits → Goals → Profile).
- **Code review**: All changes MUST pass `tsc -b` and `eslint .`
  before merge. No TypeScript errors or lint warnings permitted.
- **Project structure**: The directory layout defined in the project
  context (`src/api/`, `src/components/`, `src/hooks/`, `src/pages/`,
  `src/stores/`, `src/types/`, `src/lib/`) MUST be respected. New
  top-level directories under `src/` require constitution amendment.

## Governance

This constitution is the authoritative source of project standards for
the LifeSync frontend. All implementation plans, specifications, and
task lists MUST be validated against these principles.

- **Amendments**: Any change to principles or constraints MUST be
  documented with a version bump, rationale, and migration plan for
  affected code.
- **Versioning**: Constitution follows semantic versioning —
  MAJOR for principle removals/redefinitions, MINOR for additions or
  material expansions, PATCH for clarifications and wording fixes.
- **Compliance**: Every feature plan MUST include a Constitution Check
  verifying adherence to all five principles before implementation
  begins.
- **Guidance**: Use `CLAUDE.md` for runtime development guidance that
  supplements this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
