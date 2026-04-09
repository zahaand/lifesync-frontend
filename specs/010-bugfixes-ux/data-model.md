# Data Model: Bug Fixes, UX Improvements & Onboarding Tooltips

**Branch**: `010-bugfixes-ux` | **Date**: 2026-04-09

## Overview

This sprint modifies existing Zod schemas and adds UI-only state. No new persistent entities or API contracts are introduced.

## Modified Entities

### RegisterRequest (src/types/auth.ts)

Existing Zod schema with new transforms and refines:

| Field | Type | Validation | Transform | Change |
|-------|------|-----------|-----------|--------|
| email | string | .email() | `.toLowerCase().trim()` | NEW: trim + lowercase transform |
| username | string | .min(3).max(32).regex(/^[a-z0-9_-]+$/) | `.toLowerCase()` | NEW: lowercase transform |
| password | string | .min(8) + 4x .refine() | — | NEW: 4 password complexity refines |

**Password refine rules**:
- `/[A-Z]/` — at least one uppercase letter
- `/[a-z]/` — at least one lowercase letter
- `/[0-9]/` — at least one digit
- `/[!@#$%^&*()_+\-=\[\]{}|;':,.\/<>?]/` — at least one special character

### LoginRequest (src/types/auth.ts)

Existing Zod schema with new transform:

| Field | Type | Validation | Transform | Change |
|-------|------|-----------|-----------|--------|
| identifier | string | .min(1) | `.toLowerCase().trim()` | NEW: lowercase + trim transform |
| password | string | .min(1) | — | No change |

## Transient UI State

### UnsavedChangesGuard (HabitFormModal + GoalFormModal)

Not a persisted entity — component-level state:

| State | Type | Description |
|-------|------|-------------|
| showDiscardDialog | boolean | Whether the AlertDialog confirmation is visible |
| pendingClose | boolean | Whether a close action is waiting for user confirmation |

**Guard condition**: `watch('title').trim().length > 0`

**Flow**: Dialog `onOpenChange(false)` → check guard → if dirty: show AlertDialog; if clean: close immediately.

## No New API Contracts

All changes are frontend-only:
- Schema transforms modify data before it reaches existing API calls
- Cache invalidation uses existing React Query patterns
- Calendar component sends dates in the same `YYYY-MM-DD` string format
- Tooltips are purely presentational with no API interaction
