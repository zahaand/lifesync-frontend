import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { habitsApi } from '@/api/habits'
import type { HabitPageResponse, CreateHabitRequest, UpdateHabitRequest } from '@/types/habits'

export function useHabits() {
  return useQuery({
    queryKey: ['habits', { status: 'ACTIVE' }],
    queryFn: () => habitsApi.getHabits({ status: 'ACTIVE', size: 100 }),
  })
}

export function useAllHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: () => habitsApi.getHabits({ size: 100 }),
  })
}

export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHabitRequest) => habitsApi.createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit created')
    },
    onError: () => {
      toast.error('Failed to create habit')
    },
  })
}

export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHabitRequest }) =>
      habitsApi.updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
    onError: () => {
      toast.error('Failed to update habit')
    },
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habitId: string) => habitsApi.deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit deleted')
    },
    onError: () => {
      toast.error('Failed to delete habit')
    },
  })
}

export function useCompleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habitId: string) => habitsApi.completeHabit(habitId),
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })

      const dashboardSnapshot = queryClient.getQueryData<HabitPageResponse>([
        'habits',
        { status: 'ACTIVE' },
      ])
      const allSnapshot = queryClient.getQueryData<HabitPageResponse>(['habits'])

      const updateCache = (old: HabitPageResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          content: old.content.map((h) =>
            h.id === habitId ? { ...h, completedToday: true, todayLogId: 'optimistic-temp' } : h,
          ),
        }
      }

      queryClient.setQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }], updateCache)
      queryClient.setQueryData<HabitPageResponse>(['habits'], updateCache)

      return { dashboardSnapshot, allSnapshot }
    },
    onError: (_err, _habitId, context) => {
      if (context?.dashboardSnapshot) {
        queryClient.setQueryData(['habits', { status: 'ACTIVE' }], context.dashboardSnapshot)
      }
      if (context?.allSnapshot) {
        queryClient.setQueryData(['habits'], context.allSnapshot)
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

      const dashboardSnapshot = queryClient.getQueryData<HabitPageResponse>([
        'habits',
        { status: 'ACTIVE' },
      ])
      const allSnapshot = queryClient.getQueryData<HabitPageResponse>(['habits'])

      const updateCache = (old: HabitPageResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          content: old.content.map((h) =>
            h.id === habitId ? { ...h, completedToday: false, todayLogId: null } : h,
          ),
        }
      }

      queryClient.setQueryData<HabitPageResponse>(['habits', { status: 'ACTIVE' }], updateCache)
      queryClient.setQueryData<HabitPageResponse>(['habits'], updateCache)

      return { dashboardSnapshot, allSnapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.dashboardSnapshot) {
        queryClient.setQueryData(['habits', { status: 'ACTIVE' }], context.dashboardSnapshot)
      }
      if (context?.allSnapshot) {
        queryClient.setQueryData(['habits'], context.allSnapshot)
      }
      toast.error('Failed to uncomplete habit', { duration: 3000 })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}
