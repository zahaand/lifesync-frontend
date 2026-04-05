import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog'

type DangerZoneCardProps = {
  username: string
}

export default function DangerZoneCard({ username }: DangerZoneCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="border-l-4 border-l-red-400 p-6">
        <CardContent className="p-0">
          <h2 className="mb-3 text-[16px] font-medium text-red-600">Danger zone</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#2C2C2A]">Delete account</p>
              <p className="text-[13px] text-[#9E9B94]">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-lg border-red-300 text-[13px] text-red-600 hover:bg-red-50"
              onClick={() => setDialogOpen(true)}
            >
              Delete account
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
