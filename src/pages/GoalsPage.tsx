import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import GoalCard from '@/components/goals/GoalCard'
import GoalDetail from '@/components/goals/GoalDetail'
import GoalEmptyState from '@/components/goals/GoalEmptyState'
import GoalFilters, { type GoalFilterTab } from '@/components/goals/GoalFilters'
import GoalFormModal from '@/components/goals/GoalFormModal'
import GoalDeleteDialog from '@/components/goals/GoalDeleteDialog'
import { useQueryClient } from '@tanstack/react-query'
import { useAllGoals } from '@/hooks/useGoals'
import useIsMobile from '@/hooks/useIsMobile'
import type { Goal, GoalDetail as GoalDetailType } from '@/types/goals'

export default function GoalsPage() {
  const { t } = useTranslation('goals')
  const queryClient = useQueryClient()
  const { data, isLoading } = useAllGoals()
  const isMobile = useIsMobile()
  const allGoals = useMemo(() => data?.content ?? [], [data])

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [filterTab, setFilterTab] = useState<GoalFilterTab>('ALL')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Filter pipeline
  const filteredGoals = useMemo(
    () =>
      allGoals.filter((g) => {
        if (filterTab === 'ALL') return true
        return g.status === filterTab
      }),
    [allGoals, filterTab],
  )

  // Effective selection: clear if selected goal not in filtered list
  const effectiveSelectedId = useMemo(() => {
    if (!selectedGoalId) return null
    if (filteredGoals.some((g) => g.id === selectedGoalId)) return selectedGoalId
    return null
  }, [selectedGoalId, filteredGoals])

  const selectedGoal: Goal | undefined = allGoals.find((g) => g.id === effectiveSelectedId)

  const activeCount = allGoals.filter((g) => g.status === 'ACTIVE').length
  const completedCount = allGoals.filter((g) => g.status === 'COMPLETED').length

  const handleDeleted = () => {
    setSelectedGoalId(null)
    setDeleteDialogOpen(false)
  }

  // Mobile: show detail when goal selected, list otherwise
  const showDetail = isMobile && effectiveSelectedId !== null
  const showList = !isMobile || !effectiveSelectedId

  return (
    <div className={isMobile ? 'min-h-0' : 'grid h-[calc(100vh-0px)] grid-cols-[380px_1fr]'}>
      {/* Left column: Goals list */}
      {showList && (
        <div className={`overflow-y-auto p-4 md:border-r md:border-[#E8E6DF] md:dark:border-zinc-800 md:p-6 ${!isMobile ? '' : ''}`}>
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-semibold text-[#2C2C2A] dark:text-zinc-50">{t('page.title')}</h1>
              <p className="mt-1 text-[13px] text-[#9E9B94] dark:text-zinc-500">
                {activeCount} {t('page.statsActive')} · {completedCount} {t('page.statsCompleted')}
              </p>
            </div>
            <Button
              data-testid="new-goal-button"
              className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="mr-1.5 size-4" />
              {t('action.newGoal')}
            </Button>
          </div>

          {/* Filter tabs */}
          <GoalFilters activeFilter={filterTab} onFilterChange={setFilterTab} />

          {/* Goals list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[120px] rounded-xl" />
              ))}
            </div>
          ) : allGoals.length === 0 ? (
            <GoalEmptyState variant="no-goals" onCreateClick={() => setCreateModalOpen(true)} />
          ) : filteredGoals.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#9E9B94] dark:text-zinc-500">
              {t('emptyState.noFilteredGoals', { filter: filterTab.toLowerCase() })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGoals.map((goal) => {
                const cached = queryClient.getQueryData<GoalDetailType>(['goals', goal.id])
                return (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    isSelected={goal.id === effectiveSelectedId}
                    linkedHabitsCount={cached?.linkedHabitIds?.length}
                    onClick={() => setSelectedGoalId(goal.id)}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Right panel: Goal detail */}
      {(!isMobile || showDetail) && (
        <div className={`overflow-y-auto p-4 md:bg-[#F5F4F0] md:dark:bg-zinc-900 md:p-6 ${isMobile ? '' : 'bg-[#F5F4F0] dark:bg-zinc-900'}`}>
          {/* Mobile back button */}
          {isMobile && effectiveSelectedId && (
            <Button
              data-testid="goals-back-button"
              variant="ghost"
              className="mb-3 flex items-center gap-1 px-0 text-sm text-[#534AB7] hover:text-[#534AB7]"
              onClick={() => setSelectedGoalId(null)}
            >
              <ArrowLeft className="size-4" />
              {t('page.title')}
            </Button>
          )}

          {effectiveSelectedId && selectedGoal ? (
            <GoalDetail
              goalId={effectiveSelectedId}
              listGoal={selectedGoal}
              onEdit={() => setEditModalOpen(true)}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          ) : (
            !isMobile && <GoalEmptyState variant="no-selection" />
          )}
        </div>
      )}

      {/* Create modal */}
      <GoalFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
      />

      {/* Edit modal */}
      {selectedGoal && (
        <GoalFormModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          mode="edit"
          goal={selectedGoal}
        />
      )}

      {/* Delete dialog */}
      {selectedGoal && (
        <GoalDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          goalId={selectedGoal.id}
          goalTitle={selectedGoal.title}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
