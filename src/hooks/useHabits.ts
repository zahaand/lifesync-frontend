import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { habitsApi } from '@/api/habits'
import type { HabitPageResponse } from '@/types/habits'

export function useHabits() {
  return useQuery({
    queryKey: ['habits', { status: 'ACTIVE' }],
    queryFn: () => habitsApi.getHabits({ status: 'ACTIVE', size: 100 }),
  })
}

export function useCompleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habitId: string) => habitsApi.completeHabit(habitId),
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })
      const snapshot = queryClient.getQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }])

      queryClient.setQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }], (old) => {
        if (!old) return old
        return {
          ...old,
          content: old.content.map((h) =>
            h.id === habitId ? { ...h, completedToday: true, todayLogId: 'optimistic-temp' } : h,
          ),
        }
      })

      return { snapshot }
    },
    onError: (_err, _habitId, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(['habits', { status: 'ACTIVE' }], context.snapshot)
      }
      toast.error('Failed to complete habit', { duration: 3000 })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

export function useUncompleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, logId }: { habitId: string; logId: string }) =>
      habitsApi.uncompleteHabit(habitId, logId),
    onMutate: async ({ habitId }) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })
      const snapshot = queryClient.getQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }])

      queryClient.setQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }], (old) => {
        if (!old) return old
        return {
          ...old,
          content: old.content.map((h) =>
            h.id === habitId ? { ...h, completedToday: false, todayLogId: null } : h,
          ),
        }
      })

      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(['habits', { status: 'ACTIVE' }], context.snapshot)
      }
      toast.error('Failed to uncomplete habit', { duration: 3000 })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
