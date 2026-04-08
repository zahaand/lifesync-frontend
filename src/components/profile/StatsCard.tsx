import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHabits } from '@/hooks/useHabits'
import { useGoalsSummary } from '@/hooks/useGoals'

export default function StatsCard() {
  const { t } = useTranslation('profile')
  const { data: habitsData, isLoading: habitsLoading } = useHabits()
  const { activeCount, completedCount, isLoading: goalsLoading } = useGoalsSummary()

  const habits = habitsData?.content ?? []
  const activeHabitsCount = habits.length

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
      label: t('stats.activeHabits'),
      value: String(activeHabitsCount),
      sub: '',
      colorClass: 'text-[#534AB7]',
      loading: habitsLoading,
    },
    {
      label: t('stats.bestStreak'),
      value: bestStreakValue > 0 ? t('stats.bestStreak', { count: bestStreakValue }) : '—',
      sub: bestStreakName || '',
      colorClass: 'text-[#854F0B] dark:text-amber-400',
      loading: habitsLoading,
    },
    {
      label: t('stats.activeGoals'),
      value: String(activeCount),
      sub: '',
      colorClass: 'text-[#534AB7]',
      loading: goalsLoading,
    },
    {
      label: t('stats.completedGoals'),
      value: String(completedCount),
      sub: '',
      colorClass: 'text-[#3B6D11] dark:text-green-400',
      loading: goalsLoading,
    },
  ]

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <h2 className="mb-4 text-[16px] font-medium text-[#2C2C2A] dark:text-zinc-50">{t('stats.title')}</h2>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-[#F5F4F0] dark:bg-zinc-800 p-4"
            >
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[#9E9B94] dark:text-zinc-500">
                {s.label}
              </div>
              {s.loading ? (
                <>
                  <Skeleton className="mb-1 h-[28px] w-20 rounded" />
                  {s.sub !== '' && <Skeleton className="h-[14px] w-16 rounded" />}
                </>
              ) : (
                <>
                  <div className={`text-[22px] font-semibold ${s.colorClass}`}>
                    {s.value}
                  </div>
                  {s.sub && (
                    <div className="mt-0.5 text-[11px] text-[#9E9B94] dark:text-zinc-500">{s.sub}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
