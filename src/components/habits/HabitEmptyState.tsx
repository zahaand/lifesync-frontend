import { Inbox, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HabitEmptyStateProps = {
  variant: 'no-habits' | 'no-results'
  onCreateClick?: () => void
}

export default function HabitEmptyState({ variant, onCreateClick }: HabitEmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <SearchX className="mb-3 h-8 w-8 text-[#C7C4BB] dark:text-zinc-600" />
        <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">No habits match your search.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Inbox className="mb-3 h-8 w-8 text-[#C7C4BB] dark:text-zinc-600" />
      <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">
        {"No habits yet. Click '+ New habit' to create your first."}
      </p>
      {onCreateClick && (
        <Button
          onClick={onCreateClick}
          className="mt-4 bg-[#534AB7] text-[#EEEDFE] text-[13px] font-medium px-4 py-2 rounded-lg"
        >
          + New habit
        </Button>
      )}
    </div>
  )
}
