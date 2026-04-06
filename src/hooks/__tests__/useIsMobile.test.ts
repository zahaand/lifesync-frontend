import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useIsMobile from '@/hooks/useIsMobile'

describe('useIsMobile', () => {
  let listeners: Array<(e: MediaQueryListEvent) => void> = []
  let matches = false

  beforeEach(() => {
    listeners = []
    matches = true

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        addEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
          listeners.push(handler)
        },
        removeEventListener: (_event: string, handler: (e: MediaQueryListEvent) => void) => {
          listeners = listeners.filter((l) => l !== handler)
        },
      })),
    })
  })

  afterEach(() => {
    listeners = []
  })

  it('returns true when viewport is mobile', () => {
    matches = true
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false when viewport is desktop', () => {
    matches = false
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('updates when media query changes', () => {
    matches = false
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      for (const listener of listeners) {
        listener({ matches: true } as MediaQueryListEvent)
      }
    })

    expect(result.current).toBe(true)
  })
})
