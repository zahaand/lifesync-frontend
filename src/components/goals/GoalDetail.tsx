import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import GoalProgressSection from '@/components/goals/GoalProgress'
import GoalMilestones from '@/components/goals/GoalMilestones'
import GoalLinkedHabits from '@/components/goals/GoalLinkedHabits'
import { useGoalDetail } from '@/hooks/useGoals'
import type { Goal } from '@/types/goals'

type GoalDetailProps = {
  goalId: string
  listGoal: Goal | undefined
  onEdit: () => void
  onDelete: () => void
}

export default function GoalDetail({ goalId, listGoal, onEdit, onDelete }: GoalDetailProps) {
  const { data: detail, isLoading } = useGoalDetail(goalId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  const goal = listGoal
  if (!goal) return null

  const linkedHabitIds = detail?.linkedHabitIds ?? []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-[#2C2C2A] dark:text-zinc-50">{goal.title}</h2>
          {goal.description && (
            <p className="mt-1 text-[13px] text-[#9E9B94] dark:text-zinc-500">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[#E8E6DF] dark:border-zinc-800"
            onClick={onEdit}
          >
            <Pencil className="size-4 text-[#666360] dark:text-zinc-500" />
          </Button>
          <Button
            data-testid="goal-delete-button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[#FCA5A5]"
            onClick={onDelete}
          >
            <Trash2 className="size-4 text-red-400" />
          </Button>
        </div>
      </div>

      {/* Progress — key forces remount to reset input on goal switch */}
      <GoalProgressSection key={`${goal.id}-${goal.progress}`} goal={goal} />

      {/* Milestones */}
      <GoalMilestones goalId={goal.id} milestones={goal.milestones} />

      {/* Linked Habits */}
      <GoalLinkedHabits goalId={goal.id} linkedHabitIds={linkedHabitIds} />
    </div>
  )
}
