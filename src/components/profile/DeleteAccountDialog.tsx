import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useDeleteAccount } from '@/hooks/useUsers'

type DeleteAccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  username,
}: DeleteAccountDialogProps) {
  const [confirmValue, setConfirmValue] = useState('')
  const deleteAccount = useDeleteAccount()

  const isMatch = confirmValue === username

  const handleConfirm = () => {
    if (!isMatch) return
    deleteAccount.mutate()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setConfirmValue('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold text-red-600">
            Delete account
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#666360] dark:text-zinc-500">
            This action cannot be undone. All your habits, goals, and data will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-1 py-2">
          <Label htmlFor="confirm-username" className="text-[13px] text-[#2C2C2A] dark:text-zinc-50">
            Type your username to confirm:
          </Label>
          <Input
            id="confirm-username"
            placeholder={username}
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            className="h-9 border-[#C7C4BB] dark:border-zinc-800 rounded-lg"
          />
        </div>

        <DialogFooter className="flex justify-end gap-2 border-t border-[#E8E6DF] dark:border-zinc-800 px-1 pt-3">
          <Button
            variant="outline"
            className="rounded-lg border-[#C7C4BB] dark:border-zinc-800 px-4 py-2 text-[13px] text-[#666360] dark:text-zinc-500"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-red-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-red-600"
            onClick={handleConfirm}
            disabled={!isMatch || deleteAccount.isPending}
          >
            {deleteAccount.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
