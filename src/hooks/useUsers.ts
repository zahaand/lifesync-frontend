import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import i18n from 'i18next'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/stores/authStore'
import type { UpdateUserRequest, UpdateTelegramRequest } from '@/types/users'
import type { User } from '@/types/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: usersApi.getCurrentUser,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateUser(data),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
      const user: User = {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.displayName,
      }
      useAuthStore.getState().setUser(user)
      toast.success(i18n.t('profile:message.updated'))
    },
    onError: () => {
      toast.error(i18n.t('profile:message.updateFailed'))
    },
  })
}

export function useUpdateTelegram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTelegramRequest) => usersApi.updateTelegram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
      toast.success(i18n.t('profile:message.telegramLinked'))
    },
    onError: () => {
      toast.error(i18n.t('profile:message.telegramLinkFailed'))
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: () => {
      useAuthStore.getState().clearAuth()
      queryClient.clear()
      navigate('/login')
    },
    onError: () => {
      toast.error(i18n.t('profile:message.deleteFailed'))
    },
  })
}
