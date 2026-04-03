import { apiClient } from '@/api/client'
import type { GoalPageResponse } from '@/types/goals'

type GetGoalsParams = {
  status?: string
  page?: number
  size?: number
  sort?: string
}

export const goalsApi = {
  getGoals: async (params?: GetGoalsParams): Promise<GoalPageResponse> => {
    const res = await apiClient.get('/goals', { params })
    return res.data
  },
}
