# Quickstart: Internationalization (i18n)

**Feature**: 009-i18n | **Date**: 2026-04-08

## Integration Scenarios

### Scenario 1: First-Time Visitor (browser language = Russian)

1. User opens app for the first time — no localStorage values
2. Inline `<head>` script reads `lifesync-locale` → null
3. Script detects `navigator.language` → "ru-RU" → sets `<html lang="ru">`
4. `src/lib/i18n.ts` initializes i18next with `lng: 'ru'` (same detection)
5. `localeStore` initializes with `locale: 'ru'`
6. App renders entirely in Russian
7. User sees login page in Russian

### Scenario 2: Authenticated User Toggles Language

1. User (English, logged in) clicks user chip → clicks language toggle
2. `localeStore.toggleLocale()`:
   a. Sets `locale: 'ru'`
   b. Calls `i18next.changeLanguage('ru')`
   c. Writes `"ru"` to localStorage
   d. Sets `document.documentElement.lang = 'ru'`
   e. Fires `usersApi.updateUser({ locale: 'ru' })` (async, no await)
3. React re-renders all `useTranslation()` consumers → all text is now Russian
4. Backend receives PATCH /users/me { locale: "ru" }

### Scenario 3: Login with Backend Locale

1. User with `localStorage: 'en'` logs in
2. Backend returns `{ ...user, locale: 'ru' }` (set from another device)
3. `useLogin.onSuccess`:
   a. Sets tokens and user as before
   b. Reads `user.locale` → "ru"
   c. Calls `localeStore.setLocale('ru')`
   d. This updates localStorage, i18next language, and `<html lang>`
4. App immediately switches to Russian after login

### Scenario 4: Backend Has No Locale Field (Legacy)

1. User logs in
2. Backend returns `{ ...user, locale: null }` (or field absent)
3. `useLogin.onSuccess`: checks `user.locale` → null → skips locale update
4. App remains in whatever locale was set locally (localStorage or browser detection)

### Scenario 5: Language Toggle While Offline

1. User clicks language toggle → PATCH fails (network error)
2. Language still changes locally (localStorage + i18next + UI)
3. Toast: "Language preference could not be saved to server" (in selected language)
4. On next successful API call or login, the locale can be re-synced manually or stays local

## Key Integration Points

| Component | Integration |
|-----------|-------------|
| `src/lib/i18n.ts` | i18next init, Zod error map, locale detection |
| `src/stores/localeStore.ts` | Zustand store, localStorage, i18next bridge |
| `src/main.tsx` | Import `src/lib/i18n.ts` before App |
| `src/hooks/useAuth.ts` | Apply backend locale on login |
| `src/hooks/useUsers.ts` | Fire-and-forget PATCH locale |
| `Layout.tsx` | Language toggle in user chip menu |
| All pages/components | Replace hardcoded strings with `t()` calls |
| Zod schemas | Remove inline messages, use global error map |
| `index.html` | Extend inline script to set `<html lang>` |
| `src/test/setup.ts` | Mock `react-i18next` globally |
