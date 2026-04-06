import { apiClient } from '@/api/client'
import type { HabitLogPageResponse } from '@/types/habitLogs'

type GetHabitLogsParams = {
  page?: number
  size?: number
}

export const habitLogsApi = {
  getHabitLogs: async (
    habitId: string,
    params?: GetHabitLogsParams,
  ): Promise<HabitLogPageResponse> => {
    const res = await apiClient.get(`/habits/${habitId}/logs`, { params })
    return res.data
  },
}
