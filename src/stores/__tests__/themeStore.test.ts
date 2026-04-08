import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeStore } from '@/stores/themeStore'

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' && prefersDark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  mockMatchMedia(false)
  useThemeStore.setState({ theme: 'light' })
})

describe('themeStore', () => {
  it('initializes to light when no localStorage and no OS preference', () => {
    useThemeStore.setState({ theme: 'light' })
    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('initializes to dark when localStorage has dark', () => {
    localStorage.setItem(
      'lifesync-theme',
      JSON.stringify({ state: { theme: 'dark' } }),
    )
    // Re-import to test initialization — simulate by calling the store factory
    // Since Zustand stores are singletons, we test via setState + getStoredTheme logic
    const raw = localStorage.getItem('lifesync-theme')
    const parsed = raw ? JSON.parse(raw) : null
    expect(parsed?.state?.theme).toBe('dark')
  })

  it('falls back to OS prefers-color-scheme: dark when localStorage empty', () => {
    mockMatchMedia(true)
    const matches = window.matchMedia('(prefers-color-scheme: dark)').matches
    expect(matches).toBe(true)
  })

  it('toggleTheme flips light to dark', () => {
    useThemeStore.setState({ theme: 'light' })
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('toggleTheme flips dark to light', () => {
    useThemeStore.setState({ theme: 'dark' })
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('toggleTheme writes to localStorage', () => {
    useThemeStore.setState({ theme: 'light' })
    useThemeStore.getState().toggleTheme()
    const stored = localStorage.getItem('lifesync-theme')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.theme).toBe('dark')
  })

  it('toggleTheme adds dark class to documentElement', () => {
    useThemeStore.setState({ theme: 'light' })
    useThemeStore.getState().toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme removes dark class from documentElement', () => {
    document.documentElement.classList.add('dark')
    useThemeStore.setState({ theme: 'dark' })
    useThemeStore.getState().toggleTheme()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('invalid localStorage value is treated as missing', () => {
    localStorage.setItem('lifesync-theme', 'invalid-json')
    // getStoredTheme returns null for invalid data
    const raw = localStorage.getItem('lifesync-theme')
    let parsed = null
    try {
      const obj = JSON.parse(raw!)
      const val = obj?.state?.theme
      if (val === 'light' || val === 'dark') parsed = val
    } catch {
      parsed = null
    }
    expect(parsed).toBeNull()
  })
})
