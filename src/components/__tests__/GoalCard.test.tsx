import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GoalCard from '@/components/goals/GoalCard'
import type { Goal } from '@/types/goals'

const activeGoal: Goal = {
  id: 'goal-1',
  title: 'Learn TypeScript',
  description: 'Master TS',
  status: 'ACTIVE',
  progress: 45,
  targetDate: '2026-12-31',
  milestones: [
    { id: 'm1', title: 'Basics', completed: true },
    { id: 'm2', title: 'Advanced', completed: false },
  ],
  createdAt: '2026-01-01T00:00:00Z',
}

const completedGoal: Goal = {
  ...activeGoal,
  id: 'goal-2',
  title: 'Read 12 Books',
  status: 'COMPLETED',
  progress: 100,
}

describe('GoalCard', () => {
  it('renders title and progress percentage', () => {
    render(<GoalCard goal={activeGoal} isSelected={false} onClick={vi.fn()} />)

    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('shows Active badge for active goal', () => {
    render(<GoalCard goal={activeGoal} isSelected={false} onClick={vi.fn()} />)

    expect(screen.getByText('card.active')).toBeInTheDocument()
  })

  it('shows Completed badge for completed goal', () => {
    render(<GoalCard goal={completedGoal} isSelected={false} onClick={vi.fn()} />)

    expect(screen.getByText('card.completed')).toBeInTheDocument()
  })

  it('shows milestones count', () => {
    render(<GoalCard goal={activeGoal} isSelected={false} onClick={vi.fn()} />)

    expect(screen.getByText('card.milestone')).toBeInTheDocument()
  })

  it('shows linked habits count when provided', () => {
    render(<GoalCard goal={activeGoal} isSelected={false} linkedHabitsCount={3} onClick={vi.fn()} />)

    expect(screen.getByText('card.linkedHabit')).toBeInTheDocument()
  })
})
