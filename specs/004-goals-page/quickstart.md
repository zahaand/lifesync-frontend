# Quickstart: 004-goals-page

**Date**: 2026-04-05

## Prerequisites

- Backend running at http://localhost:8080/api/v1
- User logged in (auth token in localStorage)
- At least 2 goals created (1 active, 1 completed) with milestones
- At least 2 active habits created (for linking tests)

## Verification Checklist

### 1. Page Load & Navigation

1. Navigate to `/goals`
2. Verify page title "Goals" with subtitle "N active · M completed"
3. Verify goals displayed as cards in left column
4. Verify right panel shows placeholder "Select a goal to view details"

### 2. Goal Selection (Master-Detail)

1. Click a goal card
2. Verify card gets purple border (selected state)
3. Verify right panel shows goal title, description, progress, milestones, linked habits
4. Click a different goal — verify panel updates

### 3. Create Goal

1. Click "+ New goal" button
2. Fill in title "Test Goal", optional description, optional target date
3. Submit — verify modal closes, success toast, goal appears in list
4. Try submitting with empty title — verify validation error
5. Try title > 200 chars — verify validation error

### 4. Edit Goal

1. Select a goal, click edit button in detail panel
2. Verify modal opens with pre-filled values
3. Change title, save — verify updated in list and detail
4. Change status to COMPLETED via status selector — verify badge updates

### 5. Progress Update

1. Select an active goal
2. Enter new progress value (e.g., 50) in the input
3. Click "Update" — verify progress bar and percentage update, success toast
4. Set progress to 100 — verify status changes to COMPLETED automatically
5. On a COMPLETED goal, change progress to 80 — verify progress updates but status stays COMPLETED

### 6. Milestone Management

1. Select a goal with milestones
2. Verify all milestones listed with checkboxes
3. Toggle a milestone checkbox — verify visual change (green indicator)
4. Toggle it back — verify it returns to incomplete
5. Type a title in add input, click "Add" — verify new milestone appears
6. Try clicking "Add" with empty input — verify nothing happens
7. Click delete (×) on a milestone — verify it's removed

### 7. Linked Habits

1. Select a goal
2. Open the habit linking dropdown — verify only unlinked active habits shown
3. Select a habit, click "Link" — verify it appears in linked list with streak badge
4. Click unlink on a linked habit — verify it's removed from the list
5. Verify unlinked habit reappears in the dropdown

### 8. Filter Tabs

1. Click "Active" tab — verify only active goals shown
2. Click "Completed" tab — verify only completed goals shown
3. Click "All" tab — verify all goals shown
4. Select a goal, switch to a tab that hides it — verify detail panel clears

### 9. Delete Goal

1. Select a goal, click delete button in detail panel
2. Verify confirmation dialog with goal title
3. Click Cancel — verify dialog closes, goal unchanged
4. Click Delete — verify goal removed from list, detail panel clears, success toast

### 10. Empty States

1. Delete all goals (or use a fresh account)
2. Verify empty state "No goals yet" with create button
3. Create a goal, select it — verify detail panel works

### 11. Cross-Page Consistency

1. Navigate to `/dashboard` — verify goals section still works
2. Navigate back to `/goals` — verify list is up-to-date
