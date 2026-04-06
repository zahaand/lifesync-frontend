import { http, HttpResponse } from 'msw'
import type { UserProfile } from '@/types/users'

const BASE = '*/api/v1'

export function createMockUser(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    telegramChatId: null,
    ...overrides,
  }
}

export const usersHandlers = [
  http.get(`${BASE}/users/me`, () => {
    return HttpResponse.json(createMockUser())
  }),

  http.patch(`${BASE}/users/me`, async ({ request }) => {
    const body = (await request.json()) as Partial<UserProfile>
    return HttpResponse.json(createMockUser(body))
  }),

  http.put(`${BASE}/users/me/telegram`, async ({ request }) => {
    const body = (await request.json()) as { telegramChatId: string }
    return HttpResponse.json(createMockUser({ telegramChatId: body.telegramChatId }))
  }),

  http.delete(`${BASE}/users/me`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
