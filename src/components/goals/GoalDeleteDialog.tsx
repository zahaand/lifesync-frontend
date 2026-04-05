import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteGoal } from '@/hooks/useGoals'

type GoalDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
  goalTitle: string
  onDeleted: () => void
}

export default function GoalDeleteDialog({
  open,
  onOpenChange,
  goalId,
  goalTitle,
  onDeleted,
}: GoalDeleteDialogProps) {
  const deleteGoal = useDeleteGoal()

  const handleDelete = () => {
    deleteGoal.mutate(goalId, {
      onSuccess: () => {
        onOpenChange(false)
        onDeleted()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete goal</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{goalTitle}&quot; and all its milestones. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleDelete}
            disabled={deleteGoal.isPending}
          >
            {deleteGoal.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
