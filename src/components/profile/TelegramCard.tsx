import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { updateTelegramSchema } from '@/types/users'
import { useUpdateTelegram } from '@/hooks/useUsers'
import type { UserProfile } from '@/types/users'

type TelegramCardProps = {
  profile: UserProfile | undefined
  isLoading: boolean
}

type TelegramFormValues = z.infer<typeof updateTelegramSchema>

export default function TelegramCard({ profile, isLoading }: TelegramCardProps) {
  const updateTelegram = useUpdateTelegram()

  const isLinked = !!profile?.telegramChatId

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TelegramFormValues>({
    resolver: zodResolver(updateTelegramSchema),
    values: profile?.telegramChatId
      ? { telegramChatId: profile.telegramChatId }
      : undefined,
  })

  const onSubmit = (data: TelegramFormValues) => {
    updateTelegram.mutate(data)
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-5 w-24 rounded" />
        <Skeleton className="h-9 w-full rounded" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-[16px] font-medium text-[#2C2C2A] dark:text-zinc-50">Telegram</h2>
          <Badge className="rounded-full border-0 bg-[#E6F1FB] dark:bg-sky-950 px-2 py-0.5 text-[10px] font-medium text-[#0C447C] dark:text-sky-400">
            Optional
          </Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="telegramChatId" className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
              Telegram Chat ID
            </Label>
            <Input
              id="telegramChatId"
              placeholder="e.g. 123456789"
              {...register('telegramChatId')}
              className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg"
            />
            {errors.telegramChatId ? (
              <p className="text-[12px] text-red-500">{errors.telegramChatId.message}</p>
            ) : (
              <p className="text-[11px] text-[#9E9B94] dark:text-zinc-500">
                Link your Telegram to receive habit reminders via bot
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
            disabled={updateTelegram.isPending}
          >
            {updateTelegram.isPending
              ? 'Saving...'
              : isLinked
                ? 'Update'
                : 'Link Telegram'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
