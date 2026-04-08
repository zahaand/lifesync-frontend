import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogin, useLogout } from '@/hooks/useAuth'
import { createWrapper } from '@/test/test-utils'
import { useAuthStore } from '@/stores/authStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  mockNavigate.mockClear()
  useAuthStore.getState().clearAuth()
})

describe('useLogin', () => {
  it('stores tokens and navigates on success', async () => {
    const setError = vi.fn()
    const { result } = renderHook(() => useLogin(setError), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ identifier: 'testuser', password: 'password123' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('mock-access-token')
    expect(state.refreshToken).toBe('mock-refresh-token')
    expect(state.user?.username).toBe('testuser')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  it('sets root error on 401', async () => {
    const setError = vi.fn()
    const { result } = renderHook(() => useLogin(setError), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ identifier: 'testuser', password: 'wrongpassword' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(setError).toHaveBeenCalledWith('root', { message: 'auth:error.invalidCredentials' })
  })
})

describe('useLogout', () => {
  it('clears auth and navigates to login', async () => {
    useAuthStore.getState().setTokens('t', 'r', {
      id: '1',
      email: 'a@b.com',
      username: 'u',
      displayName: null,
    })

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true))

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
