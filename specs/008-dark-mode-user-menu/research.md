# Research: Dark Mode & User Menu Update

**Feature**: 008-dark-mode-user-menu | **Date**: 2026-04-08

## R1: Tailwind CSS v4 Dark Mode with Class Strategy

**Decision**: Use Tailwind CSS v4 class-based dark mode via `@custom-variant dark (&:is(.dark *))` (already configured in `src/index.css` line 6).

**Rationale**: The project already has this configured. Adding/removing the `.dark` class on the `<html>` element activates all `dark:` prefixed utilities. The `.dark` section in `index.css` (lines 86-118) already defines inverted CSS variables for shadcn/ui components.

**Alternatives considered**:
- Media query strategy (`prefers-color-scheme`): Rejected — doesn't allow user override via toggle
- CSS custom properties only (no class toggle): Rejected — Tailwind's `dark:` prefix is more ergonomic for inline dark variants

## R2: Flash Prevention (FOCT) — Inline Script Approach

**Decision**: Add a synchronous inline `<script>` block in `index.html` `<head>`, before any stylesheet or module script loads.

**Rationale**: This is the industry-standard approach used by Next.js, Tailwind docs site, and Docusaurus. The script runs synchronously during HTML parsing, before the browser paints. This guarantees zero flash because the `.dark` class is applied before CSS is evaluated.

**Script logic**:
```
1. Try read localStorage key 'lifesync-theme'
2. If valid ('light' or 'dark') → use it
3. Else → check matchMedia('(prefers-color-scheme: dark)')
4. If dark → add 'dark' class to <html>
5. Else → ensure no 'dark' class (default light)
```

**Alternatives considered**:
- Apply in `main.tsx` before `createRoot()`: Rejected — JS bundle must download + parse first, causing flash on slow networks
- Server-side rendering with cookie: Rejected — app is a client-side SPA with no SSR

## R3: Zustand Store for Theme (No Persist Middleware)

**Decision**: Create `src/stores/themeStore.ts` as a simple Zustand store WITHOUT the `persist` middleware.

**Rationale**: The inline `<head>` script already reads/writes localStorage directly (it must, since Zustand isn't loaded yet). Using `persist` middleware would create a race condition — the inline script sets the class, then Zustand's `persist` rehydration would run later and potentially conflict. Instead, the store reads localStorage on initialization and writes to it manually in `toggleTheme()`. This keeps the inline script and the store in sync via the same localStorage key.

**Alternatives considered**:
- Zustand `persist` middleware (like authStore): Rejected — race condition with inline `<head>` script. The `persist` middleware's async rehydration could flash the wrong theme.
- React Context instead of Zustand: Rejected — Zustand is already in the project and provides simpler store access without provider wrapping.

## R4: Hardcoded Colors — Inline `dark:` Classes

**Decision**: Add `dark:` Tailwind utility classes alongside existing hardcoded hex colors. Do not refactor to CSS custom properties.

**Rationale**: Converting 24+ hardcoded colors to CSS variables would be a significant refactor beyond sprint scope. Adding `dark:` variants inline is minimal-risk, follows Tailwind conventions, and achieves full dark mode coverage. The mapping is documented in plan.md D5.

**Alternatives considered**:
- Refactor all colors to CSS variables/design tokens: Rejected — scope creep, high risk of regressions, better suited for a dedicated refactor sprint
- Use Tailwind's built-in color palette only: Rejected — brand colors (#534AB7, etc.) don't map to standard Tailwind palette

## R5: User Chip Menu — DropdownMenuItem for Theme Toggle

**Decision**: Replace the Profile `DropdownMenuItem` with a theme toggle item using the same `DropdownMenuItem` component. Not a separate switch or checkbox.

**Rationale**: Keeps the menu items visually consistent. Clicking the item toggles the theme and the label/icon update reactively via the Zustand store. This matches common patterns in apps like GitHub, Discord, and VS Code.

**Alternatives considered**:
- Toggle switch inside the dropdown: Rejected — adds UI complexity, DropdownMenuItem onClick is simpler
- Separate settings page for theme: Rejected — user specified toggle should be in the user chip menu

## R6: Existing Dark Mode CSS Infrastructure

**Finding**: The project already has complete dark mode CSS variable definitions in `src/index.css`:
- Lines 86-118: `.dark` class with OKLch color variables for all shadcn/ui tokens
- Line 6: `@custom-variant dark (&:is(.dark *))` enables Tailwind's `dark:` prefix
- Lines 120-130: Base layer applies `bg-background text-foreground` to body

**Implication**: shadcn/ui components (buttons, cards, inputs, dropdowns, dialogs, etc.) will automatically adapt to dark mode when `.dark` class is on `<html>`. Only custom hardcoded colors in pages/components need manual `dark:` variants.

## R7: Test Impact Assessment

**Finding**: Existing 46 tests use `happy-dom` environment (via Vitest). Tests don't test visual appearance (colors, dark mode). They test:
- Component rendering (text content, form inputs)
- User interactions (clicks, form submission)
- Hook behavior (API calls, state management)
- Auth store operations

**Implication**: All 46 existing tests should pass without modification. New tests needed only for the `themeStore` (toggle, persistence, OS preference detection). The `happy-dom` environment supports `localStorage` and `matchMedia` mocking.
