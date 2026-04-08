import { z } from 'zod'

// --- Zod Schemas ---

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_-]+$/),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
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
