# Data Model: Dark Mode & User Menu Update

**Feature**: 008-dark-mode-user-menu | **Date**: 2026-04-08

## Entities

### ThemePreference

Represents the user's chosen visual theme, stored locally on the device.

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| theme | `'light' \| 'dark'` | Required, enum | Currently active theme mode |

**Storage**: `localStorage` key `lifesync-theme`
**Values**: `"light"` or `"dark"` (raw string, not JSON)
**Default**: Determined by OS `prefers-color-scheme` media query; falls back to `"light"` if no OS preference

### State Transitions

```
[No stored value] ──→ Check OS prefers-color-scheme
                        ├── dark  ──→ theme = 'dark'
                        └── light/none ──→ theme = 'light'

[User toggles] ──→ theme flips ──→ write to localStorage
                                 ──→ update <html> class
                                 ──→ store state updates

[Page load] ──→ Inline <head> script reads localStorage
              ├── found valid value ──→ apply class
              └── not found ──→ check OS preference ──→ apply class
            ──→ React mounts ──→ Zustand store initializes from same localStorage key
```

### ThemeStore (Zustand)

| Member | Type | Description |
|--------|------|-------------|
| `theme` | `'light' \| 'dark'` | Current theme state |
| `toggleTheme()` | `() => void` | Flip theme, persist to localStorage, update DOM class |

**Initialization**: On store creation, reads `localStorage.getItem('lifesync-theme')`. If invalid/missing, reads `window.matchMedia('(prefers-color-scheme: dark)')`. Syncs with the class already applied by the inline `<head>` script.

## Relationships

- **ThemePreference** is independent of **User** (auth). Theme persists across login/logout.
- **ThemeStore** is consumed by `UserChip` component (for toggle UI) and by the inline script (via shared localStorage key).
- **shadcn/ui CSS variables** respond to `.dark` class on `<html>` — no store coupling needed for library components.
