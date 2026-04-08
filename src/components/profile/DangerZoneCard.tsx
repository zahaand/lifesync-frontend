import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog'

type DangerZoneCardProps = {
  username: string
}

export default function DangerZoneCard({ username }: DangerZoneCardProps) {
  const { t } = useTranslation('profile')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="border-l-4 border-l-red-400 p-6">
        <CardContent className="p-0">
          <h2 className="mb-3 text-[16px] font-medium text-red-600">{t('dangerZone.title')}</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#2C2C2A] dark:text-zinc-50">{t('dangerZone.deleteButton')}</p>
              <p className="text-[13px] text-[#9E9B94] dark:text-zinc-500">
                {t('dangerZone.description')}
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-lg border-red-300 dark:border-red-800 text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setDialogOpen(true)}
            >
              {t('dangerZone.deleteButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        username={username}
      />
    </>
  )
}
