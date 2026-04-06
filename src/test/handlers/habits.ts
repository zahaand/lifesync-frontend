import { http, HttpResponse } from 'msw'
import type { Habit, HabitPageResponse } from '@/types/habits'
import type { HabitLogPageResponse } from '@/types/habitLogs'

const BASE = '*/api/v1'

export function createMockHabit(overrides?: Partial<Habit>): Habit {
  return {
    id: 'habit-1',
    title: 'Morning Run',
    description: 'Run 5km every morning',
    frequency: 'DAILY',
    status: 'ACTIVE',
    isActive: true,
    targetDaysOfWeek: null,
    reminderTime: null,
    completedToday: false,
    todayLogId: null,
    currentStreak: 3,
    ...overrides,
  }
}

const mockHabits: Habit[] = [
  createMockHabit(),
  createMockHabit({
    id: 'habit-2',
    title: 'Read Book',
    description: null,
    frequency: 'DAILY',
    completedToday: true,
    todayLogId: 'log-1',
    currentStreak: 7,
  }),
]

export const habitsHandlers = [
  http.get(`${BASE}/habits`, () => {
    const response: HabitPageResponse = {
      content: mockHabits,
      totalElements: mockHabits.length,
      totalPages: 1,
      number: 0,
      size: 100,
    }
    return HttpResponse.json(response)
  }),

  http.post(`${BASE}/habits`, async ({ request }) => {
    const body = (await request.json()) as { title: string; frequency: string; targetDaysOfWeek?: string[] }
    if (body.frequency === 'CUSTOM' && !body.targetDaysOfWeek?.length) {
      return HttpResponse.json({ message: 'Custom habits require target days' }, { status: 400 })
    }
    return HttpResponse.json(
      createMockHabit({ id: 'habit-new', title: body.title, frequency: body.frequency as Habit['frequency'] }),
      { status: 201 },
    )
  }),

  http.patch(`${BASE}/habits/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Habit>
    return HttpResponse.json(createMockHabit({ id: params.id as string, ...body }))
  }),

  http.delete(`${BASE}/habits/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE}/habits/:id/complete`, ({ params }) => {
    return HttpResponse.json(
      { id: 'log-new', habitId: params.id, completedAt: new Date().toISOString() },
      { status: 201 },
    )
  }),

  http.delete(`${BASE}/habits/:id/complete/:logId`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${BASE}/habits/:id/logs`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '0')
    const response: HabitLogPageResponse = {
      content: [
        { id: 'log-1', habitId: 'habit-1', date: '2026-04-06', note: null, createdAt: '2026-04-06T07:14:00Z' },
        { id: 'log-2', habitId: 'habit-1', date: '2026-04-05', note: null, createdAt: '2026-04-05T08:30:00Z' },
      ],
      totalElements: 4,
      totalPages: 2,
      page,
      size: 2,
    }
    return HttpResponse.json(response)
  }),
]
