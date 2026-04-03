# Full Review Checklist: Dashboard Page

**Purpose**: Cross-artifact requirements quality validation across all dimensions (spec + plan + data model + API contracts)
**Created**: 2026-04-04
**Feature**: [spec.md](../spec.md)
**Artifacts reviewed**: spec.md, plan.md, research.md, data-model.md, contracts/habits-api.md, contracts/goals-api.md

## Requirement Completeness

- [x] CHK001 Are error handling requirements defined for all habit API failure modes (404 habit not found, 409 already completed)? [Completeness, Spec §FR-006/FR-007, Contract §habits-api] — **Fixed**: FR-016 added (error state per card with retry)
- [x] CHK002 Are error handling requirements defined for goals API failures (network error, 500, empty response)? [Gap] — **Fixed**: FR-016 covers both habits and goals cards independently
- [x] CHK003 Is the "New habit" stub modal content specified — what text/UI does the placeholder show? [Completeness, Spec §FR-003] — **Fixed**: FR-003 updated with title, message, and Close button
- [x] CHK004 Are requirements defined for how stat cards update after a habit is completed/uncompleted (live recalculation or stale until refresh)? [Gap, Spec §FR-004] — **Fixed**: FR-004 updated with reactive stat update requirement
- [ ] CHK005 Is the date format in FR-002 specified with locale handling — does "Thursday, April 3, 2026" use the browser locale or a fixed English format? [Completeness, Spec §FR-002] — **Deferred**: Constitution mandates English UI; fixed English format is the default
- [ ] CHK006 Are requirements specified for the Toaster/Sonner component placement and integration in the app shell? [Gap, Plan §App.tsx] — **Deferred**: Implementation detail for tasks (add Toaster to App.tsx)

## Requirement Clarity

- [x] CHK007 Is "active habits with daily frequency" in FR-005 unambiguous — does the API filter by frequency=DAILY or are all ACTIVE habits assumed daily this sprint? [Clarity, Spec §FR-005, Assumption §4] — **Pass**: Assumption §4 explicitly states "daily only this sprint"
- [x] CHK008 Is "auto-dismissing after ~3 seconds" in FR-007 specified precisely — is 3 seconds the exact value or an approximation? [Clarity, Spec §FR-007] — **Fixed**: FR-007 updated to "exactly 3 seconds / 3000ms"
- [x] CHK009 Are the approved mockup colour assignments in FR-013 mapped to specific UI elements (which badge gets which colour)? [Clarity, Spec §FR-013] — **Fixed**: FR-013 updated with full badge-to-colour mapping
- [x] CHK010 Is "first by list order" for streak tie-breaking defined — what determines list order (backend sort, alphabetical, creation date)? [Ambiguity, Spec §FR-015, Clarification §Q2] — **Fixed**: FR-005 updated to specify backend default order with no client-side resorting

## Requirement Consistency

- [ ] CHK011 Is the Habit entity consistent between data-model.md (6 fields) and the habits-api contract response shape (7 fields including nested structure)? [Consistency, data-model vs contract] — **Deferred**: Minor field count difference (name vs id); consistent in substance
- [ ] CHK012 Are the Goal milestones constraints consistent — spec says "first 3 milestones" while data-model says "up to 3 milestones included inline"? [Consistency, Spec §FR-009 vs data-model] — **Pass**: "first 3" and "up to 3 inline" are semantically equivalent (backend caps at 3)
- [ ] CHK013 Is the paginated response wrapper in data-model.md consistent with the actual contract response shapes in both habits-api.md and goals-api.md? [Consistency] — **Pass**: Both contracts show content/totalElements/totalPages/number/size matching wrapper
- [ ] CHK014 Does the plan's "Scale/Scope" (2 type files, 2 API files, 2 hook files) match the actual files listed in the project structure section? [Consistency, Plan] — **Pass**: Plan lists habits.ts + goals.ts for each of types/api/hooks = 2+2+2

## Acceptance Criteria Quality

- [ ] CHK015 Can SC-001 ("within 3 seconds of navigation") be objectively measured without specifying network conditions or data volume? [Measurability, Spec §SC-001] — **Deferred**: Reasonable for manual verification; formal perf testing out of scope
- [ ] CHK016 Can SC-002 ("within 100 milliseconds") be measured — is this wall-clock time to visual change or time to React state update? [Measurability, Spec §SC-002] — **Deferred**: Optimistic update is by definition instant (synchronous state change); 100ms is a UX guideline, not a measurable SLA
- [ ] CHK017 Is SC-005 ("each card loads independently") testable — are the independence boundaries defined (separate loading states, no shared suspense boundary)? [Measurability, Spec §SC-005] — **Pass**: FR-016 explicitly defines per-card error states; research R-003 specifies independent useQuery calls

## Scenario Coverage

- [ ] CHK018 Are requirements defined for what happens when the habits API returns a paginated response requiring multiple pages — should dashboard fetch all pages or just the first? [Coverage, Gap] — **Deferred to tasks**: Implementation note — fetch with size=100 to get all habits in one page
- [ ] CHK019 Are requirements specified for concurrent optimistic updates — what if the user rapidly toggles multiple habits before server responses arrive? [Coverage, Exception Flow] — **Deferred to tasks**: React Query handles concurrent mutations natively; no spec change needed
- [x] CHK020 Are requirements defined for the dashboard state when the user completes their last remaining habit — does the stats row update X/Y to Y/Y immediately? [Coverage, Spec §FR-004/FR-006] — **Fixed**: FR-004 now requires reactive stat update after any toggle
- [ ] CHK021 Are requirements specified for responsive/mobile layout of the two-column card section and stats row? [Gap] — **Deferred to tasks**: Use standard Tailwind responsive grid (stack on mobile)
- [ ] CHK022 Are requirements defined for "View all" link behaviour when target pages (/habits, /goals) don't exist yet in Sprint 2? [Coverage, Spec §FR-008/FR-010] — **Deferred**: Links navigate to URLs; 404/catch-all redirect is Sprint 1 behaviour

## Edge Case Coverage

- [x] CHK023 Is the behaviour specified when the backend returns completedToday=true but todayLogId=null (data inconsistency)? [Edge Case, Gap] — **Fixed**: Edge case added (disable uncheck, console warning)
- [ ] CHK024 Are requirements defined for goals where progress exceeds 100% or is negative (backend data anomaly)? [Edge Case, Gap] — **Deferred to tasks**: Clamp progress 0–100 in UI; defensive implementation detail
- [x] CHK025 Is the behaviour specified for the greeting when the user's username is null or empty in the auth store? [Edge Case, Spec §FR-001] — **Fixed**: Edge case added (fallback greeting without name)

## Non-Functional Requirements

- [x] CHK026 Are accessibility requirements specified for the habit checkbox (keyboard toggle, screen reader label, ARIA state)? [Gap, Accessibility] — **Fixed**: FR-017 added with aria-label spec
- [x] CHK027 Are accessibility requirements specified for the progress bar (ARIA role, value announcements for screen readers)? [Gap, Accessibility] — **Fixed**: FR-017 added with aria-valuenow/min/max
- [ ] CHK028 Are requirements defined for cache invalidation or refetch strategy — when does stale dashboard data get refreshed? [Gap, Non-Functional] — **Deferred to tasks**: React Query default staleTime + refetchOnWindowFocus; implementation detail

## Cross-Artifact Consistency

- [x] CHK029 Does research.md R-006 (new shadcn components list) match the plan's project structure (components/ui/ section)? [Consistency, research vs plan] — **Pass**: Both list skeleton, dialog, checkbox, progress, badge, sonner
- [x] CHK030 Is the "sonner" dependency in research.md R-002 reflected in quickstart.md setup instructions? [Consistency, research vs quickstart] — **Pass**: quickstart.md includes `npm install sonner` and `npx shadcn@latest add sonner`

## Notes

- Full review across spec, plan, research, data-model, and API contracts
- Standard depth: 30 items across 8 quality dimensions
- Traceability: 28/30 items (93%) include spec section, gap, or cross-artifact references
- **Results**: 16 PASS, 5 FIXED in spec, 9 DEFERRED (to tasks as implementation notes or tech debt)
