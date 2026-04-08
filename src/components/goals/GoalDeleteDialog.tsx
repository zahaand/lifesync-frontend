import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('goals')
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
          <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteDialog.description', { name: goalTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleDelete}
            disabled={deleteGoal.isPending}
          >
            {deleteGoal.isPending ? t('deleteDialog.deleting') : t('deleteDialog.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
