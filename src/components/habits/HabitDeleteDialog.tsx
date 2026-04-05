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

type HabitDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  habitName: string
  onConfirm: () => void
}

export default function HabitDeleteDialog({
  open,
  onOpenChange,
  habitName,
  onConfirm,
}: HabitDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete habit</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The habit &ldquo;{habitName}&rdquo; and all its
            completion history will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
