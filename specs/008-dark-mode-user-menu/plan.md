# Implementation Plan: Dark Mode & User Menu Update

**Branch**: `008-dark-mode-user-menu` | **Date**: 2026-04-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-dark-mode-user-menu/spec.md`

## Summary

Add dark mode support to LifeSync frontend with class-based Tailwind CSS v4 dark mode, a Zustand theme store persisted to localStorage, an inline `<head>` script to prevent FOCT (flash of incorrect theme), and OS `prefers-color-scheme` detection for first-time visitors. Update the user chip dropdown menu to replace Profile with a theme toggle (Sun/Moon icon) while keeping Log out.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: Vite 8, React Router v7, TanStack React Query v5, Zustand, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner, Tailwind CSS v4
**Storage**: localStorage (theme preference key)
**Testing**: Vitest + React Testing Library + MSW (happy-dom)
**Target Platform**: Web browser (desktop 1280px + mobile 375px)
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: Zero flash of wrong theme on page load; instant theme toggle (<16ms visual update)
**Constraints**: No backend changes; all 46 existing tests must pass; tsc --noEmit zero errors
**Scale/Scope**: ~10 source files to modify, 1 new store file, 1 inline script addition

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | No API calls needed — purely frontend/localStorage feature |
| II. Server State via React Query | PASS | Theme is client-only state, not server state. Zustand is the correct choice per Principle III |
| III. Component-Logic Separation | PASS | Theme logic lives in `src/stores/themeStore.ts` (Zustand). Components only consume the store and render |
| IV. Type Safety | PASS | Theme type `'light' \| 'dark'` is a strict union. No `any` types. All types use `type` declarations |
| V. Design System Fidelity | PASS | shadcn/ui components already support dark mode via CSS variables. Custom colors get `dark:` variants. No manual edits to `src/components/ui/`. Icons from Lucide React (Sun, Moon) |

**Technology Constraints**:
- Styling via Tailwind CSS v4 utility classes with `dark:` prefix — PASS
- Imports use `@/` path alias — PASS
- User-facing text in English — PASS
- No new dependencies required — PASS (Zustand, Lucide React already in project)

## Project Structure

### Documentation (this feature)

```text
specs/008-dark-mode-user-menu/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── stores/
│   ├── authStore.ts          # Existing — no changes
│   └── themeStore.ts         # NEW — Zustand theme store
├── components/
│   └── shared/
│       └── Layout.tsx        # MODIFY — user chip menu, sidebar colors, version label
├── pages/
│   ├── LoginPage.tsx         # MODIFY — dark mode background & form colors
│   ├── DashboardPage.tsx     # MODIFY — hardcoded color dark variants
│   ├── HabitsPage.tsx        # MODIFY — badge dark variants
│   ├── GoalsPage.tsx         # MODIFY — badge dark variants
│   └── ProfilePage.tsx       # MODIFY — card dark variants
├── components/
│   ├── habits/
│   │   └── HabitCard.tsx     # MODIFY — streak badge dark variant
│   ├── goals/
│   │   └── GoalCard.tsx      # MODIFY — status badge dark variants
│   └── profile/
│       ├── AccountCard.tsx   # MODIFY — hardcoded color dark variants
│       ├── StatsCard.tsx     # MODIFY — hardcoded color dark variants
│       ├── TelegramCard.tsx  # MODIFY — hardcoded color dark variants
│       └── DangerZoneCard.tsx # MODIFY — hardcoded color dark variants
├── index.css                 # VERIFY — dark mode CSS variables already present
└── ...

index.html                    # MODIFY — add inline theme script in <head>

src/stores/__tests__/
└── themeStore.test.ts        # NEW — unit tests for theme store
```

**Structure Decision**: Single frontend SPA. All changes within existing `src/` directory structure. One new file (`themeStore.ts`) follows existing store pattern. No new top-level directories.

## Complexity Tracking

> No constitution violations — table not needed.

## Design Decisions

### D1: Theme Store Design

Create `src/stores/themeStore.ts` following the existing `authStore.ts` pattern with Zustand `persist` middleware.

**Store shape**:
- `theme: 'light' | 'dark'` — current active theme
- `toggleTheme()` — switches between light/dark, persists to localStorage, updates `<html>` class
- `initTheme()` — reads localStorage, falls back to `prefers-color-scheme`, applies to DOM

**localStorage key**: `lifesync-theme`

**Why not extend authStore**: Theme is an independent concern with different lifecycle (survives logout). Separate store is cleaner and follows single-responsibility.

### D2: Flash Prevention (FOCT)

Add a synchronous inline `<script>` in `index.html` `<head>` that:
1. Reads `lifesync-theme` from localStorage
2. If not found, checks `window.matchMedia('(prefers-color-scheme: dark)')` 
3. Applies `class="dark"` to `<html>` element if dark mode
4. Runs before any CSS or JS loads — zero flash guaranteed

This script must stay in sync with the localStorage key used by the Zustand store.

### D3: Hardcoded Color Strategy

The codebase has 24+ hardcoded hex colors. Strategy:
- **Brand colors** (`#534AB7`, `#3C3489`, `#EEEDFE`): Add `dark:` variants where needed. Purple stays readable on dark backgrounds.
- **Neutral colors** (`#2C2C2A`, `#666360`, `#9E9B94`, etc.): Replace with `dark:` variants using lighter/darker counterparts.
- **Background colors** (`#F1EFE8`, `#F5F4F0`, `#EEF2FF`): Add `dark:bg-*` variants with appropriate dark equivalents.
- **Border colors** (`#C7C4BB`, `#E8E6DF`): Add `dark:border-*` variants.
- **Status colors** (amber streak, emerald done-today, goal completed green): Add `dark:` variants with adjusted lightness for dark backgrounds.

**Approach**: Add `dark:` Tailwind classes inline alongside existing classes. Do NOT refactor to CSS variables (that would be scope creep beyond this sprint).

### D4: User Chip Menu Changes

Replace the Profile `DropdownMenuItem` with a theme toggle item:
- Import `Sun` and `Moon` from `lucide-react`
- Read theme from `useThemeStore`
- Display: `Moon` + "Dark mode" (in light mode) / `Sun` + "Light mode" (in dark mode)
- On click: call `toggleTheme()`
- Keep Log out item unchanged, remove Profile item

### D5: Dark Mode Color Mapping

| Light Mode | Dark Mode Equivalent | Usage |
|------------|---------------------|-------|
| `bg-[#F1EFE8]` | `dark:bg-[#1a1a1a]` | Login page background |
| `bg-white` / `bg-[#FFFFFF]` | `dark:bg-[#262626]` | Cards, form containers |
| `text-[#2C2C2A]` | `dark:text-[#E5E5E5]` | Primary text |
| `text-[#666360]` | `dark:text-[#A3A3A3]` | Secondary text |
| `text-[#9E9B94]` | `dark:text-[#737373]` | Muted/placeholder text |
| `border-[#C7C4BB]` | `dark:border-[#404040]` | Form borders |
| `border-[#E8E6DF]` | `dark:border-[#333333]` | Section dividers |
| `bg-[#EEF2FF]` | `dark:bg-[#534AB7]/20` | Avatar background |
| `bg-[#EEEDFE]` | `dark:bg-[#534AB7]/20` | Active nav item bg |
| `text-[#534AB7]` | (unchanged) | Brand purple — readable on both |
| `bg-[#534AB7]` | (unchanged) | Primary buttons — readable on both |
| `bg-[#F5F4F0]` | `dark:bg-[#333333]` | Filled input backgrounds |
| `hover:bg-[#F5F4F0]` | `dark:hover:bg-[#333333]` | Inactive tab hover |
| Streak: `text-[#854F0B]` bg `bg-[#FAEEDA]` | `dark:text-amber-300 dark:bg-amber-900/30` | Streak badge |
| Done: emerald text/bg | `dark:text-emerald-300 dark:bg-emerald-900/30` | Done-today badge |
| Completed: `text-[#3B6D11]` bg `#EAF3DE` | `dark:text-green-400 dark:bg-green-900/30` | Goal completed |
| Success: `text-[#085041]` bg `#E1F5EE` border `#9FE1CB` | `dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800` | Success messages |

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | No API calls added |
| II. Server State via React Query | PASS | Theme is client state in Zustand, not React Query |
| III. Component-Logic Separation | PASS | Logic in themeStore.ts, components only read theme and render |
| IV. Type Safety | PASS | `type Theme = 'light' \| 'dark'` — strict union, no `any` |
| V. Design System Fidelity | PASS | shadcn/ui untouched. Custom colors get `dark:` variants only. Sun/Moon from Lucide React |
