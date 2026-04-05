# Feature Specification: Profile Page + Smart Greeting

**Feature Branch**: `005-profile-page`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Sprint 5: Profile page + smart greeting"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Edit Profile (Priority: P1)

A user navigates to /profile to see their account information and make changes. They see their username and email displayed in a card. They can edit their username (which must follow the pattern `^[a-z0-9_-]+$`, 3-32 characters), save it, or cancel to revert. Email is read-only. A success notification confirms the update.

**Why this priority**: Viewing and editing the profile is the core value of the page — without it, there's no reason to visit /profile. The username validation mirrors backend rules to prevent invalid submissions.

**Independent Test**: Navigate to /profile, see current username and email, change username to a valid value, click Save, see success toast and updated value.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they navigate to /profile, **Then** they see their current username and email in the Account card.
2. **Given** the Account card is visible, **When** the user changes the username to a valid value and clicks Save, **Then** the username is updated, a success toast appears, and the input reflects the new value.
3. **Given** the Account card is visible, **When** the user enters an invalid username (e.g., uppercase, special characters, too short), **Then** a validation error is displayed and the form does not submit.
4. **Given** the user has modified the username, **When** they click Cancel, **Then** the input reverts to the original username value.
5. **Given** the Account card is visible, **Then** the email field is displayed as read-only text (not editable).

---

### User Story 2 - Smart Greeting on Dashboard (Priority: P1)

The Dashboard greeting currently uses the username from authStore. After this update, it fetches the user profile via GET /users/me and uses displayName if set, otherwise falls back to username.

**Why this priority**: Personalized greeting is a visible improvement across all sessions. It leverages the same useCurrentUser hook needed for the profile page, making it a natural co-delivery with US1.

**Independent Test**: Set a displayName on the profile, navigate to Dashboard, see "Good morning, {displayName}". Clear displayName, see "Good morning, {username}".

**Acceptance Scenarios**:

1. **Given** the user has a displayName set, **When** they view the Dashboard, **Then** the greeting shows "Good {timeOfDay}, {displayName}".
2. **Given** the user has no displayName (null or empty), **When** they view the Dashboard, **Then** the greeting shows "Good {timeOfDay}, {username}".
3. **Given** the user profile is loading, **When** the Dashboard renders, **Then** the greeting falls back to the username from authStore (no loading spinner for the greeting).

---

### User Story 3 - Link Telegram (Priority: P2)

A user wants to link their Telegram account for notifications. In the Telegram card, they enter their Telegram chat ID and save it. If already linked, the current ID is displayed and can be updated.

**Why this priority**: Telegram integration is an optional enhancement — the app is fully functional without it. It's a simple form but adds cross-platform notification capability.

**Independent Test**: Enter a Telegram chat ID in the input, click Save, see success toast and persisted value.

**Acceptance Scenarios**:

1. **Given** the user has no Telegram linked, **When** they view the Telegram card, **Then** they see an empty input with a placeholder and a Save button.
2. **Given** the user enters a Telegram chat ID and clicks Save, **Then** the ID is persisted via PUT /users/me/telegram and a success toast appears.
3. **Given** the user already has a Telegram chat ID linked, **When** they view the Telegram card, **Then** the input shows the current ID and they can update it.

---

### User Story 4 - View Profile Stats (Priority: P2)

A user wants to see a summary of their activity on the profile page. The Stats card displays 4 read-only metrics: active habits count, best streak, active goals count, and completed goals count. Data comes from existing React Query caches — no new API calls needed.

**Why this priority**: Stats provide context but are read-only and reuse existing data hooks. Low effort, moderate value.

**Independent Test**: Navigate to /profile, verify stats card shows counts matching the Dashboard stats.

**Acceptance Scenarios**:

1. **Given** the user has habits and goals, **When** they view the Stats card, **Then** they see: active habits count, best streak (days + habit name), active goals count, completed goals count.
2. **Given** the caches are loading, **When** the Stats card renders, **Then** skeleton placeholders are shown for each metric.

---

### User Story 5 - Delete Account (Priority: P3)

A user wants to permanently delete their account. They click a delete button in the Danger Zone card. A confirmation dialog requires typing their username to confirm. On success, auth state is cleared and the user is redirected to /login.

**Why this priority**: Account deletion is a compliance/safety feature (last resort), not a core workflow. It's the most destructive action and should be implemented last.

**Independent Test**: Click "Delete account", type username in confirmation, confirm, verify redirect to /login and auth state cleared.

**Acceptance Scenarios**:

1. **Given** the user is on the profile page, **When** they click "Delete account" in the Danger Zone card, **Then** a confirmation dialog appears asking them to type their username.
2. **Given** the confirmation dialog is open, **When** the user types their exact username and clicks Confirm, **Then** the account is deleted, auth is cleared, and they are redirected to /login.
3. **Given** the confirmation dialog is open, **When** the typed username does not match, **Then** the Confirm button remains disabled.
4. **Given** the confirmation dialog is open, **When** the user clicks Cancel, **Then** the dialog closes and nothing happens.

---

### Edge Cases

- What happens when the username update fails (409 conflict — username taken)? An error toast is shown with the server error message. The input retains the attempted value so the user can correct it.
- What happens when the Telegram chat ID format is invalid? The backend validates — a 400 error results in an error toast.
- What happens when DELETE /users/me fails? An error toast is shown and the user remains on the profile page.
- What happens when GET /users/me fails on Dashboard? The greeting falls back to authStore username — no error shown for the greeting (graceful degradation).
- What happens when stats caches are empty (new user, no habits/goals)? Stats show 0 for all counts, "—" for best streak.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a Profile page at the /profile route with a single-column layout (max-width 720px, centered) containing: Account card, Telegram card, Stats card, and Danger Zone card.
- **FR-002**: The Account card MUST display the user's current username (editable) and email (read-only).
- **FR-003**: Username editing MUST validate against the pattern `^[a-z0-9_-]+$` with 3-32 character length, matching backend rules.
- **FR-004**: The Account card MUST provide Save and Cancel buttons. Save submits PATCH /users/me, invalidates the `['users', 'me']` query cache, AND updates `authStore.user` so sidebar/greeting reflect the change immediately. Cancel reverts to the original value.
- **FR-005**: The Telegram card MUST provide an input for Telegram chat ID (field: `telegramChatId`, numeric string validated with `/^\d+$/`) and a Save button. Save submits PUT /users/me/telegram.
- **FR-006**: If a Telegram chat ID is already linked, the input MUST display the current value for editing.
- **FR-007**: The Stats card MUST display 4 read-only metrics: active habits count, best streak (days + habit name), active goals count, completed goals count. Data MUST come from existing React Query hooks (useHabits, useGoalsSummary) which auto-fetch if cache is cold. Skeleton placeholders MUST be shown while loading.
- **FR-008**: The Danger Zone card MUST provide a "Delete account" button that opens a confirmation Dialog (shadcn Dialog with Input, not AlertDialog).
- **FR-009**: The delete confirmation Dialog MUST include an Input where the user types their exact username. The Confirm button MUST remain disabled until the typed value matches.
- **FR-010**: On successful account deletion, the system MUST clear auth state (authStore), clear React Query cache, and redirect to /login.
- **FR-011**: The Dashboard greeting MUST use displayName from GET /users/me if available, otherwise fall back to username from authStore.
- **FR-012**: All successful mutations (username update, Telegram update, account deletion) MUST show a success toast notification.
- **FR-013**: All failed mutations MUST show an error toast notification.
- **FR-014**: While the user profile is loading on the Profile page, skeleton placeholders MUST be shown in the Account and Telegram cards.

### Key Entities

- **UserProfile**: Represents the current user's profile. Key attributes: id, email, username, displayName, telegramChatId. Extends the auth User type with telegramChatId.
- **UpdateUserRequest**: Partial update for user fields. Key attributes: username (optional).
- **UpdateTelegramRequest**: Telegram linking request. Key attributes: telegramChatId.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can update their username in under 10 seconds (edit, save, see confirmation).
- **SC-002**: Dashboard greeting reflects the correct displayName or username within 1 second of page load.
- **SC-003**: Account deletion completes and redirects within 3 seconds of confirmation.
- **SC-004**: 100% of profile mutations (username, Telegram, delete) provide clear success or error feedback.

## Clarifications

### Session 2026-04-05

- Q: Should PATCH /users/me update both React Query cache AND authStore.user, or only one? → A: Both — invalidate ['users', 'me'] query AND update authStore.user so sidebar/greeting reflect changes immediately.
- Q: Should the delete confirmation use AlertDialog (simple confirm) or Dialog with Input requiring username? → A: Dialog with Input — user must type their exact username to enable the Confirm button.
- Q: What is the backend field name for the Telegram integration, and what validation applies? → A: Field is `telegramChatId` (not telegramUserId). Numeric string, validated with `/^\d+$/`. Value is `null` when not linked. No "Remove" action in Sprint 5.
- Q: Should the Stats card trigger fetches if habits/goals caches are cold (direct navigation to /profile)? → A: Yes — reuse hooks normally, they auto-fetch if cache is cold. Show skeleton placeholders while loading.
- Q: Should the Dashboard greeting update immediately after a username change on /profile? → A: Updates on next Dashboard visit — authStore already synced from PATCH (Q1), no extra refetch or polling needed.

## Assumptions

- Users are authenticated before accessing /profile (handled by ProtectedRoute from Sprint 1).
- The backend GET /users/me endpoint returns all profile fields including telegramChatId and displayName.
- The existing auth User type (src/types/auth.ts) already includes id, email, username, displayName. The profile extends this with telegramChatId.
- The username validation pattern (`^[a-z0-9_-]+$`, 3-32 chars) matches the existing register schema in src/types/auth.ts.
- Stats data reuses existing hooks (useHabits for habits, useGoalsSummary for goals) — hooks auto-fetch if cache is cold (e.g., direct navigation to /profile).
- The Danger Zone card uses a red visual accent to signal destructive intent, consistent with the design language.
- displayName is not editable on the Profile page in Sprint 5 (it may come from a future social login or admin setting).
