import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'

export default function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="p-4">
          <h2 className="text-lg font-semibold">LifeSync</h2>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-2">
          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-sidebar-accent text-sidebar-accent-foreground">
            <LayoutDashboard className="size-4" />
            Dashboard
          </div>
          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="size-4" />
            Settings
          </div>
        </nav>

        <Separator />

        <div className="p-4">
          {user && (
            <div className="mb-3">
              <p className="truncate text-sm font-medium">
                {user.displayName ?? user.username}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {user.email}
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="size-4" />
            {logout.isPending ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
