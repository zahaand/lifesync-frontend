export type Habit = {
  id: string
  name: string
  frequency: string
  status: string
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
