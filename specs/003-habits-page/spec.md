# Feature Specification: Habits Page — Full Habit Management

**Feature Branch**: `003-habits-page`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Sprint 3: Habits page — full habit management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Track Habits (Priority: P1)

A user navigates to the Habits page to see all their habits organized by status. They can quickly identify which habits are active versus archived, see how many exist in each category, and mark habits as completed for the day. The page displays a summary count in the subtitle ("N active · M archived") and organizes habits into clearly labeled sections.

**Why this priority**: Viewing and tracking daily completion is the core value of a habits page — without it, no other management actions are meaningful.

**Independent Test**: Can be fully tested by navigating to /habits, viewing the habit list, and toggling completion checkboxes. Delivers the primary daily habit tracking value.

**Acceptance Scenarios**:

1. **Given** a user has 5 active and 2 archived habits, **When** they navigate to /habits, **Then** they see the page title "Habits" with subtitle "5 active · 2 archived", an "ACTIVE — 5" section listing all active habits, and an "ARCHIVED — 2" section listing archived habits.
2. **Given** an active habit is not yet completed today, **When** the user checks the habit's checkbox, **Then** the habit immediately shows as completed (line-through name, "Completed today" status) with optimistic UI update, and the completion is persisted to the server.
3. **Given** a habit was already completed today, **When** the user unchecks the habit's checkbox, **Then** the completion is removed immediately (optimistic update), the name reverts to normal styling, and the status shows "Not done yet".
4. **Given** a habit has a current streak of 7 days, **When** the user views the habit row, **Then** they see a streak badge displaying "7 day streak".
5. **Given** a habit has frequency WEEKLY, **When** the user views the habit row, **Then** they see a "WEEKLY" frequency pill alongside the habit name.

---

### User Story 2 - Create a New Habit (Priority: P1)

A user wants to build a new habit. They click "+ New habit" to open a creation form where they specify the habit name, optional description, frequency (daily, weekly, or custom), target days of the week (for weekly/custom frequency), and an optional reminder time. After submitting, the new habit appears in their active habits list.

**Why this priority**: Creating habits is essential for the page to have any content — without creation, users have an empty page with no value.

**Independent Test**: Can be tested by clicking "+ New habit", filling in the form fields, submitting, and verifying the new habit appears in the active section.

**Acceptance Scenarios**:

1. **Given** the user is on the Habits page, **When** they click "+ New habit", **Then** a modal opens with fields for name, description, frequency selector, and reminder time.
2. **Given** the create modal is open, **When** the user enters a valid name and selects "DAILY" frequency and submits, **Then** the modal closes, a success notification appears, and the new habit appears in the active habits list.
3. **Given** the create modal is open with frequency set to "WEEKLY", **When** the user views the form, **Then** day-of-week checkboxes (MON through SUN) become visible for selection.
4. **Given** the create modal is open, **When** the user submits with an empty name, **Then** the form shows a validation error and does not submit.
5. **Given** the create modal is open, **When** the user enters a name exceeding 200 characters, **Then** the form shows a validation error indicating the maximum length.

---

### User Story 3 - Edit an Existing Habit (Priority: P2)

A user wants to modify an existing habit's details — for example, changing its name, updating the frequency, or adjusting the description. They click the edit button on a habit row to open the edit modal pre-filled with the current values, make their changes, and save.

**Why this priority**: Editing is important for correcting mistakes and adapting habits over time, but users can function initially with create-only.

**Independent Test**: Can be tested by clicking the edit button on any habit, modifying fields, saving, and verifying the changes are reflected in the habit list.

**Acceptance Scenarios**:

1. **Given** a habit named "Morning Run" with frequency "DAILY", **When** the user clicks its edit button, **Then** a modal opens with name pre-filled as "Morning Run" and frequency showing "DAILY".
2. **Given** the edit modal is open, **When** the user changes the name to "Evening Run" and saves, **Then** the modal closes, a success notification appears, and the habit list shows the updated name.
3. **Given** the edit modal is open, **When** the user clears the name field and attempts to save, **Then** a validation error is shown and the form does not submit.

---

### User Story 4 - Filter and Search Habits (Priority: P2)

A user with many habits wants to quickly find specific ones. They can use filter tabs (All / Active / Archived) to narrow by status and a search input to filter by habit name. All filtering happens on the client side without additional server requests.

**Why this priority**: Filtering improves usability as the habit list grows, but is not critical for small lists.

**Independent Test**: Can be tested by switching between filter tabs and typing in the search input to verify the displayed habits update correctly.

**Acceptance Scenarios**:

1. **Given** a user has both active and archived habits, **When** they select the "Active" filter tab, **Then** only active habits are displayed.
2. **Given** a user has both active and archived habits, **When** they select the "Archived" filter tab, **Then** only archived habits are displayed.
3. **Given** the "All" tab is selected, **When** the user types "Run" in the search input, **Then** only habits whose name contains "Run" (case-insensitive) are displayed.
4. **Given** the user has searched for "xyz" with no matches, **When** they view the page, **Then** an empty state is shown indicating no habits match the search.

---

### User Story 5 - Archive, Restore, and Delete Habits (Priority: P2)

A user wants to manage the lifecycle of their habits. They can archive an active habit they no longer want to track (without losing data), restore an archived habit to resume tracking, or permanently delete an archived habit with a confirmation step.

**Why this priority**: Lifecycle management completes the CRUD experience but is secondary to daily tracking and creation.

**Independent Test**: Can be tested by archiving an active habit, verifying it moves to the archived section, restoring it, and deleting an archived habit after confirming.

**Acceptance Scenarios**:

1. **Given** an active habit, **When** the user clicks the archive button, **Then** the habit moves from the active section to the archived section, and the subtitle counts update accordingly.
2. **Given** an archived habit, **When** the user clicks the restore button, **Then** the habit moves from the archived section back to the active section.
3. **Given** an archived habit, **When** the user clicks the delete button, **Then** a confirmation dialog appears asking them to confirm permanent deletion.
4. **Given** the delete confirmation dialog is shown, **When** the user confirms, **Then** the habit is permanently removed from the list and a success notification appears.
5. **Given** the delete confirmation dialog is shown, **When** the user cancels, **Then** the dialog closes and the habit remains unchanged.
6. **Given** an active habit, **When** the user views the habit row, **Then** no delete button is visible (delete is only available for archived habits).

---

### User Story 6 - View Habit Completion History (Priority: P3)

A user wants to review when they completed a specific habit in the past. They can open a detail view that shows a paginated log of completion entries with dates and timestamps.

**Why this priority**: Historical data provides motivation and insight but is not essential for daily habit tracking.

**Independent Test**: Can be tested by opening the detail view for a habit with logged completions and verifying the log entries display correctly with pagination.

**Acceptance Scenarios**:

1. **Given** a habit with 15 completion logs, **When** the user opens the habit detail view, **Then** they see a paginated list of log entries showing date and completion time.
2. **Given** the detail view is open, **When** more entries exist beyond the current page, **Then** the user can navigate to the next page of entries.

---

### Edge Cases

- What happens when a user has zero habits? The page shows an empty state encouraging them to create their first habit.
- What happens when the server fails to toggle completion? The optimistic update is rolled back and an error notification is shown.
- What happens when a create or edit request fails? The modal remains open with an error notification so the user can retry.
- What happens when the user's session expires mid-action? Standard auth error handling redirects to login.
- What happens when two quick checkbox toggles are made in succession? Each toggle is handled independently with proper optimistic state management.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a Habits page at the /habits route showing all user habits organized into active and archived sections.
- **FR-002**: System MUST display a page header with title "Habits" and subtitle showing the count of active and archived habits.
- **FR-003**: System MUST provide a "+ New habit" button in the header that opens a creation modal.
- **FR-004**: System MUST allow users to mark a habit as completed for the current day via a checkbox, with immediate visual feedback (optimistic update).
- **FR-005**: System MUST allow users to unmark a previously completed habit, with immediate visual feedback (optimistic update).
- **FR-006**: Each habit row MUST display: checkbox, habit name (with line-through styling if completed today), frequency pill (DAILY/WEEKLY/CUSTOM), status text ("Completed today" or "Not done yet"), streak badge, edit button, and archive/restore button.
- **FR-007**: Archived habit rows MUST additionally display a delete button.
- **FR-008**: System MUST provide filter tabs (All / Active / Archived) for client-side filtering of the habit list.
- **FR-009**: System MUST provide a search input that filters habits by name on the client side (case-insensitive).
- **FR-010**: The create habit modal MUST include fields for: name (required, 1–200 characters), description (optional), frequency (DAILY/WEEKLY/CUSTOM), target days of week (visible for WEEKLY/CUSTOM), and reminder time (optional).
- **FR-011**: The create habit form MUST validate that name is between 1 and 200 characters before submission.
- **FR-012**: The edit habit modal MUST present the same fields as create, pre-populated with the habit's current values.
- **FR-013**: System MUST allow archiving an active habit, which sets it to inactive and moves it to the archived section.
- **FR-014**: System MUST allow restoring an archived habit, which sets it back to active.
- **FR-015**: System MUST allow permanent deletion of archived habits only, preceded by a confirmation dialog.
- **FR-016**: Successful create, edit, archive, restore, and delete operations MUST show a success notification.
- **FR-017**: Failed operations MUST show an error notification.
- **FR-018**: Section headers MUST display the count of habits in that section (e.g., "ACTIVE — 5").
- **FR-019**: The archived section MUST be hidden when there are no archived habits.
- **FR-020**: System SHOULD display a habit completion history view showing paginated log entries with date and time (P3, optional).

### Key Entities

- **Habit**: Represents a recurring behavior the user wants to track. Key attributes: name, description, frequency (daily/weekly/custom), active status, target days of week, reminder time, current streak count, today's completion state.
- **Habit Log**: Represents a single completion event for a habit. Key attributes: completion date and time, associated habit.
- **Day of Week**: Represents target days for weekly/custom frequency habits (Monday through Sunday).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new habit in under 30 seconds from clicking "+ New habit" to seeing it in the list.
- **SC-002**: Habit completion toggle provides visual feedback within 200ms (before server confirmation).
- **SC-003**: Users can find a specific habit using search or filters within 5 seconds, regardless of total habit count.
- **SC-004**: 100% of habit CRUD operations (create, edit, archive, restore, delete) provide clear success or error feedback to the user.
- **SC-005**: Users can complete the full habit lifecycle (create, track daily, archive, restore, delete) without encountering dead ends or unclear states.
- **SC-006**: The page loads and displays all habits within 2 seconds on a standard connection.

## Assumptions

- Users are authenticated and authorized before accessing the Habits page (handled by existing auth from Sprint 1).
- The backend already supports all required endpoints (GET/POST/PATCH/DELETE for habits and completion toggling from Sprint 2, plus new POST create, PATCH update, DELETE endpoints).
- The Habit entity on the backend includes fields for description, targetDaysOfWeek, and reminderTime (needed for create/edit but not yet exposed in Sprint 2's read-only type).
- Search filtering is case-insensitive substring matching on the habit name field.
- The habit detail / completion history view (P3) may be deferred to a future sprint if time is constrained.
- Streak count is calculated server-side and returned as part of the habit data.
- The archived section only appears when there are archived habits — no empty section placeholder is needed.
