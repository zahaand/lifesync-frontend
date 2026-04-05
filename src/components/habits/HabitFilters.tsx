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

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export default function HabitFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: HabitFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {TABS.map((tab) => (
        <Button
          key={tab.value}
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(tab.value)}
          className={`text-[12px] px-3 py-1.5 rounded-full h-auto ${
            activeFilter === tab.value
              ? 'bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC] font-medium'
              : 'bg-transparent text-[#666360] border-[#E8E6DF]'
          }`}
        >
          {tab.label}
        </Button>
      ))}
      <div className="ml-auto relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9B94]" />
        <Input
          type="text"
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-[220px] h-[34px] border-[#E8E6DF] rounded-lg text-[13px] pl-8 bg-[#F5F4F0]"
        />
      </div>
    </div>
  )
}
