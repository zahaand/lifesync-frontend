import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { goalsApi } from '@/api/goals'
import type {
  CreateGoalRequest,
  UpdateGoalRequest,
  UpdateGoalProgressRequest,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  LinkHabitRequest,
} from '@/types/goals'

type UseGoalsParams = {
  status?: string
  size?: number
  sort?: string
}

export function useGoals(params: UseGoalsParams) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => goalsApi.getGoals(params),
  })
}

export function useAllGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: () => goalsApi.getGoals({ size: 100 }),
  })
}

export function useGoalDetail(goalId: string | null) {
  return useQuery({
    queryKey: ['goals', goalId],
    queryFn: () => goalsApi.getGoalDetail(goalId!),
    enabled: !!goalId,
  })
}

export function useGoalsSummary() {
  const activeQuery = useGoals({ status: 'ACTIVE', size: 5, sort: 'targetDate,asc' })
  const completedQuery = useGoals({ status: 'COMPLETED', size: 1 })

  return {
    activeGoals: activeQuery.data?.content ?? [],
    activeCount: activeQuery.data?.totalElements ?? 0,
    completedCount: completedQuery.data?.totalElements ?? 0,
    isLoading: activeQuery.isLoading || completedQuery.isLoading,
    isError: activeQuery.isError || completedQuery.isError,
    activeIsLoading: activeQuery.isLoading,
    activeIsError: activeQuery.isError,
    completedIsLoading: completedQuery.isLoading,
    refetchActive: activeQuery.refetch,
    refetchCompleted: completedQuery.refetch,
  }
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Goal created')
    },
    onError: () => {
      toast.error('Failed to create goal')
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalRequest }) =>
      goalsApi.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Goal updated')
    },
    onError: () => {
      toast.error('Failed to update goal')
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Goal deleted')
    },
    onError: () => {
      toast.error('Failed to delete goal')
    },
  })
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalProgressRequest }) =>
      goalsApi.updateGoalProgress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Progress updated')
    },
    onError: () => {
      toast.error('Failed to update progress')
    },
  })
}

export function useAddMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: CreateMilestoneRequest }) =>
      goalsApi.addMilestone(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Milestone added')
    },
    onError: () => {
      toast.error('Failed to add milestone')
    },
  })
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      goalId,
      milestoneId,
      data,
    }: {
      goalId: string
      milestoneId: string
      data: UpdateMilestoneRequest
    }) => goalsApi.updateMilestone(goalId, milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
    onError: () => {
      toast.error('Failed to update milestone')
    },
  })
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      goalsApi.deleteMilestone(goalId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Milestone removed')
    },
    onError: () => {
      toast.error('Failed to remove milestone')
    },
  })
}

export function useLinkHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: LinkHabitRequest }) =>
      goalsApi.linkHabit(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Habit linked')
    },
    onError: () => {
      toast.error('Failed to link habit')
    },
  })
}

export function useUnlinkHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, habitId }: { goalId: string; habitId: string }) =>
      goalsApi.unlinkHabit(goalId, habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Habit unlinked')
    },
    onError: () => {
      toast.error('Failed to unlink habit')
    },
  })
}
