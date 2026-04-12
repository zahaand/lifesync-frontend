import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { updateProfileSchema } from '@/types/users'
import { useUpdateProfile } from '@/hooks/useUsers'
import type { UserProfile } from '@/types/users'

type AccountCardProps = {
  profile: UserProfile | undefined
  isLoading: boolean
}

type ProfileFormValues = z.infer<typeof updateProfileSchema>

export default function AccountCard({ profile, isLoading }: AccountCardProps) {
  const { t } = useTranslation('profile')
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { displayName: '' },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form

  useEffect(() => {
    if (profile) {
      reset({ displayName: profile.displayName ?? '' })
    }
  }, [profile, reset])

  const onSubmit = (data: ProfileFormValues) => {
    const displayName = data.displayName.trim() || null
    updateProfile.mutate(
      { displayName },
      {
        onSuccess: () => {
          reset({ displayName: displayName ?? '' })
        },
      },
    )
  }

  const handleCancel = () => {
    if (profile) {
      reset({ displayName: profile.displayName ?? '' })
    }
  }

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : '??'

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-5 w-24 rounded" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-9 w-full rounded" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <h2 className="mb-4 text-[16px] font-medium text-[#2C2C2A] dark:text-zinc-50">{t('account.title')}</h2>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEEDFE] dark:bg-[#534AB7]/20 text-[20px] font-medium text-[#534AB7]">
            {initials}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
                {t('account.usernameLabel')}
              </Label>
              <Input
                id="username"
                value={profile?.username ?? ''}
                disabled
                className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg bg-[#F5F4F0] dark:bg-zinc-800 text-[#9E9B94] dark:text-zinc-500"
              />
              <p className="text-[11px] text-[#9E9B94] dark:text-zinc-500">{t('account.usernameReadOnly')}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
                {t('account.displayNameLabel')}
              </Label>
              <Input
                id="displayName"
                placeholder={t('account.displayNamePlaceholder')}
                {...register('displayName')}
                className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg"
              />
              {errors.displayName ? (
                <p className="text-[12px] text-red-500">{errors.displayName.message}</p>
              ) : (
                <p className="text-[11px] text-[#9E9B94] dark:text-zinc-500">
                  {t('account.displayNameHint')}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
                {t('account.emailLabel')}
              </Label>
              <Input
                id="email"
                value={profile?.email ?? ''}
                disabled
                className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg bg-[#F5F4F0] dark:bg-zinc-800 text-[#9E9B94] dark:text-zinc-500"
              />
              <p className="text-[11px] text-[#9E9B94] dark:text-zinc-500">{t('account.emailReadOnly')}</p>
            </div>

            {isDirty && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-4 py-2 text-[13px] text-[#666360] dark:text-zinc-500"
                  onClick={handleCancel}
                >
                  {t('account.cancelButton')}
                </Button>
                <Button
                  type="submit"
                  className="min-w-[120px] rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? t('common:status.saving') : t('account.saveButton')}
                </Button>
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
