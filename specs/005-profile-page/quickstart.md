# Quickstart: Profile Page + Smart Greeting

**Feature**: 005-profile-page | **Date**: 2026-04-05

## Prerequisites

- Backend running at `http://localhost:8080/api/v1`
- User registered and logged in (Sprint 1 auth flow)
- At least 1 habit and 1 goal created (for Stats card verification)

## Scenario 1: View Profile Page

1. Log in and navigate to `/profile`
2. **Verify**: Page shows 4 cards in a single-column layout (max-width 720px, centered):
   - Account card: shows current username (editable Input) and email (read-only text)
   - Telegram card: shows empty input with placeholder (or current chat ID if linked)
   - Stats card: shows 4 metrics — active habits, best streak, active goals, completed goals
   - Danger Zone card: shows "Delete account" button with red accent

## Scenario 2: Edit Username

1. On `/profile`, change the username in the Account card to a valid value (e.g., `new_user_name`)
2. Click **Save**
3. **Verify**: Success toast appears, input shows new username
4. **Verify**: Sidebar user display updates immediately (no page reload)
5. Click the browser back button or navigate to Dashboard
6. **Verify**: Dashboard greeting shows the updated username

### Edge case: Invalid username
1. Enter `UPPERCASE` in the username field
2. **Verify**: Validation error appears ("Only lowercase letters, numbers, hyphens, and underscores")
3. **Verify**: Save button is disabled or form does not submit

### Edge case: Username conflict
1. Enter a username that already exists (another user's username)
2. Click **Save**
3. **Verify**: Error toast with "Username is already taken"
4. **Verify**: Input retains the attempted value for correction

### Edge case: Cancel edit
1. Modify the username
2. Click **Cancel**
3. **Verify**: Input reverts to the original username

## Scenario 3: Link Telegram

1. On `/profile`, enter a numeric chat ID (e.g., `123456789`) in the Telegram card
2. Click **Save**
3. **Verify**: Success toast appears, input retains the saved value

### Edge case: Invalid chat ID
1. Enter `abc` in the Telegram chat ID field
2. **Verify**: Validation error ("Chat ID must contain only digits")

## Scenario 4: View Stats

1. Navigate to `/profile` (having previously visited Dashboard so caches are warm)
2. **Verify**: Stats card shows same values as Dashboard stats row

### Edge case: Direct navigation (cold cache)
1. Open `/profile` in a new browser tab (fresh session, only auth token in localStorage)
2. **Verify**: Stats card shows skeleton placeholders briefly, then loads actual data

### Edge case: No habits/goals
1. With a new user (no habits or goals), navigate to `/profile`
2. **Verify**: Stats show `0` for all counts, `—` for best streak

## Scenario 5: Smart Greeting on Dashboard

1. Ensure the user has a `displayName` set (via backend or profile)
2. Navigate to `/dashboard`
3. **Verify**: Greeting shows "Good {timeOfDay}, {displayName}"

### Fallback
1. With a user that has `displayName: null`
2. Navigate to `/dashboard`
3. **Verify**: Greeting shows "Good {timeOfDay}, {username}" (from authStore)

### Loading state
1. Throttle network to Slow 3G
2. Navigate to `/dashboard`
3. **Verify**: Greeting immediately shows username from authStore (no spinner)
4. **Verify**: Once profile loads, greeting updates to displayName (if set)

## Scenario 6: Delete Account

1. On `/profile`, click "Delete account" in the Danger Zone card
2. **Verify**: Dialog opens with an Input asking to type your username
3. Type a wrong username
4. **Verify**: Confirm button remains disabled
5. Type the exact username
6. **Verify**: Confirm button becomes enabled
7. Click **Confirm**
8. **Verify**: Redirect to `/login`, localStorage cleared (auth tokens gone)
9. **Verify**: Navigating to `/dashboard` redirects to `/login` (auth state cleared)

### Edge case: Cancel deletion
1. Click "Delete account", Dialog opens
2. Click **Cancel**
3. **Verify**: Dialog closes, nothing happens, still on `/profile`
