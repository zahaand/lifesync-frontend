# Feature Specification: Internationalization (i18n) — EN + RU

**Feature Branch**: `009-i18n`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "Sprint 9: Internationalization (i18n) — EN + RU language support"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Application Language (Priority: P1)

A user opens the application and wants to switch from English to Russian (or vice versa). They click the user chip (bottom of sidebar on desktop, or in the mobile Sheet), see a language toggle option with a Globe icon showing the current language name, click it, and the entire application instantly switches to the other language. All page titles, labels, buttons, form placeholders, empty states, and toast messages display in the selected language.

**Why this priority**: Language switching is the core user-facing feature. Without it, all translation infrastructure is invisible to the user.

**Independent Test**: Can be fully tested by toggling the language and verifying all visible text on every page renders in the selected language.

**Acceptance Scenarios**:

1. **Given** the app is in English, **When** the user opens the user chip menu and clicks the language toggle, **Then** all UI text switches to Russian instantly without page reload.
2. **Given** the app is in Russian, **When** the user opens the user chip menu and clicks the language toggle, **Then** all UI text switches to English instantly without page reload.
3. **Given** the user switches language, **When** they navigate across pages (dashboard, habits, goals, profile), **Then** all pages display text in the selected language.
4. **Given** the user switches language, **When** they open forms (create habit, create goal, edit profile), **Then** all labels, placeholders, and validation messages display in the selected language.

---

### User Story 2 - Language Persistence Across Sessions (Priority: P1)

A user selects Russian and closes the browser. When they return later and open the application, it loads directly in Russian without any flash of English text.

**Why this priority**: Persistence is essential — forcing users to re-select their language every session is unacceptable.

**Independent Test**: Can be tested by selecting a language, closing the tab, reopening, and verifying the correct language loads instantly.

**Acceptance Scenarios**:

1. **Given** the user has selected Russian, **When** they close and reopen the application, **Then** the app loads directly in Russian without any flash of English.
2. **Given** a first-time visitor with browser language set to Russian, **When** they open the application, **Then** the app detects the browser language and displays in Russian.
3. **Given** a first-time visitor with browser language set to French (unsupported), **When** they open the application, **Then** the app defaults to English.
4. **Given** the user clears browser storage, **When** they reopen the application, **Then** the app falls back to browser language detection.

---

### User Story 3 - Backend Locale Synchronization (Priority: P2)

A logged-in user switches language on device A. Later they log in on device B, and the application loads in the language they last selected, because the preference was synced to the backend.

**Why this priority**: Cross-device sync depends on the backend storing the locale, which makes the preference durable beyond localStorage. This builds on US1 and US2.

**Independent Test**: Can be tested by changing language while authenticated, then logging in from another browser/device and verifying the saved locale is applied.

**Acceptance Scenarios**:

1. **Given** a logged-in user changes language to Russian, **When** the toggle is clicked, **Then** the frontend sends PATCH /users/me with the locale field set to "ru".
2. **Given** a user logs in, **When** GET /users/me returns a locale field, **Then** the app applies that locale, overriding localStorage and browser detection.
3. **Given** a user logs in and GET /users/me returns no locale field (legacy account), **When** the app initializes, **Then** it falls back to localStorage, then browser detection, then English.
4. **Given** the PATCH request to save locale fails (network error), **When** the user switches language, **Then** the language still changes locally and a non-blocking toast informs that sync failed.

---

### User Story 4 - Full Translation Coverage (Priority: P2)

All user-visible text in the application is translated, including page titles, navigation labels, form labels, button text, placeholder text, empty states, toast notifications, error messages, and date/time formatting.

**Why this priority**: Partial translation creates a broken experience. Full coverage is required for the feature to be considered complete.

**Independent Test**: Can be tested by switching to Russian and systematically visiting every page, opening every form, triggering every toast, and verifying no English text remains (except proper nouns like "LifeSync").

**Acceptance Scenarios**:

1. **Given** the app is in Russian, **When** the user visits any page, **Then** all static text is in Russian.
2. **Given** the app is in Russian, **When** the user opens any form, **Then** all labels, placeholders, helper text, and validation messages are in Russian.
3. **Given** the app is in Russian, **When** a toast notification appears (success, error, info), **Then** the message is in Russian.
4. **Given** the app is in Russian, **When** dates are displayed (habit history, goal deadlines), **Then** dates are formatted according to Russian locale conventions.
5. **Given** the app is in Russian, **When** the user views empty states, **Then** empty state titles and descriptions are in Russian.

---

### Edge Cases

- What happens when a translation key is missing? The app displays the English fallback text.
- What happens when the user is not authenticated and switches language? The preference is saved to localStorage only; no backend sync occurs.
- What happens when the backend returns an unsupported locale value? The app ignores it and falls back to localStorage, then browser detection, then English.
- What happens when the i18n library fails to initialize? The app renders in English (hardcoded fallback).
- What happens when date formatting fails for a locale? The app falls back to ISO format (YYYY-MM-DD).
- What happens to dynamic content from the backend (habit names, goal titles)? User-created content is NOT translated — it displays as entered by the user.
- What happens on logout? Locale persists in localStorage (it is independent of auth state). The user sees the login page in their previously selected language. On next login, backend locale overrides if different.
- What happens on registration? New user has no backend locale set. After successful register + auto-login, backend returns `locale: null` (default). The app applies the current localStorage locale value. PATCH /users/me `{ locale }` is called immediately after registration to sync the chosen locale to the new account.

## Clarifications

### Session 2026-04-08

- Q: Should Zod validation messages be translated via i18next? → A: Yes — translate all Zod validation messages via i18next (custom errorMap or per-schema message keys).
- Q: Should localStorage locale use JSON wrapper or plain string? → A: Plain string (`"en"` or `"ru"`) — simpler inline script, no JSON.parse needed.
- Q: On login, should backend locale override a recent localStorage change made while logged out? → A: Yes — backend always wins on login. User can toggle again after login if needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support exactly two languages: English (en) and Russian (ru).
- **FR-002**: System MUST provide a language toggle in the user chip dropdown menu, positioned between the dark mode toggle and the Log out item, displaying a Globe icon and the current language name in its native script (EN active: "English", RU active: "Русский"). Clicking switches to the other language immediately.
- **FR-003**: System MUST switch all UI text instantly when the user toggles language, without requiring a page reload.
- **FR-004**: System MUST persist the selected language in localStorage so it survives browser restarts.
- **FR-005**: System MUST detect the browser's preferred language on first visit and select the closest supported language (en or ru), defaulting to English if no match.
- **FR-006**: System MUST prevent flash of incorrect language on page load (analogous to FOCT prevention for dark mode).
- **FR-007**: System MUST translate all static UI text: page titles, navigation labels, button text, form labels, placeholders, helper text, empty states, toast messages, and Zod validation error messages (via i18next-integrated custom errorMap or per-schema translation keys).
- **FR-008**: System MUST format dates and times according to the selected locale conventions.
- **FR-009**: System MUST sync the selected locale to the backend via PATCH /users/me when the user is authenticated.
- **FR-010**: System MUST read the saved locale from GET /users/me on login and apply it, always overriding localStorage and browser detection (backend wins unconditionally on login).
- **FR-011**: System MUST fall back gracefully: backend locale → localStorage → browser detection → English.
- **FR-012**: System MUST use namespace-based translation files organized by feature area (common, auth, habits, goals, profile, dashboard).
- **FR-013**: System MUST NOT translate user-generated content (habit names, goal titles, milestone descriptions).
- **FR-014**: System MUST display English fallback text when a translation key is missing.
- **FR-015**: System MUST format dates using `Intl.DateTimeFormat` with the active locale parameter. EN format: "Apr 6, 2026". RU format: "6 апр. 2026 г.". Applied to: goal target dates, habit log dates in history drawer, dashboard date subtitle.

### Key Entities

- **Locale**: Represents a supported language. Values: `'en' | 'ru'`. Stored in Zustand localeStore, persisted to localStorage key `lifesync-locale` as a plain string (not JSON-wrapped), and synced to backend user.locale field.
- **Translation Namespace**: A logical grouping of translation keys by feature area. Namespaces: common, auth, habits, goals, profile, dashboard.
- **Translation Resource**: A JSON object mapping translation keys to translated strings for a given locale and namespace.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can switch between English and Russian in under 1 second with zero page reloads.
- **SC-002**: All user-visible static text (100% coverage) is translated in both languages — no untranslated strings remain when switching to Russian.
- **SC-003**: Language preference persists across browser sessions — reopening the app loads the previously selected language without flash of the wrong language.
- **SC-004**: Language preference syncs to backend — logging in on a new device applies the saved language.
- **SC-005**: All existing tests (55 unit tests) continue to pass after i18n integration.
- **SC-006**: tsc --noEmit produces zero errors.
- **SC-007**: Application builds successfully with zero errors.
- **SC-008**: Dates and times display in locale-appropriate format (e.g., "8 апреля 2026" in Russian vs "April 8, 2026" in English).

## Assumptions

- Backend API (Spring Boot) already supports or will support a `locale` field on the user entity via PATCH/GET /users/me. If not yet implemented, frontend gracefully handles its absence (fallback chain).
- Only two languages (EN, RU) are in scope. Adding more languages later should be straightforward due to the namespace-based architecture, but is not a requirement for this sprint.
- RTL (right-to-left) language support is out of scope — both English and Russian are LTR.
- Pluralization rules for Russian (which has 3 plural forms: one, few, many) are handled by i18next's built-in plural resolution using `_one`/`_few`/`_many` suffixes. Example: `{ "days_one": "{{count}} день", "days_few": "{{count}} дня", "days_many": "{{count}} дней" }`. Scope: streak counts, milestone counts, goal progress labels.
- The application name "LifeSync" is a proper noun and is NOT translated.
- react-i18next and i18next are new dependencies that will be added to the project.
- The existing FOCT prevention pattern (inline `<head>` script reading localStorage) will be extended for language preference.
- Browser language detection uses `navigator.language` (primary) with `navigator.languages[0]` as fallback. If value starts with `"ru"` (covers "ru", "ru-RU", "ru-UA") → locale = `"ru"`, otherwise → `"en"`. Detection runs ONLY on first visit (no `lifesync-locale` in localStorage). Subsequent visits always use the persisted localStorage value.
- Test strategy: global i18n mock in `src/test/setup.ts`. Mock `useTranslation()` returns the translation key as the value (e.g., `t('habits.card.notDoneYet')` → `'habits.card.notDoneYet'`). No individual test files need updating.
