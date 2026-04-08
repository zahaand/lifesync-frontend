import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useHabitLogs } from '@/hooks/useHabitLogs'

type HabitHistoryDrawerProps = {
  habitId: string | null
  habitTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatLogDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) {
    return `Today, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
  }
  if (isSameDay(date, yesterday)) {
    return `Yesterday, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatLogTime(createdAt: string): string {
  const date = new Date(createdAt)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function HabitHistoryDrawer({
  habitId,
  habitTitle,
  open,
  onOpenChange,
}: HabitHistoryDrawerProps) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHabitLogs(habitId)

  const allLogs = data?.pages.flatMap((page) => page.content) ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full p-0 md:w-[400px]"
      >
        <SheetHeader className="border-b border-[#E8E6DF] dark:border-zinc-800 px-5 py-4">
          <SheetTitle className="text-[16px] font-semibold text-[#2C2C2A] dark:text-zinc-50">
            {habitTitle}
          </SheetTitle>
          <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">Completion history</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {isLoading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center">
              <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">
                Failed to load history.
              </p>
              <Button
                variant="link"
                className="mt-1 h-auto p-0 text-[13px] text-[#534AB7]"
                onClick={() => refetch()}
              >
                Try again.
              </Button>
            </div>
          ) : allLogs.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#9E9B94] dark:text-zinc-500">
              No completions yet
            </div>
          ) : (
            <>
              {allLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b border-[#F5F4F0] dark:border-zinc-800 py-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-[#1D9E75]" />
                    <span className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
                      {formatLogDate(log.date)}
                    </span>
                  </div>
                  <span className="text-[13px] text-[#9E9B94] dark:text-zinc-500">
                    {formatLogTime(log.createdAt)}
                  </span>
                </div>
              ))}

              {hasNextPage && (
                <div className="py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#C7C4BB] dark:border-zinc-800 text-[13px] text-[#666360] dark:text-zinc-500"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
