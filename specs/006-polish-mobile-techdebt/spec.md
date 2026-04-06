# Feature Specification: Polish — Mobile Adaptation + Tech Debt

**Feature Branch**: `006-polish-mobile-techdebt`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "Sprint 6: Polish — mobile responsive layout for all pages + tech debt TD-002 (habit completion history drawer)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile Navigation (Priority: P1)

A user opens the application on a mobile phone. The sidebar is hidden to maximize screen space. A hamburger menu button is visible in the header. Tapping the hamburger opens the sidebar as an overlay drawer that slides in from the left. The user taps a navigation item and the sidebar closes, navigating to the selected page. Tapping outside the overlay or pressing a close button dismisses it.

On a tablet (768–1024px), the sidebar is permanently visible but collapsed to show only icons. Hovering or tapping an icon reveals the label.

**Why this priority**: Navigation is the foundation of the mobile experience — if users cannot navigate between pages on mobile, no other mobile improvement matters.

**Independent Test**: Can be fully tested by resizing the browser to mobile/tablet widths and verifying sidebar behavior across all breakpoints.

**Acceptance Scenarios**:

1. **Given** the user is on a screen narrower than 768px, **When** the page loads, **Then** the sidebar is hidden and a hamburger menu button is visible in the header area.
2. **Given** the sidebar is hidden on mobile, **When** the user taps the hamburger button, **Then** the sidebar slides in as an overlay drawer from the left.
3. **Given** the sidebar overlay is open, **When** the user taps a navigation link, **Then** the page navigates to the selected route and the sidebar overlay closes.
4. **Given** the sidebar overlay is open, **When** the user taps outside the overlay or taps a close button, **Then** the overlay closes.
5. **Given** the user is on a screen between 768px and 1024px (tablet), **When** the page loads, **Then** the sidebar is visible but collapsed to icons only.

---

### User Story 2 - Habit Completion History Drawer (Priority: P1)

A user on the Habits page wants to review the completion history of a specific habit. They click on the habit name or a dedicated "History" button on a habit card. A side panel (drawer) slides open from the right displaying a chronological list of completion log entries for that habit. Each entry shows the date and the time when the habit was marked as completed. The list is paginated — the user can load more entries by clicking a "Load more" button at the bottom. If there are no log entries, a friendly empty state message is displayed.

**Why this priority**: This is the sole new feature (TD-002) in this sprint and delivers user value by providing visibility into habit tracking history — a frequently requested insight.

**Independent Test**: Can be fully tested by navigating to the Habits page, clicking on a habit's name or History button, and verifying the drawer opens with correct log entries and pagination.

**Acceptance Scenarios**:

1. **Given** the user is on the Habits page, **When** they click a habit name or its "History" button, **Then** a side panel drawer slides open from the right.
2. **Given** the history drawer is open, **When** log entries exist for the habit, **Then** the drawer displays a chronological list of entries showing date and completion timestamp.
3. **Given** the history drawer shows a partial list, **When** the user clicks "Load more", **Then** the next page of log entries loads and appends below the existing entries.
4. **Given** no more pages remain, **When** all entries are loaded, **Then** the "Load more" button is no longer shown.
5. **Given** the habit has no completion history, **When** the drawer opens, **Then** a friendly empty state message is displayed (e.g., "No completions yet").
6. **Given** the drawer is open, **When** the user clicks outside the drawer or taps a close button, **Then** the drawer closes.

---

### User Story 3 - Dashboard Responsive Layout (Priority: P2)

A user opens the Dashboard page on a mobile device. The stats row, which normally shows four items in a row on desktop, now shows two items per row. The two-column card layout below stacks into a single column so each card takes the full width of the screen, making content easy to read and interact with.

**Why this priority**: The Dashboard is the landing page after login — it must be usable on mobile for a good first impression, but it is a read-only view with less interactive complexity.

**Independent Test**: Can be tested by loading the Dashboard on a mobile viewport and verifying stats grid and cards reflow correctly.

**Acceptance Scenarios**:

1. **Given** the user is on the Dashboard on a screen narrower than 768px, **When** the page renders, **Then** the stats row displays in a 2-column grid instead of 4-column.
2. **Given** the user is on the Dashboard on mobile, **When** the page renders, **Then** the two-column card layout stacks into a single column.
3. **Given** the user is on a tablet (768–1024px), **When** the page renders, **Then** the layout adjusts proportionally (e.g., stats may remain 4-column or shift to 2-column, cards may remain 2-column).

---

### User Story 4 - Goals Page Mobile Layout (Priority: P2)

A user opens the Goals page on a mobile device. Instead of seeing the master-detail split layout, they see a list of all their goals. Tapping on a goal navigates to a full-screen detail view. A back button allows them to return to the goal list. On tablet and desktop, the existing side-by-side layout is preserved.

**Why this priority**: The Goals page master-detail layout is completely broken on narrow screens — the two columns would be too compressed to use.

**Independent Test**: Can be tested by loading Goals on a mobile viewport, tapping a goal, verifying full-screen detail appears with a back button.

**Acceptance Scenarios**:

1. **Given** the user is on the Goals page on a screen narrower than 768px, **When** the page loads, **Then** only the goals list is displayed (full width, single column).
2. **Given** the user is viewing the goals list on mobile, **When** they tap a goal, **Then** the detail view takes over the full screen.
3. **Given** the user is viewing a goal detail on mobile, **When** they tap the back button, **Then** they return to the goals list.
4. **Given** the user is on a tablet or wider screen, **When** the page loads, **Then** the master-detail side-by-side layout is preserved.

---

### User Story 5 - Habits Page Mobile Adjustments (Priority: P3)

A user views the Habits page on mobile. The layout is already single-column but spacing and padding are adjusted for comfortable touch interaction. Filter tabs scroll horizontally if they overflow. Habit card action buttons either stack vertically or collapse into a dropdown menu to prevent crowding.

**Why this priority**: The Habits page is already mostly mobile-friendly; these are refinements for polish rather than fixing broken layouts.

**Independent Test**: Can be tested by loading Habits on mobile, verifying filter tabs scroll, and action buttons are accessible.

**Acceptance Scenarios**:

1. **Given** the user is on the Habits page on mobile, **When** there are more filter tabs than fit on screen, **Then** the tabs are horizontally scrollable.
2. **Given** the user is viewing a habit card on mobile, **When** action buttons would overflow, **Then** they stack vertically or are accessible via a dropdown/overflow menu.
3. **Given** the user is on the Habits page on mobile, **When** the page renders, **Then** padding and spacing are appropriate for touch targets (minimum 44px tap areas).

---

### User Story 6 - Profile Page Mobile Adjustments (Priority: P3)

A user views their Profile page on mobile. The layout remains single-column with adjusted padding for comfortable reading and interaction. The stats card grid remains 2-column.

**Why this priority**: The Profile page is already single-column and requires only minor padding adjustments — lowest effort of all pages.

**Independent Test**: Can be tested by loading Profile on mobile and verifying spacing is comfortable.

**Acceptance Scenarios**:

1. **Given** the user is on the Profile page on mobile, **When** the page renders, **Then** the layout has appropriate padding and spacing for mobile.
2. **Given** the user is viewing the stats card on mobile, **When** the page renders, **Then** the stats card maintains a 2-column grid layout.

---

### Edge Cases

- What happens when the user rotates their device from portrait to landscape while the sidebar overlay is open? The layout should adapt and the overlay should remain functional or close gracefully.
- What happens when the habit history drawer is open on desktop and the user resizes the browser to mobile width? The drawer should remain functional and adapt to the narrower width.
- What happens when the habit history API returns an error while loading more entries? An error message should be displayed without losing already-loaded entries.
- What happens when the user rapidly taps the "Load more" button in the history drawer? Duplicate requests should be prevented (button disabled during loading).
- What happens on the Goals page when the user navigates directly to a goal detail URL on mobile? The detail view should display with a back button to the list.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hamburger menu button on screens narrower than 768px that opens the sidebar as an overlay drawer.
- **FR-002**: System MUST collapse the sidebar to icon-only mode on screens between 768px and 1024px.
- **FR-003**: System MUST close the sidebar overlay when a navigation link is tapped or when the user taps outside the overlay.
- **FR-004**: System MUST provide a side panel (drawer) showing habit completion history when the user clicks a habit name or "History" button.
- **FR-005**: The history drawer MUST display log entries with date and completion timestamp in chronological order (most recent first).
- **FR-006**: The history drawer MUST support pagination with a "Load more" button that appends additional entries.
- **FR-007**: The history drawer MUST show an empty state message when no log entries exist.
- **FR-008**: System MUST reflow the Dashboard stats row to a 2-column grid on screens narrower than 768px.
- **FR-009**: System MUST stack Dashboard card columns into a single column on screens narrower than 768px.
- **FR-010**: System MUST display the Goals page as a single-column list on screens narrower than 768px, with tap-to-view-detail and back navigation.
- **FR-011**: System MUST enable horizontal scrolling for Habits page filter tabs when they overflow on mobile.
- **FR-012**: System MUST stack or collapse habit card action buttons on mobile to prevent overflow.
- **FR-013**: System MUST adjust Profile page padding for comfortable mobile interaction.
- **FR-014**: System MUST disable the "Load more" button while a page of history entries is being fetched to prevent duplicate requests.
- **FR-015**: All pages MUST maintain full functionality on desktop (screens wider than 1024px) without regression.

### Key Entities

- **Habit Log Entry**: Represents a single completion event for a habit. Key attributes: associated habit, date of completion, timestamp when marked as completed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All application pages are fully navigable and usable on screens as narrow as 320px without horizontal scrolling or content overflow.
- **SC-002**: Users can open and close the mobile sidebar overlay in under 1 second with smooth animation.
- **SC-003**: Users can access habit completion history within 2 taps from the Habits page.
- **SC-004**: The history drawer loads the first page of entries within 2 seconds on a standard connection.
- **SC-005**: Users on mobile can navigate from the Goals list to a goal detail and back without losing their scroll position in the list.
- **SC-006**: 100% of existing desktop functionality remains unaffected — no regressions on screens wider than 1024px.
- **SC-007**: All interactive elements on mobile have a minimum tap target size of 44x44 pixels.

## Assumptions

- Users access the application on modern mobile browsers (Safari on iOS 15+, Chrome on Android 10+) that support standard responsive layout features.
- The backend already exposes or will expose a paginated endpoint for habit completion logs (GET /api/v1/habits/{id}/logs).
- Page size for habit log pagination defaults to 20 entries per page (industry-standard default for list views).
- The existing desktop layouts for all pages are complete and functional (Sprints 1–5 merged).
- Touch interactions follow platform conventions (swipe to close drawers, tap targets per mobile accessibility guidelines).
- No new pages or routes are introduced — only existing pages receive responsive adjustments plus the new history drawer overlay.
