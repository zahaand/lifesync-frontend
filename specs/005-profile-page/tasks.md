# Tasks: Profile Page + Smart Greeting

**Input**: Design documents from `/specs/005-profile-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/profile-api.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: New types, API layer, and shared hooks — all user stories depend on these

- [ ] T001 [P] Define UserProfile, UpdateUserRequest, UpdateTelegramRequest types and Zod schemas (updateUsernameSchema, updateTelegramSchema) in src/types/users.ts
- [ ] T002 [P] Implement API functions (getCurrentUser, updateUser, updateTelegram, deleteAccount) in src/api/users.ts per contracts/profile-api.md
- [ ] T003 Add setUser(user: User) action to authStore in src/stores/authStore.ts — updates only user field without replacing tokens

---

## Phase 2: Foundational

**Purpose**: Shared hooks and routing that MUST be complete before user story components

**Critical**: No component work can begin until this phase is complete

- [ ] T004 Implement useCurrentUser, useUpdateUsername, useUpdateTelegram, useDeleteAccount hooks in src/hooks/useUsers.ts — useCurrentUser with query key ['users', 'me'] and staleTime 5min; useUpdateUsername invalidates ['users', 'me'] AND calls authStore.setUser(); useUpdateTelegram invalidates ['users', 'me']; useDeleteAccount calls authStore.clearAuth() + queryClient.clear() + navigate('/login')
- [ ] T005 Add /profile route to src/App.tsx inside ProtectedRoute + Layout (import ProfilePage)
- [ ] T006 Refactor Layout sidebar in src/components/shared/Layout.tsx — convert static nav items to NavLink components with active-link highlighting (FR-015), add Profile nav item with User icon linking to /profile, add Habits and Goals nav items

**Checkpoint**: Foundation ready — types, API, hooks, route, and sidebar all in place

---

## Phase 3: User Story 1 — View and Edit Profile (Priority: P1) MVP

**Goal**: User can view profile (username + email) and edit username with validation, Save/Cancel, success/error toast, and immediate sidebar sync

**Independent Test**: Navigate to /profile, see current username and email, change username to a valid value, click Save, see success toast, verify sidebar updates immediately

- [ ] T007 [P] [US1] Create AccountCard component in src/components/profile/AccountCard.tsx — displays username (editable Input with RHF + updateUsernameSchema) and email (read-only text), Save and Cancel buttons. Save calls useUpdateUsername mutation. Cancel reverts to original value. Show skeleton placeholder while useCurrentUser is loading (FR-014). Handle 409 conflict error (retain attempted value, show error toast)
- [ ] T008 [P] [US1] Create ProfilePage in src/pages/ProfilePage.tsx — single-column layout (max-w-[720px] mx-auto), renders AccountCard, TelegramCard, StatsCard, DangerZoneCard. Uses useCurrentUser for profile data. Pass profile data to child cards as props

**Checkpoint**: US1 complete — username edit works independently, sidebar reflects changes

---

## Phase 4: User Story 2 — Smart Greeting on Dashboard (Priority: P1)

**Goal**: Dashboard greeting uses displayName from GET /users/me if available, falls back to authStore username while loading

**Independent Test**: Log in, navigate to Dashboard, see greeting with displayName (if set) or username. Throttle network — greeting shows username immediately, upgrades to displayName when query resolves

- [ ] T009 [US2] Update DashboardPage greeting in src/pages/DashboardPage.tsx — import useCurrentUser, compute greeting name as: useCurrentUser().data?.displayName (if non-null/non-empty) ?? authStore.user?.username. No loading spinner for greeting — authStore username is the immediate fallback (FR-011, research R6)

**Checkpoint**: US2 complete — Dashboard greeting shows displayName or username

---

## Phase 5: User Story 3 — Link Telegram (Priority: P2)

**Goal**: User can enter Telegram chat ID in the Telegram card, save it, see success toast

**Independent Test**: Enter a numeric chat ID, click Save, see success toast and persisted value. Enter non-numeric text, see inline validation error

- [ ] T010 [US3] Create TelegramCard component in src/components/profile/TelegramCard.tsx — Input for telegramChatId with RHF + updateTelegramSchema (digits only, /^\d+$/), Save button calls useUpdateTelegram mutation. Show current value if already linked (FR-006). Show skeleton placeholder while loading (FR-014). Success/error toast on mutation result

**Checkpoint**: US3 complete — Telegram linking works independently

---

## Phase 6: User Story 4 — View Profile Stats (Priority: P2)

**Goal**: Stats card shows 4 read-only metrics using existing hooks (useHabits, useGoalsSummary) with skeleton loading and auto-fetch on cold cache

**Independent Test**: Navigate to /profile, verify stats match Dashboard values. Open /profile directly in new tab — see skeletons, then loaded data

- [ ] T011 [US4] Create StatsCard component in src/components/profile/StatsCard.tsx — displays active habits count, best streak (days + habit name), active goals count, completed goals count. Uses useHabits() and useGoalsSummary() hooks which auto-fetch if cold. Show skeleton placeholders while loading. Show 0 for empty counts, "—" for no streak (FR-007)

**Checkpoint**: US4 complete — Stats display works independently

---

## Phase 7: User Story 5 — Delete Account (Priority: P3)

**Goal**: User can delete their account via Danger Zone card with username-confirmation Dialog, auth state cleared, redirect to /login

**Independent Test**: Click "Delete account", type username in confirmation Dialog, confirm, verify redirect to /login and localStorage cleared

- [ ] T012 [P] [US5] Create DeleteAccountDialog component in src/components/profile/DeleteAccountDialog.tsx — shadcn Dialog (not AlertDialog) with Input. User must type exact username to enable Confirm button. Confirm calls useDeleteAccount mutation. Cancel closes dialog. Red destructive styling for Confirm button (FR-008, FR-009)
- [ ] T013 [P] [US5] Create DangerZoneCard component in src/components/profile/DangerZoneCard.tsx ��� red accent card with "Delete account" button that opens DeleteAccountDialog. Pass username as prop for confirmation matching (FR-008)

**Checkpoint**: US5 complete — account deletion flow works end-to-end

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Integration, validation, and final cleanup

- [ ] T014 Wire all cards into ProfilePage in src/pages/ProfilePage.tsx — ensure card order: Account, Telegram, Stats, Danger Zone. Verify all cards receive correct props from useCurrentUser
- [ ] T015 Run tsc -b — zero TypeScript errors
- [ ] T016 Run eslint . — zero warnings or errors
- [ ] T017 Verify quickstart.md scenarios manually against running app (npm run dev)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001, T002, T003 all parallel
- **Foundational (Phase 2)**: Depends on Phase 1 — T004 depends on T001+T002, T005 depends on ProfilePage existing (can stub), T006 independent
- **User Stories (Phase 3-7)**: All depend on Phase 2 completion
  - US1 + US2 can proceed in parallel (different files)
  - US3, US4, US5 can all proceed in parallel with each other and US1/US2
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 — no cross-story dependencies
- **US2 (P1)**: Depends on Phase 2 (useCurrentUser hook) — no cross-story dependencies
- **US3 (P2)**: Depends on Phase 2 — no cross-story dependencies
- **US4 (P2)**: Depends on Phase 2 — uses existing useHabits/useGoalsSummary, no profile hooks needed
- **US5 (P3)**: Depends on Phase 2 (useDeleteAccount hook) — no cross-story dependencies

### Parallel Opportunities

- T001, T002, T003 — all parallel (different files)
- T007, T008 — parallel within US1 (different files)
- T009, T010, T011 — all parallel across US2/US3/US4 (different files, independent stories)
- T012, T013 — parallel within US5 (different files)

---

## Parallel Example: Setup Phase

```
# Launch all setup tasks together:
Task T001: "Define types and schemas in src/types/users.ts"
Task T002: "Implement API functions in src/api/users.ts"
Task T003: "Add setUser action to src/stores/authStore.ts"
```

## Parallel Example: All User Stories (after Phase 2)

```
# Launch all story components in parallel:
Task T007: "AccountCard in src/components/profile/AccountCard.tsx"      [US1]
Task T009: "Update DashboardPage greeting in src/pages/DashboardPage.tsx" [US2]
Task T010: "TelegramCard in src/components/profile/TelegramCard.tsx"    [US3]
Task T011: "StatsCard in src/components/profile/StatsCard.tsx"          [US4]
Task T012: "DeleteAccountDialog in src/components/profile/DeleteAccountDialog.tsx" [US5]
Task T013: "DangerZoneCard in src/components/profile/DangerZoneCard.tsx" [US5]
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: US1 — Account card with username edit (T007-T008)
4. Complete Phase 4: US2 — Smart greeting on Dashboard (T009)
5. **STOP and VALIDATE**: Profile page shows Account card, Dashboard greeting works
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Account card) + US2 (Smart greeting) → MVP! Core profile + greeting
3. US3 (Telegram) + US4 (Stats) → Enhanced profile with integrations and metrics
4. US5 (Delete account) → Safety/compliance feature
5. Polish → Final validation and cleanup

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
- ProfilePage (T008) can start with just AccountCard; other cards are wired in T014
