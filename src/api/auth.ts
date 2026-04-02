import { apiClient } from '@/api/client'
import type { RegisterRequest, LoginRequest, TokenResponse } from '@/types/auth'

export const authApi = {
  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post('/auth/register', data)
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', { refreshToken })
    return response.data
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken })
  },
}
