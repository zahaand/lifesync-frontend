import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateGoal, useUpdateGoal } from '@/hooks/useGoals'
import type { Goal, GoalStatus } from '@/types/goals'

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().optional(),
  targetDate: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

type GoalFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  goal?: Goal
}

export default function GoalFormModal({ open, onOpenChange, mode, goal }: GoalFormModalProps) {
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const isPending = createGoal.isPending || updateGoal.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      targetDate: '',
      status: 'ACTIVE',
    },
  })

  const statusValue = watch('status')

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && goal) {
        reset({
          title: goal.title,
          description: goal.description ?? '',
          targetDate: goal.targetDate ?? '',
          status: goal.status,
        })
      } else {
        reset({
          title: '',
          description: '',
          targetDate: '',
          status: 'ACTIVE',
        })
      }
    }
  }, [open, mode, goal, reset])

  const onSubmit = (values: GoalFormValues) => {
    if (mode === 'create') {
      createGoal.mutate(
        {
          title: values.title,
          description: values.description || undefined,
          targetDate: values.targetDate || undefined,
        },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else if (goal) {
      updateGoal.mutate(
        {
          id: goal.id,
          data: {
            title: values.title,
            description: values.description || undefined,
            targetDate: values.targetDate || undefined,
            status: values.status as GoalStatus,
          },
        },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">
            {mode === 'create' ? 'Create goal' : 'Edit goal'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'create' ? 'Create a new goal' : 'Edit an existing goal'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-5 py-5">
            {/* Title */}
            <div>
              <Label className="mb-1.5 text-[13px]">Title</Label>
              <Input
                {...register('title')}
                className="h-9 rounded-lg border-[#C7C4BB]"
                placeholder="Goal title"
              />
              {errors.title && (
                <p className="mt-1 text-[12px] text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1.5 text-[13px]">Description</Label>
              <Textarea
                {...register('description')}
                className="h-20 resize-none rounded-lg border-[#C7C4BB]"
                placeholder="Optional description"
              />
            </div>

            {/* Target date */}
            <div>
              <Label className="mb-1.5 text-[13px]">Target date</Label>
              <Input
                {...register('targetDate')}
                type="date"
                className="h-9 rounded-lg border-[#C7C4BB]"
              />
            </div>

            {/* Status (edit only) */}
            {mode === 'edit' && (
              <div>
                <Label className="mb-1.5 text-[13px]">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(v) => setValue('status', v as GoalStatus)}
                >
                  <SelectTrigger className="h-9 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end border-t border-[#E8E6DF] px-5 pb-4 pt-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-[#C7C4BB] px-4 py-2 text-[13px] text-[#666360]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] text-[#EEEDFE]"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
