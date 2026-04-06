import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCurrentUser, useUpdateProfile, useUpdateTelegram, useDeleteAccount } from '@/hooks/useUsers'
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

describe('useCurrentUser', () => {
  it('fetches user profile', async () => {
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.username).toBe('testuser')
    expect(result.current.data?.email).toBe('test@example.com')
    expect(result.current.data?.displayName).toBe('Test User')
  })
})

describe('useUpdateProfile', () => {
  it('updates profile successfully', async () => {
    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.mutate({ displayName: 'Updated Name' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateTelegram', () => {
  it('links telegram successfully', async () => {
    const { result } = renderHook(() => useUpdateTelegram(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.mutate({ telegramChatId: '12345' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteAccount', () => {
  it('deletes account and navigates to login', async () => {
    useAuthStore.getState().setTokens('t', 'r', {
      id: '1',
      email: 'a@b.com',
      username: 'u',
      displayName: null,
    })

    const { result } = renderHook(() => useDeleteAccount(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
