import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { updateUsernameSchema } from '@/types/users'
import { useUpdateUsername } from '@/hooks/useUsers'
import type { UserProfile } from '@/types/users'

type AccountCardProps = {
  profile: UserProfile | undefined
  isLoading: boolean
}

type UsernameFormValues = z.infer<typeof updateUsernameSchema>

export default function AccountCard({ profile, isLoading }: AccountCardProps) {
  const updateUsername = useUpdateUsername()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(updateUsernameSchema),
    values: profile ? { username: profile.username } : undefined,
  })

  const onSubmit = (data: UsernameFormValues) => {
    updateUsername.mutate(
      { username: data.username },
      {
        onSuccess: () => {
          reset({ username: data.username })
        },
      },
    )
  }

  const handleCancel = () => {
    if (profile) {
      reset({ username: profile.username })
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
                {...register('username')}
                className="h-9 border-[#C7C4BB] rounded-lg"
              />
              {errors.username ? (
                <p className="text-[12px] text-red-500">{errors.username.message}</p>
              ) : (
                <p className="text-[11px] text-[#9E9B94]">
                  3–32 characters: letters, digits, _ and -
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
                disabled={!isDirty || updateUsername.isPending}
              >
                {updateUsername.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
