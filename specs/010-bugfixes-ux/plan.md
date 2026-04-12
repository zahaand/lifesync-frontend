# Implementation Plan: Bug Fixes, UX Improvements & Onboarding Tooltips

**Branch**: `010-bugfixes-ux` | **Date**: 2026-04-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-bugfixes-ux/spec.md`

## Summary

Fix 7 bugs and add onboarding tooltips. Bugs: static password hint + backend 400 error parsing, username/email normalization via Zod `.transform()`, unsaved changes guard on both form modals (AlertDialog), goal mutation cache invalidation investigation, native date picker → shadcn/ui Calendar with date-fns locales, AccountCard ghost button fix, login identifier normalization. UX: 3 info-icon tooltips on Goals page/detail explaining concepts.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.2, Node 20+
**Primary Dependencies**: Vite 8, React Router v7, TanStack React Query v5, Zustand, shadcn/ui (Nova preset) + Radix, Lucide React, Sonner, Tailwind CSS v4, react-i18next, i18next, date-fns (NEW), react-day-picker (NEW — shadcn/ui Calendar dependency)
**Storage**: localStorage (theme, locale), Zustand (auth tokens)
**Testing**: Vitest + React Testing Library + MSW (happy-dom), global i18n mock
**Target Platform**: Web browser (desktop 1280px + mobile 375px)
**Project Type**: Single-page web application (React SPA)
**Performance Goals**: No performance-critical changes in this sprint
**Constraints**: All existing 55 tests must pass; tsc --noEmit zero errors; constitution v1.1.0 compliance; all text via i18n
**Scale/Scope**: ~12 source files to modify, 2 new UI components (Calendar, AlertDialog if not present), ~30 new translation keys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | All mutations go through `src/api/`. No direct axios calls added |
| II. Server State via React Query | PASS | Cache invalidation fixes improve React Query usage. No local state for server data |
| III. Component-Logic Separation | PASS | Validation logic in Zod schemas (`src/types/`). Unsaved changes guard logic inline in modal (UI state, not business logic). Tooltips are pure UI |
| IV. Type Safety | PASS | Zod schemas with `.transform()` — fully typed. No `any` |
| V. Design System Fidelity | PASS | AlertDialog, Calendar, Tooltip from shadcn/ui. Info icon from Lucide React. No manual UI edits |

**Technology Constraints**:
- Styling via Tailwind CSS v4 — PASS
- Imports use `@/` path alias — PASS
- User-facing text translatable via i18next — PASS (all new text gets translation keys)
- New dependencies: date-fns + react-day-picker — **JUSTIFIED** (required by shadcn/ui Calendar for locale-aware date picking; no alternative within existing stack)

## Project Structure

### Documentation (this feature)

```text
specs/010-bugfixes-ux/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── auth.ts                # MODIFY — registerSchema: .transform() for username/email; loginSchema: .transform() for identifier
├── hooks/
│   ├── useAuth.ts             # MODIFY — useRegister: handle 400 status with message field
│   └── useGoals.ts            # INVESTIGATE — verify cache invalidation (may already be correct)
├── components/
│   ├── ui/
│   │   ├── calendar.tsx       # NEW — shadcn/ui Calendar component (npx shadcn add)
│   │   └── alert-dialog.tsx   # NEW — shadcn/ui AlertDialog component (npx shadcn add, if not present)
│   ├── habits/
│   │   └── HabitFormModal.tsx  # MODIFY — add unsaved changes guard (AlertDialog on close)
│   ├── goals/
│   │   ├── GoalFormModal.tsx   # MODIFY — add unsaved changes guard + replace <input type="date"> with Calendar
│   │   ├── GoalMilestones.tsx  # MODIFY — add info tooltip
│   │   └── GoalLinkedHabits.tsx # MODIFY — add info tooltip
│   └── profile/
│       └── AccountCard.tsx     # INVESTIGATE + FIX — ghost button during save mutation
├── pages/
│   ├── LoginPage.tsx          # MODIFY — RegisterForm: password hint, username hint; LoginForm: identifier transform
│   └── GoalsPage.tsx          # MODIFY — add info tooltip next to heading
├── locales/
│   ├── en/
│   │   ├── auth.json          # MODIFY — add password validation keys, username hint
│   │   ├── habits.json        # MODIFY — add unsaved changes dialog keys
│   │   └── goals.json         # MODIFY — add tooltip content, unsaved changes dialog keys
│   └── ru/
│       ├── auth.json          # MODIFY — Russian translations
│       ├── habits.json        # MODIFY — Russian translations
│       └── goals.json         # MODIFY — Russian translations
└── lib/
    ���── i18n.ts                # NO CHANGES — Zod error map already handles base validation
```

**Structure Decision**: No new directories. Calendar and AlertDialog are standard shadcn/ui components installed into `src/components/ui/`. date-fns is added as a direct dependency for Calendar locale support.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New dependency: date-fns | Required by shadcn/ui Calendar for locale-aware month/day names | Native `<input type="date">` cannot respect app locale — this is the bug being fixed |
| New dependency: react-day-picker | shadcn/ui Calendar is built on react-day-picker | No alternative — shadcn/ui prescribes this dependency |

## Design Decisions

### D1: Password Hint (Static)

The existing `z.string().min(8)` validation in `registerSchema` is sufficient. No `.refine()` checks are added — password complexity validation (uppercase, lowercase, digit, special character) is deferred to TD-003. The frontend displays a static translated hint below the password field: "Minimum 8 characters" (EN) / "Минимум 8 символов" (RU) via `t('auth:register.passwordHint')`. Backend 400 errors are parsed and displayed as-is.

### D2: Backend 400 Error Handling

In `useRegister` (`src/hooks/useAuth.ts`), add a handler for status 400:

```
if (status === 400 && data && 'message' in data) {
  setError('password', { message: (data as { message: string }).message })
}
```

This catches backend password validation errors that pass frontend Zod validation. Falls back to generic error if no `message` field.

### D3: Username/Email/Identifier Normalization

Use Zod `.transform()` on schema fields:

- `registerSchema.username`: `.transform(v => v.toLowerCase())`
- `registerSchema.email`: `.transform(v => v.toLowerCase().trim())`
- `loginSchema.identifier`: `.transform(v => v.toLowerCase().trim())`

The transform runs after validation, so the backend receives normalized values. Type inference still works — `z.infer<typeof registerSchema>` returns transformed types.

**Note**: When using `.transform()`, the Zod schema output type differs from input type in TypeScript. Since the transforms only apply string→string operations, the inferred types remain the same and no type changes are needed.

### D4: Unsaved Changes Guard

Both HabitFormModal and GoalFormModal need the same pattern:

1. Track whether the title field has non-whitespace content via React Hook Form's `watch('title')`
2. Intercept modal close: wrap the Dialog's `onOpenChange` callback
3. If title has content and user tries to close → show AlertDialog
4. AlertDialog: "Discard changes?" / "All entered data will be lost." / "Keep editing" / "Discard"
5. "Keep editing" → close AlertDialog, keep form open
6. "Discard" → close AlertDialog, reset form, close Dialog

**shadcn/ui Dialog close interception**: The Dialog component's `onOpenChange` fires with `false` when the user clicks X or clicks outside. We intercept this by checking form state before allowing close.

### D5: Goal Cache Invalidation Investigation

All goal mutations in `useGoals.ts` already call `queryClient.invalidateQueries({ queryKey: ['goals'] })` on success. This should invalidate all queries with the `['goals']` prefix (including `['goals', params]` and `['goals', goalId]`).

**Investigation plan** (two-phase per clarify decision):
1. Check if `useGoalDetail(goalId)` is being used with a stable reference that prevents refetch
2. Check if `GoalLinkedHabits` / `GoalProgress` components use their own local state instead of query data
3. Check if the mutation's `onSuccess` is missing `await` (unlikely but possible)
4. Fix based on actual root cause

**Hypothesis**: The link/unlink and progress mutations return success but the `useGoalDetail` query is not refetching because the component using it has a stale `goalId` reference or the query is disabled.

### D6: Calendar Component (Date Picker Replacement)

Replace `<Input type="date" {...register('targetDate')} />` in GoalFormModal with:

1. Install shadcn/ui Calendar: `npx shadcn@latest add calendar` (adds `react-day-picker` and `date-fns`)
2. Add `date-fns` as explicit direct dependency
3. Use Popover + Calendar pattern:
   - Button shows formatted date or placeholder
   - Click opens Popover with Calendar
   - Calendar accepts `locale` prop: `i18n.language === 'ru' ? ru : enUS` from `date-fns/locale`
   - On date select: format to `YYYY-MM-DD` string for form state

**Integration with React Hook Form**: Use `Controller` from react-hook-form to manage Calendar's value since it's not a native input.

### D7: Ghost Button Investigation (AccountCard)

**Phase 1 — Inspection findings** (from reading AccountCard.tsx):

The AccountCard renders Cancel and Save buttons in a `flex justify-end gap-2` container (lines 137-154). Both buttons are always rendered — Cancel is `disabled={!isDirty}` and Save is `disabled={!isDirty || updateProfile.isPending}`.

**Hypothesis**: The ghost button is likely caused by the form re-rendering when `isDirty` changes back to `false` after `reset()` is called in `onSuccess`. During the brief window between mutation success and form reset, both buttons may flash. Alternatively, the `updateProfile.isPending` → `false` transition may cause a layout shift.

**Phase 2 — Fix**: Will be determined after investigation during implementation. Likely fix: ensure `reset()` in `onSuccess` and the `isPending` state transition don't cause a visible layout shift by using consistent button dimensions or a CSS transition.

### D8: Onboarding Tooltips

Add 3 info tooltips using shadcn/ui Tooltip + Lucide React `Info` icon:

1. **GoalsPage.tsx**: Info icon next to "Goals" heading
2. **GoalMilestones.tsx**: Info icon next to "Milestones" section title
3. **GoalLinkedHabits.tsx**: Info icon next to "Linked Habits" section title

Pattern for each:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" aria-label={t('tooltip.goalsInfoLabel')}>
        <Info className="size-4 text-muted-foreground" />
      </button>
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-sm">
      {t('tooltip.goalsInfo')}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

The `<button>` wrapper ensures keyboard focusability (Tab + Enter/Space). Radix Tooltip handles touch events natively.

### D9: Translation Keys

New keys needed across namespaces:

**auth.json** (~3 keys):
- `register.passwordHint`: "Minimum 8 characters"
- `register.usernameHint`: "Username is case-insensitive and will be stored in lowercase"
- `error.registrationFailed`: "Registration failed. Please try again."

**habits.json** (~4 keys, nested under `form.unsavedChanges`):
- `form.unsavedChanges.title`: "Discard changes?"
- `form.unsavedChanges.description`: "All entered data will be lost."
- `form.unsavedChanges.keepEditing`: "Keep editing"
- `form.unsavedChanges.discard`: "Discard"

**goals.json** (~10 keys):
- `form.unsavedChanges.title`, `form.unsavedChanges.description`, `form.unsavedChanges.keepEditing`, `form.unsavedChanges.discard` (same nested pattern as habits)
- `form.pickDate`: "Pick a date"
- `tooltip.goalsHeading`: "Goals are long-term objectives you want to achieve. Link habits to a goal to automatically track progress as you complete your daily habits."
- `tooltip.goalsHeadingLabel`: "What are Goals?"
- `tooltip.milestones`: "Milestones are checkpoints on the way to your goal. Mark them as complete to track your progress step by step."
- `tooltip.milestonesLabel`: "What are Milestones?"
- `tooltip.linkedHabits`: "Habits linked to this goal automatically update its progress when you complete them. The more habits you complete, the closer you get to your goal."
- `tooltip.linkedHabitsLabel`: "What are Linked Habits?"

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API-Layer Isolation | PASS | No direct axios/fetch calls. All through `src/api/` |
| II. Server State via React Query | PASS | Cache invalidation investigation improves RQ usage |
| III. Component-Logic Separation | PASS | Validation in Zod schemas, modal guards are UI state |
| IV. Type Safety | PASS | `.transform()` and `.refine()` maintain type safety |
| V. Design System Fidelity | PASS | Calendar, AlertDialog, Tooltip from shadcn/ui; Info from Lucide React |
