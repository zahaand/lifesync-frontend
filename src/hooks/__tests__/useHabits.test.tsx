import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAllHabits, useHabits, useCompleteHabit, useUncompleteHabit, useCreateHabit, useUpdateHabit, useDeleteHabit } from '@/hooks/useHabits'
import { createWrapper, createTestQueryClient } from '@/test/test-utils'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { HabitPageResponse } from '@/types/habits'
import type { ReactNode } from 'react'

describe('useAllHabits', () => {
  it('fetches habits list', async () => {
    const { result } = renderHook(() => useAllHabits(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.content).toHaveLength(2)
    expect(result.current.data?.content[0].title).toBe('Morning Run')
  })
})

describe('useHabits', () => {
  it('fetches active habits', async () => {
    const { result } = renderHook(() => useHabits(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.content).toBeDefined()
  })
})

describe('useCreateHabit', () => {
  it('creates a habit successfully', async () => {
    const { result } = renderHook(() => useCreateHabit(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ title: 'New Habit', frequency: 'DAILY' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateHabit', () => {
  it('updates a habit successfully', async () => {
    const { result } = renderHook(() => useUpdateHabit(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ id: 'habit-1', data: { title: 'Updated' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteHabit', () => {
  it('deletes a habit successfully', async () => {
    const { result } = renderHook(() => useDeleteHabit(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate('habit-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUncompleteHabit', () => {
  it('uncompletes a habit successfully', async () => {
    const queryClient = createTestQueryClient()

    const habitsData: HabitPageResponse = {
      content: [
        {
          id: 'habit-1',
          title: 'Morning Run',
          description: null,
          frequency: 'DAILY',
          status: 'ACTIVE',
          isActive: true,
          targetDaysOfWeek: null,
          reminderTime: null,
          completedToday: true,
          todayLogId: 'log-1',
          currentStreak: 3,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 100,
    }
    queryClient.setQueryData(['habits'], habitsData)

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      )
    }

    const { result } = renderHook(() => useUncompleteHabit(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ habitId: 'habit-1', logId: 'log-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useCompleteHabit', () => {
  it('completes habit and mutation succeeds', async () => {
    const queryClient = createTestQueryClient()

    const habitsData: HabitPageResponse = {
      content: [
        {
          id: 'habit-1',
          title: 'Morning Run',
          description: null,
          frequency: 'DAILY',
          status: 'ACTIVE',
          isActive: true,
          targetDaysOfWeek: null,
          reminderTime: null,
          completedToday: false,
          todayLogId: null,
          currentStreak: 3,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 100,
    }
    queryClient.setQueryData(['habits'], habitsData)

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      )
    }

    const { result } = renderHook(() => useCompleteHabit(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate('habit-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveProperty('id', 'log-new')
  })
})
