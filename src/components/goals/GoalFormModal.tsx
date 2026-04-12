import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parse } from 'date-fns'
import { ru } from 'date-fns/locale'
import { enUS } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  title: z.string().min(1).max(200),
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
  const { t, i18n } = useTranslation('goals')
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const isPending = createGoal.isPending || updateGoal.isPending
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

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
  const targetDateValue = watch('targetDate')
  const dateLocale = i18n.language === 'ru' ? ru : enUS

  const selectedDate = targetDateValue
    ? parse(targetDateValue, 'yyyy-MM-dd', new Date())
    : undefined

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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const title = watch('title')
      if (title && title.trim().length > 0) {
        setShowDiscardDialog(true)
        return
      }
    }
    onOpenChange(nextOpen)
  }

  const handleDiscard = () => {
    setShowDiscardDialog(false)
    reset()
    onOpenChange(false)
  }

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">
            {mode === 'create' ? t('form.createTitle') : t('form.editTitle')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'create' ? t('form.createDescription') : t('form.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-5 py-5">
            {/* Title */}
            <div>
              <Label className="mb-1.5 text-[13px]">{t('form.titleLabel')}</Label>
              <Input
                data-testid="goal-title-input"
                {...register('title')}
                className="h-9 rounded-lg border-[#C7C4BB] dark:border-zinc-800"
                placeholder={t('form.titlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-1 text-[12px] text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1.5 text-[13px]">{t('form.descriptionLabel')}</Label>
              <Textarea
                {...register('description')}
                className="h-20 resize-none rounded-lg border-[#C7C4BB] dark:border-zinc-800"
                placeholder={t('form.descriptionPlaceholder')}
              />
            </div>

            {/* Target date */}
            <div>
              <Label className="mb-1.5 text-[13px]">{t('form.targetDateLabel')}</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'h-9 w-full justify-start rounded-lg border-[#C7C4BB] dark:border-zinc-800 text-left text-[13px] font-normal',
                      !targetDateValue && 'text-[#9E9B94] dark:text-zinc-500',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {selectedDate
                      ? format(selectedDate, 'PPP', { locale: dateLocale })
                      : t('form.pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setValue('targetDate', date ? format(date, 'yyyy-MM-dd') : '')
                      setCalendarOpen(false)
                    }}
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status (edit only) */}
            {mode === 'edit' && (
              <div>
                <Label className="mb-1.5 text-[13px]">{t('form.statusLabel')}</Label>
                <Select
                  value={statusValue}
                  onValueChange={(v) => setValue('status', v as GoalStatus)}
                >
                  <SelectTrigger className="h-9 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">{t('card.active')}</SelectItem>
                    <SelectItem value="COMPLETED">{t('card.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end border-t border-[#E8E6DF] dark:border-zinc-800 px-5 pb-4 pt-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-4 py-2 text-[13px] text-[#666360] dark:text-zinc-500"
              onClick={() => handleOpenChange(false)}
            >
              {t('form.cancel')}
            </Button>
            <Button
              type="submit"
              data-testid="goal-submit-button"
              className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] text-[#EEEDFE]"
              disabled={isPending}
            >
              {isPending ? t('form.saving') : t('form.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('form.unsavedChanges.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('form.unsavedChanges.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('form.unsavedChanges.keepEditing')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('form.unsavedChanges.discard')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
