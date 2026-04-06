import { Pencil, Archive, RotateCcw, Trash2, Clock, MoreHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useIsMobile from '@/hooks/useIsMobile'
import type { Habit } from '@/types/habits'

type HabitCardProps = {
  habit: Habit
  onComplete: (habitId: string) => void
  onUncomplete: (habitId: string, logId: string) => void
  onEdit: (habit: Habit) => void
  onArchive: (habitId: string) => void
  onRestore: (habitId: string) => void
  onDelete: (habit: Habit) => void
  onHistory: (habitId: string) => void
}

export default function HabitCard({
  habit,
  onComplete,
  onUncomplete,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onHistory,
}: HabitCardProps) {
  const isMobile = useIsMobile()
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
      className={`group flex items-start gap-3 rounded-xl px-4 py-3 mb-2 shadow-none ${
        isArchived
          ? 'opacity-60 bg-[#F5F4F0] border-[#E8E6DF]'
          : 'bg-white border-[#E8E6DF]'
      }`}
    >
      <Checkbox
        checked={habit.completedToday}
        onCheckedChange={handleCheckedChange}
        disabled={isArchived}
        className={`mt-0.5 h-5 w-5 shrink-0 self-center rounded-full border-[#C7C4BB] ${
          isArchived ? 'opacity-40' : ''
        } data-[state=checked]:bg-[#534AB7] data-[state=checked]:border-[#534AB7]`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[13px] font-medium text-left ${
            habit.completedToday
              ? 'text-[#9E9B94] line-through'
              : 'text-[#2C2C2A]'
          }`}
        >
          {habit.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F5F4F0] px-2 py-0.5 text-[10px] text-[#666360]">
            {habit.frequency}
          </span>
          {habit.currentStreak > 0 && (
            <span className="whitespace-nowrap rounded-full bg-[#FAEEDA] px-2.5 py-0.5 text-[11px] font-medium text-[#854F0B]">
              {'🔥'} {habit.currentStreak} day streak
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-[#9E9B94] text-left">
          {habit.completedToday ? 'Completed today' : 'Not done yet'}
        </p>
      </div>

      {/* Mobile: DropdownMenu */}
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 self-center"
            >
              <MoreHorizontal className="h-4 w-4 text-[#666360]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHistory(habit.id)}>
              <Clock className="mr-2 h-4 w-4" />
              History
            </DropdownMenuItem>
            {habit.isActive ? (
              <DropdownMenuItem onClick={() => onArchive(habit.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => onRestore(habit.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(habit)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* Desktop: inline icon buttons, visible on hover */
        <div className="flex gap-1 self-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(habit)}
            className="h-7 w-7 rounded-lg border-[#E8E6DF] bg-white"
          >
            <Pencil className="h-3.5 w-3.5 text-[#666360]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onHistory(habit.id)}
            className="h-7 w-7 rounded-lg border-[#E8E6DF] bg-white"
          >
            <Clock className="h-3.5 w-3.5 text-[#666360]" />
          </Button>

          {habit.isActive ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onArchive(habit.id)}
              className="h-7 w-7 rounded-lg border-[#E8E6DF] bg-white"
            >
              <Archive className="h-3.5 w-3.5 text-[#666360]" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRestore(habit.id)}
                className="h-7 w-7 rounded-lg border-[#E8E6DF] bg-white"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#666360]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(habit)}
                className="h-7 w-7 rounded-lg border-[#FCA5A5] bg-white"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
