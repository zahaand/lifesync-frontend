# Research: Dashboard Page

**Feature**: 002-dashboard-page | **Date**: 2026-04-04

## R-001: Optimistic Updates with React Query

**Decision**: Use React Query `useMutation` with `onMutate` / `onError` / `onSettled` callbacks for optimistic habit completion toggling.

**Rationale**: React Query's built-in optimistic update pattern provides cache manipulation on `onMutate` (snapshot + optimistic write), automatic rollback on `onError` (restore snapshot), and cache invalidation on `onSettled`. This avoids custom state management and integrates with the existing React Query setup from Sprint 1.

**Alternatives considered**:
- Manual `useState` for optimistic state → violates Principle II (Server State via React Query)
- Zustand store for habit state → same violation, adds unnecessary global state
- No optimistic update (wait for server) → poor UX for checkbox interaction (FR-006)

## R-002: Toast Notification Library

**Decision**: Use shadcn/ui Sonner integration (`sonner` package + shadcn `Toaster` component) for error toasts on failed optimistic updates.

**Rationale**: Sonner is the recommended toast solution for shadcn/ui (Nova preset). It provides auto-dismissing toasts out of the box. The `shadcn` CLI can add the Toaster component, keeping us compliant with Principle V (Design System Fidelity).

**Alternatives considered**:
- shadcn/ui Toast (older, based on Radix Toast) → less ergonomic API, being phased out in favor of Sonner
- Custom toast implementation → unnecessary complexity, violates Principle V
- No notification (silent failure) → violates FR-007

## R-003: Dashboard Data Fetching Strategy

**Decision**: Use multiple independent `useQuery` calls with separate query keys for habits, active goals, and completed goals count. Each card renders independently based on its own loading/error/data state.

**Rationale**: Independent queries allow each dashboard card to load and display as soon as its data arrives (SC-005). This avoids waterfall loading where one slow endpoint blocks the entire page. React Query deduplicates and caches each query independently.

**Alternatives considered**:
- Single aggregated dashboard endpoint → requires backend changes, couples all data together
- `Promise.all` wrapper → fails entirely if one request fails, no partial rendering
- Suspense boundaries per card → would work but adds complexity; standard `isLoading` checks are simpler for this case

## R-004: Skeleton Loading Components

**Decision**: Use shadcn/ui Skeleton component for loading placeholders. Add via `npx shadcn@latest add skeleton`.

**Rationale**: The Skeleton component is part of the shadcn/ui design system and provides consistent loading states. Using it keeps us compliant with Principle V and matches the "Calm & Focused" design language.

**Alternatives considered**:
- Custom CSS shimmer → violates Principle V (must use shadcn/ui)
- Spinner per card → less polished UX, skeletons better communicate layout structure
- No loading state → violates FR-011

## R-005: Dialog for Stub Modal

**Decision**: Use shadcn/ui Dialog component for the "New habit" stub modal. Add via `npx shadcn@latest add dialog`.

**Rationale**: Dialog is the standard shadcn/ui modal primitive. Using it for the stub ensures Sprint 3 can build on the same component without refactoring. Radix Dialog provides focus trapping and ESC-to-close accessibility for free.

**Alternatives considered**:
- Alert dialog → semantically wrong (not a confirmation)
- Sheet (slide-in panel) → could work but Dialog is more conventional for creation forms
- No modal (just disabled button) → spec explicitly requires a stub modal (FR-003)

## R-006: New Dependencies

**Decision**: Add `sonner` as the only new npm dependency. All UI components (Skeleton, Dialog, Checkbox, Progress, Badge) are added via shadcn CLI (no extra npm packages).

**Rationale**: Sonner is required for toast notifications (R-002). shadcn/ui components are copy-pasted into `src/components/ui/` by the CLI and don't add to `node_modules`. This minimizes dependency growth per constitution guidance.

**New shadcn/ui components needed**:
- Skeleton (loading states)
- Dialog (stub modal)
- Checkbox (habit completion toggle)
- Progress (goal progress bar)
- Badge (streak, status badges)
- Sonner/Toaster (toast notifications)

**Alternatives considered**:
- Building custom components → violates Principle V
- Using raw Radix primitives directly → constitution says use shadcn/ui layer
