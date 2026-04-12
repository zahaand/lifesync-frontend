import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import i18n from 'i18next'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Habit, HabitFrequency, DayOfWeek, CreateHabitRequest } from '@/types/habits'

const DAY_KEYS: { value: DayOfWeek; labelKey: string }[] = [
  { value: 'MONDAY', labelKey: 'days.mo' },
  { value: 'TUESDAY', labelKey: 'days.tu' },
  { value: 'WEDNESDAY', labelKey: 'days.we' },
  { value: 'THURSDAY', labelKey: 'days.th' },
  { value: 'FRIDAY', labelKey: 'days.fr' },
  { value: 'SATURDAY', labelKey: 'days.sa' },
  { value: 'SUNDAY', labelKey: 'days.su' },
]

const FREQUENCY_KEYS: { value: HabitFrequency; labelKey: string }[] = [
  { value: 'DAILY', labelKey: 'form.frequencyDaily' },
  { value: 'WEEKLY', labelKey: 'form.frequencyWeekly' },
  { value: 'CUSTOM', labelKey: 'form.frequencyCustom' },
]

const habitFormSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'CUSTOM'] as const),
    targetDaysOfWeek: z.array(z.enum([
      'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
    ] as const)).optional(),
    reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.frequency === 'CUSTOM') {
        return data.targetDaysOfWeek && data.targetDaysOfWeek.length > 0
      }
      return true
    },
    { message: i18n.t('habits:form.targetDaysRequired'), path: ['targetDaysOfWeek'] },
  )

type HabitFormValues = z.infer<typeof habitFormSchema>

type HabitFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  habit?: Habit | null
  onSubmit: (data: CreateHabitRequest) => void
  isPending: boolean
}

export default function HabitFormModal({
  open,
  onOpenChange,
  mode,
  habit,
  onSubmit,
  isPending,
}: HabitFormModalProps) {
  const { t } = useTranslation('habits')
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: '',
      description: '',
      frequency: 'DAILY',
      targetDaysOfWeek: [],
      reminderTime: '',
    },
  })

  const frequency = watch('frequency')
  const selectedDays = watch('targetDaysOfWeek') ?? []

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

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && habit) {
        reset({
          title: habit.title,
          description: habit.description ?? '',
          frequency: habit.frequency,
          targetDaysOfWeek: habit.targetDaysOfWeek ?? [],
          reminderTime: habit.reminderTime ?? '',
        })
      } else {
        reset({
          title: '',
          description: '',
          frequency: 'DAILY',
          targetDaysOfWeek: [],
          reminderTime: '',
        })
      }
    }
  }, [open, mode, habit, reset])

  const toggleDay = (day: DayOfWeek) => {
    const current = selectedDays
    if (current.includes(day)) {
      setValue(
        'targetDaysOfWeek',
        current.filter((d) => d !== day),
        { shouldValidate: true },
      )
    } else {
      setValue('targetDaysOfWeek', [...current, day], { shouldValidate: true })
    }
  }

  const handleFormSubmit = (values: HabitFormValues) => {
    const payload: CreateHabitRequest = {
      title: values.title,
      frequency: values.frequency,
    }
    if (values.description) {
      payload.description = values.description
    }
    if (values.frequency === 'CUSTOM' && values.targetDaysOfWeek?.length) {
      payload.targetDaysOfWeek = values.targetDaysOfWeek
    }
    if (values.reminderTime) {
      payload.reminderTime = values.reminderTime
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px] p-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-[16px] font-semibold">
            {mode === 'create' ? t('form.createTitle') : t('form.editTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4 px-5 py-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[13px]">{t('form.nameLabel')}</Label>
              <Input
                id="title"
                data-testid="habit-title-input"
                {...register('title')}
                placeholder={t('form.namePlaceholder')}
                className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg"
              />
              {errors.title && (
                <p className="text-[12px] text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[13px]">
                {t('form.descriptionLabel')} <span className="text-[#9E9B94] dark:text-zinc-500">{t('common:optional')}</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('form.descriptionPlaceholder')}
                className="h-20 border-[#C7C4BB] dark:border-zinc-800 rounded-lg resize-none"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <Label className="text-[13px]">{t('form.frequencyLabel')}</Label>
              <div className="flex gap-1">
                {FREQUENCY_KEYS.map((f) => (
                  <Button
                    key={f.value}
                    type="button"
                    onClick={() => setValue('frequency', f.value, { shouldValidate: true })}
                    className={`flex-1 text-[13px] h-9 rounded-lg ${
                      frequency === f.value
                        ? 'bg-[#534AB7] text-[#EEEDFE]'
                        : 'bg-[#F5F4F0] dark:bg-zinc-800 text-[#666360] dark:text-zinc-500 hover:bg-[#EDEDEB] dark:hover:bg-zinc-700'
                    }`}
                  >
                    {t(f.labelKey)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target days (CUSTOM only) */}
            {frequency === 'CUSTOM' && (
              <div className="space-y-1.5">
                <Label className="text-[13px]">{t('form.targetDaysLabel')}</Label>
                <p className="text-[11px] text-[#9E9B94] dark:text-zinc-600">{t('form.customFrequencyHint')}</p>
                <div className="flex flex-wrap gap-2">
                  {DAY_KEYS.map((day) => {
                    const isSelected = selectedDays.includes(day.value)
                    return (
                      <Button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`w-10 h-10 rounded-full text-[12px] p-0 ${
                          isSelected
                            ? 'bg-[#534AB7] text-[#EEEDFE]'
                            : 'bg-[#F5F4F0] dark:bg-zinc-800 text-[#666360] dark:text-zinc-500 border border-[#E8E6DF] dark:border-zinc-800 hover:bg-[#EDEDEB] dark:hover:bg-zinc-700'
                        }`}
                      >
                        {t(day.labelKey)}
                      </Button>
                    )
                  })}
                </div>
                {errors.targetDaysOfWeek && (
                  <p className="text-[12px] text-red-500">{errors.targetDaysOfWeek.message}</p>
                )}
              </div>
            )}

            {/* Reminder time */}
            <div className="space-y-1.5">
              <Label htmlFor="reminderTime" className="text-[13px]">
                {t('form.reminderTimeLabel')} <span className="text-[#9E9B94] dark:text-zinc-500">{t('common:optional')}</span>
              </Label>
              <Input
                id="reminderTime"
                type="time"
                {...register('reminderTime')}
                className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-[#E8E6DF] dark:border-zinc-800 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-[#C7C4BB] text-[13px]"
            >
              {t('form.cancel')}
            </Button>
            <Button
              type="submit"
              data-testid="habit-submit-button"
              disabled={isPending}
              className="bg-[#534AB7] text-[#EEEDFE] text-[13px]"
            >
              {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {mode === 'create' ? t('form.create') : t('form.save')}
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
