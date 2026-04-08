import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FilterTab = 'ALL' | 'ACTIVE' | 'ARCHIVED'

type HabitFiltersProps = {
  activeFilter: FilterTab
  onFilterChange: (tab: FilterTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const TABS: { value: FilterTab; labelKey: string }[] = [
  { value: 'ALL', labelKey: 'filter.all' },
  { value: 'ACTIVE', labelKey: 'filter.active' },
  { value: 'ARCHIVED', labelKey: 'filter.archived' },
]

export default function HabitFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: HabitFiltersProps) {
  const { t } = useTranslation('habits')

  return (
    <div className="flex items-center gap-3 mb-5 overflow-x-auto">
      {TABS.map((tab) => (
        <Button
          key={tab.value}
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(tab.value)}
          className={`shrink-0 text-[12px] px-3 py-1.5 rounded-full h-auto ${
            activeFilter === tab.value
              ? 'bg-[#EEEDFE] dark:bg-[#534AB7]/20 text-[#3C3489] border-[#AFA9EC] dark:border-[#534AB7] font-medium'
              : 'bg-transparent text-[#666360] dark:text-zinc-500 border-[#E8E6DF] dark:border-zinc-800'
          }`}
        >
          {t(tab.labelKey)}
        </Button>
      ))}
      <div className="ml-auto relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9B94] dark:text-zinc-500" />
        <Input
          type="text"
          placeholder={t('filter.search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-[220px] h-[34px] border-[#E8E6DF] dark:border-zinc-800 rounded-lg text-[13px] pl-8 bg-[#F5F4F0] dark:bg-zinc-800"
        />
      </div>
    </div>
  )
}
