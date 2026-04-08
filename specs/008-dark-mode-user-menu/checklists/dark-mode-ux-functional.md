# UX & Functional Checklist: Dark Mode & User Menu Update

**Purpose**: Validate completeness, clarity, and consistency of dark mode and user menu requirements
**Created**: 2026-04-08
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 - Are dark mode color requirements specified for ALL 24+ hardcoded hex colors identified in the codebase, or only a subset? [Completeness, Spec §FR-006]
- [ ] CHK002 - Are dark mode requirements defined for the mobile top bar border (`border-[#E8E6DF]`) and branding text? [Completeness, Gap]
- [ ] CHK003 - Are dark mode requirements specified for form input states (filled, focused, error) on LoginPage? [Completeness, Gap]
- [ ] CHK004 - Are dark mode requirements defined for the success/registration confirmation message on LoginPage? [Completeness, Gap]
- [x] CHK005 - Are loading/skeleton state appearances in dark mode addressed in requirements? [Completeness, Gap] — Resolved: shadcn/ui Skeleton inherits dark mode via CSS variables (documented in Assumptions)
- [x] CHK006 - Are dark mode requirements defined for toast notifications (Sonner)? [Completeness, Gap] — Resolved: Sonner/Toast inherits dark mode via CSS variables (documented in Assumptions)
- [x] CHK007 - Are dark mode requirements specified for dialog/modal overlays (GoalFormModal, HabitFormModal, DeleteDialogs)? [Completeness, Gap] — Resolved: Dialog/AlertDialog inherits dark mode via CSS variables (documented in Assumptions)

## Requirement Clarity

- [x] CHK008 - Is "readable" in FR-006 quantified with specific contrast ratio or WCAG level? SC-003 mentions WCAG AA 4.5:1 — does FR-006 reference this explicitly? [Clarity, Spec §FR-006 vs §SC-003] — Resolved: FR-006 now specifies WCAG AA 4.5:1 for normal text, 3:1 for large text
- [ ] CHK009 - Is "dark background" in FR-008/FR-009 specified with a concrete color value or reference, or left to implementer discretion? [Clarity, Spec §FR-008]
- [ ] CHK010 - Is "appropriate dark mode color variant" for the version label (FR-011) defined with specific criteria? [Clarity, Spec §FR-011]
- [x] CHK011 - Is "dark background" for the login page (FR-010) specified with a target color or contrast requirement? [Clarity, Spec §FR-010] — Resolved: FR-010 now specifies CSS variable `--background` (~#09090b in dark mode)
- [ ] CHK012 - Are the Sun/Moon icon sizes and positioning specified, or assumed to match existing menu icon conventions? [Clarity, Spec §FR-005]

## Requirement Consistency

- [ ] CHK013 - Do the avatar background colors (`bg-[#EEF2FF]`) and active nav item colors (`bg-[#EEEDFE]`) have consistent dark mode treatment since both are purple-tinted light backgrounds? [Consistency, Plan §D5]
- [x] CHK014 - Are dark mode requirements for `text-[#534AB7]` consistent across all usages (logo, active nav, avatar text, submit buttons)? Spec says "unchanged" — is this validated for all dark background contexts? [Consistency, Spec §FR-007] — Resolved: FR-007 now explicitly states #534AB7 is readable on both white and dark backgrounds, no dark: variant needed
- [ ] CHK015 - Is the theme toggle label wording consistent between spec acceptance scenarios ("Dark mode"/"Light mode") and FR-005 description? [Consistency, Spec §FR-005 vs §US-3]
- [ ] CHK016 - Are the user chip menu requirements consistent between desktop sidebar and mobile Sheet? FR-014 says "identically" — are layout/spacing differences explicitly permitted? [Consistency, Spec §FR-014]

## Acceptance Criteria Quality

- [x] CHK017 - Can SC-002 ("zero flash") be objectively measured? Is a maximum acceptable flash duration defined (e.g., <16ms)? [Measurability, Spec §SC-002] — Resolved: FR-003 now defines verification method: hard-refresh with dark mode shows no white flash
- [x] CHK018 - Is SC-003 (WCAG AA 4.5:1) specified as applying to ALL text or only "normal text"? Large text has a different threshold (3:1). [Measurability, Spec §SC-003] — Resolved: FR-006 now specifies both 4.5:1 normal and 3:1 large text thresholds
- [ ] CHK019 - Is SC-005 ("visually distinct and readable") quantified with contrast or differentiation criteria beyond SC-003? [Measurability, Spec §SC-005]
- [ ] CHK020 - Does SC-006 ("all existing tests pass") specify what happens if tests need dark-mode-aware updates (e.g., snapshot tests)? [Clarity, Spec §SC-006]

## Scenario Coverage

- [ ] CHK021 - Are requirements defined for what happens when a user logs out and logs back in — does the theme preference survive across sessions independent of auth state? [Coverage, Gap]
- [ ] CHK022 - Are requirements defined for the theme toggle behavior while the dropdown menu is open (does it close after toggle, or stay open)? [Coverage, Gap]
- [ ] CHK023 - Are requirements specified for how the inline `<head>` script and Zustand store stay in sync (same localStorage key, same value format)? [Coverage, Spec §FR-003 vs Clarifications]
- [x] CHK024 - Are requirements defined for the behavior when OS preference changes while the app is open (e.g., macOS auto dark mode at sunset)? [Coverage, Edge Case] — Resolved: Edge case added — app does NOT auto-update, localStorage takes precedence, only manual toggle changes theme
- [ ] CHK025 - Are keyboard accessibility requirements for the theme toggle menu item specified (focus order, activation key)? [Coverage, Accessibility]

## Edge Case Coverage

- [x] CHK026 - Is the fallback behavior when `localStorage` is completely unavailable (not just empty) specified beyond "defaults to light mode"? Does the toggle still work in-memory? [Edge Case, Spec §Edge Cases] — Resolved: Edge case now specifies script catches error silently, toggle works in-session but does not persist
- [x] CHK027 - Are requirements defined for what constitutes an "invalid" stored theme value in FR-015? Is any value other than `"light"` or `"dark"` considered invalid? [Edge Case, Spec §FR-015] — Resolved: Edge case now specifies any value not 'light' or 'dark' is treated as missing, falls back to prefers-color-scheme
- [ ] CHK028 - Are requirements defined for the transition animation (or lack thereof) when toggling themes? Should it be instant or have a fade? [Edge Case, Gap]

## Dependencies & Assumptions

- [x] CHK029 - Is the assumption that shadcn/ui components "support dark mode out of the box" validated against the specific components used (DropdownMenu, Sheet, Dialog, AlertDialog, Tooltip, Select)? [Assumption, Spec §Assumptions] — Resolved: Assumption now explicitly lists component names that inherit dark mode via CSS variables
- [ ] CHK030 - Is the assumption that `#534AB7` purple remains readable on dark backgrounds validated with actual contrast ratio against proposed dark background colors? [Assumption, Spec §FR-007]

## Notes

- Combined UX + Functional checklist at standard depth
- Accessibility items folded into relevant UX categories
- Focus: completeness of color mapping requirements, clarity of measurable criteria, edge case coverage for state management
- **2026-04-08**: 12/30 items resolved via spec updates (Fixes 1-8). Remaining 18 items are low-to-medium impact and acceptable for proceeding to `/speckit.tasks`.
