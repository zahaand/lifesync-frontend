import { Pencil, Archive, RotateCcw, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import type { Habit } from '@/types/habits'

type HabitCardProps = {
  habit: Habit
  onComplete: (habitId: string) => void
  onUncomplete: (habitId: string, logId: string) => void
  onEdit: (habit: Habit) => void
  onArchive: (habitId: string) => void
  onRestore: (habitId: string) => void
  onDelete: (habit: Habit) => void
}

export default function HabitCard({
  habit,
  onComplete,
  onUncomplete,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: HabitCardProps) {
  const isArchived = !habit.isActive

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onComplete(habit.id)
    } else if (checked === false && habit.todayLogId) {
      onUncomplete(habit.id, habit.todayLogId)
    }
  }

  return (
    <Card
      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 shadow-none ${
        isArchived
          ? 'opacity-60 bg-[#F5F4F0] border-[#E8E6DF]'
          : 'bg-white border-[#E8E6DF]'
      }`}
    >
      <Checkbox
        checked={habit.completedToday}
        onCheckedChange={handleCheckedChange}
        disabled={isArchived}
        className={`h-5 w-5 rounded-full border-[#C7C4BB] ${
          isArchived ? 'opacity-40' : ''
        } data-[state=checked]:bg-[#534AB7] data-[state=checked]:border-[#534AB7]`}
      />

      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-medium truncate ${
            habit.completedToday
              ? 'line-through text-[#9E9B94]'
              : 'text-[#2C2C2A]'
          }`}
        >
          {habit.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-[#F5F4F0] text-[#666360] text-[10px] px-2 py-0.5 rounded-full">
            {habit.frequency}
          </span>
          <span className="text-[11px] text-[#9E9B94]">
            {habit.completedToday ? 'Completed today' : 'Not done yet'}
          </span>
        </div>
      </div>

      {habit.currentStreak > 0 && (
        <span className="bg-[#FAEEDA] text-[#854F0B] text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
          {'🔥'} {habit.currentStreak} day streak
        </span>
      )}

      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(habit)}
          className="w-7 h-7 rounded-lg border-[#E8E6DF] bg-white"
        >
          <Pencil className="h-3.5 w-3.5 text-[#666360]" />
        </Button>

        {habit.isActive ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onArchive(habit.id)}
            className="w-7 h-7 rounded-lg border-[#E8E6DF] bg-white"
          >
            <Archive className="h-3.5 w-3.5 text-[#666360]" />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRestore(habit.id)}
              className="w-7 h-7 rounded-lg border-[#E8E6DF] bg-white"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#666360]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(habit)}
              className="w-7 h-7 rounded-lg border-[#FCA5A5] bg-white"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
