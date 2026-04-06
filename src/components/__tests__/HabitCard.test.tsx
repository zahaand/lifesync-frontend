import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import HabitCard from '@/components/habits/HabitCard'
import type { Habit } from '@/types/habits'

vi.mock('@/hooks/useIsMobile', () => ({ default: () => false }))

const baseHabit: Habit = {
  id: 'habit-1',
  title: 'Morning Run',
  description: null,
  frequency: 'DAILY',
  status: 'ACTIVE',
  isActive: true,
  targetDaysOfWeek: null,
  reminderTime: null,
  completedToday: false,
  todayLogId: null,
  currentStreak: 5,
}

const noop = vi.fn()
const defaultProps = {
  habit: baseHabit,
  onComplete: vi.fn(),
  onUncomplete: noop,
  onEdit: noop,
  onArchive: noop,
  onRestore: noop,
  onDelete: noop,
  onHistory: noop,
}

describe('HabitCard', () => {
  it('renders title and streak badge', () => {
    render(<HabitCard {...defaultProps} />)

    expect(screen.getByText('Morning Run')).toBeInTheDocument()
    expect(screen.getByText(/5 day streak/)).toBeInTheDocument()
  })

  it('triggers onComplete when checkbox clicked', async () => {
    const onComplete = vi.fn()
    const user = userEvent.setup()
    render(<HabitCard {...defaultProps} onComplete={onComplete} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onComplete).toHaveBeenCalledWith('habit-1')
  })

  it('shows line-through when completed', () => {
    const completedHabit = { ...baseHabit, completedToday: true, todayLogId: 'log-1' }
    render(<HabitCard {...defaultProps} habit={completedHabit} />)

    const title = screen.getByText('Morning Run')
    expect(title).toHaveClass('line-through')
  })
})
