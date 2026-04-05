import { useEffect } from 'react'
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
        <h2 className="mb-4 text-[16px] font-medium text-[#2C2C2A]">Account</h2>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EEEDFE] text-[20px] font-medium text-[#534AB7]">
            {initials}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[13px] text-[#2C2C2A]">
                Username
              </Label>
              <Input
                id="username"
                value={profile?.username ?? ''}
                disabled
                className="h-9 border-[#C7C4BB] rounded-lg bg-[#F5F4F0] text-[#9E9B94]"
              />
              <p className="text-[11px] text-[#9E9B94]">Username cannot be changed</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-[13px] text-[#2C2C2A]">
                Display name
              </Label>
              <Input
                id="displayName"
                placeholder="e.g. Alice Johnson"
                {...register('displayName')}
                className="h-9 border-[#C7C4BB] rounded-lg"
              />
              {errors.displayName ? (
                <p className="text-[12px] text-red-500">{errors.displayName.message}</p>
              ) : (
                <p className="text-[11px] text-[#9E9B94]">
                  Used in greetings — leave empty to use your username
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] text-[#2C2C2A]">
                Email
              </Label>
              <Input
                id="email"
                value={profile?.email ?? ''}
                disabled
                className="h-9 border-[#C7C4BB] rounded-lg bg-[#F5F4F0] text-[#9E9B94]"
              />
              <p className="text-[11px] text-[#9E9B94]">Email cannot be changed</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-[#C7C4BB] px-4 py-2 text-[13px] text-[#666360]"
                onClick={handleCancel}
                disabled={!isDirty}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg bg-[#534AB7] px-4 py-2 text-[13px] font-medium text-[#EEEDFE]"
                disabled={!isDirty || updateProfile.isPending}
              >
                {updateProfile.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
