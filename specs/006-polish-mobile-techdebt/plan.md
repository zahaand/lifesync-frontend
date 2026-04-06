# Implementation Plan: Polish — Mobile Adaptation + Tech Debt

**Branch**: `006-polish-mobile-techdebt` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-polish-mobile-techdebt/spec.md`

## Summary

Sprint 6 delivers two workstreams: (1) responsive mobile/tablet adaptation for all existing pages (Layout, Dashboard, Habits, Goals, Profile) using Tailwind breakpoints (md: 768px, lg: 1024px), and (2) TD-002 — a habit completion history drawer using shadcn Sheet component with paginated log entries from a new API endpoint.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+  
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, Zustand, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner, Tailwind CSS v4, Vite 8  
**Storage**: N/A (backend-managed)  
**Testing**: `tsc -b` + `eslint .` (constitution requirement)  
**Target Platform**: Web — modern mobile browsers (Safari iOS 15+, Chrome Android 10+), tablet, desktop  
**Project Type**: Single-page web application (frontend only)  
**Performance Goals**: Sidebar overlay open/close < 1s with smooth animation; history drawer first page load < 2s  
**Constraints**: Mobile-first approach; Tailwind responsive prefixes (sm:, md:, lg:); no `any` types; all API calls through `src/api/`; shadcn/ui components only  
**Scale/Scope**: 5 existing pages, 1 new Sheet component, 1 new API endpoint integration, ~15 files modified

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | New `getHabitLogs` function will be added to `src/api/habits.ts`. No direct Axios calls from components. |
| II. Server State via React Query | PASS | New `useHabitLogs` hook will use React Query with `useInfiniteQuery` for paginated log fetching. |
| III. Component-Logic Separation | PASS | Drawer logic (open/close, pagination) lives in hooks. Components render only. |
| IV. Type Safety | PASS | New types for `HabitLogPageResponse` in `src/types/habits.ts`. Strict typing maintained. |
| V. Design System Fidelity | PASS | Sheet from shadcn/ui for drawer. Lucide icons for hamburger (Menu) and back button (ArrowLeft). Accent color preserved. |
| Technology Constraints | PASS | Tailwind responsive classes only. `@/` imports. English UI text. React Router v7. |
| Development Workflow | PASS | Branch `006-polish-mobile-techdebt` follows naming convention. |

**Gate result**: PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/006-polish-mobile-techdebt/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── habits.ts              # Existing habit API (no changes)
│   └── habitLogs.ts           # NEW: getHabitLogs endpoint
├── components/
│   ├── habits/
│   │   ├── HabitCard.tsx       # Mobile action button adaptation
│   │   └── HabitHistoryDrawer.tsx  # NEW: Sheet-based history drawer
│   ├── shared/
│   │   └── Layout.tsx          # Responsive sidebar (hamburger + icon-only)
│   └── ui/
│       └── sheet.tsx           # NEW: shadcn Sheet component (via CLI)
├── hooks/
│   ├── useHabitLogs.ts         # NEW: useHabitLogs infinite query hook
│   └── useIsMobile.ts          # NEW: useIsMobile breakpoint hook
├── pages/
│   ├── DashboardPage.tsx       # Responsive grid adjustments
│   ├── GoalsPage.tsx           # Mobile list/detail toggle
│   ├── HabitsPage.tsx          # Mobile padding, filter scroll, history button
│   └── ProfilePage.tsx         # Mobile padding adjustments
└── types/
    ├── habits.ts               # Existing habit types (no changes)
    └── habitLogs.ts            # NEW: HabitLog, HabitLogPageResponse types
```

**Structure Decision**: Existing `src/` structure fully supports this feature. No new top-level directories needed. One new component (`HabitHistoryDrawer`), one new hook (`useIsMobile`), one new shadcn component (`sheet`). All other changes are modifications to existing files.

## Complexity Tracking

> No constitution violations. Table not needed.
