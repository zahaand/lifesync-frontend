# Feature Specification: Dashboard Page

**Feature Branch**: `002-dashboard-page`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "Sprint 2: Dashboard page — first authenticated page with habits/goals overview"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard Overview with Stats (Priority: P1)

An authenticated user navigates to the dashboard and immediately sees a personalized greeting with the current date, followed by a row of summary statistics showing their habit completion rate for today, their best active streak, and counts of active and completed goals. This gives the user an instant snapshot of their progress.

**Why this priority**: The stats overview is the core value of the dashboard — it provides at-a-glance motivation and awareness. Without it, the page has no purpose.

**Independent Test**: Can be fully tested by logging in and verifying the greeting matches the time of day, the date is correct, and the four stat cards display data (or zero-state values when no habits/goals exist).

**Acceptance Scenarios**:

1. **Given** an authenticated user with active habits and goals, **When** they navigate to /dashboard, **Then** the system displays a greeting ("Good morning/afternoon/evening, {username}"), the current date, and four stat cards: today's habit completion (X / Y), best streak (N days — habit name), active goals count, and completed goals count.
2. **Given** an authenticated user with no habits and no goals, **When** they navigate to /dashboard, **Then** the stat cards display zero values (0 / 0 habits, no streak, 0 active goals, 0 completed goals) without errors.
3. **Given** an authenticated user, **When** the dashboard is loading data, **Then** the system displays loading skeletons in place of the stat cards until data arrives.

---

### User Story 2 - Today's Habits Checklist (Priority: P1)

An authenticated user sees a card listing their active daily habits for today. Each habit has a checkbox indicating whether it has been completed today and a streak badge showing the current streak. The user can check a habit to mark it done or uncheck to undo, with instant visual feedback.

**Why this priority**: Habit tracking is the primary daily interaction — users visit the dashboard specifically to check off today's habits. This is the core engagement loop.

**Independent Test**: Can be fully tested by creating habits via the backend, navigating to the dashboard, checking/unchecking habits, and verifying the checkbox state and streak badges update correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user with active daily habits, **When** they view the dashboard, **Then** the "Today's habits" card lists each active habit with its name, a checkbox reflecting today's completion status, and a streak badge.
2. **Given** a user viewing an uncompleted habit, **When** they check the checkbox, **Then** the system immediately shows the habit as completed (optimistic update) and sends a completion request to the server; if the server confirms, the state persists; if the server rejects, the checkbox reverts and an error is shown.
3. **Given** a user viewing a completed habit, **When** they uncheck the checkbox, **Then** the system immediately shows the habit as uncompleted (optimistic update) and sends an uncomplete request to the server; if the server rejects, the checkbox reverts and an error is shown.
4. **Given** a user with no active habits, **When** they view the dashboard, **Then** the "Today's habits" card displays an empty state message (e.g., "No habits yet. Create your first habit to get started.").
5. **Given** a user viewing the habits card, **When** they click "View all", **Then** the system navigates to /habits.

---

### User Story 3 - Active Goals Overview (Priority: P2)

An authenticated user sees a card showing their active goals with progress indicators. Each goal displays its name, completion percentage with a progress bar, deadline, status badge, and up to three milestones with their completion status. This helps the user track long-term progress alongside daily habits.

**Why this priority**: Goals provide the longer-term context for habits. Showing them on the dashboard connects daily actions to bigger objectives, but the dashboard is still useful without goals (habits alone provide value).

**Independent Test**: Can be fully tested by creating goals with milestones via the backend, navigating to the dashboard, and verifying the goals card displays correct progress data, badges, and milestones.

**Acceptance Scenarios**:

1. **Given** an authenticated user with active goals, **When** they view the dashboard, **Then** the "Active goals" card lists up to 5 goals ordered by deadline (earliest first, goals without deadline last), each showing: name, progress percentage with a progress bar, deadline (if set), status badge, and the first 3 milestones with completion indicators.
2. **Given** a user with no active goals, **When** they view the dashboard, **Then** the "Active goals" card displays an empty state message (e.g., "No active goals. Set a goal to start tracking your progress.").
3. **Given** a user with more than 5 active goals, **When** they view the dashboard, **Then** only the first 5 goals (by deadline) are shown, with a "View all" link to /goals.
4. **Given** a user viewing the goals card, **When** they click "View all", **Then** the system navigates to /goals.

---

### User Story 4 - Create Habit Entry Point (Priority: P3)

An authenticated user sees a "New habit" button in the dashboard top bar. Clicking it opens a stub modal (placeholder) that will be fully implemented in Sprint 3. This establishes the entry point for habit creation from the dashboard.

**Why this priority**: The button is a stub — it provides discoverability and sets up the UX flow, but no actual creation logic is needed this sprint.

**Independent Test**: Can be tested by clicking the "New habit" button and verifying a placeholder modal appears.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** they click the "New habit" button, **Then** a stub modal opens indicating the feature is coming soon (or showing a placeholder form).
2. **Given** a user with the stub modal open, **When** they close or dismiss it, **Then** the modal closes and the dashboard remains in its prior state.

---

### Edge Cases

- What happens when a habit completion request fails after the optimistic update? The checkbox must revert to its previous state and display a brief error notification.
- What happens when the user's session expires while interacting with the dashboard? The 401 refresh interceptor (from Sprint 1) should silently refresh the token; if refresh fails, the user is redirected to the auth page.
- What happens when the server returns an empty habits list but the user has goals (or vice versa)? Each card must handle its empty state independently — one card showing data while the other shows empty state is a valid scenario.
- What happens when the greeting is displayed exactly at a time-of-day boundary (e.g., noon)? The greeting should use simple hour-based thresholds (morning: 5–11, afternoon: 12–17, evening: 18–4) evaluated once on render without live updates.
- What happens when a goal has no milestones? The milestones section for that goal is hidden entirely.
- What happens when a goal has no deadline (targetDate is null)? The deadline display should show "No deadline" or be omitted, and the goal should sort after goals with deadlines.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a personalized greeting ("Good morning/afternoon/evening, {username}") based on the client's local time using hour thresholds: morning 5:00–11:59, afternoon 12:00–17:59, evening 18:00–4:59
- **FR-002**: System MUST display the current date (client-side, formatted for readability, e.g., "Thursday, April 3, 2026") in the dashboard top bar
- **FR-003**: System MUST display a "New habit" button in the dashboard top bar that opens a stub modal (placeholder for Sprint 3)
- **FR-004**: System MUST display four stat cards in a row: today's habit completion (X / Y), best streak (N days — habit name), active goals count, and completed goals count
- **FR-005**: System MUST display a "Today's habits" card listing all active habits with daily frequency, each showing: habit name, completion checkbox for today, and streak badge
- **FR-006**: System MUST support optimistic updates for habit completion — immediately reflect the checkbox state change in the UI before server confirmation
- **FR-007**: System MUST revert the optimistic update and display a toast notification (auto-dismissing after ~3 seconds) if the server rejects a habit completion or uncompletion request
- **FR-008**: System MUST display the "Today's habits" card with a "View all" link that navigates to /habits
- **FR-009**: System MUST display an "Active goals" card listing up to 5 active goals ordered by deadline ascending (nulls last), each showing: goal name, progress percentage with progress bar, deadline (or "No deadline"), status badge, and the first 3 milestones with completion status (milestones section hidden if goal has none)
- **FR-010**: System MUST display the "Active goals" card with a "View all" link that navigates to /goals
- **FR-011**: System MUST display loading skeleton placeholders while data is being fetched for stat cards, habits card, and goals card
- **FR-012**: System MUST display an empty state message when the user has no active habits (in the habits card) or no active goals (in the goals card)
- **FR-013**: System MUST use the accent color #534AB7 as the primary brand color, with approved mockup colours for badges and progress bars as defined in the design reference
- **FR-014**: System MUST lay out the dashboard as: top bar (greeting + date + button), stats row (4 cards), then two-column layout with habits card (left) and goals card (right)
- **FR-015**: The stats card for "Best streak" MUST display the streak length in days and the associated habit name; if multiple habits share the highest streak, show the first one by list order; if no habits have streaks, it MUST show "0 days"

### Key Entities

- **Habit**: An active trackable behavior; key attributes include name, frequency (daily), status (ACTIVE), completedToday (boolean), todayLogId (nullable identifier for uncomplete), and currentStreak (consecutive days)
- **Habit Log**: A record of a single habit completion event; key attributes include the log identifier (needed for uncomplete) and the date of completion
- **Goal**: A longer-term objective the user is working toward; key attributes include name, progress percentage, target date (optional), status (ACTIVE or COMPLETED), and up to 3 milestones included inline from the list endpoint
- **Milestone**: A sub-step within a goal; key attributes include name and completion status (done or not done)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their dashboard overview (greeting, stats, habits, goals) within 3 seconds of navigation
- **SC-002**: Habit checkbox toggle provides visual feedback within 100 milliseconds (optimistic update, before server response)
- **SC-003**: Users with no habits and no goals see clear, actionable empty states that guide them to create their first habit or goal
- **SC-004**: All four stat cards display accurate, up-to-date data reflecting the user's current habits and goals
- **SC-005**: Dashboard gracefully handles partial data availability — each card (stats, habits, goals) loads and displays independently without blocking other cards
- **SC-006**: The dashboard is the first page users see after login, reinforcing daily engagement with their habits and goals

## Clarifications

### Session 2026-04-03

- Q: Should we fetch logs and streak per habit individually (N+1), or does the backend provide bulk data? → A: GET /habits response includes `completedToday` (boolean), `todayLogId` (UUID, nullable), and `currentStreak` (integer) per habit. No separate log/streak requests needed.
- Q: What timezone defines "today" for habit completion? → A: Server-side — the backend handles the date boundary. Frontend does not need to send a timezone.
- Q: If two habits share the highest streak, which one is shown on the "Best streak" stat card? → A: First habit by list order wins (simplest, deterministic).
- Q: What UI component for error notification on failed optimistic update? → A: Toast notification via shadcn Sonner, auto-dismissing after ~3 seconds.
- Q: Does the goals list endpoint include milestones, or do we need per-goal detail calls? → A: Goals list includes first 3 milestones per goal inline (no N+1). Hide milestones section if goal has 0 milestones.

## Assumptions

- The backend provides enriched API endpoints: GET /habits includes completedToday, todayLogId, and currentStreak per habit; GET /goals includes up to 3 milestones per goal inline
- Sprint 1 infrastructure (auth store, API client with Bearer/refresh interceptors, protected routes, Layout shell) is fully functional and available
- The dashboard route /dashboard already exists as a placeholder from Sprint 1 and will be replaced with the full implementation
- Habit frequency is limited to "daily" for this sprint; other frequencies (weekly, custom) are out of scope
- The "New habit" button opens a stub modal only — full habit creation is deferred to Sprint 3
- The user's username is available from the auth store (persisted from login response)
- Goals have a progress percentage field computed by the backend; the frontend does not calculate progress
- Milestone completion status is provided by the backend as a boolean; the frontend does not toggle milestones from the dashboard
