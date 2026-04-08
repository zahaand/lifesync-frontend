import { z } from 'zod'
import type { User } from '@/types/auth'

// --- Types ---

export type UserProfile = User & {
  telegramChatId: string | null
  locale: string | null
}

export type UpdateUserRequest = {
  displayName?: string | null
  locale?: string
}

export type UpdateTelegramRequest = {
  telegramChatId: string
}

// --- Zod Schemas ---

export const updateProfileSchema = z.object({
  displayName: z.string().max(100),
})

export const updateTelegramSchema = z.object({
  telegramChatId: z
    .string()
    .min(1)
    .regex(/^\d+$/),
})
