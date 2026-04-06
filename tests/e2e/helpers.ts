import { request } from '@playwright/test'

const API_BASE = 'http://localhost:8080/api/v1/'

export function generateUser() {
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return {
    username: `test-${ts}-${rand}`,
    email: `test-${ts}-${rand}@e2e.local`,
    password: 'TestPass123!',
  }
}

export async function registerUser(user: { username: string; email: string; password: string }) {
  const ctx = await request.newContext({ baseURL: API_BASE })
  const res = await ctx.post('auth/register', { data: user })
  if (!res.ok()) throw new Error(`Register failed: ${res.status()}`)
  await ctx.dispose()
}

export async function loginUser(user: { email: string; password: string }) {
  const ctx = await request.newContext({ baseURL: API_BASE })
  const res = await ctx.post('auth/login', {
    data: { identifier: user.email, password: user.password },
  })
  if (!res.ok()) throw new Error(`Login failed: ${res.status()}`)
  const body = await res.json()
  await ctx.dispose()
  return body as { accessToken: string; refreshToken: string; user: { id: string } }
}

export async function deleteUser(accessToken: string) {
  const ctx = await request.newContext({
    baseURL: API_BASE,
    extraHTTPHeaders: { Authorization: `Bearer ${accessToken}` },
  })
  await ctx.delete('users/me')
  await ctx.dispose()
}
