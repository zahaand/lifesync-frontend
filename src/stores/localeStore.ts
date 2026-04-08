import { create } from 'zustand'
import i18n from 'i18next'
import { useAuthStore } from '@/stores/authStore'
import { usersApi } from '@/api/users'

type Locale = 'en' | 'ru'

const STORAGE_KEY = 'lifesync-locale'

function getStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'en' || value === 'ru') return value
    return null
  } catch {
    return null
  }
}

function detectBrowserLocale(): Locale {
  try {
    const lang = navigator.language || navigator.languages?.[0] || ''
    if (lang.startsWith('ru')) return 'ru'
  } catch {
    // navigator not available
  }
  return 'en'
}

function applyLocale(locale: Locale) {
  i18n.changeLanguage(locale)
  document.documentElement.lang = locale
}

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // localStorage unavailable
  }
}

function syncToBackend(locale: Locale) {
  const token = useAuthStore.getState().accessToken
  if (token) {
    usersApi.updateUser({ locale }).catch(() => {
      // fire-and-forget — locale saved locally regardless
    })
  }
}

type LocaleState = {
  locale: Locale
  toggleLocale: () => void
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()((set, get) => ({
  locale: getStoredLocale() ?? detectBrowserLocale(),
  toggleLocale: () => {
    const next: Locale = get().locale === 'en' ? 'ru' : 'en'
    applyLocale(next)
    persistLocale(next)
    syncToBackend(next)
    set({ locale: next })
  },
  setLocale: (locale: Locale) => {
    applyLocale(locale)
    persistLocale(locale)
    set({ locale })
  },
}))
