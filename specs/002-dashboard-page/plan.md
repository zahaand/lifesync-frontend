# Implementation Plan: Dashboard Page

**Branch**: `002-dashboard-page` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-dashboard-page/spec.md`

## Summary

Build the first authenticated page — Dashboard — within the existing Layout shell from Sprint 1. The page displays a personalized greeting, four summary stat cards (today's habits, best streak, active goals, completed goals), a "Today's habits" checklist with optimistic toggle and streak badges, and an "Active goals" card with progress bars and milestones. Adds habits and goals API layer, React Query hooks, and new TypeScript types. Introduces shadcn/ui Skeleton, Checkbox, Progress, Badge, Dialog, and Sonner for toast notifications.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, Zustand, shadcn/ui (Nova preset) + Radix primitives, Lucide React, Sonner (new)
**Storage**: localStorage (auth only, unchanged from Sprint 1)
**Testing**: Manual verification this sprint (test infrastructure deferred)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: Dashboard load < 3 seconds, optimistic toggle < 100ms visual feedback
**Constraints**: All imports via `@/` alias; no `any` types; `strict: true`; Tailwind CSS v4 only; English UI text
**Scale/Scope**: 1 page (DashboardPage replacement), 2 type files, 2 API files, 2 hook files, ~6 new shadcn components, 1 new npm dep (sonner)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. API-Layer Isolation | PASS | All HTTP calls in `src/api/habits.ts` and `src/api/goals.ts` using the Axios instance from `src/api/client.ts`. Components/hooks never import axios directly. |
| II. Server State via React Query | PASS | `useHabits`, `useGoals`, `useGoalsSummary` use `useQuery`. `useCompleteHabit`, `useUncompleteHabit` use `useMutation` with optimistic update pattern. No API data stored in useState or Zustand. |
| III. Component-Logic Separation | PASS | Data fetching and business logic in `src/hooks/useHabits.ts` and `src/hooks/useGoals.ts`. DashboardPage handles rendering only. Greeting/date computation is a pure utility. |
| IV. Type Safety | PASS | All types in `src/types/habits.ts` and `src/types/goals.ts` using `type` declarations. No `any`. `const`/`let` only. |
| V. Design System Fidelity | PASS | UI built with shadcn/ui Skeleton, Checkbox, Progress, Badge, Dialog, Card. Sonner for toasts. Accent color #534AB7. Icons from Lucide React. Custom components in `src/components/shared/`. |

**Technology Constraints Check**:

| Constraint | Status |
|------------|--------|
| Build: Vite 8 + @tailwindcss/vite | PASS — no changes |
| Styling: Tailwind CSS v4 only | PASS — no inline styles |
| Routing: React Router v7 declarative | PASS — no route changes needed (dashboard route exists) |
| Imports: @/ path alias only | PASS — enforced in all new files |
| Language: English UI text | PASS — all labels, messages, placeholders in English |
| New dependencies: justified | PASS — sonner only (see research.md R-006) |

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-page/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup and verification steps
├── contracts/
│   ├── habits-api.md    # Phase 1: Habits API contract
│   └── goals-api.md     # Phase 1: Goals API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                                # Add Toaster component (Sonner)
├── types/
│   ├── auth.ts                            # (unchanged from Sprint 1)
│   ├── habits.ts                          # NEW: Habit, HabitLog, HabitPageResponse
│   └── goals.ts                           # NEW: Goal, Milestone, GoalPageResponse
├── api/
│   ├── client.ts                          # (unchanged from Sprint 1)
│   ├── auth.ts                            # (unchanged from Sprint 1)
│   ├── habits.ts                          # NEW: getHabits(), completeHabit(), uncompleteHabit()
│   └── goals.ts                           # NEW: getGoals()
├── hooks/
│   ├── useAuth.ts                         # (unchanged from Sprint 1)
│   ├── useHabits.ts                       # NEW: useHabits(), useCompleteHabit(), useUncompleteHabit()
│   └── useGoals.ts                        # NEW: useGoals(), useGoalsSummary()
├── stores/
│   └── authStore.ts                       # (unchanged — username read for greeting)
├── components/
│   ├── ui/                                # shadcn/ui managed
│   │   ├── skeleton.tsx                   # NEW via CLI
│   │   ├── dialog.tsx                     # NEW via CLI
│   │   ├── checkbox.tsx                   # NEW via CLI
│   │   ├── progress.tsx                   # NEW via CLI
│   │   ├── badge.tsx                      # NEW via CLI
│   │   ├── sonner.tsx                     # NEW via CLI
│   │   └── (existing: button, card, input, label, separator, tabs)
│   └── shared/
│       ├── Layout.tsx                     # (unchanged from Sprint 1)
│       └── ProtectedRoute.tsx             # (unchanged from Sprint 1)
├── pages/
│   ├── LoginPage.tsx                      # (unchanged from Sprint 1)
│   └── DashboardPage.tsx                  # REWRITE: full dashboard implementation
└── lib/
    └── utils.ts                           # (unchanged)
```

**Structure Decision**: Follows existing `src/` convention. New files added to `src/types/`, `src/api/`, `src/hooks/` per constitution project structure mandate. No new top-level directories under `src/`.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
