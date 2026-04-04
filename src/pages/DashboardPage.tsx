import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import { useHabits, useCompleteHabit, useUncompleteHabit } from '@/hooks/useHabits'
import { useGoalsSummary } from '@/hooks/useGoals'

const COLORS = {
  purple: '#534AB7',
  purpleLight: '#EEEDFE',
  purpleText: '#3C3489',
  greenFill: '#3B6D11',
  greenBg: '#EAF3DE',
  greenText: '#27500A',
  tealDot: '#1D9E75',
  amberBg: '#FAEEDA',
  amberText: '#854F0B',
  surface: '#F5F4F0',
  border: '#E8E6DF',
  textPrimary: '#2C2C2A',
  textSecondary: '#666360',
  textHint: '#9E9B94',
} as const

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour <= 11) return 'Good morning'
  if (hour >= 12 && hour <= 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function StatsRow() {
  const { data: habitsData, isLoading: habitsLoading, isError: habitsError, refetch: refetchHabits } = useHabits()
  const { activeCount, completedCount, isLoading: goalsLoading, isError: goalsError, refetchActive, refetchCompleted } = useGoalsSummary()

  const habits = habitsData?.content ?? []
  const todayCompleted = habits.filter((h) => h.completedToday).length
  const todayTotal = habits.length

  let bestStreakValue = 0
  let bestStreakName = ''
  for (const h of habits) {
    if (h.currentStreak > bestStreakValue) {
      bestStreakValue = h.currentStreak
      bestStreakName = h.name
    }
  }

  const stats = [
    {
      label: "TODAY'S HABITS",
      value: habitsLoading ? null : `${todayCompleted} / ${todayTotal}`,
      sub: 'completed',
      color: COLORS.purple,
      loading: habitsLoading,
      error: habitsError,
      retry: refetchHabits,
    },
    {
      label: 'BEST STREAK',
      value: habitsLoading ? null : `${bestStreakValue} days`,
      sub: bestStreakName || '—',
      color: COLORS.amberText,
      loading: habitsLoading,
      error: habitsError,
      retry: refetchHabits,
    },
    {
      label: 'ACTIVE GOALS',
      value: goalsLoading ? null : String(activeCount),
      sub: 'in progress',
      color: COLORS.purple,
      loading: goalsLoading,
      error: goalsError,
      retry: refetchActive,
    },
    {
      label: 'COMPLETED GOALS',
      value: goalsLoading ? null : String(completedCount),
      sub: 'achieved',
      color: COLORS.greenFill,
      loading: goalsLoading,
      error: goalsError,
      retry: refetchCompleted,
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg p-4"
          style={{ backgroundColor: COLORS.surface }}
        >
          <div
            className="mb-1 text-[10px] font-medium uppercase tracking-wider"
            style={{ color: COLORS.textHint }}
          >
            {s.label}
          </div>
          {s.loading ? (
            <>
              <Skeleton className="mb-1 h-[28px] w-20 rounded" />
              <Skeleton className="h-[14px] w-16 rounded" />
            </>
          ) : s.error ? (
            <div className="text-[11px]" style={{ color: COLORS.textHint }}>
              Failed to load.{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-[11px]"
                style={{ color: COLORS.purple }}
                onClick={() => s.retry()}
              >
                Try again.
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-1 text-[22px] font-semibold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px]" style={{ color: COLORS.textHint }}>
                {s.sub}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function HabitsCard() {
  const { data, isLoading, isError, refetch } = useHabits()
  const completeMutation = useCompleteHabit()
  const uncompleteMutation = useUncompleteHabit()

  const habits = data?.content ?? []

  const handleToggle = (habitId: string, completedToday: boolean, todayLogId: string | null) => {
    if (completedToday) {
      if (!todayLogId) {
        console.warn(`Habit ${habitId} has completedToday=true but todayLogId=null`)
        return
      }
      uncompleteMutation.mutate({ habitId, logId: todayLogId })
    } else {
      completeMutation.mutate(habitId)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: COLORS.border }}>
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: COLORS.border }}
      >
        <span className="text-[14px] font-medium" style={{ color: COLORS.textPrimary }}>
          Today&apos;s habits
        </span>
        <Link to="/habits" className="text-[12px]" style={{ color: COLORS.purple }}>
          View all
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2 px-4 py-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[52px] rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="px-4 py-8 text-center text-[13px]" style={{ color: COLORS.textHint }}>
          Failed to load.{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-[13px]"
            style={{ color: COLORS.purple }}
            onClick={() => refetch()}
          >
            Try again.
          </Button>
        </div>
      ) : habits.length === 0 ? (
        <div className="px-4 py-8 text-center text-[13px]" style={{ color: COLORS.textHint }}>
          No habits yet. Create your first habit to get started.
        </div>
      ) : (
        habits.map((habit, idx) => {
          const isLast = idx === habits.length - 1
          const disableUncheck = habit.completedToday && !habit.todayLogId
          return (
            <div
              key={habit.id}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: isLast ? 'none' : `1px solid ${COLORS.border}` }}
            >
              <Checkbox
                checked={habit.completedToday}
                disabled={disableUncheck && habit.completedToday}
                onCheckedChange={() =>
                  handleToggle(habit.id, habit.completedToday, habit.todayLogId)
                }
                aria-label={
                  habit.completedToday
                    ? `Mark ${habit.name} as incomplete`
                    : `Mark ${habit.name} as complete`
                }
                className="h-[22px] w-[22px] rounded-full border-[#C7C4BB] data-[state=checked]:border-[#534AB7] data-[state=checked]:bg-[#534AB7]"
              />
              <div className="flex-1">
                <div
                  className={`text-[13px] font-medium ${habit.completedToday ? 'line-through' : ''}`}
                  style={{ color: habit.completedToday ? COLORS.textHint : COLORS.textPrimary }}
                >
                  {habit.name}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full border-0 px-2 py-0.5 text-[10px]"
                    style={{ backgroundColor: COLORS.surface, color: COLORS.textSecondary }}
                  >
                    {habit.frequency}
                  </Badge>
                  <span className="text-[11px]" style={{ color: COLORS.textHint }}>
                    {habit.completedToday ? 'Completed today' : 'Not done yet'}
                  </span>
                </div>
              </div>
              {habit.currentStreak > 0 && (
                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full border-0 px-2.5 py-1 text-[11px] font-medium"
                  style={{ backgroundColor: COLORS.amberBg, color: COLORS.amberText }}
                >
                  🔥 {habit.currentStreak} day streak
                </Badge>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function GoalsCard() {
  const { activeGoals, activeIsLoading, activeIsError, refetchActive } = useGoalsSummary()

  const formatDeadline = (targetDate: string | null) => {
    if (!targetDate) return 'No deadline'
    return `Due ${new Date(targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: COLORS.border }}>
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: COLORS.border }}
      >
        <span className="text-[14px] font-medium" style={{ color: COLORS.textPrimary }}>
          Active goals
        </span>
        <Link to="/goals" className="text-[12px]" style={{ color: COLORS.purple }}>
          View all
        </Link>
      </div>

      {/* Content */}
      {activeIsLoading ? (
        <div className="space-y-2 px-4 py-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[80px] rounded-lg" />
          ))}
        </div>
      ) : activeIsError ? (
        <div className="px-4 py-8 text-center text-[13px]" style={{ color: COLORS.textHint }}>
          Failed to load.{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-[13px]"
            style={{ color: COLORS.purple }}
            onClick={() => refetchActive()}
          >
            Try again.
          </Button>
        </div>
      ) : activeGoals.length === 0 ? (
        <div className="px-4 py-8 text-center text-[13px]" style={{ color: COLORS.textHint }}>
          No active goals. Set a goal to start tracking your progress.
        </div>
      ) : (
        activeGoals.map((goal, idx) => {
          const isLast = idx === activeGoals.length - 1
          const progressColor = goal.status === 'COMPLETED' ? COLORS.greenFill : COLORS.purple
          const clampedProgress = Math.max(0, Math.min(100, goal.progress))
          return (
            <div
              key={goal.id}
              className="px-4 py-3"
              style={{ borderBottom: isLast ? 'none' : `1px solid ${COLORS.border}` }}
            >
              {/* Name + progress % */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium" style={{ color: COLORS.textPrimary }}>
                  {goal.name}
                </span>
                <span className="text-[13px] font-semibold" style={{ color: progressColor }}>
                  {clampedProgress}%
                </span>
              </div>

              {/* Meta: deadline + badge */}
              <div className="mb-2 mt-1 flex items-center gap-2">
                <span className="text-[11px]" style={{ color: COLORS.textHint }}>
                  {formatDeadline(goal.targetDate)}
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full border-0 px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: goal.status === 'COMPLETED' ? COLORS.greenBg : COLORS.purpleLight,
                    color: goal.status === 'COMPLETED' ? COLORS.greenText : COLORS.purpleText,
                  }}
                >
                  {goal.status === 'COMPLETED' ? 'Completed' : 'Active'}
                </Badge>
              </div>

              {/* Progress bar */}
              <Progress
                value={clampedProgress}
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mb-2 h-[5px] rounded-full"
                style={{ backgroundColor: COLORS.surface, ['--progress-color' as string]: progressColor }}
              />

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="mt-1 space-y-1">
                  {goal.milestones.slice(0, 3).map((ms) => (
                    <div key={ms.id} className="flex items-center gap-2">
                      <div
                        className="h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ backgroundColor: ms.completed ? COLORS.tealDot : '#C7C4BB' }}
                      />
                      <span
                        className={`text-[11px] ${ms.completed ? 'line-through' : ''}`}
                        style={{ color: ms.completed ? COLORS.textHint : COLORS.textSecondary }}
                      >
                        {ms.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [modalOpen, setModalOpen] = useState(false)

  const greeting = getGreeting()
  const username = user?.username
  const greetingText = username ? `${greeting}, ${username}` : greeting

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold" style={{ color: COLORS.textPrimary }}>
            {greetingText}
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: COLORS.textHint }}>
            {formatDate()}
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="rounded-lg px-4 py-2 text-[13px] font-medium"
              style={{ backgroundColor: COLORS.purple, color: COLORS.purpleLight }}
            >
              <Plus className="mr-1.5 size-4" />
              New habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[440px]">
            <DialogHeader>
              <DialogTitle className="text-[16px] font-semibold">New habit</DialogTitle>
              <DialogDescription className="sr-only">Create a new habit</DialogDescription>
            </DialogHeader>
            <div className="px-5 py-6 text-center text-[13px]" style={{ color: COLORS.textHint }}>
              Full habit creation coming soon
            </div>
            <DialogFooter
              className="flex justify-end border-t px-5 pb-4 pt-3"
              style={{ borderColor: COLORS.border }}
            >
              <Button
                variant="outline"
                className="rounded-lg border-[#C7C4BB] px-4 py-2 text-[13px]"
                style={{ color: COLORS.textSecondary }}
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <StatsRow />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <HabitsCard />
        <GoalsCard />
      </div>
    </div>
  )
}
