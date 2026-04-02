# Implementation Plan: Auth Pages, Routing & App Layout

**Branch**: `001-auth-routing-layout` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auth-routing-layout/spec.md`

## Summary

Implement the foundational authentication layer for LifeSync: a tabbed Login/Register page with form validation, a Zustand-based auth store (access token in memory, refresh token in localStorage), an Axios client with automatic token attachment and silent 401 refresh, React Query mutation hooks, a ProtectedRoute guard with returnUrl support, and a sidebar + main area Layout shell. This sprint delivers the full auth flow from registration through login to accessing protected routes.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: React Router v7, TanStack React Query v5, Axios, Zustand (new), React Hook Form (new), Zod (new), shadcn/ui (Nova preset) + Radix primitives, Lucide React
**Storage**: localStorage (refresh token + user profile via Zustand persist middleware)
**Testing**: Manual verification this sprint (test infrastructure deferred)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page web application (frontend only)
**Performance Goals**: Login-to-dashboard < 10 seconds, registration < 60 seconds
**Constraints**: All imports via `@/` alias; no `any` types; `strict: true`; Tailwind CSS v4 only; English UI text
**Scale/Scope**: 2 routes (login, dashboard), 1 store, 4 API functions, 3 hooks, 2 pages, 2 shared components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. API-Layer Isolation | PASS | All HTTP calls in `src/api/auth.ts` and `src/api/client.ts`. Components/hooks never import axios directly. |
| II. Server State via React Query | PASS | `useLogin`, `useRegister`, `useLogout` are React Query `useMutation` hooks in `src/hooks/useAuth.ts`. Auth state (tokens) is client state in Zustand, not server state — correctly excluded from React Query. |
| III. Component-Logic Separation | PASS | Business logic in `src/hooks/useAuth.ts`, store in `src/stores/authStore.ts`, components handle rendering only. |
| IV. Type Safety | PASS | All types in `src/types/auth.ts` using `type` declarations. Zod schemas provide runtime validation with inferred TS types. No `any`. `const`/`let` only. |
| V. Design System Fidelity | PASS | UI built with shadcn/ui Tabs, Input, Button, Label, Card. Custom shared components in `src/components/shared/`. Accent color #534AB7. Icons from Lucide React. |

**Technology Constraints Check**:

| Constraint | Status |
|------------|--------|
| Build: Vite 8 + @tailwindcss/vite | PASS — no changes |
| Styling: Tailwind CSS v4 only | PASS — no inline styles |
| Routing: React Router v6+ declarative | PASS — routes in App.tsx, ProtectedRoute wrapper |
| Imports: @/ path alias only | PASS — enforced in all new files |
| Language: English UI text | PASS — all labels, messages, placeholders in English |
| New dependencies: justified | PASS — zustand, react-hook-form, @hookform/resolvers, zod (see research.md R-006) |

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-routing-layout/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup instructions
├── contracts/
│   └── auth-api.md      # Phase 1: Backend API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── App.tsx                          # QueryClientProvider, BrowserRouter, route definitions
├── main.tsx                         # Entry point (unchanged)
├── index.css                        # Theme (unchanged)
├── types/
│   └── auth.ts                      # RegisterRequest, LoginRequest, TokenResponse, User
├── stores/
│   └── authStore.ts                 # Zustand store: accessToken (memory), refreshToken (persisted)
├── api/
│   ├── client.ts                    # Axios instance, Bearer interceptor, 401 refresh interceptor
│   └── auth.ts                      # register(), login(), refresh(), logout()
├── hooks/
│   └── useAuth.ts                   # useLogin, useRegister, useLogout (React Query mutations)
├── components/
│   ├── ui/                          # shadcn/ui managed (unchanged)
│   │   └── button.tsx
│   └── shared/
│       ├── Layout.tsx               # Sidebar (user info + placeholder nav) + main content area
│       └── ProtectedRoute.tsx       # Auth guard: check token, redirect to /login?returnUrl=...
├── pages/
│   ├── LoginPage.tsx                # Tabbed Sign In / Sign Up with form validation
│   └── DashboardPage.tsx            # Placeholder dashboard page
├── lib/
│   └── utils.ts                     # cn() utility (unchanged)
└── assets/                          # Static assets (unchanged)
```

**Structure Decision**: Single frontend project following the established `src/` directory convention from the constitution. New directories `src/types/`, `src/stores/`, `src/api/`, `src/hooks/`, `src/pages/` follow the project structure mandate. No new top-level directories under `src/` beyond what's already defined.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
