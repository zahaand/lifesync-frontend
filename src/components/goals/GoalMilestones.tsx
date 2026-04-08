import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAddMilestone, useUpdateMilestone, useDeleteMilestone } from '@/hooks/useGoals'
import type { Milestone } from '@/types/goals'

type GoalMilestonesProps = {
  goalId: string
  milestones: Milestone[]
}

export default function GoalMilestones({ goalId, milestones }: GoalMilestonesProps) {
  const { t } = useTranslation('goals')
  const [newTitle, setNewTitle] = useState('')
  const addMilestone = useAddMilestone()
  const updateMilestone = useUpdateMilestone()
  const deleteMilestone = useDeleteMilestone()

  const handleAdd = () => {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    addMilestone.mutate(
      { goalId, data: { title: trimmed } },
      { onSuccess: () => setNewTitle('') },
    )
  }

  const handleToggle = (milestone: Milestone) => {
    updateMilestone.mutate({
      goalId,
      milestoneId: milestone.id,
      data: { completed: !milestone.completed },
    })
  }

  const handleDelete = (milestoneId: string) => {
    deleteMilestone.mutate({ goalId, milestoneId })
  }

  return (
    <div className="rounded-xl border border-[#E8E6DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#9E9B94] dark:text-zinc-500">
        {t('milestones.title')}
      </div>

      {milestones.length === 0 ? (
        <p className="py-3 text-[13px] text-[#9E9B94] dark:text-zinc-500">{t('milestones.empty')}</p>
      ) : (
        <div>
          {milestones.map((ms, idx) => (
            <div
              key={ms.id}
              className={`flex items-center gap-3 py-2 ${
                idx < milestones.length - 1 ? 'border-b border-[#F5F4F0] dark:border-zinc-800' : ''
              }`}
            >
              <Checkbox
                checked={ms.completed}
                onCheckedChange={() => handleToggle(ms)}
                className={
                  ms.completed
                    ? 'border-[#1D9E75] bg-[#1D9E75] data-[state=checked]:border-[#1D9E75] data-[state=checked]:bg-[#1D9E75]'
                    : 'border-[#C7C4BB] dark:border-zinc-800'
                }
              />
              <span
                className={`flex-1 text-[13px] ${
                  ms.completed ? 'text-[#9E9B94] dark:text-zinc-600 line-through' : 'text-[#2C2C2A] dark:text-zinc-50'
                }`}
              >
                {ms.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6 text-[#9E9B94] dark:text-zinc-500 hover:text-red-500"
                onClick={() => handleDelete(ms.id)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add row */}
      <div className="mt-3 flex gap-2">
        <Input
          placeholder={t('milestones.placeholder')}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          className="h-9 flex-1 rounded-lg border-[#C7C4BB] dark:border-zinc-800"
        />
        <Button
          className="h-9 rounded-lg bg-[#534AB7] px-4 text-[#EEEDFE]"
          onClick={handleAdd}
          disabled={addMilestone.isPending}
        >
          {t('milestones.addButton')}
        </Button>
      </div>
    </div>
  )
}
