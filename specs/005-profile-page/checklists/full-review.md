# Full Review Checklist: Profile Page + Smart Greeting

**Purpose**: Full spec review across all quality dimensions with spec + plan artifacts cross-check
**Created**: 2026-04-05
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 Are loading state requirements defined for all 4 profile cards (Account, Telegram, Stats, Danger Zone), or only Account and Telegram? [Completeness, Spec §FR-014]
- [ ] CHK002 Are error state requirements defined for Stats card when useHabits or useGoalsSummary fetches fail? [Gap]
- [ ] CHK003 Is the behavior specified for what happens when useCurrentUser (GET /users/me) fails on the Profile page itself? [Gap, Edge Case]
- [x] CHK004 Are requirements defined for the /profile navigation link in the Layout sidebar? [Gap, Plan §Source Code mentions Layout.tsx modification but spec has no FR for it] — Fixed: added FR-015
- [ ] CHK005 Is the card rendering order explicitly specified (Account → Telegram → Stats → Danger Zone), or only implied by FR-001 listing order? [Completeness, Spec §FR-001]

## Requirement Clarity

- [ ] CHK006 Is "single-column layout (max-width 720px, centered)" sufficiently specified — are vertical spacing/gap between cards defined? [Clarity, Spec §FR-001]
- [ ] CHK007 Is the Save button behavior for Account card clarified — should it be disabled when form is pristine or invalid, or always enabled? [Clarity, Spec §FR-004]
- [ ] CHK008 Is "success toast" quantified — are toast messages specified for each mutation (username update, Telegram save, account deletion)? [Clarity, Spec §FR-012]
- [ ] CHK009 Is the Cancel button visibility specified — always visible, or only when the username has been modified? [Clarity, Spec §FR-004]
- [ ] CHK010 Is "falls back to username from authStore" specified with clear priority logic — what if authStore.user is also null (edge case: corrupted localStorage)? [Clarity, Spec §FR-011]

## Requirement Consistency

- [ ] CHK011 Are the dual-store sync requirements in FR-004 consistent with the research decision R2 — does FR-004 mention both `queryClient.invalidateQueries` AND `authStore.user` update? [Consistency, Spec §FR-004 vs Research §R2]
- [ ] CHK012 Is the UserProfile type definition consistent between spec Key Entities (telegramChatId), data-model.md, and contracts/profile-api.md? [Consistency, Cross-Artifact]
- [ ] CHK013 Does the spec's UpdateTelegramRequest field name (telegramChatId) match the contract's PUT /users/me/telegram request body field? [Consistency, Spec §Key Entities vs Contract §PUT /users/me/telegram]
- [ ] CHK014 Is the Telegram card validation (`/^\d+$/`) consistent between spec FR-005, data-model.md Zod schema, and research R5? [Consistency, Cross-Artifact]

## Acceptance Criteria Quality

- [ ] CHK015 Are US1 acceptance scenarios testable without backend access — is there a scenario for the 409 conflict case (username taken)? [Acceptance Criteria, Spec §US1 vs Edge Cases]
- [ ] CHK016 Is US2 acceptance scenario 3 (loading fallback) measurable — "no loading spinner" is a negative assertion, but is the positive behavior (show authStore username immediately) explicit enough? [Measurability, Spec §US2]
- [ ] CHK017 Are US5 acceptance scenarios complete — is there a scenario for DELETE /users/me returning a server error (500)? [Coverage, Spec §US5 vs Edge Cases]

## Scenario Coverage

- [ ] CHK018 Are requirements defined for the greeting text transition — when useCurrentUser resolves and displayName differs from username, should the greeting visibly change or is a seamless swap acceptable? [Coverage, Spec §FR-011]
- [ ] CHK019 Is the behavior specified for concurrent mutations — what if the user clicks Save on both Account and Telegram cards simultaneously? [Coverage, Gap]
- [ ] CHK020 Is the behavior specified for navigating away from Profile with unsaved username changes — should there be an unsaved-changes warning? [Coverage, Gap]
- [ ] CHK021 Are requirements defined for the Telegram card when PUT /users/me/telegram returns 400 — should the input retain the invalid value or revert? [Coverage, Spec §Edge Cases mentions error toast but not input state]

## Edge Case Coverage

- [ ] CHK022 Is the behavior defined when the delete confirmation Dialog is open and the user's session expires (401) during the DELETE call? [Edge Case, Gap]
- [ ] CHK023 Is the behavior specified for a zero-length displayName (empty string "" vs null) — does FR-011 treat both as "not set"? [Edge Case, Spec §FR-011]
- [ ] CHK024 Is the Stats card "best streak" display specified for when multiple habits share the same highest streak value? [Edge Case, Spec §FR-007]
- [ ] CHK025 Is the behavior defined when the user modifies the username, clicks Save, and the request is still pending — should the Cancel button be disabled during save? [Edge Case, Spec §FR-004]

## Non-Functional Requirements

- [ ] CHK026 Is the staleTime for useCurrentUser (5 minutes per research R1) documented in the spec or only in research.md? [Gap, NFR not in spec]
- [ ] CHK027 Are keyboard accessibility requirements defined for the delete confirmation Dialog (focus trap, Escape to close, Tab order)? [Coverage, Gap — shadcn Dialog provides this, but spec doesn't reference it]

## Dependencies & Assumptions

- [ ] CHK028 Is the assumption that GET /users/me returns telegramChatId validated — does the existing backend actually include this field, or is it a new backend endpoint? [Assumption, Spec §Assumptions]
- [x] CHK029 Is the assumption about authStore.setTokens accepting a partial user update validated — R2 says "construct a partial User update" but setTokens expects (accessToken, refreshToken, user)? [Assumption, Research §R2 vs authStore implementation] — Fixed: added setUser(user) action to authStore assumptions, updated R2 and plan
- [x] CHK030 Is the Layout.tsx sidebar modification scope defined — does it need active-link highlighting for /profile, or just a static nav entry? [Gap, Plan §Source Code] — Fixed: FR-015 specifies active state with purple accent matching other nav items
