# Implementation Plan: Internationalization (i18n) — EN + RU

**Branch**: `009-i18n` | **Date**: 2026-04-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-i18n/spec.md`

## Summary

Add internationalization (EN + RU) to LifeSync frontend using react-i18next + i18next. Create a Zustand localeStore (manual localStorage, no persist middleware), namespace-based translation files, Zod validation translation via global error map, language toggle in the user chip dropdown menu (Globe icon), and backend locale sync via PATCH /users/me. Extend the inline `<head>` script to set `<html lang>` for accessibility.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: Vite 8, React Router v7, TanStack React Query v5, Zustand, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner, Tailwind CSS v4, react-i18next (NEW), i18next (NEW)
**Storage**: localStorage (locale preference key `lifesync-locale`, plain string)
**Testing**: Vitest + React Testing Library + MSW (happy-dom), global i18n mock
**Target Platform**: Web browser (desktop 1280px + mobile 375px)
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: Language switch <1s with zero page reloads; no flash of incorrect language
**Constraints**: Constitution amendment required (v1.0.1 → v1.1.0); all existing tests must pass; tsc --noEmit zero errors
**Scale/Scope**: ~25 source files to modify, 4 new files, 14 translation JSON files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | Locale PATCH goes through `src/api/users.ts`. No direct axios calls |
| II. Server State via React Query | PASS | Locale is client state in Zustand, not server state. Backend sync is fire-and-forget PATCH, not cached query data |
| III. Component-Logic Separation | PASS | Locale logic in `localeStore.ts` + `src/lib/i18n.ts`. Components only call `useTranslation()` hook and render |
| IV. Type Safety | PASS | `type Locale = 'en' \| 'ru'` — strict union, no `any`. All types use `type` declarations |
| V. Design System Fidelity | PASS | shadcn/ui untouched. Globe icon from Lucide React. No manual edits to `src/components/ui/` |

**Technology Constraints**:
- Styling via Tailwind CSS v4 utility classes — PASS
- Imports use `@/` path alias — PASS
- User-facing text: **REQUIRES AMENDMENT** — current rule says "MUST be in English". Will amend to "MUST be translatable via i18next; English is the default/fallback". Justification: the English-only constraint was intended for code identifiers, comments, commit messages, and API calls. UI text is now translatable — this is an extension, not a violation. Code and git history remain English-only; UI strings use i18next with English fallback.
- New dependencies: react-i18next + i18next — **JUSTIFIED** (core feature requirement, de facto React i18n standard, no viable alternative within existing stack)
- New directory `src/locales/`: **REQUIRES AMENDMENT** — must add to permitted project structure. Justification: `src/locales/` contains JSON translation files, not source code. Adding it to permitted directories does not violate API isolation or any other constitution principle.

## Project Structure

### Documentation (this feature)

```text
specs/009-i18n/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── utils.ts              # Existing — no changes
│   └── i18n.ts               # NEW — i18next config, Zod error map, locale detection
├── stores/
│   ├── authStore.ts           # Existing — no changes
│   ├── themeStore.ts          # Existing — no changes
│   └── localeStore.ts         # NEW — Zustand locale store
├── locales/                   # NEW directory
│   ��── en/
│   │   ├── common.json        # Nav, sidebar, user chip, shared
│   │   ├─��� auth.json          # Login, register
│   │   ├── dashboard.json     # Dashboard page
│   ���   ├── habits.json        # Habits page, cards, forms
│   │   ├���─ goals.json         # Goals page, cards, forms
│   │   ├── profile.json       # Profile page, cards
│   │   └── validation.json    # Zod validation messages
│   └── ru/
│       ├── common.json
│       ├��─ auth.json
│       ├���─ dashboard.json
│       ├─�� habits.json
│       ├── goals.json
│       ├── profile.json
│       └── validation.json
├── types/
│   ├── auth.ts                # MODIFY — remove hardcoded Zod messages
│   └── users.ts               # MODIFY — add locale to UserProfile + UpdateUserRequest, remove hardcoded Zod messages
├── api/
│   └── users.ts               # Existing — no changes (already accepts partial UpdateUserRequest)
├── hooks/
│   ├── useAuth.ts             # MODIFY — apply backend locale on login
│   └── useUsers.ts            # MODIFY — toast messages use t()
├── components/
│   └── shared/
│       └── Layout.tsx         # MODIFY — language toggle in user chip menu, nav labels use t()
├── pages/
│   ├── LoginPage.tsx          # MODIFY — all text via t()
│   ├── (RegisterPage is embedded in LoginPage.tsx)
│   ├── DashboardPage.tsx      # MODIFY — all text via t()
│   ├��─ HabitsPage.tsx         # MODIFY — all text via t()
│   ├��─ GoalsPage.tsx          # MODIFY — all text via t()
│   └── ProfilePage.tsx        # MODIFY — all text via t()
├── components/
│   ├── habits/
│   │   ├── HabitCard.tsx      # MODIFY — badge labels, frequency text via t()
│   │   ├── HabitFormModal.tsx  # MODIFY — form labels, Zod schema via t()
│   │   ├── HabitEmptyState.tsx # MODIFY — empty state text via t()
│   │   ├── HabitFilters.tsx   # MODIFY — filter labels via t()
│   │   └── HabitHistoryDrawer.tsx # MODIFY — history labels, dates via t()
│   ├── goals/
│   │   ├── GoalCard.tsx       # MODIFY — status labels via t()
│   │   ���── GoalFormModal.tsx  # MODIFY — form labels, Zod schema via t()
│   │   ├���─ GoalEmptyState.tsx # MODIFY — empty state text via t()
│   │   ├── GoalFilters.tsx    # MODIFY — filter labels via t()
│   │   ├── GoalDetail.tsx     # MODIFY — detail labels via t()
│   │   ├── GoalMilestones.tsx # MODIFY — milestone labels via t()
���   │   ├── GoalLinkedHabits.tsx # MODIFY — linked habits labels via t()
│   │   └── GoalProgress.tsx   # MODIFY — progress labels via t()
│   └── profile/
��       ├── AccountCard.tsx    # MODIFY — form labels via t()
│       ├���─ StatsCard.tsx      # MODIFY — stat labels via t()
│       ├── TelegramCard.tsx   # MODIFY — form labels via t()
│       ├── DangerZoneCard.tsx # MODIFY — warning text via t()
│       └── DeleteAccountDialog.tsx # MODIFY — dialog text via t()
├── test/
│   └── setup.ts               # MODIFY — add global i18n mock
└── main.tsx                   # MODIFY — import i18n config before App

index.html                     # MODIFY — extend inline script to set <html lang>
.specify/memory/constitution.md # MODIFY — amendment v1.0.1 → v1.1.0
```

**Structure Decision**: Single frontend SPA. All changes within existing `src/` directory structure. One new top-level directory `src/locales/` (requires constitution amendment). New files: `src/lib/i18n.ts`, `src/stores/localeStore.ts`, and 14 translation JSON files.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New directory `src/locales/` | Translation files need organized structure per locale and namespace | Putting JSON files in existing directories would be confusing and non-standard |
| Constitution language rule change | i18n is the core feature — "English only" rule is incompatible | Cannot implement i18n without amending this constraint |

## Design Decisions

### D1: i18n Library Configuration

Create `src/lib/i18n.ts` that:
1. Imports all translation JSON resources statically (no lazy loading — SPA is small enough)
2. Initializes i18next with `react-i18next` integration
3. Sets `fallbackLng: 'en'`, `defaultNS: 'common'`
4. Reads initial language from localStorage `lifesync-locale` → `navigator.language` detection → `'en'`
5. Sets global `z.setErrorMap()` for Zod validation message translation
6. Exports nothing — side-effect-only module imported in `main.tsx`

**Why static imports**: The total translation payload for 2 languages × 7 namespaces is estimated at <20KB gzipped. Lazy loading adds complexity with no meaningful performance benefit.

### D2: Locale Store Design

Create `src/stores/localeStore.ts` following `themeStore.ts` pattern:

**Store shape**:
- `locale: Locale` — current active language (`'en'` or `'ru'`)
- `toggleLocale()` — switches between en/ru, persists to localStorage, changes i18next language, updates `<html lang>`, fires backend PATCH if authenticated
- `setLocale(locale: Locale)` — sets specific locale (used by login flow when backend returns saved locale)

**localStorage key**: `lifesync-locale`
**Value format**: Plain string `"en"` or `"ru"` (no JSON wrapper — per clarify decision)

On store creation: reads localStorage, validates value is `'en'` or `'ru'`, falls back to browser detection, then to `'en'`.

### D3: Inline Script Extension (FOIL Prevention)

Extend the existing `<head>` inline script in `index.html` to also handle locale:
1. Read `lifesync-locale` from localStorage
2. If valid (`'en'` or `'ru'`): set `document.documentElement.lang` to that value
3. If absent: detect `navigator.language` — if starts with `"ru"` set `lang="ru"`, else `lang="en"`
4. All wrapped in existing try/catch

This ensures `<html lang>` is correct before React renders, for accessibility and SEO.

### D4: Language Toggle in User Chip

Add a language toggle `DropdownMenuItem` in the user chip dropdown:
- Import `Globe` from `lucide-react`
- Read locale from `useLocaleStore`
- Display: `Globe` icon + "English" (when current locale is en) / "Русский" (when current locale is ru)
- On click: call `toggleLocale()`
- Position: between theme toggle and separator/log out

**Menu order**: Theme toggle → Language toggle → Separator → Log out

### D5: Zod Error Map Strategy

In `src/lib/i18n.ts`, set a global Zod error map that translates common validation errors:

**Approach**: Remove hardcoded English strings from all `.min()`, `.max()`, `.email()`, `.regex()` calls in Zod schemas. Instead, use the global error map which maps Zod issue codes to translation keys:

| Zod Issue Code | Translation Key | EN Example | RU Example |
|----------------|----------------|------------|------------|
| `too_small` (string, min=1) | `validation.required` | "This field is required" | "Это поле обязательно" |
| `too_small` (string, min>1) | `validation.minLength` | "Must be at least {{min}} characters" | "Минимум {{min}} символов" |
| `too_big` (string) | `validation.maxLength` | "Must be at most {{max}} characters" | "Максимум {{max}} символов" |
| `invalid_string` (email) | `validation.email` | "Please enter a valid email" | "Введите корректный email" |
| `invalid_string` (regex) | `validation.invalidFormat` | "Invalid format" | "Неверный формат" |

For custom per-field messages (e.g., username regex), use field-specific keys:
- `validation.usernameFormat` → "Only lowercase letters, numbers, hyphens, and underscores"
- `validation.telegramDigitsOnly` → "Chat ID must contain only digits"

### D6: Backend Sync Pattern

**On language toggle** (in `localeStore.toggleLocale()`):
1. Toggle locale locally (localStorage + i18next + `<html lang>`)
2. Check if user is authenticated via `useAuthStore.getState().accessToken`
3. If authenticated: call `usersApi.updateUser({ locale })` — fire-and-forget, no await
4. If PATCH fails: ignore silently (locale saved locally, will re-sync on next login)

**On login** (in `useAuth.ts > useLogin.onSuccess`):
1. After setting tokens and user
2. Read `data.user.locale` (if exists and is `'en'` or `'ru'`)
3. Call `useLocaleStore.getState().setLocale(locale)` — this updates localStorage, i18next, and `<html lang>`
4. Backend always wins on login (per clarify decision)

### D7: Translation Key Namespaces

| Namespace | Scope | Estimated Keys (per language) |
|-----------|-------|-------------------------------|
| `common` | Nav labels, sidebar, user chip menu, shared buttons (Save, Cancel, Delete), loading states | ~25 |
| `auth` | Login page, register page, error messages | ~20 |
| `dashboard` | Dashboard page title, stat cards, summary text | ~15 |
| `habits` | Habits page, HabitCard, HabitFormModal, filters, empty state, history drawer | ~40 |
| `goals` | Goals page, GoalCard, GoalFormModal, filters, empty state, detail, milestones, progress | ~45 |
| `profile` | Profile page, AccountCard, StatsCard, TelegramCard, DangerZoneCard, DeleteAccountDialog | ~30 |
| `validation` | All Zod validation messages (shared across forms) | ~15 |

**Total estimated**: ~190 keys × 2 languages = ~380 translation strings

### D8: Date Formatting Strategy

Use `Intl.DateTimeFormat` with the current locale from i18next:
- Create a utility `formatDate(date, locale, options?)` in `src/lib/i18n.ts` or use i18next's built-in formatting
- Habit history dates: `{ day: 'numeric', month: 'long', year: 'numeric' }`
- Goal target dates: `{ day: 'numeric', month: 'long', year: 'numeric' }`
- Relative dates (e.g., "today", "yesterday"): use translation keys, not Intl

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | Locale PATCH goes through `src/api/users.ts` |
| II. Server State via React Query | PASS | Locale is client state in Zustand |
| III. Component-Logic Separation | PASS | Logic in localeStore + i18n.ts, components only use `useTranslation()` |
| IV. Type Safety | PASS | `type Locale = 'en' \| 'ru'` strict union |
| V. Design System Fidelity | PASS | shadcn/ui untouched, Globe from Lucide React |
