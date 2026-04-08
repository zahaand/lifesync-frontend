# i18n UX & Functional Checklist: Internationalization (i18n) — EN + RU

**Purpose**: Validate translation coverage completeness and functional behavior requirements quality
**Created**: 2026-04-08
**Feature**: [spec.md](../spec.md)

## Requirement Completeness — Translation Coverage

- [x] CHK001 - Are all user-visible text categories explicitly enumerated for translation? (page titles, nav labels, buttons, form labels, placeholders, helper text, empty states, toasts, validation messages) [Completeness, Spec §FR-007]
- [x] CHK002 - Are Zod validation message translation requirements specified for all 4 schema files? (auth registerSchema, auth loginSchema, users updateProfileSchema/updateTelegramSchema, habitSchema, goalSchema) [Completeness, Spec §FR-007, Clarify Q1]
- [x] CHK003 - Are translation requirements defined for dynamically constructed strings? (e.g., "3 day streak", "Completed 5 of 10 milestones") [Completeness, Gap]
- [x] CHK004 - Are Russian pluralization requirements specified for all countable nouns? (streak days, habits count, goals count, milestones) [Completeness, Gap]
- [ ] CHK005 - Is the list of proper nouns excluded from translation explicitly defined? (spec mentions "LifeSync" — are there others like "Telegram"?) [Clarity, Spec §FR-013]
- [x] CHK006 - Are date/time format requirements specified for all date display contexts? (habit history entries, goal target dates, profile "member since") [Completeness, Spec §FR-008]

## Requirement Completeness — Functional Behavior

- [x] CHK007 - Is the localStorage key and value format for locale persistence unambiguously defined? [Clarity, Spec §FR-004, Clarify Q2]
- [x] CHK008 - Is the fallback chain priority order (backend → localStorage → browser → English) specified with no gaps between steps? [Completeness, Spec §FR-011]
- [x] CHK009 - Are browser language detection rules specified beyond "starts with ru"? (e.g., "ru-RU", "ru-UA", "ru" all match?) [Clarity, Spec §FR-005]
- [x] CHK010 - Is the behavior defined when the user toggles language on the login page (not authenticated — no backend sync)? [Coverage, Spec §US1 + Edge Cases]
- [x] CHK011 - Are requirements defined for what happens when backend PATCH locale fails? (toast text, retry policy, local-only behavior) [Coverage, Spec §US3.4]
- [x] CHK012 - Is the login-locale-override behavior clearly specified when localStorage has a different value than the backend? [Clarity, Spec §FR-010, Clarify Q3]

## Requirement Clarity — UX & Accessibility

- [x] CHK013 - Is the language toggle label format precisely defined? ("English" / "Русский" vs "EN" / "RU" vs localized names) [Clarity, Plan §D4]
- [x] CHK014 - Is the menu item order in the user chip dropdown explicitly specified? (theme toggle → language toggle → separator → log out) [Clarity, Plan §D4]
- [x] CHK015 - Are `<html lang>` attribute requirements defined for accessibility? (set before first render, updated on toggle) [Completeness, Plan §D3]
- [ ] CHK016 - Are aria-label / screen reader requirements defined for the language toggle button? [Coverage, Gap]
- [x] CHK017 - Is the Globe icon source and size explicitly specified? (Lucide React `Globe`, consistent with existing icon sizing) [Clarity, Plan §D4]

## Requirement Consistency

- [x] CHK018 - Is the locale store pattern (manual localStorage, no persist middleware) consistent with the rationale documented for themeStore? [Consistency, Plan §D2 vs Research §R3]
- [x] CHK019 - Are the namespace names consistent between plan.md (D7), data-model.md, and research.md (R2)? [Consistency]
- [x] CHK020 - Is the `UserProfile` type extension (adding `locale: string | null`) consistent between data-model.md and plan.md? [Consistency]

## Scenario Coverage

- [x] CHK021 - Are requirements defined for the register flow? (after registration, should the frontend send locale to the backend as part of the initial profile setup?) [Coverage, Gap]
- [x] CHK022 - Are requirements defined for logout behavior? (should locale persist in localStorage across logout/login cycles?) [Coverage, Gap]
- [ ] CHK023 - Are requirements specified for concurrent language and theme toggling? (switching both rapidly — any interaction or ordering dependency?) [Coverage, Edge Case]
- [x] CHK024 - Are requirements defined for what text the test suite asserts on after i18n? (translation keys vs English text vs mock behavior) [Completeness, Plan §D7, Research §R7]

## Constitution & Dependencies

- [x] CHK025 - Is the constitution amendment scope clearly defined? (which specific clauses change, version bump rationale) [Completeness, Research §R8]
- [x] CHK026 - Are the new dependencies (react-i18next, i18next) justified per constitution "new dependencies require justification" rule? [Completeness, Research §R8]

## Notes

- Focus areas: translation coverage + functional behavior (combined)
- Depth: standard (~25 items)
- Accessibility items folded into UX section (CHK015-CHK017)
- Actor: reviewer (PR review context)
- Items reference spec sections, plan design decisions, and research findings for traceability
