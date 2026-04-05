import { apiClient } from '@/api/client'
import type {
  HabitPageResponse,
  HabitLog,
  Habit,
  CreateHabitRequest,
  UpdateHabitRequest,
} from '@/types/habits'

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

  createHabit: async (data: CreateHabitRequest): Promise<Habit> => {
    const res = await apiClient.post('/habits', data)
    return res.data
  },

  updateHabit: async (id: string, data: UpdateHabitRequest): Promise<Habit> => {
    const res = await apiClient.patch(`/habits/${id}`, data)
    return res.data
  },

  deleteHabit: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`)
  },

  completeHabit: async (habitId: string): Promise<HabitLog> => {
    const res = await apiClient.post(`/habits/${habitId}/complete`)
    return res.data
  },

  uncompleteHabit: async (habitId: string, logId: string): Promise<void> => {
    await apiClient.delete(`/habits/${habitId}/complete/${logId}`)
  },
}
