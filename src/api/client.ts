import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor: silent 401 refresh with mutex
let refreshPromise: Promise<string> | null = null

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const { getRefreshToken, setTokens, clearAuth } =
      useAuthStore.getState()
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post('/auth/refresh', { refreshToken })
          .then((res) => {
            const data = res.data
            setTokens(data.accessToken, data.refreshToken, data.user)
            return data.accessToken as string
          })
      }

      const newAccessToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(originalRequest)
    } catch {
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      refreshPromise = null
    }
  },
)
