# Feature Specification: Auth Pages, Routing & App Layout

**Feature Branch**: `001-auth-routing-layout`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Sprint 1: Routing + Layout + Auth pages (Login / Register)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration (Priority: P1)

A new user visits the application for the first time. They see a Sign Up form where they can create an account by providing their details. After successful registration, the system confirms their account was created and directs them to sign in with their new credentials.

**Why this priority**: Registration is the entry point for all new users. Without it, no one can access the system.

**Independent Test**: Can be fully tested by filling in the registration form and verifying the success message appears and the view switches to the Sign In tab.

**Acceptance Scenarios**:

1. **Given** a visitor on the auth page with the Sign Up tab active, **When** they fill in valid registration details and submit, **Then** the system creates their account, switches to the Sign In tab, and displays a success message (e.g., "Account created successfully. Please sign in.").
2. **Given** a visitor on the Sign Up form, **When** they submit with an email that is already registered, **Then** the system displays an error message indicating the email is already in use.
3. **Given** a visitor on the Sign Up form, **When** they submit with invalid or incomplete fields, **Then** the system displays inline validation errors for each invalid field without submitting the form.

---

### User Story 2 - Existing User Login (Priority: P1)

A registered user visits the application and signs in using their credentials. Upon successful login, their authentication session is established and they are redirected to the dashboard.

**Why this priority**: Login is equally critical to registration -- without it, registered users cannot access any protected content.

**Independent Test**: Can be fully tested by entering valid credentials, submitting, and verifying redirection to the dashboard.

**Acceptance Scenarios**:

1. **Given** a registered user on the Sign In tab, **When** they enter valid credentials and submit, **Then** the system authenticates them, stores their session, and redirects to the returnUrl if present (fallback to /dashboard).
2. **Given** a user on the Sign In tab, **When** they enter incorrect credentials, **Then** the system displays an error message (e.g., "Invalid email or password") without revealing which field is wrong.
3. **Given** a user on the Sign In tab, **When** they submit with empty required fields, **Then** the system displays inline validation errors for each missing field.

---

### User Story 3 - Protected Route Access (Priority: P2)

An unauthenticated user attempts to access a protected page (e.g., the dashboard) directly via URL. The system redirects them to the auth page to sign in first. After signing in, they are taken to the originally requested page.

**Why this priority**: Route protection ensures only authenticated users can access private content, which is foundational to application security.

**Independent Test**: Can be tested by navigating directly to a protected URL while unauthenticated and verifying the redirect to the auth page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate to a protected route (e.g., /dashboard), **Then** the system redirects them to the auth page.
2. **Given** an authenticated user, **When** they navigate to a protected route, **Then** the system displays the requested page within the application layout (sidebar + main content area).
3. **Given** an authenticated user, **When** they navigate to the auth page, **Then** the system redirects them to the dashboard (since they are already signed in).

---

### User Story 4 - Session Persistence Across Reloads (Priority: P2)

An authenticated user refreshes the page or closes and reopens the browser. The system restores their session from stored credentials so they do not need to sign in again.

**Why this priority**: Session persistence is essential for a smooth user experience -- users should not lose their session on every page reload.

**Independent Test**: Can be tested by signing in, refreshing the browser, and verifying the user remains authenticated.

**Acceptance Scenarios**:

1. **Given** a user who previously signed in, **When** they refresh the page, **Then** the system restores their session and they remain on the protected page.
2. **Given** a user whose session token has expired, **When** they perform an action, **Then** the system silently refreshes the token and completes the request without interruption.
3. **Given** a user whose refresh token has also expired, **When** they perform an action, **Then** the system redirects them to the auth page to sign in again.

---

### User Story 5 - User Logout (Priority: P3)

An authenticated user decides to sign out. The system clears their session and returns them to the auth page.

**Why this priority**: Logout is important for security but less critical than the ability to sign in and access content.

**Independent Test**: Can be tested by clicking a logout action and verifying redirection to the auth page and that protected routes are no longer accessible.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they trigger the logout action, **Then** the system clears their session and redirects to the auth page.
2. **Given** a user who just logged out, **When** they attempt to navigate to a protected route, **Then** the system redirects them to the auth page.

---

### Edge Cases

- What happens when the user submits the registration form multiple times rapidly (double-click)? The system should prevent duplicate submissions.
- What happens when the server is unreachable during login or registration? The system should display a user-friendly network error message.
- What happens when the token refresh fails mid-request? The system should redirect to the auth page without losing the user's context of what page they were on.
- What happens when a user has multiple tabs open and logs out in one tab? Each tab should recognize the session is invalid on the next interaction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a combined auth page with two tabs: "Sign In" and "Sign Up"
- **FR-002**: System MUST validate registration fields before submission: email (RFC format), password (minimum 8 characters, no complexity requirements), username (`^[a-z0-9_-]+$`, 3–32 characters)
- **FR-003**: System MUST validate login fields (email format, non-empty password) before submission
- **FR-004**: After successful registration (201 response), the system MUST automatically switch to the Sign In tab and display a success message
- **FR-005**: After successful login, the system MUST keep the access token in memory only and persist the refresh token in local storage; on page reload, the system MUST use the stored refresh token to obtain a new access token
- **FR-006**: After successful login, the system MUST redirect the user to the originally requested protected route (returnUrl pattern); if no prior route exists, redirect to /dashboard as the default
- **FR-007**: System MUST attach authentication tokens to all outgoing requests to protected endpoints
- **FR-008**: System MUST silently refresh expired access tokens using the refresh token without user intervention
- **FR-009**: When token refresh fails (e.g., refresh token expired), the system MUST clear session data and redirect to the auth page
- **FR-010**: System MUST prevent unauthenticated users from accessing protected routes by redirecting them to the auth page
- **FR-011**: System MUST redirect already-authenticated users away from the auth page to the dashboard
- **FR-012**: System MUST provide a logout capability that sends the refresh token to the backend for server-side invalidation, clears all local session data, and redirects to the auth page
- **FR-013**: System MUST display the application layout (sidebar + main content area) on all protected pages; the sidebar MUST show the authenticated user's displayName (fallback to username) and email from the session and static placeholder nav items (e.g., "Dashboard", "Settings"); functional navigation deferred to later sprints
- **FR-014**: System MUST use the accent color #534AB7 as the primary brand color on the auth page
- **FR-015**: System MUST disable the submit button while a login or registration request is in progress to prevent duplicate submissions
- **FR-016**: On 409 Conflict during registration, the system MUST display the error inline under the conflicting field (email or username)
- **FR-017**: On 401 during login, the system MUST display the hardcoded message "Invalid email or password" (never reveal which field is incorrect)
- **FR-018**: On 403 during login, the system MUST display "Your account has been suspended. Please contact support."
- **FR-019**: The returnUrl parameter MUST be validated as an internal path (starts with `/`, no external domain or protocol) before redirect; invalid returnUrl values MUST be discarded and the user redirected to /dashboard

### Key Entities

- **User**: Represents an authenticated individual; key attributes include email, username, display name, and unique identifier
- **Authentication Session**: Represents the user's active session; consists of an access token (short-lived), a refresh token (long-lived), and associated user profile information
- **Registration Request**: Captures user-submitted data for account creation (email, username, and password)
- **Login Request**: Captures user-submitted credentials for authentication (email and password)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete account registration in under 60 seconds from first visiting the auth page
- **SC-002**: Users can sign in and reach the dashboard in under 10 seconds (including redirect)
- **SC-003**: 95% of users successfully complete registration on their first attempt (clear validation guidance)
- **SC-004**: Authenticated sessions survive page reloads without requiring the user to sign in again
- **SC-005**: Token refresh occurs transparently -- users experience zero interruptions during normal usage
- **SC-006**: Unauthorized access attempts to protected routes result in redirect to auth page 100% of the time

## Clarifications

### Session 2026-04-02

- Q: Should access token be stored in localStorage or memory only? → A: Access token in memory only; refresh token in localStorage (security best practice for SPAs).
- Q: What are the exact frontend validation rules for registration fields? → A: Email RFC format check; password minimum 8 characters (no complexity requirements); username `^[a-z0-9_-]+$` 3–32 characters. Mirror backend rules exactly.
- Q: How should API error responses be displayed to users? → A: 409 Conflict → field-level error under the conflicting field (email or username); 401 on login → hardcoded "Invalid email or password"; 403 → "Your account has been suspended. Please contact support."
- Q: After login, redirect to originally requested route or always /dashboard? → A: ReturnUrl pattern — redirect to the originally requested protected route; fall back to /dashboard if no prior route.
- Q: What should the sidebar render this sprint? → A: Static placeholder nav items (e.g., "Dashboard", "Settings") plus user name/email from authStore. Functional nav links deferred to later sprints.

## Assumptions

- Users access the application via a modern web browser with local storage enabled
- A backend authentication service exists that provides registration, login, token refresh, and logout endpoints
- The backend returns a 201 status code on successful registration and 200 with token data on successful login
- Password strength requirements and specific registration fields (beyond email and password) are defined by the backend validation rules
- The sidebar includes static placeholder nav items and user name/email this sprint; functional navigation and full profile display are deferred to subsequent sprints
- The dashboard page (/dashboard) exists as a minimal placeholder route for this sprint
- The auth page design follows the Figma reference at https://www.figma.com/design/OyeRpnGfCojppIt3nDlh3u with accent color #534AB7

## Deferred / Tech Debt

- **TD-001**: Network error handling — no FR covers generic network failures (server unreachable). A user-friendly error message should be added in a future sprint.
- **TD-002**: Catch-all route (`*` → `/login`) — implemented in T007/T016 but not formally specified. Documented as an implicit routing convention; consider adding an explicit FR in the next sprint.
