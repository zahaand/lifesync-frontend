# Full Review Checklist: Pre-release — Audit, Testing & Documentation

**Purpose**: Validate specification completeness, clarity, and consistency across spec + plan artifacts before implementation
**Created**: 2026-04-06
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 - Are all test file locations explicitly specified for every hook and component test? (spec lists hooks/components but plan's `__tests__/` directories need mapping to individual files) [Completeness, Spec §FR-003/FR-004] — **FIXED**: Added test file locations to Assumptions section
- [ ] CHK002 - Are the specific test assertions defined for each hook test? (e.g., what exactly should `useAuth` login test verify — token stored? redirect triggered? user state updated?) [Completeness, Spec §FR-003]
- [ ] CHK003 - Is the expected number of test files quantified? (spec says "hook tests" and "component tests" but doesn't count how many `.test.ts` files to produce) [Completeness, Gap]
- [ ] CHK004 - Are Postman environment variables (baseUrl, token) documented as requirements? (edge case mentions parameterization, but no FR covers it) [Completeness, Gap]
- [ ] CHK005 - Is the `.env.example` variable list explicitly enumerated? (FR-011 says "all required variables" but doesn't list them) [Completeness, Spec §FR-011]
- [ ] CHK006 - Are README sections with their expected content length/depth specified? (FR-010 lists section names but not how detailed each should be) [Completeness, Spec §FR-010]

## Requirement Clarity

- [x] CHK007 - Is "70% line coverage" scope precisely defined? Does it mean 70% of `src/hooks/` overall, or 70% per individual hook file? [Clarity, Spec §FR-005/SC-002] — **FIXED**: FR-005 clarified to 70% of `src/hooks/` directory overall
- [ ] CHK008 - Is "tested component files" in SC-002 an exhaustive list or open-ended? (spec lists 4 components — is that the full scope?) [Clarity, Spec §SC-002]
- [ ] CHK009 - Is "realistic mock data" in FR-002 quantified? (how many mock habits/goals/users should handlers return by default?) [Clarity, Spec §FR-002]
- [x] CHK010 - Is the Playwright test user cleanup guaranteed even on test failure? (`afterAll` may not run if process crashes — is this acceptable?) [Clarity, Spec §FR-007] — **FIXED**: FR-007 updated — afterAll cleanup executes via Playwright guarantee; orphaned accounts acceptable
- [ ] CHK011 - Are "pre-existing React Compiler warnings" enumerated so new warnings can be distinguished? [Clarity, Spec §FR-015]

## Requirement Consistency

- [ ] CHK012 - Are component test file locations consistent between spec and plan? (spec says `src/components/__tests__/` but LoginPage lives in `src/pages/` — should its test be in `src/pages/__tests__/` or `src/components/__tests__/`?) [Consistency, Spec §FR-004 vs Plan §Project Structure]
- [ ] CHK013 - Does the MSW handler contract (contracts/msw-handlers.md) cover all endpoints referenced in hook test requirements (FR-003)? [Consistency, Spec §FR-003 vs Contract]
- [ ] CHK014 - Are E2E test cases in contracts/e2e-test-plan.md aligned 1:1 with FR-007 requirements? [Consistency, Spec §FR-007 vs Contract]
- [ ] CHK015 - Does the plan's project structure match the spec's Key Entities section for test file locations? [Consistency, Spec §Key Entities vs Plan §Project Structure]

## Acceptance Criteria Quality

- [ ] CHK016 - Can SC-005 ("README is readable and a new developer can set up the project locally") be objectively measured? [Measurability, Spec §SC-005]
- [ ] CHK017 - Is SC-004 (">= 45 organized requests") derived from an actual count of required requests, or an estimate? [Measurability, Spec §SC-004]
- [ ] CHK018 - Are US1 acceptance scenarios specific enough to write test assertions? (AS-4 says "optimistic UI update occurs immediately" — what's the observable assertion?) [Measurability, Spec §US1 AS-4]

## Scenario Coverage

- [ ] CHK019 - Are requirements defined for what happens when E2E user registration fails during test setup? (e.g., username collision with parallel test runs) [Coverage, Gap]
- [ ] CHK020 - Are flaky test mitigation requirements specified? (network timeouts, animation timing, race conditions in E2E) [Coverage, Gap]
- [ ] CHK021 - Is the behavior specified for Vitest tests that accidentally bypass MSW? (e.g., direct import of apiClient without MSW intercept) [Coverage, Spec §FR-016]
- [ ] CHK022 - Are requirements defined for Playwright test retries? (plan says `retries: 0` — is this intentional for strict pass/fail?) [Coverage, Gap]
- [ ] CHK023 - Are requirements defined for running unit and E2E tests independently? (can a developer run only vitest without backend? only playwright without vitest?) [Coverage, Gap]

## Cross-Artifact Consistency

- [ ] CHK024 - Does research.md R-003 test wrapper pattern align with how hooks are actually tested in the plan? [Consistency, Research §R-003 vs Plan]
- [ ] CHK025 - Does research.md R-004 Playwright config align with FR-006 and the e2e-test-plan contract? [Consistency, Research §R-004 vs Spec §FR-006]
- [ ] CHK026 - Does data-model.md mock data shapes reference the correct source type files? (e.g., does `src/types/habits.ts` actually export the listed fields?) [Consistency, Data Model vs Codebase]
- [ ] CHK027 - Does the MSW handler contract cover error variants for all endpoints that have error-state tests in FR-002? [Consistency, Contract vs Spec §FR-002]

## Edge Case & Non-Functional Coverage

- [ ] CHK028 - Are timeout/performance requirements defined for test suite execution? (spec mentions 30s per Playwright test but no overall suite time budget) [Non-Functional, Gap]
- [x] CHK029 - Is the behavior specified for when MSW `onUnhandledRequest: 'error'` catches an unmocked endpoint? (research.md mentions it, but no FR covers it) [Edge Case, Gap] — **FIXED**: Assumptions updated — MSW uses `onUnhandledRequest: 'warn'` (warn, not error) to prevent false failures from background refetches
- [ ] CHK030 - Are requirements defined for test output format and reporting? (vitest coverage format, playwright report format) [Non-Functional, Gap]

## Notes

- Check items off as completed: `[x]`
- Items referencing [Gap] indicate missing requirements that may need spec updates
- Items referencing specific sections (e.g., Spec §FR-003) can be verified by reading that section
- Cross-artifact items require checking multiple files for consistency
