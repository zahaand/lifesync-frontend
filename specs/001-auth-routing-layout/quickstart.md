# Quickstart: Auth Pages, Routing & App Layout

**Branch**: `001-auth-routing-layout` | **Date**: 2026-04-02

## Prerequisites

- Node.js 20+
- pnpm (or npm)
- Backend auth service running at the URL configured in `VITE_API_BASE_URL`

## Setup

```bash
# Install dependencies (including new ones for this sprint)
pnpm install

# Start dev server
pnpm dev
```

## New Dependencies (this sprint)

```bash
pnpm add zustand react-hook-form @hookform/resolvers zod
```

## Environment Variables

Create `.env.local` in project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Files Created / Modified (this sprint)

```
src/
├── App.tsx                          # Modified: QueryClient provider, Router, routes
├── main.tsx                         # Unchanged
├── types/
│   └── auth.ts                      # New: RegisterRequest, LoginRequest, TokenResponse, UserResponse
├── stores/
│   └── authStore.ts                 # New: Zustand store (accessToken in memory, refreshToken persisted)
├── api/
│   ├── client.ts                    # New: Axios instance, Bearer interceptor, 401/refresh interceptor
│   └── auth.ts                      # New: register(), login(), refresh(), logout()
├── hooks/
│   └── useAuth.ts                   # New: useLogin, useRegister, useLogout mutation hooks
├── components/
│   └── shared/
│       ├── Layout.tsx               # New: Sidebar + main area wrapper
│       └── ProtectedRoute.tsx       # New: Auth guard, returnUrl redirect
├── pages/
│   ├── LoginPage.tsx                # New: Sign In / Sign Up tabbed form
│   └── DashboardPage.tsx            # New: Placeholder page
└── index.css                        # Unchanged (theme already configured)
```

## Routes

| Path         | Component      | Auth Required | Notes                           |
|--------------|----------------|---------------|---------------------------------|
| `/login`     | LoginPage      | No            | Redirects to /dashboard if already authenticated |
| `/dashboard` | DashboardPage  | Yes           | Wrapped in Layout + ProtectedRoute |
| `*`          | —              | —             | Redirects to /login             |

## Verification

1. Navigate to `http://localhost:5173` — should redirect to `/login`
2. Switch to "Sign Up" tab — fill in email, username, password (8+ chars) — submit
3. Should see success message and auto-switch to "Sign In" tab
4. Sign in with the registered credentials
5. Should redirect to `/dashboard` with sidebar showing username
6. Refresh the page — should remain on `/dashboard` (session persisted)
7. Click logout — should redirect to `/login`
