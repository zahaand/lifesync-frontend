import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useHabitLogs } from '@/hooks/useHabitLogs'
import { createWrapper } from '@/test/test-utils'

describe('useHabitLogs', () => {
  it('fetches first page of logs', async () => {
    const { result } = renderHook(() => useHabitLogs('habit-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const logs = result.current.data?.pages[0].content
    expect(logs).toHaveLength(2)
    expect(logs?.[0].date).toBe('2026-04-06')
  })

  it('reports hasNextPage when more pages exist', async () => {
    const { result } = renderHook(() => useHabitLogs('habit-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasNextPage).toBe(true)
  })

  it('is disabled when habitId is null', () => {
    const { result } = renderHook(() => useHabitLogs(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
  })
})
