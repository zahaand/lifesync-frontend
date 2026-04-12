# Bug Fix & UX Requirements Quality Checklist: Bug Fixes, UX Improvements & Onboarding Tooltips

**Purpose**: Validate completeness, clarity, and consistency of bug fix and UX improvement requirements before implementation
**Created**: 2026-04-09
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [X] CHK001 - Are all 4 password character-class rules explicitly listed with their regex patterns? [Completeness, Spec §FR-001] — Yes: uppercase, lowercase, digit, special character; patterns in plan D1
- [X] CHK002 - Are translated error message keys specified for each of the 4 password refine checks? [Completeness, Spec §FR-002] — Yes: plan D9 lists all 4 auth.validation.password* keys
- [X] CHK003 - Is the backend 400 error response shape documented (field names, types)? [Completeness, Spec §FR-003] — Yes: FR-003 now specifies expected shape `{ message: string }` with fallback behavior
- [X] CHK004 - Are the exact special characters accepted in the password rule defined? [Completeness, Spec §FR-001] — Yes: spec lists `!@#$%^&*()_+-=[]{}|;':,./<>?` in user input
- [X] CHK005 - Are all form fields requiring `.trim()` or `.toLowerCase()` explicitly enumerated? [Completeness, Spec §FR-004/006/013/014] — Yes: FR-004 (username toLowerCase), FR-006 (email trim), FR-013 (identifier toLowerCase+trim), FR-014 (register email toLowerCase+trim)
- [X] CHK006 - Is the unsaved changes guard condition precisely defined (which field, what constitutes "non-empty")? [Completeness, Spec §FR-007] — Yes: "title field contains non-whitespace content"; edge case clarifies whitespace-only = empty
- [X] CHK007 - Are requirements defined for the Calendar component's date format sent to the backend? [Gap] — Yes: FR-010 now specifies `YYYY-MM-DD` format for form state and backend submission
- [X] CHK008 - Are all 3 tooltip content strings specified in both EN and RU? [Completeness, Spec §FR-015/016/017] — Yes: full EN and RU text in user input for all 3 tooltips
- [X] CHK009 - Is the ghost button root cause investigation approach documented in the requirements? [Completeness, Spec §US6] — Yes: clarifications specify two-phase inspect-then-fix; assumptions document this

## Requirement Clarity

- [X] CHK010 - Is "non-whitespace content" in the unsaved changes guard precisely defined (trim + length > 0)? [Clarity, Spec §FR-007] — Yes: edge cases say "whitespace-only is not meaningful content"; data-model defines `watch('title').trim().length > 0`
- [ ] CHK011 - Is the AlertDialog button hierarchy clear — which action is primary/destructive? [Clarity, Spec §FR-008] — **PARTIAL**: spec names "Keep editing" and "Discard" but doesn't define which is primary/destructive styling
- [X] CHK012 - Is the Calendar locale mapping explicit (which date-fns locale for each app language)? [Clarity, Spec §FR-011] — Yes: plan D6 specifies `i18n.language === 'ru' ? ru : enUS` from date-fns/locale
- [ ] CHK013 - Is "immediately" in cache invalidation requirements defined (same render cycle, next tick, refetch)? [Ambiguity, Spec §FR-009] — **PARTIAL**: "immediately" means after onSuccess invalidation + React re-render, but no explicit timing definition
- [X] CHK014 - Is the scope of "all goal mutations" in FR-009 exhaustively listed (link, unlink, progress — any others)? [Clarity, Spec §FR-009] — Yes: FR-009 now lists all mutation types including create, update, delete, milestones, progress

## Requirement Consistency

- [X] CHK015 - Are unsaved changes guard requirements consistent between HabitFormModal and GoalFormModal? [Consistency, Spec §FR-007/008] — Yes: FR-007 explicitly says "Both" and FR-008 says "Same behavior in both form modals"
- [X] CHK016 - Are `.toLowerCase().trim()` transforms applied consistently across all identifier/email fields in both login and register? [Consistency, Spec §FR-004/006/013/014] — Yes: data-model table enumerates each field's transform explicitly
- [X] CHK017 - Are translation key patterns for discard dialog consistent between habits and goals namespaces? [Consistency] — Yes: plan D9 shows identical key patterns in both habits.json and goals.json
- [ ] CHK018 - Do tooltip accessibility requirements (FR-019) align with existing app accessibility patterns? [Consistency] — **PARTIAL**: FR-019 specifies keyboard focus, but no cross-reference to existing app a11y patterns

## Acceptance Criteria Quality

- [X] CHK019 - Can SC-001 ("specific, translated error") be objectively measured — is "specific" defined? [Measurability, Spec §SC-001] — Yes: "specific" = individual per-rule messages from 4 separate .refine() checks (FR-001/002)
- [ ] CHK020 - Can SC-004 ("updates immediately") be objectively verified — is a timing threshold defined? [Measurability, Spec §SC-004] — **No**: no timing threshold; "immediately" relies on React Query refetch semantics
- [X] CHK021 - Can SC-006 ("no ghost button") be objectively verified — is the visual artifact described precisely enough to detect? [Measurability, Spec §SC-006] — Yes: US6 describes "no duplicate or ghost buttons during loading state" + "button area clean"
- [X] CHK022 - Are success criteria defined for the Calendar locale display (what exactly should be in the target language)? [Measurability, Spec §SC-005] — Yes: "month/day names matching the app's i18n language setting"

## Scenario Coverage

- [X] CHK023 - Are requirements defined for what happens when multiple password rules fail simultaneously? [Coverage, Spec §FR-001/002] — Yes: FR-002 now specifies RHF shows first failing .refine() error; next unmet rule shows as user fixes each
- [X] CHK024 - Are requirements defined for the Escape key closing modals with unsaved changes? [Coverage, Spec §FR-007] — Yes: research R4 and plan D4 confirm `onOpenChange(false)` covers X, overlay click, and Escape
- [X] CHK025 - Are requirements defined for the unsaved changes guard during edit mode (pre-filled form vs empty form)? [Coverage, Gap] — Yes: edge case now specifies edit mode uses `isDirty` — guard triggers only if user modified fields
- [X] CHK026 - Are requirements defined for date picker behavior when no target date is set (optional field)? [Coverage, Spec §FR-010] — Yes: edge case now defines placeholder text (EN/RU) and Calendar opens to current month with no selection
- [ ] CHK027 - Are requirements defined for navigating away from the page while a form modal with unsaved changes is open? [Coverage, Gap] — **OUT OF SCOPE**: browser navigation guard (beforeunload) is not applicable to SPA modals; deferred

## Edge Case Coverage

- [X] CHK028 - Is the fallback specified when the backend 400 response has no `message` field? [Edge Case, Spec §Edge Cases] — Yes: "Display the generic 'Registration failed' message (translated)"
- [X] CHK029 - Is behavior specified when the user pastes text with mixed case into the username field? [Edge Case, Spec §Edge Cases] — Yes: "Zod transform normalizes it to lowercase before submission"
- [X] CHK030 - Is behavior specified when date-fns locale fails to load for the Calendar? [Edge Case, Spec §Edge Cases] — Yes: "Fall back to the default (English) Calendar locale"
- [X] CHK031 - Is behavior specified for rapid consecutive goal mutations (race conditions)? [Edge Case, Spec §Edge Cases] — Yes: "React Query deduplicates the refetch"
- [X] CHK032 - Is the whitespace-only title edge case for the unsaved changes guard documented? [Edge Case, Spec §Edge Cases] — Yes: "whitespace-only is not meaningful content"

## Non-Functional Requirements

- [ ] CHK033 - Are keyboard accessibility requirements specified for all new interactive elements (tooltips, AlertDialog, Calendar)? [Accessibility, Spec §FR-019] — **PARTIAL**: tooltips have keyboard reqs (FR-019), AlertDialog inherits from Radix, Calendar has no keyboard reqs specified
- [X] CHK034 - Are screen reader requirements defined for info icon tooltips (aria-label, role)? [Accessibility, Gap] — Yes: edge cases require aria-label; plan D8 shows `aria-label={t('tooltip.goalsInfoLabel')}`
- [ ] CHK035 - Are mobile touch interaction requirements defined for the Calendar date picker? [Accessibility, Gap] — **MISSING**: only tooltip touch is mentioned (US8 AS5), Calendar mobile touch not specified
- [X] CHK036 - Are i18n requirements consistent — does every new UI string have both EN and RU translations specified? [Coverage, Spec §FR-020] — Yes: assumptions now define namespace assignment for all new keys; FR-020 mandates i18n for all text

## Dependencies & Assumptions

- [X] CHK037 - Is the assumption that the backend returns a `message` field on 400 errors validated or documented as a risk? [Assumption, Spec §Assumptions] — Yes: assumption documented + FR-003 defines fallback when no message field present
- [X] CHK038 - Is the dependency on date-fns and react-day-picker justified with alternatives considered? [Dependency, Plan §Complexity Tracking] — Yes: research R3 and plan complexity table justify both with rejected alternatives
- [X] CHK039 - Is the assumption that shadcn/ui Calendar is not yet installed verified? [Assumption, Spec §Assumptions] — Yes: assumptions now specify exact install commands (npx shadcn@latest add calendar + npm install date-fns)
- [X] CHK040 - Is the assumption that Radix Tooltip handles touch events natively validated? [Assumption, Spec §Clarifications] — Yes: assumptions now specify explicit locale mapping (ru → ru, en/other → enUS) with prop syntax

## Notes

- Focus areas: bug fix completeness + UX/accessibility coverage
- Depth: Standard (PR reviewer audience)
- 40 items covering 8 quality dimensions
- All items test requirement quality, not implementation behavior
