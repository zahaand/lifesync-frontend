# Feature Specification: Goals Page — Full Goal Management

**Feature Branch**: `004-goals-page`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Sprint 4: Goals page — full goal management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Goals and Track Progress (Priority: P1)

A user navigates to the Goals page to see all their goals in a master-detail layout. The left column shows a scrollable list of goal cards with key info (title, progress, deadline, status). Clicking a goal card reveals its full detail in the right panel, including a large progress display, milestone checklist, and linked habits. The user can quickly assess their progress across all goals and drill into any specific goal.

**Why this priority**: Viewing goals and their progress is the core value — without it, no management actions are meaningful. The master-detail layout is the page's foundational interaction pattern.

**Independent Test**: Navigate to /goals, see goal list with cards showing progress and status, click a goal to see its detail panel with progress, milestones, and linked habits.

**Acceptance Scenarios**:

1. **Given** a user has 3 active and 1 completed goal, **When** they navigate to /goals, **Then** they see the page title "Goals" with subtitle "3 active · 1 completed", and all 4 goals displayed as cards in the left column.
2. **Given** the goals list is displayed, **When** the user clicks a goal card, **Then** the right panel shows that goal's title, description, progress percentage, progress bar, milestones checklist, and linked habits section. The selected card shows a purple border.
3. **Given** a goal has progress at 65%, **When** the user views its card, **Then** they see "65%" displayed with a progress bar filled to 65%.
4. **Given** a goal has a target date of 2026-06-15, **When** the user views its card, **Then** they see the formatted deadline. A goal without a target date shows "No deadline".
5. **Given** a goal has 3 milestones with 2 completed, **When** the user views its card footer, **Then** they see "2 of 3 milestones done".
6. **Given** the user has zero goals, **When** they navigate to /goals, **Then** they see an empty state encouraging them to create their first goal.

---

### User Story 2 - Create and Edit Goals (Priority: P1)

A user wants to create a new goal or edit an existing one. They click "+ New goal" to open a creation modal where they specify the goal title, optional description, and optional target date. For editing, they click the edit button in the detail panel to open the same modal pre-filled with current values, which also allows changing the status.

**Why this priority**: Creating goals is essential for the page to have content. Editing allows corrections and status changes. Together with US1, this forms a complete MVP.

**Independent Test**: Click "+ New goal", fill form, submit, see new goal in list. Click edit on a goal, change title, save, see updated title.

**Acceptance Scenarios**:

1. **Given** the user is on the Goals page, **When** they click "+ New goal", **Then** a modal opens with fields for title, description, and target date.
2. **Given** the create modal is open, **When** the user enters a valid title and submits, **Then** the modal closes, a success notification appears, and the new goal appears in the goals list.
3. **Given** the create modal is open, **When** the user submits with an empty title, **Then** the form shows a validation error and does not submit.
4. **Given** a goal is selected in the detail panel, **When** the user clicks the edit button, **Then** a modal opens with title, description, and target date pre-filled with current values, plus a status selector (Active / Completed).
5. **Given** the edit modal is open, **When** the user changes the title and saves, **Then** the modal closes, a success notification appears, and the updated title is reflected in both the list and detail panel.

---

### User Story 3 - Update Goal Progress (Priority: P1)

A user wants to manually update their progress on a goal. In the detail panel's progress section, they see a large progress percentage, a progress bar, and a number input (0-100) with an "Update" button. Setting progress to 100 automatically marks the goal as completed.

**Why this priority**: Progress tracking is the primary ongoing interaction with goals — users need to record their advancement daily/weekly.

**Independent Test**: Select a goal, enter a new progress value, click "Update", see the progress bar and percentage update. Set to 100, verify goal status changes to Completed.

**Acceptance Scenarios**:

1. **Given** a goal with 40% progress is selected, **When** the user views the detail panel, **Then** they see "40%" displayed prominently, a progress bar at 40%, and an input field showing 40.
2. **Given** the progress input is visible, **When** the user changes it to 75 and clicks "Update", **Then** the progress bar and percentage update to 75%, and a success notification appears.
3. **Given** the progress input is visible, **When** the user sets it to 100 and clicks "Update", **Then** the goal's status automatically changes to COMPLETED, reflected in both the card and detail panel.
4. **Given** the progress input is visible, **When** the user enters a value outside 0-100, **Then** the input is constrained to the valid range and does not submit invalid values.

---

### User Story 4 - Manage Milestones (Priority: P2)

A user wants to break a goal into smaller milestones and track their completion. In the detail panel's milestones section, they see an ordered checklist. They can add new milestones, toggle completion via checkboxes, and delete milestones they no longer need.

**Why this priority**: Milestones provide granular tracking within goals, but goals can function without them initially.

**Independent Test**: Select a goal, add a milestone via the text input, toggle its completion checkbox, delete it via the remove button.

**Acceptance Scenarios**:

1. **Given** a goal has 3 milestones, **When** the user views the milestones section, **Then** they see all 3 listed in order with checkboxes indicating completion status.
2. **Given** the milestones section is visible, **When** the user types a title in the add input and clicks "Add", **Then** a new milestone appears at the end of the list and the input clears.
3. **Given** an incomplete milestone, **When** the user clicks its checkbox, **Then** the milestone is marked as completed with a visual indicator (green dot/check).
4. **Given** a completed milestone, **When** the user clicks its checkbox, **Then** the milestone is marked as incomplete.
5. **Given** a milestone exists, **When** the user clicks the delete button on it, **Then** the milestone is removed from the list.
6. **Given** the add input is empty, **When** the user clicks "Add", **Then** nothing happens (no empty milestones created).

---

### User Story 5 - Link and Unlink Habits (Priority: P2)

A user wants to connect habits to their goals to see which daily behaviors contribute to which goals. In the detail panel's linked habits section, they see a list of linked habits with streak badges. They can link new habits via a dropdown selector and unlink existing ones.

**Why this priority**: Habit-goal linking provides valuable cross-feature insight but is not essential for basic goal tracking.

**Independent Test**: Select a goal, use the dropdown to link a habit, see it appear in the linked list with streak info, click unlink to remove it.

**Acceptance Scenarios**:

1. **Given** a goal has 2 linked habits, **When** the user views the linked habits section, **Then** they see both habits listed with their names and streak badges.
2. **Given** the linked habits section is visible, **When** the user selects a habit from the dropdown and clicks "Link", **Then** the habit appears in the linked list.
3. **Given** a habit is linked to a goal, **When** the user clicks the unlink button, **Then** the habit is removed from the linked list.
4. **Given** the user has 5 active habits and 2 are already linked, **When** they open the link dropdown, **Then** only the 3 unlinked active habits appear as options.
5. **Given** a linked habit has a 7-day streak, **When** the user views it in the linked list, **Then** they see a streak badge displaying "7 day streak".

---

### User Story 6 - Filter Goals (Priority: P2)

A user with many goals wants to quickly narrow the list. They use filter tabs (All / Active / Completed) to filter the goals list by status. Filtering happens entirely on the client side.

**Why this priority**: Filtering improves usability as the goals list grows but is not critical for small lists.

**Independent Test**: Switch between filter tabs, verify the displayed goals match the selected status.

**Acceptance Scenarios**:

1. **Given** a user has both active and completed goals, **When** they select the "Active" tab, **Then** only active goals are displayed.
2. **Given** a user has both active and completed goals, **When** they select the "Completed" tab, **Then** only completed goals are displayed.
3. **Given** the "All" tab is selected, **When** the user views the list, **Then** all goals (active and completed) are displayed.
4. **Given** a goal is selected and visible in the detail panel, **When** the user switches filter tabs and the selected goal is no longer in the filtered list, **Then** the detail panel clears (no stale goal shown).

---

### User Story 7 - Delete a Goal (Priority: P2)

A user wants to permanently remove a goal they no longer need. They click the delete button in the detail panel, confirm via a dialog, and the goal is removed.

**Why this priority**: Deletion completes the CRUD lifecycle but is secondary to creation and tracking.

**Independent Test**: Select a goal, click delete, confirm in the dialog, verify the goal is removed from the list and detail panel clears.

**Acceptance Scenarios**:

1. **Given** a goal is selected, **When** the user clicks the delete button, **Then** a confirmation dialog appears with the goal title and a warning about permanent deletion.
2. **Given** the delete dialog is shown, **When** the user confirms, **Then** the goal is permanently removed, the detail panel clears, and a success notification appears.
3. **Given** the delete dialog is shown, **When** the user cancels, **Then** the dialog closes and the goal remains unchanged.

---

### Edge Cases

- What happens when a user has zero goals? The page shows an empty state encouraging them to create their first goal.
- What happens when the selected goal is deleted? The detail panel clears to an empty/placeholder state.
- What happens when progress update fails? An error notification is shown and the previous value is preserved.
- What happens when the user tries to link a habit that's already linked? The dropdown only shows unlinked habits, preventing duplicates.
- What happens when all milestones are completed? The milestones section shows all items checked; progress is not automatically updated (progress is managed independently).
- What happens when the selected goal disappears from the filtered list after a filter change? The detail panel clears.
- What happens when setting progress to 100 on an already-completed goal? No status change occurs (already COMPLETED).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a Goals page at the /goals route with a master-detail layout: scrollable goal cards list on the left, goal detail panel on the right.
- **FR-002**: System MUST display a page header with title "Goals" and subtitle showing the count of active and completed goals ("N active · M completed").
- **FR-003**: System MUST provide a "+ New goal" button in the header that opens a creation modal.
- **FR-004**: Each goal card MUST display: goal title, progress percentage (purple if active, green if completed), progress bar, deadline (or "No deadline"), status badge (Active / Completed), and footer with linked habits count and milestones progress ("N of M milestones done").
- **FR-005**: Clicking a goal card MUST select it (highlighted with purple border) and display its full detail in the right panel.
- **FR-006**: The detail panel MUST display: goal title, description, edit button, delete button, progress section, milestones section, and linked habits section.
- **FR-007**: The progress section MUST display a large progress percentage, a progress bar, a number input (0-100), and an "Update" button that persists the new value.
- **FR-008**: Setting progress to 100 MUST automatically change the goal's status to COMPLETED.
- **FR-009**: The milestones section MUST display milestones as an ordered checklist with completion toggles (checkboxes).
- **FR-010**: Users MUST be able to add a new milestone via a text input and "Add" button. Empty submissions MUST be prevented.
- **FR-011**: Users MUST be able to delete individual milestones via a remove button on each row.
- **FR-012**: The linked habits section MUST display habits linked to the selected goal with their name and streak badge.
- **FR-013**: Users MUST be able to link an active habit to a goal via a dropdown selector showing only unlinked active habits.
- **FR-014**: Users MUST be able to unlink a habit from a goal via an unlink button.
- **FR-015**: The create goal modal MUST include fields for: title (required, 1-200 characters), description (optional), and target date (optional).
- **FR-016**: The edit goal modal MUST present the same fields as create, pre-populated with current values, plus a status selector (Active / Completed).
- **FR-017**: System MUST provide filter tabs (All / Active / Completed) for client-side filtering of the goals list.
- **FR-018**: When the selected goal is no longer visible after a filter change or deletion, the detail panel MUST clear.
- **FR-019**: System MUST allow permanent deletion of goals, preceded by a confirmation dialog.
- **FR-020**: Successful create, edit, delete, progress update, milestone, and habit-link operations MUST show a success notification.
- **FR-021**: Failed operations MUST show an error notification.
- **FR-022**: The goals list MUST show an empty state when no goals exist, encouraging the user to create their first goal.

### Key Entities

- **Goal**: Represents a long-term objective the user wants to achieve. Key attributes: title, description, progress (0-100), target date, status (Active / Completed), linked milestones, linked habits count.
- **Milestone**: Represents a sub-task within a goal. Key attributes: title, completion status, sort order within the goal.
- **Goal-Habit Link**: Represents an association between a goal and a habit. Key attributes: linked goal, linked habit, creation timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new goal in under 30 seconds from clicking "+ New goal" to seeing it in the list.
- **SC-002**: Users can update goal progress in under 5 seconds (enter value, click Update, see feedback).
- **SC-003**: Users can add a milestone in under 5 seconds (type title, click Add, see it in the list).
- **SC-004**: 100% of goal management operations (create, edit, delete, progress update, milestone CRUD, habit link/unlink) provide clear success or error feedback.
- **SC-005**: Users can complete the full goal lifecycle (create, track progress, add milestones, link habits, complete, delete) without encountering dead ends or unclear states.
- **SC-006**: The page loads and displays all goals within 2 seconds on a standard connection.
- **SC-007**: Master-detail navigation (clicking a goal card to see detail) provides visual feedback within 200ms.

## Assumptions

- Users are authenticated and authorized before accessing the Goals page (handled by existing auth from Sprint 1).
- The backend supports all required endpoints (GET/POST/PATCH/DELETE for goals, milestones, progress, and habit links).
- The Goal entity on the backend includes a description field (may need to be added to the existing frontend type from Sprint 2).
- Milestones are returned inline within the Goal response from GET /goals (no separate query needed — no N+1 problem).
- Linked habits require fetching habit details (names, streaks) from the habits endpoint since the goal-habit link only stores IDs.
- The goals list fetches up to 100 goals (pagination beyond 100 is out of scope for MVP).
- Goal progress and milestone completion are independent — completing all milestones does not auto-update progress, and updating progress does not auto-complete milestones.
- Filter tabs use client-side filtering on the already-fetched goals list.
- The detail panel shows a placeholder/empty state when no goal is selected.
- Streak badge reuses the same design tokens as Sprint 3 Habits page.
