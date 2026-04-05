# Implementation Plan: Goals Page — Full Goal Management

**Branch**: `004-goals-page` | **Date**: 2026-04-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-goals-page/spec.md`

## Summary

Build a full goal management page at `/goals` with a master-detail layout. Left column: scrollable goals list with filter tabs. Right panel: goal detail with progress tracking (0-100), milestone management (add/toggle/delete), and linked habits (link/unlink with streak display). Reuses existing Sprint 2 types/API/hooks, extending them with CRUD mutations, a detail endpoint hook, and milestone/habit-link mutations. All server state via React Query with cache invalidation. Design follows the "Calm & Focused" visual language from Sprint 3.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2  
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, React Hook Form + Zod, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner  
**Storage**: N/A (backend-managed)  
**Testing**: No test framework configured — validation via `tsc -b && eslint .`  
**Target Platform**: Web (desktop/tablet browsers)  
**Project Type**: SPA frontend (Vite 8 + Tailwind CSS v4)  
**Performance Goals**: Page load < 2s, detail selection feedback < 200ms  
**Constraints**: No mobile layout (desktop/tablet only for Sprint 4)  
**Scale/Scope**: Up to 100 goals fetched per page (pagination out of scope)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | All HTTP calls go through `src/api/goals.ts` via `apiClient`. No direct axios imports in components/hooks. |
| II. Server State via React Query | PASS | Goals list via `useGoals`/`useAllGoals`, detail via `useGoalDetail`, mutations via `useMutation` hooks. No server data in `useState`. |
| III. Component-Logic Separation | PASS | All data fetching and mutation logic in `src/hooks/useGoals.ts`. Components handle rendering and local UI state (selectedGoalId, modals, filter tab). |
| IV. Type Safety | PASS | Extended types in `src/types/goals.ts`. No `any`. Strict TypeScript. |
| V. Design System Fidelity | PASS | All UI via shadcn/ui components. Design tokens from approved mockup. Lucide icons. |

No violations. No Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/004-goals-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── goals-api.md     # API contract for goals endpoints
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   └── goals.ts              # Extend: add CRUD + milestone + habit-link functions
├── types/
│   └── goals.ts              # Extend: add request types, GoalDetail, GoalHabitLink
├── hooks/
│   └── useGoals.ts           # Extend: add useAllGoals, useGoalDetail, CRUD hooks,
│                              #   milestone hooks, habit-link hooks
├── components/
│   └── goals/                # NEW directory for goal-specific components
│       ├── GoalCard.tsx       # Goal list card
│       ├── GoalDetail.tsx     # Right panel detail view
│       ├── GoalEmptyState.tsx # Empty states (no goals, no selection)
│       ├── GoalFilters.tsx    # Filter tabs (All/Active/Completed)
│       ├── GoalFormModal.tsx  # Create/Edit goal modal
│       ├── GoalDeleteDialog.tsx  # Delete confirmation dialog
│       ├── GoalProgress.tsx   # Progress section (percentage, bar, input, update)
│       ├── GoalMilestones.tsx # Milestones section (list, add, toggle, delete)
│       └── GoalLinkedHabits.tsx  # Linked habits section (list, link, unlink)
├── pages/
│   └── GoalsPage.tsx          # NEW: main page with master-detail layout
└── App.tsx                    # Extend: add /goals route
```

**Structure Decision**: Follows the established pattern from Sprint 3 (feature-specific directory under `src/components/`). Each detail panel section gets its own component to keep GoalDetail manageable given the complexity (progress + milestones + linked habits).
