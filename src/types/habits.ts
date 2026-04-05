export type HabitFrequency = 'DAILY' | 'WEEKLY' | 'CUSTOM'

export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED'

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type Habit = {
  id: string
  name: string
  description: string | null
  frequency: HabitFrequency
  status: HabitStatus
  isActive: boolean
  targetDaysOfWeek: DayOfWeek[] | null
  reminderTime: string | null
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

export type CreateHabitRequest = {
  name: string
  description?: string
  frequency: HabitFrequency
  targetDaysOfWeek?: DayOfWeek[]
  reminderTime?: string
}

export type UpdateHabitRequest = {
  name?: string
  description?: string
  frequency?: HabitFrequency
  targetDaysOfWeek?: DayOfWeek[]
  reminderTime?: string
  isActive?: boolean
}
