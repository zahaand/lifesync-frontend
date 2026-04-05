import { z } from 'zod'
import type { User } from '@/types/auth'

// --- Types ---

export type UserProfile = User & {
  telegramChatId: string | null
}

export type UpdateUserRequest = {
  displayName?: string | null
}

export type UpdateTelegramRequest = {
  telegramChatId: string
}

// --- Zod Schemas ---

export const updateProfileSchema = z.object({
  displayName: z.string().max(100, 'Display name must be at most 100 characters'),
})

export const updateTelegramSchema = z.object({
  telegramChatId: z
    .string()
    .min(1, 'Chat ID is required')
    .regex(/^\d+$/, 'Chat ID must contain only digits'),
})
