export type GoalStatus = 'ACTIVE' | 'COMPLETED'

export type Milestone = {
  id: string
  name: string
  completed: boolean
}

export type Goal = {
  id: string
  name: string
  progress: number
  targetDate: string | null
  status: GoalStatus
  milestones: Milestone[]
}

export type GoalPageResponse = {
  content: Goal[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
