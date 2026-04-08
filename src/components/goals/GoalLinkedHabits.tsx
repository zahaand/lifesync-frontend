import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAllHabits } from '@/hooks/useHabits'
import { useLinkHabit, useUnlinkHabit } from '@/hooks/useGoals'

type GoalLinkedHabitsProps = {
  goalId: string
  linkedHabitIds: string[]
}

export default function GoalLinkedHabits({ goalId, linkedHabitIds }: GoalLinkedHabitsProps) {
  const [selectedHabitId, setSelectedHabitId] = useState<string>('')
  const { data: habitsData } = useAllHabits()
  const linkHabit = useLinkHabit()
  const unlinkHabit = useUnlinkHabit()

  const allHabits = habitsData?.content ?? []
  const linkedHabits = allHabits.filter((h) => linkedHabitIds.includes(h.id))
  const availableHabits = allHabits.filter(
    (h) => h.isActive && !linkedHabitIds.includes(h.id),
  )

  const handleLink = () => {
    if (!selectedHabitId) return
    linkHabit.mutate(
      { goalId, data: { habitId: selectedHabitId } },
      { onSuccess: () => setSelectedHabitId('') },
    )
  }

  const handleUnlink = (habitId: string) => {
    unlinkHabit.mutate({ goalId, habitId })
  }

  return (
    <div className="rounded-xl border border-[#E8E6DF] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[#9E9B94] dark:text-zinc-500">
        Linked habits
      </div>

      {linkedHabits.length === 0 ? (
        <p className="py-3 text-[13px] text-[#9E9B94] dark:text-zinc-500">No habits linked</p>
      ) : (
        <div>
          {linkedHabits.map((habit, idx) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between py-2 ${
                idx < linkedHabits.length - 1 ? 'border-b border-[#F5F4F0] dark:border-zinc-800' : ''
              }`}
            >
              <span className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">{habit.title}</span>
              <div className="flex items-center gap-2">
                {habit.currentStreak > 0 && (
                  <span className="rounded-full bg-[#FAEEDA] dark:bg-amber-950 px-2 py-0.5 text-[11px] font-medium text-[#854F0B] dark:text-amber-400">
                    {habit.currentStreak} day streak
                  </span>
                )}
                <Button
                  variant="ghost"
                  className="h-auto px-1 py-0 text-[11px] text-[#9E9B94] dark:text-zinc-500 hover:text-red-500"
                  onClick={() => handleUnlink(habit.id)}
                >
                  Unlink
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link row */}
      <div className="mt-3 flex gap-2">
        <Select
          value={selectedHabitId}
          onValueChange={setSelectedHabitId}
          disabled={availableHabits.length === 0}
        >
          <SelectTrigger className="h-9 flex-1 rounded-lg text-[13px]">
            <SelectValue
              placeholder={
                availableHabits.length === 0 ? 'All habits linked' : 'Link a habit...'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableHabits.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="h-9 rounded-lg bg-[#534AB7] px-4 text-[#EEEDFE]"
          onClick={handleLink}
          disabled={!selectedHabitId || linkHabit.isPending}
        >
          Link
        </Button>
      </div>
    </div>
  )
}
