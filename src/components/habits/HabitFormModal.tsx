import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Habit, HabitFrequency, DayOfWeek, CreateHabitRequest } from '@/types/habits'

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Mo' },
  { value: 'TUESDAY', label: 'Tu' },
  { value: 'WEDNESDAY', label: 'We' },
  { value: 'THURSDAY', label: 'Th' },
  { value: 'FRIDAY', label: 'Fr' },
  { value: 'SATURDAY', label: 'Sa' },
  { value: 'SUNDAY', label: 'Su' },
]

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'CUSTOM', label: 'Custom' },
]

const habitFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
    description: z.string().optional(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'CUSTOM'] as const),
    targetDaysOfWeek: z.array(z.enum([
      'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
    ] as const)).optional(),
    reminderTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.frequency === 'CUSTOM') {
        return data.targetDaysOfWeek && data.targetDaysOfWeek.length > 0
      }
      return true
    },
    { message: 'Select at least one day', path: ['targetDaysOfWeek'] },
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
      name: '',
      description: '',
      frequency: 'DAILY',
      targetDaysOfWeek: [],
      reminderTime: '',
    },
  })

  const frequency = watch('frequency')
  const selectedDays = watch('targetDaysOfWeek') ?? []

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && habit) {
        reset({
          name: habit.name,
          description: habit.description ?? '',
          frequency: habit.frequency,
          targetDaysOfWeek: habit.targetDaysOfWeek ?? [],
          reminderTime: habit.reminderTime ?? '',
        })
      } else {
        reset({
          name: '',
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
      name: values.name,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-[16px] font-semibold">
            {mode === 'create' ? 'New habit' : 'Edit habit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4 px-5 py-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px]">Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. Morning Run"
                className="h-9 border-[#C7C4BB] rounded-lg"
              />
              {errors.name && (
                <p className="text-[12px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-[13px]">
                Description <span className="text-[#9E9B94]">(optional)</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="What is this habit about?"
                className="h-20 border-[#C7C4BB] rounded-lg resize-none"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <Label className="text-[13px]">Frequency</Label>
              <div className="flex gap-1">
                {FREQUENCIES.map((f) => (
                  <Button
                    key={f.value}
                    type="button"
                    onClick={() => setValue('frequency', f.value, { shouldValidate: true })}
                    className={`flex-1 text-[13px] h-9 rounded-lg ${
                      frequency === f.value
                        ? 'bg-[#534AB7] text-[#EEEDFE]'
                        : 'bg-[#F5F4F0] text-[#666360] hover:bg-[#EDEDEB]'
                    }`}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Target days (CUSTOM only) */}
            {frequency === 'CUSTOM' && (
              <div className="space-y-1.5">
                <Label className="text-[13px]">Target days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.value)
                    return (
                      <Button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`w-10 h-10 rounded-full text-[12px] p-0 ${
                          isSelected
                            ? 'bg-[#534AB7] text-[#EEEDFE]'
                            : 'bg-[#F5F4F0] text-[#666360] border border-[#E8E6DF] hover:bg-[#EDEDEB]'
                        }`}
                      >
                        {day.label}
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
                Reminder time <span className="text-[#9E9B94]">(optional)</span>
              </Label>
              <Input
                id="reminderTime"
                type="time"
                {...register('reminderTime')}
                className="h-9 border-[#C7C4BB] rounded-lg"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-[#E8E6DF] px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#C7C4BB] text-[13px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#534AB7] text-[#EEEDFE] text-[13px]"
            >
              {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
