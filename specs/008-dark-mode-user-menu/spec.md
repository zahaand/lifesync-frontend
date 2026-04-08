# Feature Specification: Dark Mode & User Menu Update

**Feature Branch**: `008-dark-mode-user-menu`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "Sprint 8: Dark mode + user menu update"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Dark Mode (Priority: P1)

A user opens the application and wants to switch to dark mode for comfortable use in low-light environments. They click the user chip (bottom of sidebar on desktop, or in the mobile Sheet), select the theme toggle option, and the entire application immediately switches to dark mode. All text, backgrounds, badges, and UI elements remain clearly readable.

**Why this priority**: Dark mode is the core feature of this sprint. Without it, nothing else in scope has meaning.

**Independent Test**: Can be fully tested by toggling the theme and visually verifying all pages render correctly in both light and dark modes.

**Acceptance Scenarios**:

1. **Given** the app is in light mode, **When** the user opens the user chip menu and clicks the theme toggle, **Then** the app switches to dark mode with all elements readable.
2. **Given** the app is in dark mode, **When** the user opens the user chip menu and clicks the theme toggle, **Then** the app switches back to light mode with all elements readable.
3. **Given** the user toggles to dark mode, **When** they navigate across different pages (dashboard, habits, goals, profile), **Then** all pages display correctly in dark mode.

---

### User Story 2 - Theme Persistence Across Sessions (Priority: P1)

A user selects dark mode and closes the browser. When they return later and open the application, it loads directly in dark mode without any flash of the wrong theme.

**Why this priority**: Persistence is essential for a usable dark mode — forcing users to re-select every session defeats the purpose.

**Independent Test**: Can be tested by selecting a theme, closing the tab, reopening, and verifying the correct theme loads instantly.

**Acceptance Scenarios**:

1. **Given** the user has selected dark mode, **When** they close and reopen the application, **Then** the app loads directly in dark mode without any flash of light mode.
2. **Given** the user has selected light mode (or never changed the default), **When** they open the application, **Then** the app loads in light mode.
3. **Given** the user clears browser storage, **When** they reopen the application, **Then** the app applies the OS color scheme preference (or light mode if none detected).

---

### User Story 3 - Updated User Chip Menu (Priority: P2)

A user opens the user chip dropdown menu and sees a streamlined menu with a theme toggle and log out option. The Profile link has been removed since the sidebar already provides navigation to the profile page.

**Why this priority**: The menu update is the delivery mechanism for the theme toggle and also simplifies navigation by removing a redundant link.

**Independent Test**: Can be tested by opening the user chip menu on both desktop sidebar and mobile Sheet, verifying menu items are correct.

**Acceptance Scenarios**:

1. **Given** the user is on desktop, **When** they click the user chip at the bottom of the sidebar, **Then** they see a menu with "Dark mode" toggle (with Moon icon) and "Log out" — no "Profile" item.
2. **Given** the user is on mobile, **When** they open the Sheet and tap the user chip, **Then** they see the same menu items as desktop.
3. **Given** the app is in dark mode, **When** the user opens the menu, **Then** the toggle shows "Light mode" with a Sun icon.
4. **Given** the app is in light mode, **When** the user opens the menu, **Then** the toggle shows "Dark mode" with a Moon icon.

---

### User Story 4 - Custom Color Readability in Dark Mode (Priority: P2)

A user viewing habits or goals pages in dark mode sees that custom-colored badges (streak badge in amber, done-today badge in emerald) remain clearly readable against the dark background, with appropriate dark mode color variants.

**Why this priority**: Custom colors that become unreadable in dark mode would make key information inaccessible.

**Independent Test**: Can be tested by switching to dark mode and verifying badge readability on habits/goals pages.

**Acceptance Scenarios**:

1. **Given** the app is in dark mode, **When** the user views the streak badge (amber), **Then** the badge text and background have sufficient contrast and are clearly readable.
2. **Given** the app is in dark mode, **When** the user views the done-today badge (emerald), **Then** the badge text and background have sufficient contrast and are clearly readable.
3. **Given** the app is in dark mode, **When** the user views the primary purple (#534AB7) branding/logo, **Then** it displays correctly without modification.
4. **Given** the app is in dark mode, **When** the user views the green (#1D9E75) elements, **Then** they display correctly without modification.

---

### Edge Cases

- What happens when localStorage is unavailable (private browsing, security policy)? The inline `<head>` script catches the error silently and defaults to light mode. The toggle still works for the current session but does not persist.
- What happens when a stored theme value is corrupted or invalid (not `'light'` or `'dark'`)? The app treats it as missing — falls back to OS `prefers-color-scheme`, then to light mode. The themeStore re-initializes with the fallback value.
- How does the theme toggle behave during page transitions? Theme must persist without flicker during client-side navigation.
- What if the user has system-level dark mode preference? On first visit (no stored choice), the app respects the OS preference. Once the user explicitly toggles, their choice takes precedence over OS setting.
- What if the user changes OS color scheme after first visit (e.g., macOS auto dark mode at sunset)? The app does NOT auto-update. The persisted localStorage value takes precedence. Only a manual toggle in the user chip menu can change the theme after first visit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support two theme modes: light and dark.
- **FR-002**: System MUST persist the user's theme preference in browser local storage.
- **FR-003**: The theme class MUST be applied before the first paint via an inline `<script>` in the HTML `<head>`. No visible color change may occur after the initial render. Verified by: hard-refreshing with dark mode active shows no white flash on any page.
- **FR-004**: System MUST provide a theme toggle action accessible from the user chip dropdown menu.
- **FR-005**: The theme toggle MUST display a Moon icon with "Dark mode" text when in light mode, and a Sun icon with "Light mode" text when in dark mode.
- **FR-006**: All text MUST meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text) against its background in both light and dark modes. Components using the UI library's design tokens require no manual changes; only elements with hardcoded color values need explicit `dark:` variants.
- **FR-007**: The primary purple `#534AB7` (used for LifeSync logo, active nav item text, primary buttons) and green `#1D9E75` brand colors MUST remain unchanged in both modes. These colors are readable on both white and dark backgrounds and do NOT need `dark:` variants.
- **FR-008**: The streak badge (amber) MUST have a dark mode variant that maintains readability against dark backgrounds.
- **FR-009**: The done-today badge (emerald) MUST have a dark mode variant that maintains readability against dark backgrounds.
- **FR-010**: The login page MUST use the application's standard dark background (CSS variable `--background`, resolves to ~`#09090b` in dark mode) instead of the light-mode hardcoded color, consistent with the rest of the application.
- **FR-011**: The version label in the sidebar MUST remain legible in dark mode with an appropriate dark mode color variant.
- **FR-012**: The user chip dropdown menu MUST contain exactly two items: theme toggle and log out.
- **FR-013**: The Profile menu item MUST be removed from the user chip dropdown menu.
- **FR-014**: The user chip menu MUST behave identically on desktop (sidebar) and mobile (Sheet).
- **FR-015**: When the stored theme value is missing or invalid, the system MUST detect the user's operating system color scheme preference and apply it. If no OS preference is detected, the system MUST default to light mode.
- **FR-016**: Once the user explicitly toggles the theme, their choice MUST override any OS preference and persist across sessions.

### Key Entities

- **Theme Preference**: Represents the user's chosen visual mode (light or dark). Stored locally on the device, not synced to a server. Key attribute: mode value ('light' or 'dark').
- **User Chip Menu**: A dropdown menu anchored to the user avatar/name chip. Contains actionable items for theme switching and session management.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between light and dark mode in a single click from any page.
- **SC-002**: The selected theme persists across browser sessions with zero flash of the incorrect theme on reload.
- **SC-003**: All text and interactive elements maintain readable contrast (WCAG AA minimum 4.5:1 for normal text) in both modes.
- **SC-004**: The user chip menu displays exactly two options (theme toggle and log out) on both desktop and mobile viewports.
- **SC-005**: Custom-colored badges (amber streak, emerald done-today) remain visually distinct and readable in dark mode.
- **SC-006**: All existing application tests continue to pass without modification related to theme changes.

## Clarifications

### Session 2026-04-08

- Q: What should be the default theme for new users? → A: Follow system `prefers-color-scheme` on first visit, then persist the user's explicit choice. If no OS preference is detected, default to light mode.
- Q: How to prevent flash of wrong theme on startup? → A: Inline script in the HTML `<head>` that reads localStorage (and falls back to OS preference) and applies the theme class before any rendering occurs.
- Q: Which components need explicit dark mode variants? → A: Only components with hardcoded colors (badges, custom backgrounds). The UI component library handles dark mode automatically via CSS variables.
- Q: Should the login page background become dark in dark mode? → A: Yes, switch to a dark background in dark mode for consistency with the rest of the application.
- Q: Does the version label in the sidebar need a dark mode variant? → A: Yes, add a dark mode variant so the label remains legible on dark backgrounds.

## Assumptions

- On first visit (no stored preference), the application respects the user's OS color scheme preference. If no OS preference is detected, it defaults to light mode.
- Theme preference is device-local only — no server-side persistence or cross-device sync is needed.
- The existing UI component library already supports dark mode styling out of the box; only custom-colored elements need manual dark mode variants. Specifically, shadcn/ui components (Dialog, Toast/Sonner, Skeleton, Sheet, DropdownMenu, Card, Input, Button) inherit dark mode automatically via CSS variable overrides in the global stylesheet. No manual `dark:` classes are needed for these components.
- The sidebar already provides a direct link to the Profile page, making the Profile menu item in the user chip redundant.
- No backend API changes are required — this is a purely frontend feature.
