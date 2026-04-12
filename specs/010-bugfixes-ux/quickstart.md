# Quickstart: Bug Fixes, UX Improvements & Onboarding Tooltips

**Branch**: `010-bugfixes-ux` | **Date**: 2026-04-09

## Verification Scenarios

### BUG-001: Password Validation
1. Go to `/login`, switch to Register tab
2. Enter valid email and username
3. Enter "12345678" as password → submit
4. **Expected**: See specific error "Must contain at least one uppercase letter" (or equivalent per-rule message)
5. Enter "Abcdefg1" → submit
6. **Expected**: See "Must contain at least one special character"
7. Switch app to Russian → repeat
8. **Expected**: Error messages in Russian

### BUG-002: Username Normalization
1. Register with username "TestUser"
2. **Expected**: Backend receives "testuser"
3. **Expected**: Hint below username field says "Username is case-insensitive and will be stored in lowercase"

### BUG-003: Unsaved Changes Guard
1. Click "New habit" → type "Morning Run" in title
2. Click X button or click outside modal
3. **Expected**: AlertDialog "Discard changes?" appears
4. Click "Keep editing" → form stays open with data preserved
5. Repeat step 2, click "Discard" → modal closes, data cleared
6. Open modal again, leave title empty, click outside
7. **Expected**: Modal closes immediately, no dialog
8. Repeat for GoalFormModal (New goal)

### BUG-004: Goal Cache Invalidation
1. Create a goal and navigate to its detail
2. Click "Link" to add a habit
3. **Expected**: Linked habits count updates immediately
4. Update progress percentage
5. **Expected**: Progress bar updates immediately
6. Navigate to goals list
7. **Expected**: GoalCard shows updated data

### BUG-005: Locale-Aware Date Picker
1. Set app language to English
2. Create/edit a goal → click target date field
3. **Expected**: Calendar popup shows English month/day names
4. Switch to Russian → repeat
5. **Expected**: Calendar shows Russian month/day names
6. Select a date → save goal
7. **Expected**: Date saved correctly

### BUG-006: Ghost Button
1. Go to Profile page
2. Change display name
3. Click Save
4. **Expected**: Only one button visible during save (no ghost/duplicate)
5. After save completes → button area clean

### BUG-007: Login Normalization
1. Register account as "test@example.com"
2. Log out, go to login
3. Enter "Test@Example.com" as identifier
4. **Expected**: Login succeeds
5. Enter " testuser " (with spaces) → login succeeds

### UX-001: Onboarding Tooltips
1. Navigate to Goals page
2. Hover/tap info icon next to "Goals" heading
3. **Expected**: Tooltip explains goals concept
4. Open a goal detail
5. Hover info icon next to "Milestones"
6. **Expected**: Tooltip explains milestones
7. Hover info icon next to "Linked Habits"
8. **Expected**: Tooltip explains linking mechanism
9. Switch to Russian → repeat
10. **Expected**: All tooltips in Russian
11. Tab to info icons via keyboard
12. **Expected**: Tooltips accessible via keyboard focus
