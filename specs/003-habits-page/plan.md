# Implementation Plan: Habits Page — Full Habit Management

**Branch**: `003-habits-page` | **Date**: 2026-04-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-habits-page/spec.md`

## Summary

Build a full Habits management page at `/habits` enabling users to view, create, edit, archive, restore, delete, search, and filter habits. Extends Sprint 2's read-only habits integration with complete CRUD operations, client-side filtering, and form modals. All server state managed via React Query with optimistic updates for completion toggling.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2  
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, Zustand, React Hook Form + Zod, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner  
**Storage**: N/A (backend-managed)  
**Testing**: `tsc -b` + `eslint .` (no unit test framework configured)  
**Target Platform**: Web (SPA, Vite 8)  
**Project Type**: Web application (frontend SPA)  
**Performance Goals**: Optimistic UI updates within 200ms, page load <2s  
**Constraints**: All API calls via `src/api/`, server state via React Query, logic in hooks, shadcn/ui only, no `any` types, `@/` imports only, English UI text  
**Scale/Scope**: Single page with ~6 new components, 3 new hooks, type extensions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | All new endpoints (POST/PATCH/DELETE) added to `src/api/habits.ts`. No direct axios imports in components. |
| II. Server State via React Query | PASS | New mutations (`useCreateHabit`, `useUpdateHabit`, `useDeleteHabit`) defined in `src/hooks/useHabits.ts`. Filter/search state is local UI state (not server data), appropriately in `useState`. |
| III. Component-Logic Separation | PASS | All data-fetching and mutation logic in hooks. Components handle rendering and local UI state (modal open/close, filter tab, search query). |
| IV. Type Safety | PASS | New types (`DayOfWeek`, `CreateHabitRequest`, `UpdateHabitRequest`) in `src/types/habits.ts`. Existing `Habit` type extended. No `any` types. Zod schemas for form validation. |
| V. Design System Fidelity | PASS | Using shadcn/ui components (AlertDialog, Textarea to be installed). Accent `#534AB7`, custom colors from approved mockup. Lucide icons. No manual edits to `src/components/ui/`. |

**Technology Constraints**:
- Vite 8 + Tailwind CSS v4: PASS
- React Router v7 declarative routing: PASS (add `/habits` route to `App.tsx`)
- `@/` imports only: PASS
- English UI text: PASS
- New dependencies: shadcn/ui components only (alert-dialog, textarea) — no new npm packages

**Gate result**: ALL PASS — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-habits-page/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research decisions
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart guide
├── contracts/
│   └── habits-api.md    # API contract documentation
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   └── habits.ts              # [MODIFY] Add createHabit, updateHabit, deleteHabit
├── components/
│   ├── habits/                # [NEW DIRECTORY]
│   │   ├── HabitCard.tsx      # [NEW] Individual habit row component
│   │   ├── HabitFormModal.tsx  # [NEW] Shared create/edit modal
│   │   ├── HabitDeleteDialog.tsx # [NEW] Delete confirmation dialog
│   │   ├── HabitFilters.tsx    # [NEW] Filter tabs + search input
│   │   └── HabitEmptyState.tsx # [NEW] Empty state component
│   ├── shared/
│   └── ui/
│       ├── alert-dialog.tsx   # [NEW via shadcn CLI]
│       └── textarea.tsx       # [NEW via shadcn CLI]
├── hooks/
│   └── useHabits.ts           # [MODIFY] Add useAllHabits, useCreateHabit, useUpdateHabit, useDeleteHabit
├── pages/
│   └── HabitsPage.tsx         # [NEW] Main page component
├── types/
│   └── habits.ts              # [MODIFY] Add DayOfWeek, CreateHabitRequest, UpdateHabitRequest; extend Habit
└── App.tsx                    # [MODIFY] Add /habits route
```

**Structure Decision**: Follows existing project structure. New `src/components/habits/` directory groups feature-specific components (same pattern would apply to future goals components). No new top-level `src/` directories needed.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
