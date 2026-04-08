# Data Model: Internationalization (i18n)

**Feature**: 009-i18n | **Date**: 2026-04-08

## Entities

### Locale (client-side)

| Field | Type | Description |
|-------|------|-------------|
| locale | `'en' \| 'ru'` | Currently active language |

**Storage**: Zustand `localeStore` + localStorage key `lifesync-locale` (plain string)
**Lifecycle**: Created on app init → read from localStorage or detected from browser → updated on toggle → synced to backend on toggle (if authenticated)

### Translation Resource

| Field | Type | Description |
|-------|------|-------------|
| namespace | `string` | Feature area (common, auth, habits, goals, profile, dashboard, validation) |
| language | `'en' \| 'ru'` | Target language |
| keys | `Record<string, string \| object>` | Nested key-value translation map |

**Storage**: Static JSON files in `src/locales/{lang}/{namespace}.json`
**Loaded**: Synchronously at app init via i18next `resources` option

### UserProfile (extended)

Existing entity extended with locale field:

| Field | Type | Description |
|-------|------|-------------|
| locale | `string \| null` | User's preferred language (`'en'` or `'ru'`), null if not set |

**Note**: This field is read from GET /users/me and written via PATCH /users/me. The backend may not have this field yet — frontend handles null gracefully.

## Type Definitions

### New types

```typescript
type Locale = 'en' | 'ru'

type LocaleState = {
  locale: Locale
  toggleLocale: () => void
  setLocale: (locale: Locale) => void
}
```

### Modified types

```typescript
// src/types/users.ts — extend
type UserProfile = User & {
  telegramChatId: string | null
  locale: string | null          // NEW
}

type UpdateUserRequest = {
  displayName?: string | null
  locale?: string               // NEW
}
```

## Translation Key Convention

**Pattern**: `{namespace}.{section}.{element}`

**Examples**:
- `common.nav.dashboard` → "Dashboard" / "Панель"
- `habits.card.notDoneYet` → "Not done yet" / "Ещё не выполнено"
- `auth.login.title` → "Welcome back" / "С возвращением"
- `validation.required` → "This field is required" / "Это поле обязательно"

**Pluralization** (Russian has 3 forms: one, few, many):
- `habits.stats.streak_one` → "{{count}} day streak"
- `habits.stats.streak_few` → "{{count}} дня подряд"
- `habits.stats.streak_many` → "{{count}} дней подряд"

## Relationships

```
localeStore ──reads/writes──▶ localStorage('lifesync-locale')
localeStore ──calls──▶ i18next.changeLanguage()
localeStore ──calls──▶ usersApi.updateUser({ locale }) [if authenticated]
useLogin ──reads──▶ user.locale from API response
useLogin ──calls──▶ localeStore.setLocale()
i18next ──reads──▶ src/locales/{lang}/{ns}.json
```
