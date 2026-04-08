# Tasks: Internationalization (i18n) — EN + RU

**Input**: Design documents from `/specs/009-i18n/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Global i18n mock in test setup only. No dedicated test tasks — existing 55 tests must continue passing.

**Organization**: Tasks grouped by user story. US1+US2 share foundational phase. US3 and US4 build incrementally.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install dependencies, configure i18n infrastructure, amend constitution

- [x] T001 Install react-i18next and i18next dependencies via `npm install react-i18next i18next`
- [x] T002 Amend constitution v1.0.1 → v1.1.0 in `.specify/memory/constitution.md`: (1) change Technology Constraints > Language rule from "All user-facing text MUST be in English" to "All user-facing text MUST be translatable via i18next. English (en) is the default/fallback language. Code, comments, commit messages, and API calls remain English-only." (2) add `src/locales/` to permitted project structure in Development Workflow > Project structure. (3) bump version to 1.1.0 with rationale.
- [x] T003 Create i18n config file `src/lib/i18n.ts`: initialize i18next with react-i18next `initReactI18next` plugin, set `fallbackLng: 'en'`, `defaultNS: 'common'`, `interpolation: { escapeValue: false }`. Read initial language from localStorage key `lifesync-locale` (plain string), fall back to `navigator.language` detection (starts with "ru" → "ru", else "en"), fall back to "en". Import all translation JSON resources statically. Set global Zod error map via `z.setErrorMap()` that maps issue codes to translation keys: `too_small` (min=1) → `validation.required`, `too_small` (min>1) → `validation.minLength` with `{{min}}` interpolation, `too_big` → `validation.maxLength` with `{{max}}`, `invalid_string` (email) → `validation.email`, `invalid_string` (regex) → `validation.invalidFormat`. Export nothing — side-effect module.
- [x] T004 Create locale store `src/stores/localeStore.ts`: Zustand store (NO persist middleware) with type `Locale = 'en' | 'ru'`. State: `locale: Locale`, `toggleLocale()`, `setLocale(locale: Locale)`. On creation: read `lifesync-locale` from localStorage, validate is "en" or "ru", fall back to navigator.language detection, then "en". `toggleLocale()`: flip en↔ru, write plain string to localStorage, call `i18next.changeLanguage()`, set `document.documentElement.lang`, check `useAuthStore.getState().accessToken` — if authenticated call `usersApi.updateUser({ locale })` fire-and-forget. `setLocale()`: same side effects but set specific value (used by login flow).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Translation files, test mock, main.tsx import, index.html script — MUST complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create English translation file `src/locales/en/common.json`: nav labels (Dashboard, Habits, Goals, Profile), sidebar (LifeSync title), user chip menu (Dark mode, Light mode, English, Русский, Log out, Logging out...), shared buttons (Save, Cancel, Delete, Edit, Close, Back, Loading..., Create), version label format.
- [x] T006 [P] Create Russian translation file `src/locales/ru/common.json`: same keys as en/common.json with Russian translations. Nav: Панель, Привычки, Цели, Профиль. Menu: Тёмная тема, Светлая тема, English, Русский, Выйти, Выход... Buttons: Сохранить, Отмена, Удалить, Редактировать, Закрыть, Назад, Загрузка..., Создать.
- [x] T007 [P] Create English translation file `src/locales/en/validation.json`: required, minLength (with {{min}}), maxLength (with {{max}}), email, invalidFormat, usernameFormat ("Only lowercase letters, numbers, hyphens, and underscores"), telegramDigitsOnly ("Chat ID must contain only digits"), timeFormat ("Time must be in HH:mm format").
- [x] T008 [P] Create Russian translation file `src/locales/ru/validation.json`: same keys with Russian translations. required: "Это поле обязательно", minLength: "Минимум {{min}} символов", maxLength: "Максимум {{max}} символов", email: "Введите корректный email", etc.
- [x] T009 [P] Create `src/locales/en/auth.json` and `src/locales/ru/auth.json`: login page (Welcome back, Sign in to your account, Email or username, Password, Sign in, Don't have an account?, Create one, Invalid credentials, account suspended, generic error), register page (Create account, subtitle, Email, Username, Password, Create account button, Already have an account?, Sign in, conflict/validation errors).
- [x] T010 [P] Create `src/locales/en/dashboard.json` and `src/locales/ru/dashboard.json`: page title (Dashboard), greeting ("Hello, {{name}}"), date subtitle, stat cards (Total habits, Completed today, Current streak, Active goals), summary text.
- [x] T011 [P] Create `src/locales/en/habits.json` and `src/locales/ru/habits.json`: page title (My Habits), search placeholder, filter labels (All, Active, Paused), empty state (title, description, CTA), HabitCard (streak badge with pluralization _one/_few/_many for RU, done today badge, not done yet, frequency labels: daily/weekly/specific days, day abbreviations Mon-Sun, paused label), HabitFormModal (create/edit titles, Name, Description optional, Frequency, Reminder time optional, day selection labels, Save/Cancel), HabitHistoryDrawer (title, log entry text, load more, empty history).
- [x] T012 [P] Create `src/locales/en/goals.json` and `src/locales/ru/goals.json`: page title (My Goals), filter labels (All, Active, Completed), empty state (title, description, CTA), GoalCard (status badges: Active/Completed, progress %, target date), GoalFormModal (create/edit titles, Title, Description, Target date, Save/Cancel), GoalDetail (edit button, description label), GoalMilestones (title, add placeholder, delete confirm), GoalLinkedHabits (title, link button, unlink, streak badge with pluralization), GoalProgress (title, update label, input placeholder).
- [x] T013 [P] Create `src/locales/en/profile.json` and `src/locales/ru/profile.json`: page title (My Profile), AccountCard (title, avatar alt, username label, email label, display name label, hint text, save/cancel), StatsCard (title, stat labels: total habits/goals completed/current streak/member since, with pluralization), TelegramCard (title, optional badge, chat ID label, hint, save), DangerZoneCard (title, description, delete button), DeleteAccountDialog (title, description, confirm label, type username prompt, cancel/delete buttons, deleting...).
- [x] T014 Add global i18n mock to `src/test/setup.ts`: add `vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en', changeLanguage: vi.fn() } }), Trans: ({ children }: any) => children, initReactI18next: { type: '3rdParty', init: () => {} } }))` before existing setup code.
- [x] T015 Import i18n config in `src/main.tsx`: add `import '@/lib/i18n'` as the FIRST import (before App, before index.css) to ensure i18n initializes before any component renders.
- [x] T016 Extend inline script in `index.html` `<head>`: after existing theme detection, add locale detection: read `lifesync-locale` from localStorage, if value is "en" or "ru" set `document.documentElement.lang` to that value, else detect `navigator.language` — if starts with "ru" set lang="ru", else set lang="en". All inside existing try/catch.

**Checkpoint**: i18n infrastructure ready. `npm run test` should pass (55/55). `tsc --noEmit` zero errors. `npm run build` succeeds.

---

## Phase 3: User Story 1 — Switch Application Language (Priority: P1) 🎯 MVP

**Goal**: User can toggle between EN and RU via user chip menu; all UI text switches instantly

**Independent Test**: Toggle language in user chip menu, verify all pages render in selected language

- [x] T017 [US1] Add language toggle to user chip dropdown in `src/components/shared/Layout.tsx`: import `Globe` from lucide-react, import `useLocaleStore`. Add new `DropdownMenuItem` between theme toggle and `DropdownMenuSeparator`. Display `Globe` icon (mr-2 size-4) + locale === 'en' ? 'English' : 'Русский'. On click: call `toggleLocale()` + `onNavClick?.()`. Apply dark mode classes consistent with existing items: `dark:text-zinc-50 dark:hover:bg-zinc-800`.
- [x] T018 [US1] Replace hardcoded nav labels in `src/components/shared/Layout.tsx`: import `useTranslation` from react-i18next. Replace `navItems` array labels with translation keys: `{ to: '/dashboard', label: 'common.nav.dashboard', icon: LayoutDashboard }` etc. In the NavLink render, use `t(item.label)` instead of `item.label`. Replace "Log out" / "Logging out..." with `t('common.menu.logout')` / `t('common.menu.loggingOut')`. Replace "Dark mode" / "Light mode" with `t('common.menu.darkMode')` / `t('common.menu.lightMode')`. Replace "Navigation" sr-only text with `t('common.nav.navigation')`.
- [x] T019 [P] [US1] Replace hardcoded strings in `src/pages/LoginPage.tsx`: import `useTranslation` with namespace 'auth'. Replace all static text: title, subtitle, input labels, placeholders, button text, link text, error messages. Use `t('auth.login.title')`, `t('auth.login.subtitle')`, etc.
- [x] T020 [P] [US1] Replace hardcoded strings in `src/pages/RegisterPage.tsx`: import `useTranslation` with namespace 'auth'. Replace all static text: title, subtitle, input labels, placeholders, button text, link text, validation error display.
- [x] T021 [P] [US1] Replace hardcoded strings in `src/pages/DashboardPage.tsx`: import `useTranslation` with namespace 'dashboard'. Replace page title, greeting (use interpolation `t('dashboard.greeting', { name })`), stat card labels, date subtitle (use `Intl.DateTimeFormat` with `i18n.language`).
- [x] T022 [P] [US1] Replace hardcoded strings in `src/pages/HabitsPage.tsx`: import `useTranslation` with namespace 'habits'. Replace page title, search placeholder, filter labels (All/Active/Paused).
- [x] T023 [P] [US1] Replace hardcoded strings in `src/pages/GoalsPage.tsx`: import `useTranslation` with namespace 'goals'. Replace page title, filter labels (All/Active/Completed), any section headers.
- [x] T024 [P] [US1] Replace hardcoded strings in `src/pages/ProfilePage.tsx`: import `useTranslation` with namespace 'profile'. Replace page title.
- [x] T025 [P] [US1] Replace hardcoded strings in `src/components/habits/HabitCard.tsx`: import `useTranslation` with namespace 'habits'. Replace streak badge text (use pluralization for RU: `t('habits.card.streak', { count })` with _one/_few/_many keys), done today badge, not done yet text, frequency labels, day abbreviations.
- [x] T026 [P] [US1] Replace hardcoded strings in `src/components/habits/HabitEmptyState.tsx`: import `useTranslation`. Replace empty state title, description, CTA button text.
- [x] T027 [P] [US1] Replace hardcoded strings in `src/components/habits/HabitFilters.tsx`: import `useTranslation`. Replace filter button labels, search input placeholder.
- [x] T028 [P] [US1] Replace hardcoded strings in `src/components/habits/HabitFormModal.tsx`: import `useTranslation`. Replace dialog title (create vs edit), all form labels (Name, Description, Frequency, Reminder time), optional hints, day selection labels, frequency option labels, Save/Cancel buttons. Remove hardcoded Zod validation messages from habitSchema — rely on global error map from T003.
- [x] T029 [P] [US1] Replace hardcoded strings in `src/components/habits/HabitHistoryDrawer.tsx`: import `useTranslation`. Replace drawer title, log entry text, load more button, empty history message. Format dates using `Intl.DateTimeFormat` with `i18n.language`.
- [x] T030 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalCard.tsx`: import `useTranslation`. Replace status badge text (Active/Completed), progress label, target date display (format with `Intl.DateTimeFormat`).
- [x] T031 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalEmptyState.tsx`: import `useTranslation`. Replace empty state title, description, CTA button.
- [x] T032 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalFilters.tsx`: import `useTranslation`. Replace filter button labels.
- [x] T033 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalDetail.tsx`: import `useTranslation`. Replace edit button text, description label, any static text.
- [x] T034 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalMilestones.tsx`: import `useTranslation`. Replace section title, add input placeholder, delete button text, completion text.
- [x] T035 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalLinkedHabits.tsx`: import `useTranslation`. Replace section title, link/unlink button text, streak badge (with pluralization).
- [x] T036 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalProgress.tsx`: import `useTranslation`. Replace section title, progress label, input placeholder.
- [x] T037 [P] [US1] Replace hardcoded strings in `src/components/goals/GoalFormModal.tsx`: import `useTranslation`. Replace dialog title (create vs edit), form labels (Title, Description, Target date), Save/Cancel buttons. Remove hardcoded Zod validation messages from goalSchema — rely on global error map.
- [x] T038 [P] [US1] Replace hardcoded strings in `src/components/profile/AccountCard.tsx`: import `useTranslation` with namespace 'profile'. Replace section title, field labels, hint text, Save/Cancel buttons.
- [x] T039 [P] [US1] Replace hardcoded strings in `src/components/profile/StatsCard.tsx`: import `useTranslation`. Replace title, stat labels (with pluralization for streak _one/_few/_many in RU), "member since" text with locale-formatted date.
- [x] T040 [P] [US1] Replace hardcoded strings in `src/components/profile/TelegramCard.tsx`: import `useTranslation`. Replace title, Optional badge, Chat ID label, hint, Save button.
- [x] T041 [P] [US1] Replace hardcoded strings in `src/components/profile/DangerZoneCard.tsx`: import `useTranslation`. Replace title, description, Delete button text.
- [x] T042 [P] [US1] Replace hardcoded strings in `src/components/profile/DeleteAccountDialog.tsx`: import `useTranslation`. Replace dialog title, description, confirm label, placeholder, Cancel/Delete/Deleting... buttons.
- [x] T043 [US1] Remove hardcoded Zod validation messages from `src/types/auth.ts`: remove inline messages from registerSchema (.email(), .min(), .max(), .regex()) and loginSchema (.min()) — rely on global error map from T003. For usernameFormat regex, use custom message via `{ message: t('validation.usernameFormat') }` or a refine callback that references the translation key.
- [x] T044 [US1] Remove hardcoded Zod validation messages from `src/types/users.ts`: remove inline messages from updateProfileSchema (.max()) and updateTelegramSchema (.min(), .regex()) — rely on global error map. For telegramDigitsOnly regex, use translation key.
- [x] T045 [US1] Replace hardcoded toast messages in `src/hooks/useUsers.ts`: import `useTranslation` or use `i18next.t()` directly. Replace 'Profile updated', 'Failed to update profile', 'Telegram linked', 'Failed to link Telegram', 'Failed to delete account' with translation keys from profile namespace.
- [x] T046 [US1] Replace hardcoded error messages in `src/hooks/useAuth.ts`: replace 'Invalid credentials', 'Your account has been suspended...', 'Something went wrong...' with translation keys from auth namespace.

**Checkpoint**: Language toggle works. All pages display translated text. `npm run test` passes. `tsc --noEmit` zero errors.

---

## Phase 4: User Story 2 — Language Persistence Across Sessions (Priority: P1)

**Goal**: Selected language persists in localStorage and loads correctly on next visit; browser language detected for first-time visitors

**Independent Test**: Select RU, close tab, reopen — app loads in Russian. Clear localStorage — app detects browser language.

**Note**: Most of US2 is already implemented via localeStore (T004) and index.html script (T016). This phase validates and ensures the persistence chain is complete.

- [x] T047 [US2] Verify and test locale persistence end-to-end: confirm that `localeStore.toggleLocale()` writes to localStorage, that `src/lib/i18n.ts` reads from localStorage on init, and that `index.html` inline script sets `<html lang>` correctly. Run manual verification: toggle to RU → refresh → confirm RU persists. If any gap found, fix in the relevant file.

**Checkpoint**: Locale persists across sessions. No flash of wrong language.

---

## Phase 5: User Story 3 — Backend Locale Synchronization (Priority: P2)

**Goal**: Locale syncs to backend on toggle and applies from backend on login

**Independent Test**: Toggle language while logged in → verify PATCH sent. Log in from new session → verify backend locale applied.

- [x] T048 [US3] Extend `UserProfile` type in `src/types/users.ts`: add `locale: string | null` field to UserProfile type. Add `locale?: string` to UpdateUserRequest type.
- [x] T049 [US3] Apply backend locale on login in `src/hooks/useAuth.ts`: in `useLogin` `onSuccess` callback, after `setTokens()`, read `data.user.locale`. If value is `'en'` or `'ru'`, call `useLocaleStore.getState().setLocale(locale)`. Import useLocaleStore. This ensures backend wins on login (per clarify decision).
- [x] T050 [US3] Apply backend locale on register in `src/hooks/useAuth.ts`: in `useRegister` flow (if auto-login happens after register), sync current localStorage locale to backend by calling `usersApi.updateUser({ locale: useLocaleStore.getState().locale })` fire-and-forget after successful registration. **Note**: Register returns void (no auto-login), so no authenticated API call is possible. Locale syncs on first toggleLocale() after user logs in — handled by localeStore.syncToBackend().

**Checkpoint**: Backend sync works. Login applies server locale. Register syncs local locale to new account.

---

## Phase 6: User Story 4 — Full Translation Coverage (Priority: P2)

**Goal**: 100% of static text is translated, including dates, plurals, and edge cases

**Independent Test**: Switch to RU, visit every page, open every form, trigger toasts — no English text remains (except "LifeSync" and "Telegram").

**Note**: Most translation coverage is done in Phase 3 (US1). This phase covers remaining gaps and date formatting.

- [x] T051 [P] [US4] Audit all components for remaining hardcoded English strings: search codebase for any remaining hardcoded text that wasn't caught in Phase 3. Check: error boundary messages, loading skeletons, aria-labels, title attributes, tooltip text.
- [x] T052 [P] [US4] Verify date formatting across all date displays: confirm all dates use `Intl.DateTimeFormat` with `i18n.language` parameter. Check: DashboardPage date subtitle, HabitHistoryDrawer log dates, GoalCard target dates, StatsCard "member since" date.
- [x] T053 [US4] Verify Russian pluralization for all countable values: confirm streak count, milestone count, and goal progress labels use `_one`/`_few`/`_many` suffixes in ru translation files. Test with values 1, 2, 5, 11, 21 to cover all Russian plural forms.

**Checkpoint**: Full translation coverage verified. No untranslated strings in RU mode.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, build verification, cleanup

- [x] T054 Run `tsc --noEmit` and fix any TypeScript errors
- [x] T055 Run `npm run test` and fix any failing tests (target: all existing tests pass)
- [x] T056 Run `npm run build` and verify zero build errors
- [x] T057 Run `npm run lint` and fix any lint warnings/errors
- [x] T058 Add `validation` namespace to Translation Namespace list in `src/locales/en/` and `src/locales/ru/` if not already created in T007/T008

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (T001-T004 must complete first)
- **Phase 3 (US1)**: Depends on Phase 2 — all translation files and test mock must exist
- **Phase 4 (US2)**: Depends on Phase 1 (T004 localeStore + T016 inline script) — can run in parallel with Phase 3
- **Phase 5 (US3)**: Depends on Phase 1 (T004 localeStore) — can run in parallel with Phase 3
- **Phase 6 (US4)**: Depends on Phase 3 — audit requires all translations to be in place
- **Phase 7 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2). Core MVP — all text replacement happens here.
- **US2 (P1)**: Mostly implemented by T004 + T016. Verification only in Phase 4.
- **US3 (P2)**: Depends on T004 (localeStore). Type extension (T048) should happen before US1 component work to avoid double-editing `src/types/users.ts`.
- **US4 (P2)**: Depends on US1 completion. Audit and verification phase.

### Within Each User Story

- T017 (language toggle in Layout) should be done first in US1 — enables manual testing
- T019-T042 (component translations) are all [P] parallel — different files
- T043-T044 (Zod schemas) should be done after T003 (global error map)
- T045-T046 (hook messages) can run in parallel with component translations

### Parallel Opportunities

**Phase 2** — All translation file tasks (T005-T013) are [P] parallel
**Phase 3** — All component translation tasks (T019-T042) are [P] parallel
**Phase 5** — T048 type extension should be done before T049-T050

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# After T017-T018 (Layout language toggle + nav labels):
# Launch ALL component translations in parallel:
T019: LoginPage.tsx
T020: RegisterPage.tsx
T021: DashboardPage.tsx
T022: HabitsPage.tsx
T023: GoalsPage.tsx
T024: ProfilePage.tsx
T025: HabitCard.tsx
T026: HabitEmptyState.tsx
T027: HabitFilters.tsx
T028: HabitFormModal.tsx
T029: HabitHistoryDrawer.tsx
T030-T037: Goal components
T038-T042: Profile components

# Then sequentially:
T043: auth.ts Zod schemas
T044: users.ts Zod schemas
T045: useUsers.ts toast messages
T046: useAuth.ts error messages
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (T001-T004) — ~30 min
2. Phase 2: Foundational (T005-T016) — ~1 hr (translation files + test mock)
3. Phase 3: US1 (T017-T046) — ~2 hrs (bulk of work — all component translations)
4. **STOP and VALIDATE**: Toggle language, verify all pages
5. Phase 7: Polish (T054-T058) — verify build/test/lint

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 → language toggle works, all text translated (MVP!)
3. US2 → persistence verified (mostly automatic from T004)
4. US3 → backend sync on login/toggle/register
5. US4 → audit for 100% coverage, verify plurals and dates
6. Polish → build/test/lint verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Translation files (T005-T013) contain estimated ~190 keys per language — actual keys determined during component translation in Phase 3
- Zod error map (T003) must be initialized before any Zod schema validation runs
- The `localeStore.toggleLocale()` handles both localStorage persistence (US2) and backend PATCH (US3) — these user stories share the store implementation
- Constitution amendment (T002) is a documentation task with no code impact
