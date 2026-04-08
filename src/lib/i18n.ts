import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'

import enCommon from '@/locales/en/common.json'
import enAuth from '@/locales/en/auth.json'
import enDashboard from '@/locales/en/dashboard.json'
import enHabits from '@/locales/en/habits.json'
import enGoals from '@/locales/en/goals.json'
import enProfile from '@/locales/en/profile.json'
import enValidation from '@/locales/en/validation.json'

import ruCommon from '@/locales/ru/common.json'
import ruAuth from '@/locales/ru/auth.json'
import ruDashboard from '@/locales/ru/dashboard.json'
import ruHabits from '@/locales/ru/habits.json'
import ruGoals from '@/locales/ru/goals.json'
import ruProfile from '@/locales/ru/profile.json'
import ruValidation from '@/locales/ru/validation.json'

function detectLocale(): string {
  try {
    const stored = localStorage.getItem('lifesync-locale')
    if (stored === 'en' || stored === 'ru') return stored
  } catch {
    // localStorage unavailable
  }
  try {
    const lang = navigator.language || navigator.languages?.[0] || ''
    if (lang.startsWith('ru')) return 'ru'
  } catch {
    // navigator not available
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      dashboard: enDashboard,
      habits: enHabits,
      goals: enGoals,
      profile: enProfile,
      validation: enValidation,
    },
    ru: {
      common: ruCommon,
      auth: ruAuth,
      dashboard: ruDashboard,
      habits: ruHabits,
      goals: ruGoals,
      profile: ruProfile,
      validation: ruValidation,
    },
  },
  lng: detectLocale(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

z.setErrorMap((issue) => {
  const t = i18n.t.bind(i18n)

  if (issue.code === 'too_small') {
    if (issue.minimum === 1) {
      return { message: t('validation:required') }
    }
    return { message: t('validation:minLength', { min: issue.minimum }) }
  }

  if (issue.code === 'too_big') {
    return { message: t('validation:maxLength', { max: issue.maximum }) }
  }

  if (issue.code === 'invalid_format') {
    if (issue.format === 'email') {
      return { message: t('validation:email') }
    }
    return { message: t('validation:invalidFormat') }
  }

  if (issue.code === 'invalid_type') {
    return { message: t('validation:required') }
  }

  return { message: t('validation:invalidFormat') }
})

export default i18n
