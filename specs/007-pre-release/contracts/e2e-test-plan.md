# E2E Test Plan (Playwright)

**Feature**: 007-pre-release
**Date**: 2026-04-06

## Configuration

- **Runner**: Playwright 1.x, chromium only
- **Base URL**: `http://localhost:5173`
- **Backend**: `http://localhost:8080/api/v1` (must be running)
- **Timeout**: 30 seconds per test
- **Mode**: Headless by default, `--headed` for debugging
- **Screenshots**: Only on failure
- **Traces**: On first retry

## Test Isolation

Each spec file manages its own user lifecycle:

```
beforeAll:
  POST /api/v1/auth/register { username: `test-{timestamp}-{random}`, email, password }
  Store token for authenticated requests

afterAll:
  DELETE /api/v1/users/me (cascades all user data)
```

## Spec Files

### tests/e2e/auth.spec.ts

| Test | Action | Expected |
|------|--------|----------|
| Register new user | Fill form, submit | Redirect to /dashboard, greeting visible |
| Login with email | Enter email + password | Redirect to /dashboard |
| Login with username | Enter username + password | Redirect to /dashboard |
| Login wrong password | Enter wrong password | Error message displayed |
| Logout | Click logout button | Redirect to /login |
| Protected route redirect | Navigate to /dashboard unauthenticated | Redirect to /login |

### tests/e2e/habits.spec.ts

| Test | Action | Expected |
|------|--------|----------|
| Navigate to /habits | Click sidebar link | Habits page loads |
| Create DAILY habit | Fill form, select DAILY, submit | Habit appears in list |
| Create CUSTOM habit | Fill form, select CUSTOM, pick days, submit | Habit appears with CUSTOM badge |
| Complete habit | Click checkbox | "Completed today" shown, optimistic update |
| Edit habit | Click edit, change title, save | Title updated in list |
| Archive habit | Click archive button | Habit moves to Archived filter |
| Restore habit | Switch to Archived, click restore | Habit returns to Active |
| Delete archived habit | Archive first, then delete | Habit removed from list |
| Filter Active tab | Click Active filter | Only active habits shown |
| Search by name | Type in search input | Filtered results shown |

### tests/e2e/goals.spec.ts

| Test | Action | Expected |
|------|--------|----------|
| Navigate to /goals | Click sidebar link | Goals page loads |
| Create goal | Fill form, submit | Goal appears in list |
| View goal detail | Click goal card | Detail panel opens (or full-screen on mobile) |
| Update progress to 50% | Set progress slider/input | Progress bar updates |
| Add milestone | Type milestone, submit | Milestone appears in checklist |
| Toggle milestone | Click milestone checkbox | Completed state toggles |
| Complete goal (100%) | Set progress to 100 | Status badge shows Completed |
| Delete goal | Click delete, confirm | Goal removed from list |

### tests/e2e/profile.spec.ts

| Test | Action | Expected |
|------|--------|----------|
| Navigate to /profile | Click sidebar link | Profile page loads |
| Update display name | Edit name, save | Name updated, Dashboard greeting reflects change |
| Link Telegram Chat ID | Enter chat ID, save | Saved successfully |

### tests/e2e/mobile.spec.ts

**Viewport**: 375x812 (iPhone-sized)

| Test | Action | Expected |
|------|--------|----------|
| Hamburger visible | Load page at 375px | Hamburger button visible, sidebar hidden |
| Open sidebar | Click hamburger | Sidebar overlay slides from left |
| Navigate via sidebar | Click nav item in overlay | Page changes, sidebar closes |
| Goals: tap goal | Tap goal card | Detail view appears full-screen |
| Goals: back button | Tap "← Goals" button | Returns to goals list |
