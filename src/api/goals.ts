import { apiClient } from '@/api/client'
import type {
  GoalPageResponse,
  GoalDetail,
  Goal,
  Milestone,
  GoalHabitLink,
  CreateGoalRequest,
  UpdateGoalRequest,
  UpdateGoalProgressRequest,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  LinkHabitRequest,
} from '@/types/goals'

type GetGoalsParams = {
  status?: string
  page?: number
  size?: number
  sort?: string
}

export const goalsApi = {
  getGoals: async (params?: GetGoalsParams): Promise<GoalPageResponse> => {
    const res = await apiClient.get('/goals', { params })
    return res.data
  },

  getGoalDetail: async (id: string): Promise<GoalDetail> => {
    const res = await apiClient.get<GoalDetail>(`/goals/${id}`)
    return res.data
  },

  createGoal: async (data: CreateGoalRequest): Promise<Goal> => {
    const res = await apiClient.post<Goal>('/goals', data)
    return res.data
  },

  updateGoal: async (id: string, data: UpdateGoalRequest): Promise<Goal> => {
    const res = await apiClient.patch<Goal>(`/goals/${id}`, data)
    return res.data
  },

  deleteGoal: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`)
  },

  updateGoalProgress: async (id: string, data: UpdateGoalProgressRequest): Promise<Goal> => {
    const res = await apiClient.patch<Goal>(`/goals/${id}/progress`, data)
    return res.data
  },

  addMilestone: async (goalId: string, data: CreateMilestoneRequest): Promise<Milestone> => {
    const res = await apiClient.post<Milestone>(`/goals/${goalId}/milestones`, data)
    return res.data
  },

  updateMilestone: async (
    goalId: string,
    milestoneId: string,
    data: UpdateMilestoneRequest,
  ): Promise<Milestone> => {
    const res = await apiClient.patch<Milestone>(
      `/goals/${goalId}/milestones/${milestoneId}`,
      data,
    )
    return res.data
  },

  deleteMilestone: async (goalId: string, milestoneId: string): Promise<void> => {
    await apiClient.delete(`/goals/${goalId}/milestones/${milestoneId}`)
  },

  linkHabit: async (goalId: string, data: LinkHabitRequest): Promise<GoalHabitLink> => {
    const res = await apiClient.post<GoalHabitLink>(`/goals/${goalId}/habits`, data)
    return res.data
  },

  unlinkHabit: async (goalId: string, habitId: string): Promise<void> => {
    await apiClient.delete(`/goals/${goalId}/habits/${habitId}`)
  },
}
