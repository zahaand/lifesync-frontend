import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import HabitCard from '@/components/habits/HabitCard'
import HabitEmptyState from '@/components/habits/HabitEmptyState'
import HabitFormModal from '@/components/habits/HabitFormModal'
import HabitFilters from '@/components/habits/HabitFilters'
import HabitDeleteDialog from '@/components/habits/HabitDeleteDialog'
import {
  useAllHabits,
  useCompleteHabit,
  useUncompleteHabit,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
} from '@/hooks/useHabits'
import type { Habit, CreateHabitRequest } from '@/types/habits'

export default function HabitsPage() {
  const { data: habitsData, isLoading } = useAllHabits()
  const completeHabit = useCompleteHabit()
  const uncompleteHabit = useUncompleteHabit()
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()
  const deleteHabit = useDeleteHabit()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const { activeHabits, archivedHabits, filteredActive, filteredArchived, hasAnyHabits, hasFilteredResults } =
    useMemo(() => {
      const allHabits = habitsData?.content ?? []
      const active = allHabits.filter((h) => h.isActive)
      const archived = allHabits.filter((h) => !h.isActive)

      let visibleActive = active
      let visibleArchived = archived

      if (filterTab === 'ACTIVE') {
        visibleArchived = []
      } else if (filterTab === 'ARCHIVED') {
        visibleActive = []
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        visibleActive = visibleActive.filter((h) => h.name.toLowerCase().includes(q))
        visibleArchived = visibleArchived.filter((h) => h.name.toLowerCase().includes(q))
      }

      return {
        activeHabits: active,
        archivedHabits: archived,
        filteredActive: visibleActive,
        filteredArchived: visibleArchived,
        hasAnyHabits: allHabits.length > 0,
        hasFilteredResults: visibleActive.length > 0 || visibleArchived.length > 0,
      }
    }, [habitsData, filterTab, searchQuery])

  const handleComplete = (habitId: string) => {
    completeHabit.mutate(habitId)
  }

  const handleUncomplete = (habitId: string, logId: string) => {
    uncompleteHabit.mutate({ habitId, logId })
  }

  const handleCreateSubmit = (data: CreateHabitRequest) => {
    createHabit.mutate(data, {
      onSuccess: () => setCreateModalOpen(false),
    })
  }

  const handleEditSubmit = (data: CreateHabitRequest) => {
    if (!editingHabit) return
    updateHabit.mutate(
      { id: editingHabit.id, data },
      { onSuccess: () => setEditingHabit(null) },
    )
  }

  const handleArchive = (habitId: string) => {
    updateHabit.mutate(
      { id: habitId, data: { isActive: false } },
      { onSuccess: () => toast.success('Habit archived') },
    )
  }

  const handleRestore = (habitId: string) => {
    updateHabit.mutate(
      { id: habitId, data: { isActive: true } },
      { onSuccess: () => toast.success('Habit restored') },
    )
  }

  const handleDeleteConfirm = () => {
    if (!deletingHabit) return
    deleteHabit.mutate(deletingHabit.id, {
      onSuccess: () => setDeletingHabit(null),
    })
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#2C2C2A]">Habits</h1>
          <p className="text-[13px] text-[#9E9B94] mt-1">
            {activeHabits.length} active · {archivedHabits.length} archived
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#534AB7] text-[#EEEDFE] text-[13px] font-medium px-4 py-2 rounded-lg"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New habit
        </Button>
      </div>

      {/* Filters */}
      <HabitFilters
        activeFilter={filterTab}
        onFilterChange={setFilterTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Content */}
      {!hasAnyHabits ? (
        <HabitEmptyState variant="no-habits" onCreateClick={() => setCreateModalOpen(true)} />
      ) : !hasFilteredResults ? (
        <HabitEmptyState variant="no-results" />
      ) : (
        <>
          {/* Active section */}
          {filteredActive.length > 0 && (
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#9E9B94] mb-3">
                Active — {filteredActive.length}
              </h2>
              {filteredActive.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleComplete}
                  onUncomplete={handleUncomplete}
                  onEdit={setEditingHabit}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeletingHabit}
                />
              ))}
            </div>
          )}

          {/* Archived section */}
          {filteredArchived.length > 0 && (
            <div className={filteredActive.length > 0 ? 'mt-5' : ''}>
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-[#9E9B94] mb-3">
                Archived — {filteredArchived.length}
              </h2>
              {filteredArchived.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onComplete={handleComplete}
                  onUncomplete={handleUncomplete}
                  onEdit={setEditingHabit}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={setDeletingHabit}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <HabitFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isPending={createHabit.isPending}
      />

      {/* Edit modal */}
      <HabitFormModal
        open={editingHabit !== null}
        onOpenChange={(open) => { if (!open) setEditingHabit(null) }}
        mode="edit"
        habit={editingHabit}
        onSubmit={handleEditSubmit}
        isPending={updateHabit.isPending}
      />

      {/* Delete dialog */}
      <HabitDeleteDialog
        open={deletingHabit !== null}
        onOpenChange={(open) => { if (!open) setDeletingHabit(null) }}
        habitName={deletingHabit?.name ?? ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
