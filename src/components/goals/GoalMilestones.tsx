import { useState } from 'react'
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
    <div className="rounded-xl border border-[#E8E6DF] bg-white p-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#9E9B94]">
        Milestones
      </div>

      {milestones.length === 0 ? (
        <p className="py-3 text-[13px] text-[#9E9B94]">No milestones yet</p>
      ) : (
        <div>
          {milestones.map((ms, idx) => (
            <div
              key={ms.id}
              className={`flex items-center gap-3 py-2 ${
                idx < milestones.length - 1 ? 'border-b border-[#F5F4F0]' : ''
              }`}
            >
              <Checkbox
                checked={ms.completed}
                onCheckedChange={() => handleToggle(ms)}
                className={
                  ms.completed
                    ? 'border-[#1D9E75] bg-[#1D9E75] data-[state=checked]:border-[#1D9E75] data-[state=checked]:bg-[#1D9E75]'
                    : 'border-[#C7C4BB]'
                }
              />
              <span
                className={`flex-1 text-[13px] ${
                  ms.completed ? 'text-[#9E9B94] line-through' : 'text-[#2C2C2A]'
                }`}
              >
                {ms.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6 text-[#9E9B94] hover:text-red-500"
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
          placeholder="Add milestone..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          className="h-9 flex-1 rounded-lg border-[#C7C4BB]"
        />
        <Button
          className="h-9 rounded-lg bg-[#534AB7] px-4 text-[#EEEDFE]"
          onClick={handleAdd}
          disabled={addMilestone.isPending}
        >
          Add
        </Button>
      </div>
    </div>
  )
}
