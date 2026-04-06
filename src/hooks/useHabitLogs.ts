import { useInfiniteQuery } from '@tanstack/react-query'
import { habitLogsApi } from '@/api/habitLogs'
import type { HabitLogPageResponse } from '@/types/habitLogs'

const PAGE_SIZE = 20

export function useHabitLogs(habitId: string | null) {
  return useInfiniteQuery<HabitLogPageResponse>({
    queryKey: ['habits', habitId, 'logs'],
    queryFn: ({ pageParam }) =>
      habitLogsApi.getHabitLogs(habitId!, { page: pageParam as number, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    enabled: !!habitId,
  })
}
