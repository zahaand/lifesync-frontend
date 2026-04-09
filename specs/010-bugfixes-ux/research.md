# Research: Bug Fixes, UX Improvements & Onboarding Tooltips

**Branch**: `010-bugfixes-ux` | **Date**: 2026-04-09

## R1: Zod .refine() vs .regex() for Password Complexity

**Decision**: Use 4 separate `.refine()` checks, each with its own translated error message.

**Rationale**: `.regex()` with a single complex pattern can only report one generic "invalid format" message. `.refine()` allows individual messages per failed rule ("Missing uppercase letter", "Missing digit", etc.). This directly satisfies FR-002 which requires specific per-requirement feedback.

**Alternatives considered**:
- Single `.regex()` with complex lookahead pattern — rejected because it provides only one error message regardless of which rules fail.
- `.superRefine()` collecting multiple errors — considered but `.refine()` chain is simpler and Zod already collects all failing refines.

**Implementation note**: `.refine()` runs after `.min(8)` validation. If the string is too short, the min-length error appears first (from global Zod error map). If length is ok, all 4 refines run and report individual failures.

## R2: Zod .transform() for Username/Email Normalization

**Decision**: Use `.transform(v => v.toLowerCase())` for username and `.transform(v => v.toLowerCase().trim())` for email/identifier.

**Rationale**: Zod transforms modify the parsed value before it's returned from `.parse()`. React Hook Form with `zodResolver` will use the transformed values in the `onSubmit` callback. No change needed in the mutation call — it receives already-normalized data.

**Alternatives considered**:
- Normalize in `onSubmit` handler — rejected because it's easy to forget, and validation should enforce data shape.
- Normalize in the API layer — rejected because it's too late for frontend display purposes.

**Implementation note**: When using `.transform()`, the Zod schema's inferred output type reflects the transform. Since our transforms are string→string, no type changes are needed in existing code.

## R3: shadcn/ui Calendar + date-fns Locale Support

**Decision**: Install Calendar via `npx shadcn@latest add calendar`. Add `date-fns` as explicit direct dependency.

**Rationale**: shadcn/ui Calendar is built on `react-day-picker` which accepts a `locale` prop from date-fns. This is the standard way to localize the calendar component in the shadcn/ui ecosystem.

**Alternatives considered**:
- Keep native `<input type="date">` and accept locale mismatch — rejected because it breaks the bilingual UX.
- Use a custom month/day name mapping without date-fns — rejected as reinventing the wheel when date-fns provides battle-tested locale data.

**Dependencies**: `react-day-picker` (added by shadcn/ui Calendar), `date-fns` (explicit direct dep for locale imports).

## R4: Dialog Close Interception for Unsaved Changes

**Decision**: Intercept `onOpenChange(false)` on the shadcn/ui Dialog component. Show AlertDialog when form has non-whitespace title content.

**Rationale**: shadcn/ui Dialog (Radix) calls `onOpenChange(false)` for all close triggers (X button, overlay click, Escape key). By wrapping this callback, we can conditionally prevent close and show a confirmation AlertDialog instead.

**Alternatives considered**:
- Browser `beforeunload` event — not applicable to modal close, only page navigation.
- Custom overlay click handler — incomplete (doesn't cover X button or Escape key).
- Radix Dialog's `onInteractOutside` / `onEscapeKeyDown` — partial solution that misses X button. The `onOpenChange` wrapper is more comprehensive.

**Implementation note**: Use `watch('title')` from React Hook Form to check if title has content. Check `title.trim().length > 0` for the guard condition.

## R5: Goal Cache Invalidation — Existing Code Analysis

**Decision**: Investigate during implementation. All mutations already call `invalidateQueries({ queryKey: ['goals'] })`.

**Rationale**: Code analysis shows all 9 goal mutations in `useGoals.ts` already have cache invalidation with the `['goals']` prefix key. This should invalidate `['goals', params]`, `['goals', goalId]`, and `['goals']` queries. The bug might be:
1. Component-level stale closure preventing re-render
2. `useGoalDetail` query disabled or stale
3. Race condition between mutation success and invalidation

**Investigation approach**: Read the consuming components (GoalLinkedHabits, GoalProgress, GoalDetail) during implementation to find the actual cause.

## R6: AccountCard Ghost Button — Existing Code Analysis

**Decision**: Two-phase approach — inspect then fix.

**Rationale**: AccountCard.tsx (lines 137-154) renders Cancel and Save buttons always visible, with `disabled` state changes. The ghost effect likely occurs when:
- `updateProfile.isPending` transitions to `false`
- `reset()` in `onSuccess` changes `isDirty` to `false`
- Both buttons re-render simultaneously with new disabled states

The fix will be determined after visual inspection during implementation. Likely candidates:
- Add `overflow-hidden` to the button container
- Ensure button dimensions are consistent across states (min-width)
- Check for duplicate form re-render caused by `reset()` + state transition

## R7: shadcn/ui Tooltip Touch Behavior

**Decision**: Use shadcn/ui Tooltip as-is. Radix Tooltip handles focus events that translate to touch on mobile.

**Rationale**: Radix Tooltip triggers on focus, hover, and pointer events. On mobile, tapping a focusable element triggers a focus event, which opens the tooltip. The tooltip closes on tap-away (blur). Using a `<button>` as the trigger ensures focusability across all platforms.

**Alternatives considered**:
- Popover for mobile — rejected as unnecessary complexity. Popover requires explicit open/close state management.
- Conditional component (Tooltip on desktop, Popover on mobile) — rejected as over-engineering for educational tooltips.
