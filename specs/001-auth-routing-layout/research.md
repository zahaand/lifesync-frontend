# Research: Auth Pages, Routing & App Layout

**Branch**: `001-auth-routing-layout` | **Date**: 2026-04-02

## R-001: State Management for Auth Store

**Decision**: Use Zustand for `authStore.ts`

**Rationale**: The constitution mandates global client state (auth tokens, current user) lives in `src/stores/authStore.ts` backed by localStorage. Zustand is the lightest store library that supports localStorage middleware (`persist`), works with React 19, and requires no provider wrappers. The access token stays in memory (non-persisted state), while the refresh token and user profile persist via Zustand's `persist` middleware with `localStorage` storage.

**Alternatives considered**:
- **React Context + useReducer**: No built-in persistence middleware; manual localStorage sync is error-prone and bloats the store code.
- **Jotai**: Atom-based model is overkill for a single auth store; persistence requires extra setup.
- **No library (vanilla module)**: Loses reactivity — components wouldn't re-render on auth state changes without manual subscription wiring.

## R-002: Token Refresh Interceptor Pattern

**Decision**: Axios response interceptor with a shared refresh promise (mutex pattern)

**Rationale**: When multiple concurrent requests hit 401 simultaneously, only one refresh call should fire. The interceptor detects 401, checks if a refresh is already in-flight (shared `refreshPromise` variable), and either joins the existing promise or initiates a new one. After refresh, failed requests are retried with the new access token. If refresh itself fails, clear auth state and redirect to `/login`.

**Alternatives considered**:
- **Request-level retry in each hook**: Duplicates refresh logic across every API call; violates API-Layer Isolation (Principle I).
- **Proactive refresh before expiry (timer-based)**: Requires decoding JWT exp on the client; adds complexity and still needs the 401 fallback for edge cases (clock skew, server-side revocation).

## R-003: Form Validation Approach

**Decision**: Use React Hook Form with Zod schema validation

**Rationale**: React Hook Form is the standard for performant form handling in React (uncontrolled inputs, minimal re-renders). Zod provides type-safe schema validation that integrates via `@hookform/resolvers/zod`. Validation rules from the spec (email RFC, password >= 8 chars, username regex) map directly to Zod schemas. This combination produces TypeScript-inferred form types automatically.

**Alternatives considered**:
- **Manual validation with useState**: Error-prone, repetitive, no type inference. Doesn't scale to registration form with 3+ fields.
- **Formik**: Heavier, less performant (controlled inputs), declining community momentum vs React Hook Form.
- **Zod only (no form library)**: Loses input registration, focus management, and submission handling that RHF provides.

## R-004: Auth Page Layout (Sign In / Sign Up Tabs)

**Decision**: Use shadcn/ui Tabs component for tab switching; single `/login` route with tab state

**Rationale**: The Figma design shows a tabbed auth page. shadcn/ui provides a `Tabs` component built on Radix primitives (Principle V compliance). Tab state managed locally via URL search params (`?tab=signin` / `?tab=signup`) so the active tab is shareable/bookmarkable and the success redirect after registration can set `?tab=signin&registered=true`.

**Alternatives considered**:
- **Separate /login and /register routes**: Adds routing complexity for no UX benefit — the spec explicitly calls for a single tabbed page.
- **Local component state only**: Tab state lost on refresh; can't deep-link to registration tab.

## R-005: returnUrl Pattern Implementation

**Decision**: Store the attempted URL as a query parameter on the auth page redirect (`/login?returnUrl=/habits`)

**Rationale**: When ProtectedRoute redirects an unauthenticated user, it appends the current path as `returnUrl` to the login URL. After successful login, the useLogin hook reads `returnUrl` from search params and navigates there, falling back to `/dashboard`. Query params are the standard SPA pattern — they survive page reloads and don't require store state.

**Alternatives considered**:
- **Store returnUrl in authStore/sessionStorage**: Adds state management overhead; can become stale across tabs.
- **History stack manipulation**: Browser history API is fragile and doesn't survive full-page refreshes.

## R-006: New Dependencies Required

**Decision**: Add `zustand`, `react-hook-form`, `@hookform/resolvers`, and `zod`

**Rationale**:
- `zustand`: Auth store with localStorage persistence (R-001)
- `react-hook-form`: Form state management for login/register forms (R-003)
- `@hookform/resolvers`: Bridges RHF with Zod validation (R-003)
- `zod`: Schema validation for form inputs and API response types (R-003)

All four are widely adopted, tree-shakeable, and TypeScript-first. Combined bundle cost is ~15KB gzipped. No alternative in the existing stack covers these needs without significantly more custom code.
