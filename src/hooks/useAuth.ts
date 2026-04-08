import {useMutation} from '@tanstack/react-query'
import {useNavigate} from 'react-router-dom'
import {AxiosError} from 'axios'
import i18n from 'i18next'
import {authApi} from '@/api/auth'
import {useAuthStore} from '@/stores/authStore'
import {useLocaleStore} from '@/stores/localeStore'
import type {RegisterRequest, LoginRequest, ConflictError, ValidationError} from '@/types/auth'
import type {UseFormSetError} from 'react-hook-form'

export function useRegister(setError: UseFormSetError<RegisterRequest>) {
    return useMutation({
        mutationFn: authApi.register,
        onError: (error: AxiosError<ConflictError | ValidationError>) => {
            const status = error.response?.status
            const data = error.response?.data

            if (status === 409 && data && 'field' in data) {
                const conflict = data as ConflictError
                const fieldName = conflict.field as keyof RegisterRequest
                if (fieldName === 'email' || fieldName === 'username') {
                    setError(fieldName, {message: conflict.message})
                }
            } else if (status === 422 && data && 'errors' in data) {
                const validation = data as ValidationError
                for (const err of validation.errors) {
                    const fieldName = err.field as keyof RegisterRequest
                    if (fieldName === 'email' || fieldName === 'username' || fieldName === 'password') {
                        setError(fieldName, {message: err.message})
                    }
                }
            } else {
                setError('root', {message: i18n.t('auth:error.generic')})
            }
        },
    })
}

export function useLogin(setError: UseFormSetError<LoginRequest>) {
    const setTokens = useAuthStore((s) => s.setTokens)
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setTokens(data.accessToken, data.refreshToken, data.user)

            const userLocale = (data.user as { locale?: string | null }).locale
            if (userLocale === 'en' || userLocale === 'ru') {
                useLocaleStore.getState().setLocale(userLocale)
            }

            const params = new URLSearchParams(window.location.search)
            const returnUrl = params.get('returnUrl')
            const safeUrl = returnUrl && returnUrl.startsWith('/') && !returnUrl.includes('://') && !returnUrl.startsWith('//')
                ? returnUrl
                : '/dashboard'
            navigate(safeUrl, {replace: true})
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const status = error.response?.status

            if (status === 401) {
                setError('root', {message: i18n.t('auth:error.invalidCredentials')})
            } else if (status === 403) {
                setError('root', {message: i18n.t('auth:error.accountSuspended')})
            } else {
                setError('root', {message: i18n.t('auth:error.generic')})
            }
        },
    })
}

export function useLogout() {
    const getRefreshToken = useAuthStore((s) => s.getRefreshToken)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => {
            const token = getRefreshToken()
            return token ? authApi.logout(token) : Promise.resolve()
        },
        onSettled: () => {
            clearAuth()
            navigate('/login', {replace: true})
        },
    })
}
