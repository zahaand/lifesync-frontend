import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
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
import type { Goal, GoalDetail as GoalDetailType } from '@/types/goals'

export default function GoalsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useAllGoals()
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

  return (
    <div className="grid h-[calc(100vh-0px)] grid-cols-[380px_1fr]">
      {/* Left column: Goals list */}
      <div className="overflow-y-auto border-r border-[#E8E6DF] p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#2C2C2A]">Goals</h1>
            <p className="mt-1 text-[13px] text-[#9E9B94]">
              {activeCount} active · {completedCount} completed
            </p>
          </div>
          <Button
            className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="mr-1.5 size-4" />
            New goal
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
          <div className="py-12 text-center text-[13px] text-[#9E9B94]">
            No {filterTab.toLowerCase()} goals
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

      {/* Right panel: Goal detail */}
      <div className="overflow-y-auto bg-[#F5F4F0] p-6">
        {effectiveSelectedId && selectedGoal ? (
          <GoalDetail
            goalId={effectiveSelectedId}
            listGoal={selectedGoal}
            onEdit={() => setEditModalOpen(true)}
            onDelete={() => setDeleteDialogOpen(true)}
          />
        ) : (
          <GoalEmptyState variant="no-selection" />
        )}
      </div>

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
