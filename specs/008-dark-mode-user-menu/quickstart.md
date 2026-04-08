# Quickstart: Dark Mode & User Menu Update

**Feature**: 008-dark-mode-user-menu | **Date**: 2026-04-08

## Prerequisites

- Node 20+
- Project dependencies installed (`npm install`)
- On branch `008-dark-mode-user-menu`

## Key Files

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Modify | Add inline theme detection script in `<head>` |
| `src/stores/themeStore.ts` | Create | Zustand store for theme state + toggle |
| `src/stores/__tests__/themeStore.test.ts` | Create | Unit tests for theme store |
| `src/components/shared/Layout.tsx` | Modify | User chip menu (replace Profile with theme toggle), sidebar dark variants, version label |
| `src/pages/LoginPage.tsx` | Modify | Add `dark:` color variants for background, form, tabs |
| `src/pages/DashboardPage.tsx` | Modify | Add `dark:` color variants for cards, stats, badges |
| `src/pages/HabitsPage.tsx` | Modify | Add `dark:` color variants |
| `src/pages/GoalsPage.tsx` | Modify | Add `dark:` color variants |
| `src/pages/ProfilePage.tsx` | Modify | Add `dark:` color variants |
| `src/components/habits/HabitCard.tsx` | Modify | Streak badge dark variant |
| `src/components/goals/GoalCard.tsx` | Modify | Status badge dark variants |
| `src/components/profile/*.tsx` | Modify | Card dark variants |

## Verification

```bash
# TypeScript check
npx tsc --noEmit

# Run all tests (must be 46+ passing)
npm test

# Dev server for visual verification
npm run dev
# Check at 1280px (desktop) and 375px (mobile)
# Toggle dark mode via user chip menu
# Verify: no flash on reload, all pages readable
```

## Implementation Order

1. Create `themeStore.ts` with `toggleTheme()` and initialization logic
2. Add inline `<script>` to `index.html` `<head>` for FOCT prevention
3. Update `Layout.tsx` — user chip menu (remove Profile, add theme toggle)
4. Add `dark:` variants to `Layout.tsx` sidebar (nav items, version label, avatar)
5. Add `dark:` variants to `LoginPage.tsx`
6. Add `dark:` variants to `DashboardPage.tsx`
7. Add `dark:` variants to `HabitsPage.tsx` + `HabitCard.tsx`
8. Add `dark:` variants to `GoalsPage.tsx` + `GoalCard.tsx`
9. Add `dark:` variants to `ProfilePage.tsx` + profile components
10. Write `themeStore.test.ts`
11. Run full test suite + tsc check
