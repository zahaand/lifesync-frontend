import AccountCard from '@/components/profile/AccountCard'
import TelegramCard from '@/components/profile/TelegramCard'
import StatsCard from '@/components/profile/StatsCard'
import DangerZoneCard from '@/components/profile/DangerZoneCard'
import { useCurrentUser } from '@/hooks/useUsers'

export default function ProfilePage() {
  const { data: profile, isLoading } = useCurrentUser()

  return (
    <div className="mx-auto max-w-[680px] space-y-4">
      <h1 className="mb-2 text-[20px] font-semibold text-[#2C2C2A]">Profile</h1>
      <AccountCard profile={profile} isLoading={isLoading} />
      <TelegramCard profile={profile} isLoading={isLoading} />
      <StatsCard />
      <DangerZoneCard username={profile?.username ?? ''} />
    </div>
  )
}
