# Research: Internationalization (i18n) — EN + RU

**Feature**: 009-i18n | **Date**: 2026-04-08

## R1: i18n Library Choice

**Decision**: react-i18next + i18next

**Rationale**: react-i18next is the de facto standard for React i18n. It provides:
- Hooks (`useTranslation`) for functional components
- Namespace-based lazy loading
- Built-in pluralization (critical for Russian — 3 plural forms)
- Interpolation and formatting
- Fallback language chain
- No additional runtime framework needed

**Alternatives considered**:
- **react-intl (FormatJS)**: More opinionated, heavier bundle, ICU message syntax has steeper learning curve. Overkill for 2 languages.
- **LinguiJS**: Excellent extraction tooling, but smaller ecosystem. Better for compile-time extraction which we don't need.
- **Manual i18n (plain objects)**: Too much boilerplate for pluralization, no ecosystem support.

## R2: Translation File Structure

**Decision**: Namespace-based JSON files in `src/locales/{lang}/` directory

**Structure**:
```text
src/locales/
├── en/
│   ├── common.json      # Nav, sidebar, user chip, shared UI
│   ├── auth.json         # Login, register pages
│   ├── dashboard.json    # Dashboard page
│   ├── habits.json       # Habits page, HabitCard, forms
│   ├── goals.json        # Goals page, GoalCard, forms
│   ├── profile.json      # Profile page, cards
│   └── validation.json   # Zod validation messages
└── ru/
    ├── common.json
    ├── auth.json
    ├── dashboard.json
    ├── habits.json
    ├── goals.json
    ├── profile.json
    └── validation.json
```

**Rationale**: Namespace-per-feature mirrors the existing page/component architecture. Validation messages get their own namespace since they are used across all forms. Separate directories per language (not single flat files) for maintainability as translation count grows.

**Alternative rejected**: Single `en.json` / `ru.json` — becomes unwieldy for 100+ keys.

## R3: Locale Store Pattern

**Decision**: Zustand store WITHOUT persist middleware, manual localStorage read/write

**Rationale**: Same pattern as themeStore. Avoids middleware race condition with the inline `<head>` script that sets `<html lang="">` before React hydrates. The store reads localStorage on creation and writes on toggle.

**localStorage key**: `lifesync-locale`
**Value format**: Plain string `"en"` or `"ru"` (clarified in /speckit.clarify — simpler than JSON wrapper)

**Fallback chain on store initialization**:
1. Read `lifesync-locale` from localStorage
2. If absent/invalid: detect `navigator.language` — if starts with `"ru"` → `"ru"`, else → `"en"`

## R4: Inline Script for Locale (FOCT Prevention)

**Decision**: Add locale detection to the existing inline `<head>` script to set `<html lang="...">` attribute

**Rationale**: While language flash is less visually jarring than theme flash (no CSS class needed), the `<html lang>` attribute affects:
- Screen readers and accessibility tools
- Browser font selection
- SEO crawlers

The existing FOCT script in index.html will be extended to also read `lifesync-locale` and set `document.documentElement.lang`.

**Note**: This does NOT prevent React from initially rendering with the default language. The i18n library initializes synchronously in `src/lib/i18n.ts` reading localStorage, so React always renders the correct language on first paint. The inline script only handles the `<html lang>` attribute.

## R5: Zod Validation Translation

**Decision**: Custom Zod error map using i18next translation keys

**Approach**:
- Define a global `z.setErrorMap()` in `src/lib/i18n.ts`
- The error map receives Zod error codes (too_small, too_big, invalid_string, etc.) and returns translated messages
- Individual schema `.min()`, `.max()`, `.email()` calls will NOT contain hardcoded strings — instead they rely on the global error map
- For custom messages (e.g., "Username can only contain..."), use per-field keys in the validation namespace

**Existing schemas to update**:
- `src/types/auth.ts`: registerSchema, loginSchema (5 validation messages)
- `src/types/users.ts`: updateProfileSchema, updateTelegramSchema (3 validation messages)
- `src/components/habits/HabitFormModal.tsx`: habitSchema (3 validation messages)
- `src/components/goals/GoalFormModal.tsx`: goalSchema (2 validation messages)

## R6: Backend Locale Sync

**Decision**: Extend PATCH /users/me with `locale` field, fire-and-forget

**Implementation**:
- `usersApi.updateUser()` already accepts `UpdateUserRequest` and sends PATCH /users/me
- Extend `UpdateUserRequest` type to include optional `locale?: string`
- On language toggle (when authenticated): call `usersApi.updateUser({ locale })` — no await, no UI blocking
- On login success: read `user.locale` from response, apply to localeStore + localStorage
- If backend doesn't return locale field (not yet implemented): ignore, use fallback chain

**API contract assumption**: The backend `UserProfile` response will include `locale: string | null`. The `PATCH /users/me` body will accept `{ locale: "en" | "ru" }`.

## R7: Test Strategy

**Decision**: Global i18n mock in test setup — return translation key as value

**Approach**:
- Add `vi.mock('react-i18next')` to `src/test/setup.ts`
- Mock `useTranslation()` to return `{ t: (key) => key, i18n: { language: 'en', changeLanguage: vi.fn() } }`
- Existing tests continue to assert on rendered text using translation keys (e.g., `'habits.card.notDoneYet'`)
- No test files need i18n provider wrapping

**Rationale**: Minimal test changes. Tests verify component logic, not translations. Translation correctness is verified by the JSON files themselves.

## R8: Constitution Amendment Required

**Identified conflicts**:

1. **Technology Constraints > Language**: "All user-facing text MUST be in English" — directly conflicts with i18n. Must be amended to: "All user-facing text MUST be translatable via i18next. English (en) is the default/fallback language."

2. **Development Workflow > Project structure**: "New top-level directories under `src/` require constitution amendment" — `src/locales/` is a new top-level directory. Must be added to the permitted list.

3. **Technology Constraints > Dependencies**: "New dependencies require justification" — `react-i18next` and `i18next` are new dependencies. Justified by: core feature requirement, de facto React i18n standard, no viable alternative within existing stack.

**Action**: Constitution amendment from v1.0.1 → v1.1.0 (MINOR — adding i18n constraint) to be included as first task in implementation.
