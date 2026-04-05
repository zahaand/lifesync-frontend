import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import GoalProgress from '@/components/shared/GoalProgress'
import { useAuthStore } from '@/stores/authStore'
import { useHabits, useCompleteHabit, useUncompleteHabit } from '@/hooks/useHabits'
import { useGoalsSummary } from '@/hooks/useGoals'
import { useCurrentUser } from '@/hooks/useUsers'

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
      bestStreakName = h.title
    }
  }

  const stats = [
    {
      label: "TODAY'S HABITS",
      value: habitsLoading ? null : `${todayCompleted} / ${todayTotal}`,
      sub: 'completed',
      colorClass: 'text-[#534AB7]',
      loading: habitsLoading,
      error: habitsError,
      retry: refetchHabits,
    },
    {
      label: 'BEST STREAK',
      value: habitsLoading ? null : `${bestStreakValue} days`,
      sub: bestStreakName || '—',
      colorClass: 'text-[#854F0B]',
      loading: habitsLoading,
      error: habitsError,
      retry: refetchHabits,
    },
    {
      label: 'ACTIVE GOALS',
      value: goalsLoading ? null : String(activeCount),
      sub: 'in progress',
      colorClass: 'text-[#534AB7]',
      loading: goalsLoading,
      error: goalsError,
      retry: refetchActive,
    },
    {
      label: 'COMPLETED GOALS',
      value: goalsLoading ? null : String(completedCount),
      sub: 'achieved',
      colorClass: 'text-[#3B6D11]',
      loading: goalsLoading,
      error: goalsError,
      retry: refetchCompleted,
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="gap-0 rounded-lg border-0 bg-[#F5F4F0] p-0 ring-0"
        >
          <CardContent className="p-4">
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[#9E9B94]">
              {s.label}
            </div>
            {s.loading ? (
              <>
                <Skeleton className="mb-1 h-[28px] w-20 rounded" />
                <Skeleton className="h-[14px] w-16 rounded" />
              </>
            ) : s.error ? (
              <div className="text-[11px] text-[#9E9B94]">
                Failed to load.{' '}
                <Button
                  variant="link"
                  className="h-auto p-0 text-[11px] text-[#534AB7]"
                  onClick={() => s.retry()}
                >
                  Try again.
                </Button>
              </div>
            ) : (
              <>
                <div className={`mb-1 text-[22px] font-semibold ${s.colorClass}`}>
                  {s.value}
                </div>
                <div className="text-[11px] text-[#9E9B94]">
                  {s.sub}
                </div>
              </>
            )}
          </CardContent>
        </Card>
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
    <div className="overflow-hidden rounded-xl border border-[#E8E6DF]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6DF] px-4 py-3">
        <span className="text-[14px] font-medium text-[#2C2C2A]">
          Today&apos;s habits
        </span>
        <Link to="/habits" className="text-[12px] text-[#534AB7]">
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
        <div className="px-4 py-8 text-center text-[13px] text-[#9E9B94]">
          Failed to load.{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-[13px] text-[#534AB7]"
            onClick={() => refetch()}
          >
            Try again.
          </Button>
        </div>
      ) : habits.length === 0 ? (
        <div className="px-4 py-8 text-center text-[13px] text-[#9E9B94]">
          No habits yet. Create your first habit to get started.
        </div>
      ) : (
        habits.map((habit, idx) => {
          const isLast = idx === habits.length - 1
          const disableUncheck = habit.completedToday && !habit.todayLogId
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-3 px-4 py-3 ${isLast ? '' : 'border-b border-[#E8E6DF]'}`}
            >
              <Checkbox
                checked={habit.completedToday}
                disabled={disableUncheck && habit.completedToday}
                onCheckedChange={() =>
                  handleToggle(habit.id, habit.completedToday, habit.todayLogId)
                }
                aria-label={
                  habit.completedToday
                    ? `Mark ${habit.title} as incomplete`
                    : `Mark ${habit.title} as complete`
                }
                className="h-[22px] w-[22px] rounded-full border-[#C7C4BB] data-[state=checked]:border-[#534AB7] data-[state=checked]:bg-[#534AB7]"
              />
              <div className="flex-1">
                <div
                  className={`text-[13px] font-medium ${habit.completedToday ? 'text-[#9E9B94] line-through' : 'text-[#2C2C2A]'}`}
                >
                  {habit.title}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full border-0 bg-[#F5F4F0] px-2 py-0.5 text-[10px] text-[#666360]"
                  >
                    {habit.frequency}
                  </Badge>
                  <span className="text-[11px] text-[#9E9B94]">
                    {habit.completedToday ? 'Completed today' : 'Not done yet'}
                  </span>
                </div>
              </div>
              {habit.currentStreak > 0 && (
                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full border-0 bg-[#FAEEDA] px-2.5 py-1 text-[11px] font-medium text-[#854F0B]"
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
    <div className="overflow-hidden rounded-xl border border-[#E8E6DF]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6DF] px-4 py-3">
        <span className="text-[14px] font-medium text-[#2C2C2A]">
          Active goals
        </span>
        <Link to="/goals" className="text-[12px] text-[#534AB7]">
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
        <div className="px-4 py-8 text-center text-[13px] text-[#9E9B94]">
          Failed to load.{' '}
          <Button
            variant="link"
            className="h-auto p-0 text-[13px] text-[#534AB7]"
            onClick={() => refetchActive()}
          >
            Try again.
          </Button>
        </div>
      ) : activeGoals.length === 0 ? (
        <div className="px-4 py-8 text-center text-[13px] text-[#9E9B94]">
          No active goals. Set a goal to start tracking your progress.
        </div>
      ) : (
        activeGoals.map((goal, idx) => {
          const isLast = idx === activeGoals.length - 1
          const progressColor = goal.status === 'COMPLETED' ? '#3B6D11' : '#534AB7'
          const clampedProgress = Math.max(0, Math.min(100, goal.progress))
          return (
            <div
              key={goal.id}
              className={`px-4 py-3 ${isLast ? '' : 'border-b border-[#E8E6DF]'}`}
            >
              {/* Name + progress % */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#2C2C2A]">
                  {goal.title}
                </span>
                <span
                  className={`text-[13px] font-semibold ${goal.status === 'COMPLETED' ? 'text-[#3B6D11]' : 'text-[#534AB7]'}`}
                >
                  {clampedProgress}%
                </span>
              </div>

              {/* Meta: deadline + badge */}
              <div className="mb-2 mt-1 flex items-center gap-2">
                <span className="text-[11px] text-[#9E9B94]">
                  {formatDeadline(goal.targetDate)}
                </span>
                <Badge
                  variant="secondary"
                  className={`rounded-full border-0 px-2 py-0.5 text-[10px] font-medium ${
                    goal.status === 'COMPLETED'
                      ? 'bg-[#EAF3DE] text-[#27500A]'
                      : 'bg-[#EEEDFE] text-[#3C3489]'
                  }`}
                >
                  {goal.status === 'COMPLETED' ? 'Completed' : 'Active'}
                </Badge>
              </div>

              {/* Progress bar */}
              <GoalProgress
                value={clampedProgress}
                color={progressColor}
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mb-2 h-[5px] rounded-full bg-[#F5F4F0]"
              />

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="mt-1 space-y-1">
                  {goal.milestones.slice(0, 3).map((ms) => (
                    <div key={ms.id} className="flex items-center gap-2">
                      <div
                        className={`h-[7px] w-[7px] shrink-0 rounded-full ${ms.completed ? 'bg-[#1D9E75]' : 'bg-[#C7C4BB]'}`}
                      />
                      <span
                        className={`text-[11px] ${ms.completed ? 'text-[#9E9B94] line-through' : 'text-[#666360]'}`}
                      >
                        {ms.title}
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
  const { data: currentUser } = useCurrentUser()
  const [modalOpen, setModalOpen] = useState(false)

  const greeting = getGreeting()
  const displayName = currentUser?.displayName
  const name = displayName || user?.username || ''
  const greetingText = name ? `${greeting}, ${name}` : greeting

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#2C2C2A]">
            {greetingText}
          </h1>
          <p className="mt-1 text-[13px] text-[#9E9B94]">
            {formatDate()}
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
            >
              <Plus className="mr-1.5 size-4" />
              New habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[440px]">
            <DialogHeader>
              <DialogTitle className="text-[16px] font-semibold">Create habit</DialogTitle>
              <DialogDescription className="sr-only">Create a new habit</DialogDescription>
            </DialogHeader>
            <div className="px-5 py-6 text-center text-[13px] text-[#9E9B94]">
              Full habit creation coming soon
            </div>
            <DialogFooter
              className="flex justify-end border-t border-[#E8E6DF] px-5 pb-4 pt-3"
            >
              <Button
                variant="outline"
                className="rounded-lg border-[#C7C4BB] px-4 py-2 text-[13px] text-[#666360]"
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
