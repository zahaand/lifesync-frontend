import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  useAllGoals,
  useGoals,
  useGoalDetail,
  useGoalsSummary,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useUpdateGoalProgress,
  useAddMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
  useLinkHabit,
  useUnlinkHabit,
} from '@/hooks/useGoals'
import { createWrapper } from '@/test/test-utils'

describe('useGoals', () => {
  it('fetches goals with params', async () => {
    const { result } = renderHook(() => useGoals({ status: 'ACTIVE' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.content).toBeDefined()
  })
})

describe('useGoalsSummary', () => {
  it('returns active and completed counts', async () => {
    const { result } = renderHook(() => useGoalsSummary(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.activeCount).toBeGreaterThanOrEqual(0)
    expect(result.current.completedCount).toBeGreaterThanOrEqual(0)
  })
})

describe('useAllGoals', () => {
  it('fetches goals list', async () => {
    const { result } = renderHook(() => useAllGoals(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.content).toHaveLength(2)
    expect(result.current.data?.content[0].title).toBe('Learn TypeScript')
  })
})

describe('useGoalDetail', () => {
  it('fetches single goal with linkedHabitIds', async () => {
    const { result } = renderHook(() => useGoalDetail('goal-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.title).toBe('Learn TypeScript')
    expect(result.current.data?.linkedHabitIds).toContain('habit-1')
  })

  it('is disabled when goalId is null', () => {
    const { result } = renderHook(() => useGoalDetail(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
  })
})

describe('useCreateGoal', () => {
  it('creates a goal successfully', async () => {
    const { result } = renderHook(() => useCreateGoal(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ title: 'New Goal', description: 'Desc', targetDate: '2026-12-31' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateGoal', () => {
  it('updates a goal', async () => {
    const { result } = renderHook(() => useUpdateGoal(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ id: 'goal-1', data: { title: 'Updated' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteGoal', () => {
  it('deletes a goal successfully', async () => {
    const { result } = renderHook(() => useDeleteGoal(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate('goal-1')
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateGoalProgress', () => {
  it('updates goal progress', async () => {
    const { result } = renderHook(() => useUpdateGoalProgress(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ id: 'goal-1', data: { progress: 50 } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAddMilestone', () => {
  it('adds a milestone', async () => {
    const { result } = renderHook(() => useAddMilestone(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ goalId: 'goal-1', data: { title: 'Step 1' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateMilestone', () => {
  it('updates a milestone', async () => {
    const { result } = renderHook(() => useUpdateMilestone(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ goalId: 'goal-1', milestoneId: 'ms-1', data: { completed: true } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteMilestone', () => {
  it('deletes a milestone', async () => {
    const { result } = renderHook(() => useDeleteMilestone(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ goalId: 'goal-1', milestoneId: 'ms-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useLinkHabit', () => {
  it('links a habit to a goal', async () => {
    const { result } = renderHook(() => useLinkHabit(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ goalId: 'goal-1', data: { habitId: 'habit-1' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUnlinkHabit', () => {
  it('unlinks a habit from a goal', async () => {
    const { result } = renderHook(() => useUnlinkHabit(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({ goalId: 'goal-1', habitId: 'habit-1' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
