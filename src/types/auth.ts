import { z } from 'zod'

// --- Zod Schemas ---

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// --- Types (inferred from schemas + API responses) ---

export type RegisterRequest = z.infer<typeof registerSchema>

export type LoginRequest = z.infer<typeof loginSchema>

export type User = {
  id: string
  email: string
  username: string
  displayName: string | null
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type ConflictError = {
  field: string
  message: string
}

export type ValidationError = {
  errors: Array<{
    field: string
    message: string
  }>
}

export type GenericError = {
  message: string
}
