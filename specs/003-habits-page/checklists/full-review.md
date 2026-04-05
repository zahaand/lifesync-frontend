# Full Spec Review Checklist: Habits Page — Full Habit Management

**Purpose**: Full spec review across all quality dimensions with spec + plan artifacts cross-check
**Created**: 2026-04-05
**Feature**: [spec.md](../spec.md)
**Artifacts reviewed**: spec.md, plan.md, research.md, data-model.md, contracts/habits-api.md

## Requirement Completeness

- [ ] CHK001 - Are loading state requirements defined for the Habits page initial data fetch? [Gap — spec defines edge cases for errors but no loading skeleton/spinner requirement]
- [ ] CHK002 - Are requirements specified for habit ordering within each section (ACTIVE / ARCHIVED)? [Gap — spec §FR-001 says "organized into sections" but not sort order: alphabetical, newest-first, or server-determined]
- [ ] CHK003 - Is the empty state for zero habits formally specified as a functional requirement? [Completeness — mentioned only in Edge Cases, not as an FR with acceptance criteria]
- [x] CHK004 - Are requirements defined for the PAUSED habit status? [Gap — RESOLVED: PAUSED documented as reserved for future use; section placement determined by `isActive` boolean, not `status`]
- [ ] CHK005 - Is a maximum length or character constraint specified for the description field in the create/edit form? [Gap — spec §FR-010 specifies name validation (1–200 chars) but no constraints on description]
- [ ] CHK006 - Are requirements specified for what the streak badge displays when currentStreak is 0? [Gap — spec §User Story 1 scenario 4 only covers streak > 0; is the badge hidden, or shows "0 day streak"?]
- [ ] CHK007 - Are requirements defined for the visual appearance of a disabled checkbox on archived habit rows? [Gap — spec §FR-006 says checkbox "MUST be disabled" but not how it should look: greyed out, hidden, or visually muted]

## Requirement Clarity

- [ ] CHK008 - Is "today" precisely defined for completion status reset timing? [Clarity — spec §FR-004/FR-005 reference "completed today" but no specification of timezone handling or day boundary]
- [ ] CHK009 - Is search input behavior specified for debouncing or instant filtering? [Clarity — spec §FR-009 says "filters by name on the client side" but doesn't specify whether filtering is keystroke-by-keystroke or debounced]
- [ ] CHK010 - Are section header visibility rules specified when a filter tab narrows to one status? [Clarity — when "Active" tab is selected, should the "ACTIVE — N" section header still display, or is it redundant?]
- [ ] CHK011 - Is "case-insensitive" search matching precisely defined? [Clarity, Spec §FR-009 — does it handle locale-specific characters like accented letters, or just ASCII toLowerCase?]

## Requirement Consistency

- [x] CHK012 - Is the relationship between `status` (ACTIVE/PAUSED/ARCHIVED) and `isActive` (boolean) fields consistent across data-model.md and the API contracts? [Conflict — RESOLVED: `isActive` is authoritative for section placement. PAUSED reserved for future use. Documented in spec §FR-013, §Key Entities, and data-model.md]
- [ ] CHK013 - Does spec §FR-001 contain implementation detail that conflicts with spec-level abstraction? [Consistency — FR-001 states "The single habits query returns both active and archived habits; the frontend separates them client-side by status" which leaks implementation detail into a functional requirement]
- [ ] CHK014 - Are the custom design color tokens in the spec consistent with the plan's constitution check reference to accent `#534AB7`? [Consistency — spec §Design Reference defines streak badge bg #FAEEDA, archived row bg #F5F4F0, etc., but these are only in the original user description, not carried into any formal FR or design system reference in plan.md]
- [ ] CHK015 - Is the optimistic update scope consistent between spec and research? [Consistency — spec §FR-004/FR-005 define optimistic updates for completion toggle only; research §R2 documents dual-cache update strategy; but no spec requirement addresses optimistic behavior for archive/restore/delete operations]

## Acceptance Criteria Quality

- [ ] CHK016 - Are acceptance scenarios defined for the create form when frequency changes from CUSTOM back to DAILY? [Coverage, Spec §User Story 2 — scenario 3 covers showing day checkboxes for CUSTOM, but no scenario for hiding them and clearing selections when switching away from CUSTOM]
- [ ] CHK017 - Can SC-002 ("visual feedback within 200ms") be objectively measured at the spec level without implementation knowledge? [Measurability, Spec §SC-002 — 200ms is a frontend rendering metric requiring performance profiling; is this appropriate as a business-level success criterion?]
- [x] CHK018 - Are acceptance scenarios defined for editing an archived habit? [Coverage — RESOLVED: FR-012 updated to confirm edit button available for both active and archived habits. Clarification added.]

## Scenario Coverage

- [x] CHK019 - Are requirements defined for what happens when the user has more than 100 habits? [Coverage — RESOLVED: FR-001 updated with "up to 100 habits" limit. Pagination UI explicitly out of scope for MVP. Documented in Clarifications.]
- [ ] CHK020 - Are requirements specified for the subtitle count when filter tab is not "All"? [Coverage — spec §FR-002 says subtitle shows "N active · M archived" but should these counts reflect the current filter or always show totals?]
- [ ] CHK021 - Are requirements defined for form state preservation when the create/edit modal is closed without saving? [Coverage — spec §Edge Case 3 covers failed submissions, but no requirement for unsaved changes warning or form reset on modal close/reopen]

## Edge Case Coverage

- [ ] CHK022 - Are requirements defined for rapid successive archive/restore toggling of the same habit? [Edge Case — spec §Edge Case 5 covers rapid checkbox toggles but not rapid archive/restore which also mutates server state]
- [ ] CHK023 - Are requirements specified for attempting to delete a habit that was restored by another session between opening the confirmation dialog and confirming? [Edge Case — race condition: habit may no longer be archived when DELETE is sent, producing a 400 error]
- [ ] CHK024 - Are requirements defined for network connectivity loss during optimistic updates? [Edge Case — spec defines rollback on server failure, but not behavior during prolonged offline state or timeout scenarios]

## Non-Functional Requirements

- [ ] CHK025 - Are accessibility requirements specified for keyboard navigation across habit rows, filter tabs, and modal forms? [Gap — constitution §V references Radix for accessibility, but spec defines no keyboard interaction requirements: tab order, focus trapping in modals, or screen reader labels]
- [ ] CHK026 - Are responsive/mobile layout requirements specified for the Habits page? [Gap — no breakpoint or mobile-specific layout requirements; the design reference only describes a desktop-style layout]

## Dependencies & Assumptions

- [ ] CHK027 - Is the assumption that the backend returns all habits (active + archived) in a single GET request validated against the actual API behavior? [Assumption — spec §Clarifications states "returns both" but the existing `habitsApi.getHabits` in Sprint 2 was called with `status: 'ACTIVE'`; the unfiltered response behavior is assumed but not confirmed]
- [ ] CHK028 - Is the assumption that backend Habit entity includes `description`, `targetDaysOfWeek`, and `reminderTime` fields validated? [Assumption, Spec §Assumptions — stated as assumed but these fields don't exist in the current Sprint 2 type definition; backend contract confirmation is noted but not proven]

## Cross-Artifact Consistency

- [ ] CHK029 - Does the data model's `UpdateHabitRequest` with `isActive` field align with the spec's archive/restore requirements using the same PATCH endpoint? [Cross-check — spec §FR-013/FR-014 describe archive/restore behavior; data-model.md §UpdateHabitRequest includes `isActive`; contracts/habits-api.md shows separate examples; ensure no ambiguity about whether archive/restore is a dedicated action or reuses the edit endpoint]
- [ ] CHK030 - Is the plan's component decomposition (6 components) sufficient to cover all spec requirements without gaps? [Cross-check — plan.md lists HabitCard, HabitFormModal, HabitDeleteDialog, HabitFilters, HabitEmptyState, HabitsPage; verify that all FR-001 through FR-019 map to at least one planned component]

## Notes

- Items are ordered by quality dimension, not priority
- CHK004 (PAUSED status) and CHK012 (status vs isActive conflict) are the highest-risk items — they suggest a data model ambiguity that could cause incorrect section placement
- CHK019 (>100 habits pagination) is a practical risk given the hardcoded page size in the API contract
- 30 items total at standard depth
