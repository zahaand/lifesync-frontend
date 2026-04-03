import { useQuery } from '@tanstack/react-query'
import { goalsApi } from '@/api/goals'

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
