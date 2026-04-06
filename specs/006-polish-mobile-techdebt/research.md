# Research: Polish — Mobile Adaptation + Tech Debt

**Feature**: 006-polish-mobile-techdebt  
**Date**: 2026-04-06

## R-001: Responsive Sidebar Pattern (Hamburger + Icon-Only)

**Decision**: Use a combination of Tailwind responsive classes and React state for three sidebar modes:
- Mobile (< md/768px): Hidden by default, hamburger button (Menu icon from Lucide) in top-left of header opens sidebar as shadcn Sheet (side="left").
- Tablet (md to lg / 768–1024px): Sidebar always visible, collapsed to icon-only (w-16 instead of w-64). Labels hidden. Tooltip on hover for accessibility.
- Desktop (> lg/1024px): Current behavior unchanged (w-64, full labels).

**Rationale**: Sheet component provides accessible overlay behavior (focus trap, escape to close, click-outside-to-close) out of the box. Icon-only sidebar on tablet preserves navigation context without consuming too much space. This approach requires minimal state management — only a boolean `sidebarOpen` for mobile.

**Alternatives considered**:
- CSS-only with `hidden md:flex` — insufficient for mobile overlay behavior (needs focus trap, backdrop).
- Headless UI Popover — not in the shadcn/ui stack; would require new dependency.
- Custom drawer implementation — reinvents what Sheet already provides.

## R-002: shadcn Sheet Component for Drawers

**Decision**: Install shadcn Sheet component (`npx shadcn@latest add sheet`). Use it for:
1. Mobile sidebar overlay (side="left")
2. Habit history drawer (side="right")

**Rationale**: Sheet is the shadcn wrapper around Radix Dialog with slide-in animation. It provides accessible overlay with backdrop, focus management, and keyboard support. Using one component for both drawers ensures consistency.

**Alternatives considered**:
- Radix Dialog directly — Sheet is the idiomatic shadcn wrapper; using raw Radix would break design system fidelity.
- Custom CSS transitions + portal — fragile, no focus trap, accessibility gaps.

## R-003: Habit Logs Pagination Strategy

**Decision**: Use React Query's `useInfiniteQuery` with cursor-based pagination (page number) for the habit logs endpoint. "Load more" button at bottom triggers `fetchNextPage()`. Button disabled while `isFetchingNextPage` is true.

**Rationale**: `useInfiniteQuery` is purpose-built for append-style pagination. It manages page accumulation, deduplication, and loading states. The "Load more" pattern (vs infinite scroll) gives users explicit control and avoids layout shift issues in a fixed-height drawer.

**Alternatives considered**:
- Infinite scroll with IntersectionObserver — more complex, harder to test, potential issues in fixed-height Sheet container.
- Standard `useQuery` with manual page state — loses built-in page accumulation; would require manual array merging.

## R-004: Goals Page Mobile List/Detail Pattern

**Decision**: Use React state (`selectedGoalId`) combined with a `useIsMobile()` hook to conditionally render either the list or the detail view on mobile. On mobile (< md), when `selectedGoalId` is set, show GoalDetail full-screen with a back button. When null, show the list. On tablet+, preserve the existing `grid-cols-[380px_1fr]` layout.

**Rationale**: This is the simplest approach that doesn't require route changes. The existing `selectedGoalId` state already controls which goal is shown — we just conditionally hide the other panel on mobile. Back button sets `selectedGoalId` to null. After goal deletion, `handleDeleted` already sets `selectedGoalId` to null, which on mobile will auto-return to list.

**Alternatives considered**:
- Separate routes for list/detail — breaks the existing state model, adds complexity, complicates tablet behavior.
- CSS-only with `hidden md:block` — doesn't work because both panels need to render for desktop, but only one on mobile based on state.

## R-005: useIsMobile Hook

**Decision**: Create a `useIsMobile` custom hook using `window.matchMedia('(max-width: 767px)')` with an event listener for changes. Returns a boolean `isMobile`. Optionally extend with `isTablet` (768–1023px) if needed.

**Rationale**: A centralized hook avoids duplicating breakpoint logic across components. `matchMedia` is more performant than resize event listeners and matches the same breakpoints Tailwind uses.

**Alternatives considered**:
- Tailwind `hidden/block` classes only — insufficient for conditional rendering of different component trees (Goals list vs detail).
- Third-party hook library (e.g., react-responsive) — unnecessary dependency for a simple matchMedia wrapper.

## R-006: Habit Log Entry Display Format

**Decision**: Display each log entry as "MMM D, YYYY at HH:mm" (e.g., "Apr 5, 2026 at 14:30"). Use `toLocaleDateString('en-US', ...)` and `toLocaleTimeString('en-US', ...)` for formatting. The `completedAt` field from the API is an ISO 8601 timestamp string.

**Rationale**: Date + time gives users insight into their habit completion patterns (morning vs evening). The format matches English locale conventions and is easily readable. Using native Intl formatting avoids adding a date library dependency.

**Alternatives considered**:
- date-fns or dayjs — adds dependency for simple formatting that native APIs handle.
- Relative time ("2 days ago") — loses precision and becomes less useful for historical entries.
