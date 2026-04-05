import { z } from 'zod'
import type { User } from '@/types/auth'

// --- Types ---

export type UserProfile = User & {
  telegramChatId: string | null
}

export type UpdateUserRequest = {
  username?: string
}

export type UpdateTelegramRequest = {
  telegramChatId: string
}

// --- Zod Schemas ---

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens, and underscores'),
})

export const updateTelegramSchema = z.object({
  telegramChatId: z
    .string()
    .min(1, 'Chat ID is required')
    .regex(/^\d+$/, 'Chat ID must contain only digits'),
})
