export type HabitLog = {
  id: string
  habitId: string
  date: string
  note: string | null
  createdAt: string
}

export type HabitLogPageResponse = {
  content: HabitLog[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}
