# Full Review Checklist: Goals Page — Full Goal Management

**Purpose**: Comprehensive requirements quality review across all dimensions — completeness, clarity, consistency, measurability, coverage, and cross-artifact alignment
**Created**: 2026-04-05
**Feature**: [spec.md](../spec.md)
**Artifacts**: spec.md, plan.md, research.md, data-model.md, contracts/goals-api.md

## Requirement Completeness

- [x] CHK001 - Are loading state requirements defined for the goals list, detail panel, and all mutation operations (progress, milestones, habit links)? [Gap] — **Fixed**: Added skeleton placeholder requirement to FR-005 for detail panel loading.
- [ ] CHK002 - Are error handling requirements specified for each distinct API failure mode (network error, 400 validation, 404 not found, 401 unauthorized)? [Gap, Spec §FR-021]
- [ ] CHK003 - Is the visual layout of the master-detail split specified with proportions or min-widths for left column and right panel? [Completeness, Spec §FR-001]
- [ ] CHK004 - Are skeleton/placeholder requirements defined for the detail panel while the GET /goals/{id} request is in flight after goal selection? [Gap]
- [ ] CHK005 - Does the spec define what happens when a goal create/edit/delete mutation is in flight (button disabled state, loading indicator)? [Completeness, Spec §FR-020]

## Requirement Clarity

- [x] CHK006 - Is "ordered checklist" for milestones (FR-009) clarified — does "ordered" mean server-defined sortOrder, or creation order, or alphabetical? [Clarity, Spec §FR-009] — **Fixed**: Added assumption clarifying backend assigns sortOrder automatically on add (append to end).
- [ ] CHK007 - Is "large progress percentage" (FR-007) quantified with specific font size or visual hierarchy relative to other detail panel elements? [Clarity, Spec §FR-007]
- [ ] CHK008 - Is "standard connection" in SC-006 defined with specific bandwidth/latency targets for the 2-second page load goal? [Measurability, Spec §SC-006]
- [ ] CHK009 - Are the progress bar color tokens explicitly mapped to status — purple (#534AB7) for ACTIVE and green (#3B6D11) for COMPLETED — in both the card and detail panel contexts? [Clarity, Spec §FR-004/FR-007]

## Requirement Consistency

- [x] CHK010 - Does the Goal entity use `name` (current types/goals.ts) or `title` (spec FR-004, CreateGoalRequest) consistently? Is the field name migration documented? [Consistency, Spec §FR-004 vs data-model.md] — **Fixed**: data-model.md Goal.name → Goal.title, contracts JSON examples updated.
- [x] CHK011 - Are milestone field names consistent — spec says "title" (FR-010) but data-model.md and existing Milestone type use "name"? [Consistency, Spec §FR-010 vs data-model.md §Milestone] — **Fixed**: data-model.md Milestone.name → Milestone.title, contracts JSON examples updated.
- [ ] CHK012 - Is the progress update behavior consistent between spec (FR-007: button-only) and research.md (R6: button-only, not blur/enter)? Does any requirement contradict this? [Consistency, Spec §FR-007 vs research.md §R6]
- [ ] CHK013 - Are query key conventions consistent between data-model.md query key strategy table and research.md R1 decision? [Consistency, data-model.md vs research.md §R1]

## Acceptance Criteria Quality

- [x] CHK014 - Is the subtitle format "N active · M completed" (FR-002) explicitly defined for zero-count cases (e.g., "0 active · 3 completed")? [Measurability, Spec §FR-002] — **Fixed**: Added zero-count behavior to FR-002.
- [ ] CHK015 - Are the exact conditions for disabling the "Link" button/dropdown specified (all active habits linked, or no active habits exist)? [Measurability, Spec §FR-013]
- [ ] CHK016 - Is "visual feedback within 200ms" (SC-007) defined — does it mean purple border appears, or detail panel content renders, or a loading skeleton shows? [Measurability, Spec §SC-007]

## Scenario Coverage

- [ ] CHK017 - Are concurrent mutation scenarios addressed — e.g., user toggles a milestone while a progress update is in flight? [Coverage, Gap]
- [ ] CHK018 - Are requirements defined for what happens when the habits cache is cold (user hasn't visited /habits) and linked habits need resolving? [Coverage, Gap, Spec §FR-024]
- [ ] CHK019 - Is the behavior specified for editing a goal that has been deleted by another tab/session (stale detail panel)? [Coverage, Gap]
- [ ] CHK020 - Are requirements defined for the goal card footer when a goal has zero milestones — should it show "0 of 0 milestones done" or hide the milestones count? [Coverage, Spec §FR-004]

## Edge Case Coverage

- [ ] CHK021 - Is the behavior specified for the progress input when the user enters non-numeric characters or decimals? [Edge Case, Spec §FR-007]
- [ ] CHK022 - Is the target date validation defined — can the user set a past date when creating or editing a goal? [Edge Case, Spec §FR-015]
- [ ] CHK023 - Are requirements defined for milestone title length limits or character restrictions? [Edge Case, Spec §FR-010 vs contracts §CreateMilestoneRequest]
- [ ] CHK024 - Is the behavior specified when linking a habit that gets archived/deleted between opening the dropdown and clicking "Link"? [Edge Case, Gap]

## Cross-Artifact Consistency

- [ ] CHK025 - Does data-model.md's GoalDetail type align with the contracts/goals-api.md GET /goals/{id} response schema (same fields, same types)? [Consistency, data-model.md vs contracts]
- [ ] CHK026 - Does the plan.md project structure (9 components in src/components/goals/) cover all UI sections described in the spec's functional requirements? [Completeness, plan.md vs Spec §FR-001–FR-025]
- [ ] CHK027 - Are all 10 API endpoints in contracts/goals-api.md traceable to at least one functional requirement in the spec? [Traceability, contracts vs Spec]
- [ ] CHK028 - Does the research.md R5 decision (exclude linked habits from dropdown) align with the spec's FR-013 and US5 acceptance scenario 4? [Consistency, research.md §R5 vs Spec §FR-013]

## Non-Functional Requirements

- [ ] CHK029 - Are cache invalidation requirements specified for each mutation — which query keys to invalidate after create, edit, delete, progress update, milestone CRUD, and habit link/unlink? [Completeness, Gap]
- [ ] CHK030 - Are accessibility requirements defined for the master-detail interaction pattern (keyboard navigation between list and panel, focus management on selection)? [Coverage, Gap]

## Notes

- Check items off as completed: `[x]`
- Add comments or findings inline
- Items are numbered sequentially for easy reference
- This checklist tests requirements quality, not implementation correctness
