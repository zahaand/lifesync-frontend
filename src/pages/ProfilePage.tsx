import { useTranslation } from 'react-i18next'
import AccountCard from '@/components/profile/AccountCard'
import TelegramCard from '@/components/profile/TelegramCard'
import StatsCard from '@/components/profile/StatsCard'
import DangerZoneCard from '@/components/profile/DangerZoneCard'
import { useCurrentUser } from '@/hooks/useUsers'

export default function ProfilePage() {
  const { t } = useTranslation('profile')
  const { data: profile, isLoading } = useCurrentUser()

  return (
    <div className="mx-auto max-w-full space-y-4 px-0 md:max-w-[680px]">
      <h1 className="mb-2 text-[20px] font-semibold text-[#2C2C2A] dark:text-zinc-50">{t('page.title')}</h1>
      <AccountCard profile={profile} isLoading={isLoading} />
      <TelegramCard profile={profile} isLoading={isLoading} />
      <StatsCard />
      <DangerZoneCard username={profile?.username ?? ''} />
    </div>
  )
}
