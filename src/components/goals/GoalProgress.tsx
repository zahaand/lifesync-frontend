import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SharedGoalProgress from '@/components/shared/GoalProgress'
import { useUpdateGoalProgress } from '@/hooks/useGoals'
import type { Goal } from '@/types/goals'

type GoalProgressProps = {
  goal: Goal
}

export default function GoalProgressSection({ goal }: GoalProgressProps) {
  const [inputValue, setInputValue] = useState(String(goal.progress))
  const updateProgress = useUpdateGoalProgress()

  const isCompleted = goal.status === 'COMPLETED'
  const progressColor = isCompleted ? '#3B6D11' : '#534AB7'
  const clamped = Math.max(0, Math.min(100, goal.progress))

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      setInputValue('')
      return
    }
    const num = Math.min(100, Math.max(0, parseInt(raw, 10)))
    setInputValue(String(num))
  }

  const handleUpdate = () => {
    const num = parseInt(inputValue, 10)
    if (isNaN(num) || num < 0 || num > 100) return
    if (num === goal.progress) return
    updateProgress.mutate(
      { id: goal.id, data: { progress: num } },
      {
        onSuccess: () => {
          setInputValue(String(num))
        },
      },
    )
  }

  return (
    <div className="rounded-xl border border-[#E8E6DF] bg-white p-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#9E9B94]">
        Progress
      </div>
      <div
        className={`mb-2 text-[32px] font-semibold ${isCompleted ? 'text-[#3B6D11]' : 'text-[#534AB7]'}`}
      >
        {clamped}%
      </div>
      <SharedGoalProgress
        value={clamped}
        color={progressColor}
        className="mb-4 h-[8px] rounded-full bg-[#F5F4F0]"
      />
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          className="h-9 w-20 rounded-lg border-[#C7C4BB] text-center"
        />
        <Button
          className="h-9 rounded-lg bg-[#534AB7] px-4 text-[#EEEDFE]"
          onClick={handleUpdate}
          disabled={updateProgress.isPending}
        >
          {updateProgress.isPending ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </div>
  )
}
