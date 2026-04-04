# Quickstart: Dashboard Page

**Feature**: 002-dashboard-page | **Date**: 2026-04-04

## Prerequisites

- Sprint 1 complete: auth store, API client, protected routes, Layout shell
- Backend running at `VITE_API_BASE_URL` with habits and goals endpoints
- At least one user account registered

## Setup

```bash
# Install new dependency
npm install sonner

# Add new shadcn/ui components
npx shadcn@latest add skeleton dialog checkbox progress badge

# Add Sonner toast component
npx shadcn@latest add sonner

# Start dev server
npm run dev
```

## Verification Steps

### Step 1: Dashboard loads with greeting and date

1. Log in with valid credentials
2. Verify redirect to /dashboard
3. Verify greeting matches time of day ("Good morning/afternoon/evening, {username}")
4. Verify current date is displayed (e.g., "Friday, April 4, 2026")

### Step 2: Stats cards display

1. Verify 4 stat cards are visible in a row:
   - Today's habits: X / Y
   - Best streak: N days — {habit name}
   - Active goals: N
   - Completed goals: N
2. With no habits/goals, verify zero values display without errors

### Step 3: Loading skeletons

1. Throttle network in DevTools (Slow 3G)
2. Refresh dashboard
3. Verify skeleton placeholders appear for stat cards, habits card, and goals card

### Step 4: Habits checklist — complete/uncomplete

1. Create habits via backend (if none exist)
2. Verify habits list shows with checkboxes and streak badges
3. Check a habit → checkbox fills immediately (optimistic)
4. Verify network tab shows POST /habits/{id}/complete
5. Uncheck the habit → checkbox clears immediately
6. Verify network tab shows DELETE /habits/{id}/complete/{logId}
7. Simulate server error (e.g., disconnect backend) → check habit → verify checkbox reverts and toast appears

### Step 5: Habits empty state

1. Delete all habits via backend
2. Verify "No habits yet" empty state message appears

### Step 6: Goals card

1. Create goals with milestones via backend
2. Verify goals card shows up to 5 active goals with:
   - Name, progress bar, progress percentage
   - Deadline (or "No deadline")
   - Status badge
   - Up to 3 milestones with completion indicators
3. Verify goals without milestones have no milestones section
4. Click "View all" → navigates to /goals

### Step 7: Goals empty state

1. Remove all active goals via backend
2. Verify "No active goals" empty state message appears

### Step 8: New habit button (stub)

1. Click "New habit" button in top bar
2. Verify stub modal opens
3. Close/dismiss modal → dashboard unchanged

### Step 9: View all links

1. Click "View all" on habits card → navigates to /habits
2. Click "View all" on goals card → navigates to /goals
3. (These pages may not exist yet — verify URL change is correct)

### Step 10: Build verification

```bash
npx tsc -b         # Zero TypeScript errors
npx eslint .       # Zero lint warnings
npm run build       # Vite build succeeds
```
