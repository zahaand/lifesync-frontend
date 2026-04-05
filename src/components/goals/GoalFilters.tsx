import { Button } from '@/components/ui/button'

export type GoalFilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED'

type GoalFiltersProps = {
  activeFilter: GoalFilterTab
  onFilterChange: (tab: GoalFilterTab) => void
}

const TABS: { label: string; value: GoalFilterTab }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
]

export default function GoalFilters({ activeFilter, onFilterChange }: GoalFiltersProps) {
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
                ? 'border border-[#AFA9EC] bg-[#EEEDFE] font-medium text-[#3C3489] hover:bg-[#EEEDFE]'
                : 'border border-[#E8E6DF] bg-transparent text-[#666360] hover:bg-[#F5F4F0]'
            }`}
            onClick={() => onFilterChange(tab.value)}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}
