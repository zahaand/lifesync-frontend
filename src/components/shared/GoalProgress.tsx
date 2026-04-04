import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type GoalProgressProps = {
  value: number
  color: string
  className?: string
  'aria-valuenow'?: number
  'aria-valuemin'?: number
  'aria-valuemax'?: number
}

export default function GoalProgress({ value, color, className, ...ariaProps }: GoalProgressProps) {
  return (
    <div style={{ ['--progress-color' as string]: color }}>
      <Progress
        value={value}
        className={cn('[&>[data-slot=progress-indicator]]:bg-[var(--progress-color)]', className)}
        {...ariaProps}
      />
    </div>
  )
}
