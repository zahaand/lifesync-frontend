# Feature Specification: Bug Fixes, UX Improvements & Onboarding Tooltips

**Feature Branch**: `010-bugfixes-ux`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Sprint 10: Bug fixes, UX improvements and onboarding tooltips"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Registration Password Validation (Priority: P1)

A user registers a new account with a weak password (e.g. "12345678"). Instead of a generic "Registration failed" message, the user sees a clear, translated error message explaining exact password requirements: at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character.

**Why this priority**: Users are unable to register successfully without understanding password requirements. This blocks onboarding.

**Independent Test**: Attempt registration with a weak password and verify the specific error message appears in the selected language.

**Acceptance Scenarios**:

1. **Given** a user enters a password like "12345678" on the registration form, **When** they submit, **Then** the frontend Zod validation shows a translated error explaining all four character-class requirements.
2. **Given** a user enters "Abcdefg1" (no special character), **When** they submit, **Then** the Zod validation error specifies the missing requirement.
3. **Given** the backend returns a 400 error with a message field for a password that passes frontend validation but fails backend rules, **When** the error response arrives, **Then** the frontend displays the backend's error message (translated via i18next if a matching key exists, otherwise displayed as-is).
4. **Given** the app is in Russian, **When** any password validation error appears, **Then** the error text is in Russian.

---

### User Story 2 — Username Normalization (Priority: P1)

A user registers with "TestUser" as their username. The frontend normalizes it to "testuser" before submission, and a hint below the field explains that usernames are case-insensitive and stored in lowercase.

**Why this priority**: Case-inconsistent usernames cause login failures.

**Independent Test**: Register with an uppercase username, verify the stored value is lowercase, and verify the hint text is visible.

**Acceptance Scenarios**:

1. **Given** a user types "TestUser" in the username field, **When** the form is submitted, **Then** the value sent to the backend is "testuser".
2. **Given** the registration form is displayed, **When** the user looks at the username field, **Then** a hint below says "Username is case-insensitive and will be stored in lowercase" (translated for the active language).

---

### User Story 3 — Unsaved Changes Confirmation (Priority: P1)

A user is creating a new habit or goal, has typed a title, and accidentally clicks the X button or clicks outside the modal. Instead of silently losing data, the user sees a confirmation dialog asking whether to discard changes. Applies to both HabitFormModal and GoalFormModal.

**Why this priority**: Silent data loss causes frustration and erodes trust in the application.

**Independent Test**: Open the habit form, type a title, try to close the modal, and verify the confirmation dialog appears.

**Acceptance Scenarios**:

1. **Given** the habit form modal is open and the title field has user-entered content, **When** the user clicks the close button (X) or clicks outside the modal, **Then** an AlertDialog appears with "Discard changes?" title and "All entered data will be lost." description.
2. **Given** the confirmation dialog is shown, **When** the user clicks "Keep editing", **Then** the dialog closes and the form remains open with all data preserved.
3. **Given** the confirmation dialog is shown, **When** the user clicks "Discard", **Then** both the dialog and the form modal close, and all entered data is cleared.
4. **Given** the habit form modal is open but the title field is empty (no user input), **When** the user clicks close, **Then** the modal closes immediately without a confirmation dialog.
5. **Given** the app is in Russian, **When** the confirmation dialog appears, **Then** all dialog text is in Russian.

---

### User Story 4 — Goal Mutations Cache Invalidation (Priority: P1)

A user links a habit to a goal or updates goal progress. The UI immediately reflects the change without requiring a manual page refresh.

**Why this priority**: Stale UI after mutations is a broken core experience — users think their action didn't work.

**Independent Test**: Link a habit to a goal and verify the linked habits count updates immediately. Update goal progress and verify the percentage updates immediately.

**Acceptance Scenarios**:

1. **Given** a user links a habit to a goal, **When** the link mutation succeeds, **Then** the linked habits section and count update immediately without page refresh.
2. **Given** a user unlinks a habit from a goal, **When** the unlink mutation succeeds, **Then** the linked habits section updates immediately.
3. **Given** a user updates goal progress percentage, **When** the update mutation succeeds, **Then** the progress bar and percentage display update immediately.
4. **Given** any goal mutation succeeds (link, unlink, progress), **When** the user navigates to the goals list, **Then** the GoalCard reflects the updated data.

---

### User Story 5 — Locale-Aware Date Picker (Priority: P2)

A user sets a target date for a goal. The date picker UI follows the app's language setting, not the OS locale. In English mode, the calendar shows English month/day names; in Russian mode, Russian names.

**Why this priority**: The native date picker ignoring app locale breaks the bilingual experience.

**Independent Test**: Switch app to English on a Russian-OS device, open the goal form, and verify the date picker shows English month/day names.

**Acceptance Scenarios**:

1. **Given** the app language is English, **When** the user opens the goal form date picker, **Then** month names and day abbreviations display in English.
2. **Given** the app language is Russian, **When** the user opens the goal form date picker, **Then** month names and day abbreviations display in Russian.
3. **Given** the user selects a date in the picker, **When** the form is submitted, **Then** the date value is correctly formatted and sent to the backend.
4. **Given** a goal has an existing target date, **When** the user opens the edit form, **Then** the date picker displays the existing date correctly.

---

### User Story 6 — Ghost Button Fix (Priority: P2)

After saving profile changes, no ghost elements appear near the save button. The button area remains clean during and after the mutation.

**Why this priority**: Visual artifacts undermine perceived quality.

**Independent Test**: Edit display name on the profile page, click Save, and verify no duplicate or ghost buttons appear during the loading state.

**Acceptance Scenarios**:

1. **Given** the user edits their display name and clicks Save, **When** the mutation is in progress, **Then** only a single button (showing "Saving..." or equivalent) is visible.
2. **Given** the save mutation completes, **When** the UI returns to its default state, **Then** the button area is clean with no visual artifacts.

---

### User Story 7 — Login Email/Identifier Normalization (Priority: P2)

A user enters "Test@Example.com" in the login form. The frontend normalizes it to "test@example.com" before submission, preventing case-sensitivity login failures. Leading/trailing whitespace is also trimmed on all identifier/email fields across login and registration.

**Why this priority**: Users who registered with lowercase emails cannot log in when accidentally capitalizing.

**Independent Test**: Log in with "Test@Example.com" for an account registered as "test@example.com" and verify login succeeds.

**Acceptance Scenarios**:

1. **Given** a user types "Test@Example.com" in the login identifier field, **When** the form is submitted, **Then** the value sent to the backend is "test@example.com".
2. **Given** a user types " user@test.com " (with spaces) in any email/identifier field, **When** the form is submitted, **Then** the value sent has leading/trailing whitespace trimmed.
3. **Given** a user types " TestUser " in the login identifier field (username case), **When** the form is submitted, **Then** the value sent is "testuser" (lowercased and trimmed).

---

### User Story 8 — Onboarding Tooltips (Priority: P3)

New users see contextual info icons next to Goals heading, Milestones section, and Linked Habits section. Hovering or clicking an icon reveals a tooltip explaining the concept in the active language.

**Why this priority**: Educational feature — improves onboarding but does not fix broken functionality.

**Independent Test**: Navigate to the Goals page and goal detail, hover each info icon, and verify tooltip content appears in the active language.

**Acceptance Scenarios**:

1. **Given** the user is on the Goals page, **When** they hover the info icon next to "Goals" heading, **Then** a tooltip explains what Goals are and how they relate to Habits.
2. **Given** the user is viewing a goal's detail, **When** they hover the info icon next to "Milestones", **Then** a tooltip explains what Milestones are.
3. **Given** the user is viewing a goal's detail, **When** they hover the info icon next to "Linked Habits", **Then** a tooltip explains the habit-goal linking mechanism.
4. **Given** the app is in Russian, **When** the user hovers any info icon, **Then** the tooltip content is in Russian.
5. **Given** a mobile user, **When** they tap the info icon, **Then** the tooltip appears (tap-triggered, not hover-only).

---

### Edge Cases

- What happens when the backend 400 error for password has no message field? Display the generic "Registration failed" message (translated).
- What happens if the user pastes a username with mixed case? The Zod transform normalizes it to lowercase before submission.
- What happens if the habit form title has only whitespace? Treat as empty — no confirmation dialog needed (whitespace-only is not meaningful content).
- What happens if the user clears the title after typing? No confirmation needed — title is empty again.
- What happens if the date-fns locale fails to load? Fall back to the default (English) Calendar locale.
- What happens if multiple goal mutations fire rapidly? Each mutation's onSuccess invalidates queries; React Query deduplicates the refetch.
- What happens to tooltip accessibility? Info icons must have aria-label, tooltips must be accessible via keyboard focus (Tab + Enter).

## Clarifications

### Session 2026-04-09

- Q: Password complexity — single Zod .regex() or separate .refine() checks? → A: Four separate .refine() checks with individual translated error messages per missing requirement (uppercase, lowercase, digit, special character).
- Q: Unsaved changes guard scope — HabitFormModal only or both forms? → A: Both HabitFormModal and GoalFormModal.
- Q: Calendar component — check existing date-fns or always add explicitly? → A: Always explicitly add date-fns to package.json as a direct dependency.
- Q: Ghost button investigation — inspect first or fix directly? → A: Two-phase approach — inspect AccountCard first, report findings, then fix.
- Q: Tooltip trigger on mobile — shadcn/ui Tooltip as-is or Popover? → A: Use shadcn/ui Tooltip as-is (Radix handles focus/touch natively).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Registration form MUST validate password complexity on the frontend via Zod: minimum 8 characters, plus four separate `.refine()` checks — one for uppercase, one for lowercase, one for digit, one for special character — each with its own translated error message.
- **FR-002**: Registration form MUST display specific translated error messages for each unmet password requirement.
- **FR-003**: Registration form MUST parse backend 400 error responses and display the message field content to the user (falling back to generic error if no message field).
- **FR-004**: Registration form MUST apply `.toLowerCase()` transform to the username field value before submission via Zod schema transform.
- **FR-005**: Registration form MUST display a hint below the username field: "Username is case-insensitive and will be stored in lowercase" (translated).
- **FR-006**: Registration form MUST apply `.trim()` to the email field value before submission.
- **FR-007**: Both HabitFormModal and GoalFormModal MUST show an AlertDialog confirmation when the user attempts to close the modal while the title field contains non-whitespace content.
- **FR-008**: The AlertDialog MUST offer "Keep editing" (returns to form) and "Discard" (closes modal and clears data) actions. Same behavior in both form modals.
- **FR-009**: All goal mutations (link habit, unlink habit, update progress) MUST invalidate the relevant React Query cache entries on success, matching the pattern used by Add Milestone.
- **FR-010**: Goal form MUST use a shadcn/ui Calendar component (Popover + Calendar) instead of native `<input type="date">` for the target date field.
- **FR-011**: The Calendar component MUST accept the current i18n locale and display month/day names in the active language.
- **FR-012**: Profile AccountCard MUST NOT render ghost/duplicate button elements during or after save mutation.
- **FR-013**: Login form MUST apply `.toLowerCase().trim()` transform to the identifier field value before submission via Zod schema transform.
- **FR-014**: Registration form email field MUST apply `.toLowerCase().trim()` transform before submission.
- **FR-015**: Goals page heading MUST include an info icon that displays a tooltip explaining the Goals concept.
- **FR-016**: Goal detail Milestones section heading MUST include an info icon with a tooltip explaining Milestones.
- **FR-017**: Goal detail Linked Habits section heading MUST include an info icon with a tooltip explaining the habit-goal linking mechanism.
- **FR-018**: All tooltips MUST be translated via i18next (EN and RU).
- **FR-019**: All tooltip triggers (info icons) MUST be accessible via keyboard (focusable, activatable with Enter/Space).
- **FR-020**: All new and modified error messages, hints, and UI text MUST use the i18n system (t() calls with translation keys in all namespaces as needed).

### Key Entities

- **PasswordComplexityRule**: Frontend validation rule for password strength. Enforces: minLength(8), hasUppercase, hasLowercase, hasDigit, hasSpecialCharacter.
- **UnsavedChangesGuard**: Logic that detects non-empty form content and intercepts modal close to show a confirmation dialog.
- **OnboardingTooltip**: An info icon + shadcn/ui Tooltip combination that displays educational content for a feature concept.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Registration with a weak password shows a specific, translated error — not a generic failure message.
- **SC-002**: Username "TestUser" is submitted as "testuser" on registration.
- **SC-003**: Closing a partially filled habit form triggers a confirmation dialog; empty form closes immediately.
- **SC-004**: Linking a habit to a goal updates the UI immediately without page refresh.
- **SC-005**: Goal form date picker displays month/day names matching the app's i18n language setting.
- **SC-006**: No ghost button appears after saving profile changes.
- **SC-007**: Login with "Test@Example.com" succeeds for an account registered as "test@example.com".
- **SC-008**: Three onboarding tooltips are visible on the Goals page and goal detail view, with content in the active language.
- **SC-009**: `tsc --noEmit` produces zero errors after all changes.
- **SC-010**: All existing tests continue to pass after all changes.
- **SC-011**: `npm run build` succeeds with zero errors.

## Assumptions

- The backend already returns a `message` field in 400 error responses for password validation failures.
- The backend accepts lowercase-only usernames without issues.
- The Calendar component from shadcn/ui supports locale props via date-fns locale objects. If the Calendar component is not yet installed, it will be added via `npx shadcn@latest add calendar`.
- date-fns MUST be added as an explicit direct dependency in package.json (not relied upon as transitive).
- The ghost button issue in AccountCard requires a two-phase approach: inspect the component first, report findings, then fix based on the actual root cause.
- Tooltip content is static educational text, not user-generated — it goes through the i18n system.
- shadcn/ui Tooltip (Radix-based) handles touch and focus events natively — no need to replace with Popover for mobile.
- The unsaved changes guard applies to both HabitFormModal and GoalFormModal.
