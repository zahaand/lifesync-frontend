import { Card } from '@/components/ui/card'
import GoalProgress from '@/components/shared/GoalProgress'
import type { Goal } from '@/types/goals'

type GoalCardProps = {
  goal: Goal
  isSelected: boolean
  linkedHabitsCount?: number
  onClick: () => void
}

function formatDeadline(targetDate: string | null) {
  if (!targetDate) return 'No deadline'
  return new Date(targetDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function GoalCard({ goal, isSelected, linkedHabitsCount, onClick }: GoalCardProps) {
  const isCompleted = goal.status === 'COMPLETED'
  const isDark = document.documentElement.classList.contains('dark')
  const progressColor = isCompleted ? (isDark ? '#4ade80' : '#3B6D11') : '#534AB7'
  const clamped = Math.max(0, Math.min(100, goal.progress))
  const completedMilestones = goal.milestones.filter((m) => m.completed).length

  return (
    <Card
      className={`cursor-pointer rounded-xl border p-4 shadow-none transition-all hover:border-[#C7C4BB] dark:hover:border-zinc-600 ${
        isSelected ? 'border-[1.5px] border-[#534AB7]' : 'border-[#E8E6DF] dark:border-zinc-800'
      }`}
      onClick={onClick}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className="text-[14px] font-medium text-[#2C2C2A] dark:text-zinc-50">{goal.title}</span>
        <span
          className={`text-[13px] font-semibold ${isCompleted ? 'text-[#3B6D11] dark:text-green-400' : 'text-[#534AB7]'}`}
        >
          {clamped}%
        </span>
      </div>

      {/* Meta row */}
      <div className="mt-1.5 mb-2.5 flex items-center gap-2">
        <span className="text-[11px] text-[#9E9B94] dark:text-zinc-500">{formatDeadline(goal.targetDate)}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isCompleted
              ? 'bg-[#EAF3DE] dark:bg-emerald-950 text-[#27500A] dark:text-green-400'
              : 'bg-[#EEEDFE] dark:bg-[#534AB7]/20 text-[#3C3489]'
          }`}
        >
          {isCompleted ? 'Completed' : 'Active'}
        </span>
      </div>

      {/* Progress bar */}
      <GoalProgress
        value={clamped}
        color={progressColor}
        className="mb-3 h-[5px] rounded-full bg-[#F5F4F0] dark:bg-zinc-800"
      />

      {/* Footer */}
      <div className="flex justify-between text-[11px] text-[#9E9B94] dark:text-zinc-500">
        <span>
          {linkedHabitsCount !== undefined
            ? `${linkedHabitsCount} ${linkedHabitsCount === 1 ? 'habit' : 'habits'} linked`
            : ''}
        </span>
        <span>
          {goal.milestones.length > 0
            ? `${completedMilestones} of ${goal.milestones.length} milestones done`
            : 'No milestones'}
        </span>
      </div>
    </Card>
  )
}
