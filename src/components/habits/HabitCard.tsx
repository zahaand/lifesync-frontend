import { useTranslation } from 'react-i18next'
import { Pencil, Archive, RotateCcw, Trash2, Clock, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
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

function ActionButton({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: typeof Pencil
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={`h-7 w-7 ${className ?? ''}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
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
  const { t } = useTranslation('habits')
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
    <div
      className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition hover:border-border/60 ${
        isArchived
          ? 'opacity-60 bg-muted/30'
          : 'bg-background'
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        checked={habit.completedToday}
        onCheckedChange={handleCheckedChange}
        disabled={isArchived}
        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
          isArchived
            ? 'border-border/30 cursor-not-allowed'
            : habit.completedToday
              ? 'border-[#534AB7] bg-[#534AB7]'
              : 'border-border/40 hover:border-[#534AB7]'
        } data-[state=checked]:bg-[#534AB7] data-[state=checked]:border-[#534AB7]`}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            habit.completedToday
              ? 'line-through text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          {habit.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="rounded border border-border/40 bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            {habit.frequency === 'DAILY' ? t('card.daily') : habit.frequency === 'WEEKLY' ? t('card.weekly') : t('card.custom')}
          </span>
          {habit.currentStreak > 0 && (
            <span className="rounded bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 text-[11px] text-amber-800 dark:text-amber-400">
              {'🔥'} {t('card.streak', { count: habit.currentStreak })}
            </span>
          )}
          {habit.completedToday ? (
            <span className="rounded bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-[11px] text-emerald-800 dark:text-green-400">
              {t('card.doneTodayBadge')}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {t('card.notDoneYet')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {isArchived ? (
        /* Archived: always visible Restore + Delete */
        <div className="flex items-center gap-0.5">
          <ActionButton
            icon={RotateCcw}
            label={t('card.restore')}
            onClick={() => onRestore(habit.id)}
            className="hover:text-[#534AB7]"
          />
          <ActionButton
            icon={Trash2}
            label={t('card.delete')}
            onClick={() => onDelete(habit)}
            className="hover:text-destructive"
          />
        </div>
      ) : isMobile ? (
        /* Active mobile: DropdownMenu */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t('card.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onHistory(habit.id)}>
              <Clock className="mr-2 h-4 w-4" />
              {t('card.history')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(habit.id)}>
              <Archive className="mr-2 h-4 w-4" />
              {t('card.archive')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(habit)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('card.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* Active desktop: hover-visible icon buttons */
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <ActionButton
            icon={Pencil}
            label={t('card.edit')}
            onClick={() => onEdit(habit)}
          />
          <ActionButton
            icon={Clock}
            label={t('card.history')}
            onClick={() => onHistory(habit.id)}
          />
          <ActionButton
            icon={Archive}
            label={t('card.archive')}
            onClick={() => onArchive(habit.id)}
          />
          <ActionButton
            icon={Trash2}
            label={t('card.delete')}
            onClick={() => onDelete(habit)}
            className="hover:text-destructive"
          />
        </div>
      )}
    </div>
  )
}
