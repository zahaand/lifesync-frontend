# Full Spec Review Checklist: Auth Pages, Routing & App Layout

**Purpose**: Validate requirement completeness, clarity, consistency, and cross-artifact alignment across spec.md, data-model.md, contracts/auth-api.md, and research.md
**Created**: 2026-04-02
**Feature**: [spec.md](../spec.md)
**Depth**: Standard | **Audience**: Reviewer (PR/pre-implementation gate)

## Requirement Completeness

- [ ] CHK001 - Are requirements defined for handling backend 422 validation errors on registration? FR-016 covers 409 and FR-017/018 cover login errors, but no FR addresses 422 response rendering. [Gap, Contract §POST /auth/register]
- [ ] CHK002 - Are requirements defined for network error / 500 server error display? Edge Cases mention "user-friendly network error message" but no FR formalizes this. [Gap, Spec §Edge Cases]
- [ ] CHK003 - Are loading state requirements fully specified beyond button disabling? FR-015 defines button disable but does not specify spinner visibility, form field disabling, or timeout messaging. [Completeness, Spec §FR-015]
- [ ] CHK004 - Are requirements defined for whether registration includes a password confirmation field? RegisterRequest in data-model has only `password`; spec does not address confirm-password UX. [Gap, Data Model §RegisterRequest]
- [ ] CHK005 - Are requirements specified for the exact success message text after registration? FR-004 says "display a success message" with only an example — is the example the canonical wording? [Clarity, Spec §FR-004]
- [ ] CHK006 - Are requirements defined for the multi-tab logout scenario? Edge Cases describe the behavior but no FR captures the requirement. [Gap, Spec §Edge Cases]
- [ ] CHK007 - Are requirements specified for what happens when localStorage is unavailable or full (e.g., Safari private mode quota exceeded)? [Gap, Spec §Assumptions]

## Requirement Clarity

- [ ] CHK008 - Is the list of sidebar placeholder nav items explicitly defined, or are "Dashboard" and "Settings" just examples? FR-013 uses "e.g." — the exact items should be specified. [Clarity, Spec §FR-013]
- [ ] CHK009 - Is the sidebar display name fallback logic documented in the spec? Data-model defines `displayName` (optional) with fallback to `username`, but spec FR-013 says "user's name/email" — which field exactly? [Ambiguity, Spec §FR-013 vs Data Model §User]
- [ ] CHK010 - Are the exact URL query parameter names for tab state and returnUrl documented in the spec? Research R-004 mentions `?tab=signin&registered=true` and R-005 mentions `?returnUrl=`, but the spec does not define these. [Clarity, Research §R-004/R-005 vs Spec]
- [ ] CHK011 - Is `isAuthenticated` derivation logic clear when only `refreshToken` exists but `accessToken` is null (page reload state)? Data-model says `accessToken !== null OR refreshToken !== null` — is the OR intentional? [Clarity, Data Model §AuthState]

## Requirement Consistency

- [x] CHK012 - Does User Story 2 acceptance scenario 1 align with FR-006? **Fixed**: US2 updated to reference returnUrl with /dashboard fallback. [Conflict, Spec §US2 vs §FR-006]
- [x] CHK013 - Does the 403 error message in the contract match FR-018? **Fixed**: Standardized to "Your account has been suspended. Please contact support." in both spec and contract. [Conflict, Spec §FR-018 vs Contract §POST /auth/login]
- [x] CHK014 - Is the logout request body consistently defined? **Fixed**: Documented as `{ "refreshToken": string }` in both FR-012 and contract. [Ambiguity, Contract §POST /auth/logout]
- [ ] CHK015 - Are the `User` entity fields consistent between spec Key Entities and data-model? Spec says "email, display name, and unique identifier" but data-model also includes `username` as a distinct field. [Consistency, Spec §Key Entities vs Data Model §User]

## Acceptance Criteria Quality

- [ ] CHK016 - Are acceptance scenarios defined for the "Refreshing" intermediate state (data-model state transition) from the user's perspective? US4 covers expired token refresh but not the in-flight state behavior. [Coverage, Spec §US4 vs Data Model §AuthState]
- [ ] CHK017 - Can SC-003 ("95% of users successfully complete registration on first attempt") be measured without analytics infrastructure? Is the measurement method defined? [Measurability, Spec §SC-003]
- [ ] CHK018 - Is SC-002 ("sign in and reach dashboard in under 10 seconds") measurable independently of backend response time? The frontend can't control API latency. [Measurability, Spec §SC-002]

## Scenario Coverage

- [ ] CHK019 - Are requirements defined for tab keyboard accessibility (Tab/Enter to switch between Sign In and Sign Up)? [Gap, Accessibility]
- [ ] CHK020 - Are requirements defined for form field focus management — e.g., auto-focus first field on tab switch, focus first error field on validation failure? [Gap, UX]
- [ ] CHK021 - Are requirements defined for the catch-all route behavior? Quickstart mentions `*` redirects to `/login`, but no spec FR or US covers this. [Gap, Quickstart §Routes vs Spec]
- [ ] CHK022 - Are requirements defined for concurrent 401 refresh scenarios — what happens from the user's perspective when multiple requests fail simultaneously? [Gap, Research §R-002 vs Spec]

## Edge Case Coverage

- [ ] CHK023 - Are requirements defined for the 409 conflict case where both email AND username are already taken simultaneously? Contract defines a single-field ConflictError shape — can only one field error be returned per request? [Edge Case, Contract §Error Response Format]
- [x] CHK024 - Are requirements defined for returnUrl validation to prevent open redirect attacks? **Fixed**: Added FR-019 — returnUrl must be internal path (starts with `/`, no external domain); invalid values redirect to /dashboard. [Edge Case, Security, Research §R-005]
- [ ] CHK025 - Are requirements defined for maximum form submission attempts / rate limiting on the frontend? [Edge Case, Gap]

## Cross-Artifact Alignment

- [ ] CHK026 - Does the spec reference the tab state URL scheme (`?tab=signin`) that research R-004 decided on? This UX behavior is not captured in any FR. [Gap, Research §R-004 vs Spec]
- [ ] CHK027 - Does the spec capture the Zustand persist middleware decision (research R-001) as a constraint or clarification? The clarification section records "access token in memory, refresh token in localStorage" but FR-005 doesn't mention the rehydration flow explicitly. [Consistency, Research §R-001 vs Spec §FR-005]
- [ ] CHK028 - Are the new dependencies (zustand, react-hook-form, @hookform/resolvers, zod) from research R-006 captured anywhere in the spec or its assumptions? [Traceability, Research §R-006 vs Spec]

## Notes

- Check items off as completed: `[x]`
- Items referencing `[Gap]` indicate missing requirements that should be added to spec
- Items referencing `[Conflict]` indicate inconsistencies that must be resolved before implementation
- Items referencing `[Ambiguity]` indicate unclear requirements that need sharpening
- ~~Priority fixes before `/speckit.tasks`~~: All 4 priority items resolved (CHK012, CHK013, CHK014, CHK024)
- Remaining open items (CHK001-011, CHK015-023, CHK025-028) deferred to implementation tasks as implementation notes or tech debt
