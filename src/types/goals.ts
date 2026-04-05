export type GoalStatus = 'ACTIVE' | 'COMPLETED'

export type Milestone = {
  id: string
  title: string
  completed: boolean
}

export type Goal = {
  id: string
  title: string
  description: string | null
  progress: number
  targetDate: string | null
  status: GoalStatus
  milestones: Milestone[]
  createdAt: string
}

export type GoalDetail = Goal & {
  linkedHabitIds: string[]
}

export type GoalPageResponse = {
  content: Goal[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type CreateGoalRequest = {
  title: string
  description?: string
  targetDate?: string
}

export type UpdateGoalRequest = {
  title?: string
  description?: string
  targetDate?: string
  status?: GoalStatus
}

export type UpdateGoalProgressRequest = {
  progress: number
}

export type CreateMilestoneRequest = {
  title: string
}

export type UpdateMilestoneRequest = {
  completed: boolean
}

export type LinkHabitRequest = {
  habitId: string
}

export type GoalHabitLink = {
  id: string
  goalId: string
  habitId: string
  createdAt: string
}
