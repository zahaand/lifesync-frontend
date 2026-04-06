import { http, HttpResponse } from 'msw'
import type { Goal, GoalDetail, GoalPageResponse } from '@/types/goals'

const BASE = '*/api/v1'

export function createMockGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: 'goal-1',
    title: 'Learn TypeScript',
    description: 'Master advanced TypeScript patterns',
    progress: 40,
    targetDate: '2026-06-01',
    status: 'ACTIVE',
    milestones: [
      { id: 'ms-1', title: 'Read handbook', completed: true },
      { id: 'ms-2', title: 'Build project', completed: false },
    ],
    createdAt: '2026-03-01T00:00:00Z',
    ...overrides,
  }
}

const mockGoals: Goal[] = [
  createMockGoal(),
  createMockGoal({
    id: 'goal-2',
    title: 'Run Marathon',
    description: null,
    progress: 100,
    status: 'COMPLETED',
    milestones: [],
  }),
]

export const goalsHandlers = [
  http.get(`${BASE}/goals`, () => {
    const response: GoalPageResponse = {
      content: mockGoals,
      totalElements: mockGoals.length,
      totalPages: 1,
      number: 0,
      size: 100,
    }
    return HttpResponse.json(response)
  }),

  http.get(`${BASE}/goals/:id`, ({ params }) => {
    const goal = mockGoals.find((g) => g.id === params.id) ?? mockGoals[0]
    const detail: GoalDetail = { ...goal, linkedHabitIds: ['habit-1'] }
    return HttpResponse.json(detail)
  }),

  http.post(`${BASE}/goals`, async ({ request }) => {
    const body = (await request.json()) as { title: string }
    return HttpResponse.json(createMockGoal({ id: 'goal-new', title: body.title }), { status: 201 })
  }),

  http.patch(`${BASE}/goals/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Goal>
    return HttpResponse.json(createMockGoal({ id: params.id as string, ...body }))
  }),

  http.delete(`${BASE}/goals/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch(`${BASE}/goals/:id/progress`, async ({ params, request }) => {
    const body = (await request.json()) as { progress: number }
    if (body.progress > 100) {
      return HttpResponse.json({ message: 'Progress cannot exceed 100' }, { status: 400 })
    }
    const status = body.progress >= 100 ? 'COMPLETED' : 'ACTIVE'
    return HttpResponse.json(
      createMockGoal({ id: params.id as string, progress: body.progress, status }),
    )
  }),

  http.post(`${BASE}/goals/:id/milestones`, async ({ request }) => {
    const body = (await request.json()) as { title: string }
    return HttpResponse.json(
      { id: 'ms-new', title: body.title, completed: false },
      { status: 201 },
    )
  }),

  http.patch(`${BASE}/goals/:id/milestones/:mid`, async ({ params, request }) => {
    const body = (await request.json()) as { completed: boolean }
    return HttpResponse.json({ id: params.mid, title: 'Milestone', completed: body.completed })
  }),

  http.delete(`${BASE}/goals/:id/milestones/:mid`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE}/goals/:id/habits`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete(`${BASE}/goals/:id/habits/:hid`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
