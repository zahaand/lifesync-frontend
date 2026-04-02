import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (accessToken: string, refreshToken: string, user: User) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  getRefreshToken: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
      getRefreshToken: () => get().refreshToken,
    }),
    {
      name: 'lifesync-auth',
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
)

export const selectIsAuthenticated = (state: AuthState) =>
  state.accessToken !== null || state.refreshToken !== null
