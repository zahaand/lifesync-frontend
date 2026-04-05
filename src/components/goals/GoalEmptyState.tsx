import { Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

type GoalEmptyStateProps =
  | { variant: 'no-goals'; onCreateClick: () => void }
  | { variant: 'no-selection' }

export default function GoalEmptyState(props: GoalEmptyStateProps) {
  if (props.variant === 'no-selection') {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-[13px] text-[#9E9B94]">Select a goal to view details</span>
      </div>
    )
  }

  return (
    <div className="py-12 text-center">
      <Target className="mx-auto mb-3 size-8 text-[#C7C4BB]" />
      <p className="mb-3 text-[13px] text-[#9E9B94]">
        No goals yet. Create your first goal to start tracking.
      </p>
      <Button
        className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
        onClick={props.onCreateClick}
      >
        + New goal
      </Button>
    </div>
  )
}
