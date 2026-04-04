import { apiClient } from '@/api/client'
import type { HabitPageResponse, HabitLog } from '@/types/habits'

type GetHabitsParams = {
  status?: string
  page?: number
  size?: number
}

export const habitsApi = {
  getHabits: async (params?: GetHabitsParams): Promise<HabitPageResponse> => {
    const res = await apiClient.get('/habits', { params })
    return res.data
  },

  completeHabit: async (habitId: string): Promise<HabitLog> => {
    const res = await apiClient.post(`/habits/${habitId}/complete`)
    return res.data
  },

  uncompleteHabit: async (habitId: string, logId: string): Promise<void> => {
    await apiClient.delete(`/habits/${habitId}/complete/${logId}`)
  },
}
