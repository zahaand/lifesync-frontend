import { create } from 'zustand'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'lifesync-theme'

function getStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const value = parsed?.state?.theme
    if (value === 'light' || value === 'dark') return value
    return null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {
    // matchMedia not available
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { theme } }))
  } catch {
    // localStorage unavailable (private browsing)
  }
}

type ThemeState = {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: getStoredTheme() ?? getSystemTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    persistTheme(next)
    set({ theme: next })
  },
}))
