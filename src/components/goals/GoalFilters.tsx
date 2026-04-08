import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export type GoalFilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED'

type GoalFiltersProps = {
  activeFilter: GoalFilterTab
  onFilterChange: (tab: GoalFilterTab) => void
}

const TABS: { labelKey: string; value: GoalFilterTab }[] = [
  { labelKey: 'filter.all', value: 'ALL' },
  { labelKey: 'filter.active', value: 'ACTIVE' },
  { labelKey: 'filter.completed', value: 'COMPLETED' },
]

export default function GoalFilters({ activeFilter, onFilterChange }: GoalFiltersProps) {
  const { t } = useTranslation('goals')

  return (
    <div className="mb-4 flex gap-2">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab.value
        return (
          <Button
            key={tab.value}
            variant="ghost"
            className={`h-auto rounded-full px-3 py-1.5 text-[12px] ${
              isActive
                ? 'border border-[#AFA9EC] dark:border-[#534AB7] bg-[#EEEDFE] dark:bg-[#534AB7]/20 font-medium text-[#3C3489] hover:bg-[#EEEDFE]'
                : 'border border-[#E8E6DF] dark:border-zinc-800 bg-transparent text-[#666360] dark:text-zinc-500 hover:bg-[#F5F4F0] dark:hover:bg-zinc-800'
            }`}
            onClick={() => onFilterChange(tab.value)}
          >
            {t(tab.labelKey)}
          </Button>
        )
      })}
    </div>
  )
}
