import { authHandlers } from './auth'
import { habitsHandlers } from './habits'
import { goalsHandlers } from './goals'
import { usersHandlers } from './users'

export { createMockHabit } from './habits'
export { createMockGoal } from './goals'
export { createMockUser } from './users'

export const handlers = [
  ...authHandlers,
  ...habitsHandlers,
  ...goalsHandlers,
  ...usersHandlers,
]
