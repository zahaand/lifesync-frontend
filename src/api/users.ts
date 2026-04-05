import { apiClient } from '@/api/client'
import type { UserProfile, UpdateUserRequest, UpdateTelegramRequest } from '@/types/users'

export const usersApi = {
  getCurrentUser: async (): Promise<UserProfile> => {
    const res = await apiClient.get('/users/me')
    return res.data
  },

  updateUser: async (data: UpdateUserRequest): Promise<UserProfile> => {
    const res = await apiClient.patch('/users/me', data)
    return res.data
  },

  updateTelegram: async (data: UpdateTelegramRequest): Promise<UserProfile> => {
    const res = await apiClient.put('/users/me/telegram', data)
    return res.data
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me')
  },
}
