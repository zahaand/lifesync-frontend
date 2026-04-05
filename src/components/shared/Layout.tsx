import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Target, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useUsers'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Layout() {
  const authUser = useAuthStore((s) => s.user)
  const { data: profile } = useCurrentUser()
  const logout = useLogout()

  const displayName = profile?.displayName || profile?.username || authUser?.username || ''
  const email = profile?.email || authUser?.email || ''

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="p-4">
          <h2 className="text-lg font-semibold">LifeSync</h2>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Separator />

        <div className="p-4">
          {(authUser || profile) && (
            <div className="mb-3">
              <p className="truncate text-sm font-medium">
                {displayName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {email}
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
