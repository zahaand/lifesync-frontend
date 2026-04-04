export type HabitFrequency = 'DAILY' | 'WEEKLY' | 'CUSTOM'

export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED'

export type Habit = {
  id: string
  name: string
  frequency: HabitFrequency
  status: HabitStatus
  completedToday: boolean
  todayLogId: string | null
  currentStreak: number
}

export type HabitLog = {
  id: string
  habitId: string
  completedAt: string
}

export type HabitPageResponse = {
  content: Habit[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
