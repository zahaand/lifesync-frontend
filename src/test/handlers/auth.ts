import { http, HttpResponse } from 'msw'

const BASE = '*/api/v1'

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
}

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; password: string }
    if (body.password === 'wrongpassword') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: mockUser,
    })
  }),

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { username: string; email: string }
    if (body.username === 'taken') {
      return HttpResponse.json({ field: 'username', message: 'Username already taken' }, { status: 409 })
    }
    return HttpResponse.json(
      { id: 'user-new', username: body.username, email: body.email },
      { status: 201 },
    )
  }),

  http.post(`${BASE}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string }
    if (body.refreshToken === 'invalid') {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
    }
    return HttpResponse.json({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: mockUser,
    })
  }),

  http.post(`${BASE}/auth/logout`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
]
