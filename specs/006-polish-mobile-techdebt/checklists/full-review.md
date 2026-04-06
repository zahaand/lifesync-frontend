# Full Spec Review Checklist: Polish — Mobile Adaptation + Tech Debt

**Purpose**: Full requirements quality review across all dimensions, cross-checking spec against plan artifacts
**Created**: 2026-04-06
**Feature**: [spec.md](../spec.md)
**Artifacts reviewed**: spec.md, plan.md, research.md, data-model.md, contracts/habit-logs-api.md

## Requirement Completeness

- [x] CHK001 - Are loading state requirements defined for the habit history drawer (skeleton, spinner, or text indicator)? [Gap, Spec §User Story 2] — FIXED: Added skeleton rows + error state with Retry to FR-005
- [ ] CHK002 - Are error state requirements specified for the habit history drawer when the API call fails on initial load (not just "Load more")? [Gap, Spec §User Story 2]
- [ ] CHK003 - Is the drawer width/sizing specified for mobile vs desktop viewports? [Gap, Spec §FR-004]
- [ ] CHK004 - Are tablet-specific layout requirements defined for the Dashboard page (768–1024px), or is the behavior intentionally left to implementation discretion? [Ambiguity, Spec §User Story 3, Scenario 3]
- [ ] CHK005 - Are requirements defined for the "History" button placement and visual style on the HabitCard? [Gap, Spec §FR-004]
- [ ] CHK006 - Is the sidebar overlay backdrop behavior specified (dimmed background, blur, opacity level)? [Gap, Spec §User Story 1]
- [ ] CHK007 - Are animation/transition requirements specified for the sidebar overlay and history drawer (duration, easing, direction)? [Gap, Spec §SC-002]

## Requirement Clarity

- [ ] CHK008 - Is "appropriate padding and spacing for mobile" quantified with specific values or minimum thresholds for Habits and Profile pages? [Ambiguity, Spec §FR-013, §FR-011]
- [x] CHK009 - Is "stack vertically or collapse into a dropdown menu" resolved to a single approach for HabitCard action buttons on mobile? [Ambiguity, Spec §FR-012] — FIXED: Resolved to DropdownMenu with "..." trigger on mobile, inline icons on desktop
- [ ] CHK010 - Does "smooth animation" in SC-002 have measurable criteria (e.g., 60fps, no jank)? [Clarity, Spec §SC-002]
- [ ] CHK011 - Is the "History" button label defined — is it text ("History"), icon-only (Clock icon), or icon + text? [Gap, Spec §FR-004]
- [ ] CHK012 - Is "friendly empty state message" specified with exact copy, or is "No completions yet" the canonical text? [Clarity, Spec §FR-007]

## Requirement Consistency

- [ ] CHK013 - Does the spec's assumption of 20 entries per page align with the contract's default `size: 20`? [Consistency, Spec §Assumptions vs Contract §Query Parameters] — currently consistent, confirm maintained
- [ ] CHK014 - Are breakpoint values consistent between spec (< 768px, 768–1024px, > 1024px) and plan's Tailwind mapping (md: 768px, lg: 1024px)? [Consistency, Spec §Clarifications vs Plan §Technical Context]
- [ ] CHK015 - Does the plan's `useIsMobile` hook (matchMedia 767px) align with the spec's breakpoint of "narrower than 768px"? [Consistency, Research §R-005 vs Spec §Clarifications]
- [ ] CHK016 - Is the sidebar close behavior consistently specified — spec mentions "click outside OR close button" but research mentions Sheet provides "escape to close" which is not in spec acceptance scenarios? [Consistency, Spec §User Story 1 Scenario 4 vs Research §R-001]

## Acceptance Criteria Quality

- [ ] CHK017 - Is SC-005 ("without losing scroll position") measurable — does it define tolerance (exact pixel, viewport section, or nearest item)? [Measurability, Spec §SC-005]
- [ ] CHK018 - Is SC-001 ("screens as narrow as 320px") accompanied by acceptance scenarios testing at 320px, or is it only stated as a success criterion? [Traceability, Spec §SC-001]
- [ ] CHK019 - Is SC-004 ("within 2 seconds on a standard connection") defined with network conditions (e.g., 3G, 4G, broadband)? [Clarity, Spec §SC-004]

## Scenario Coverage

- [ ] CHK020 - Are requirements defined for what happens when the habit history drawer is already open and the user taps "History" on a different habit? [Coverage, Spec §User Story 2]
- [ ] CHK021 - Are requirements defined for tablet behavior of the history drawer (full-width vs partial-width sheet)? [Coverage, Gap]
- [ ] CHK022 - Are requirements specified for the sidebar's icon-only tooltip behavior on tablet — trigger method (hover, focus, tap), dismiss behavior, and position? [Coverage, Research §R-001 vs Spec §User Story 1]
- [ ] CHK023 - Are keyboard navigation requirements defined for the mobile sidebar overlay (Tab order, Escape to close, focus return)? [Coverage, Gap — Accessibility]

## Edge Case Coverage

- [ ] CHK024 - Are requirements defined for the Goals page when the user is viewing a detail on mobile and the goal is edited/completed by another session or background sync? [Edge Case, Gap]
- [ ] CHK025 - Is the behavior specified when the habit logs API returns an empty first page (totalElements: 0) vs a non-empty page with no next page? [Edge Case, Spec §FR-007]
- [ ] CHK026 - Are requirements defined for deep-linking to a specific goal on mobile (navigating directly to a goal detail URL) — does the back button still work? [Edge Case, Spec §Edge Cases — partially addressed but acceptance scenario missing]

## Cross-Artifact Consistency (Spec ↔ Plan)

- [ ] CHK027 - Does the plan's new file `src/hooks/useMobile.ts` have corresponding requirements in the spec, or is it purely an implementation detail? [Traceability, Plan §Source Code vs Spec]
- [x] CHK028 - Does the contract define a 500/503 error response for server failures, and are corresponding spec requirements present for handling server errors in the drawer? [Gap, Contract §Error Responses — only 401/404 listed] — FIXED: Added 500 to contract with Retry handling; FR-005 now covers error state
- [ ] CHK029 - Does the data model's cache invalidation strategy ("invalidated on habit complete/uncomplete") have a corresponding spec requirement ensuring history drawer data stays fresh? [Gap, Data Model §Server State vs Spec]

## Dependencies & Assumptions

- [x] CHK030 - Is the assumption that the backend endpoint already exists validated, or is there a dependency on backend Sprint 6 delivery? [Assumption, Spec §Assumptions] — FIXED: Assumption updated to require Swagger verification before implementation

## Notes

- Check items off as completed: `[x]`
- Items reference spec sections (§), plan artifacts, and quality dimensions
- 30 items total across 8 quality dimensions
- Cross-artifact checks (CHK027–CHK030) validate spec-plan-contract alignment
