# Quickstart: Polish — Mobile Adaptation + Tech Debt

**Feature**: 006-polish-mobile-techdebt  
**Date**: 2026-04-06

## Prerequisites

- Node 20+
- Feature branch `006-polish-mobile-techdebt` checked out
- Backend running with habit logs endpoint available

## Setup

```bash
# Install dependencies (if needed)
npm install

# Add shadcn Sheet component
npx shadcn@latest add sheet

# Start dev server
npm run dev
```

## Testing Responsive Layouts

1. Open browser DevTools → Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
2. Test at these widths:
   - **320px** — smallest mobile (iPhone SE)
   - **375px** — standard mobile (iPhone 12/13)
   - **768px** — tablet breakpoint boundary (iPad portrait)
   - **1024px** — desktop breakpoint boundary
   - **1440px** — standard desktop

## Key Breakpoints

| Viewport       | Tailwind | Sidebar Behavior         | Layout         |
|---------------|----------|--------------------------|----------------|
| < 768px       | default  | Hidden + hamburger       | Single column  |
| 768–1024px    | md:      | Icon-only (w-16)         | Adaptive       |
| > 1024px      | lg:      | Full sidebar (w-64)      | Desktop layout |

## New Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/sheet.tsx` | shadcn Sheet (via CLI) |
| `src/components/habits/HabitHistoryDrawer.tsx` | History drawer component |
| `src/hooks/useMobile.ts` | `useIsMobile()` breakpoint hook |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/shared/Layout.tsx` | Responsive sidebar (hamburger, icon-only, Sheet overlay) |
| `src/pages/DashboardPage.tsx` | Stats grid `grid-cols-2 md:grid-cols-4`, cards already responsive |
| `src/pages/GoalsPage.tsx` | Mobile list/detail toggle, back button, auto-return on delete |
| `src/pages/HabitsPage.tsx` | History button, drawer integration, filter scroll, mobile padding |
| `src/pages/ProfilePage.tsx` | Mobile padding adjustments |
| `src/components/habits/HabitCard.tsx` | History button, mobile action button adaptation |
| `src/api/habits.ts` | `getHabitLogs()` function |
| `src/hooks/useHabits.ts` | `useHabitLogs()` infinite query hook |
| `src/types/habits.ts` | `HabitLogPageResponse` type |

## Validation

```bash
# Type check
npx tsc -b

# Lint
npx eslint .
```
