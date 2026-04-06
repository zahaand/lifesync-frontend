import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Target, User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useUsers'
import useIsMobile from '@/hooks/useIsMobile'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/profile', label: 'Profile', icon: User },
]

function SidebarContent({
  onNavClick,
}: {
  onNavClick?: () => void
}) {
  const authUser = useAuthStore((s) => s.user)
  const { data: profile } = useCurrentUser()
  const logout = useLogout()

  const displayName = profile?.displayName || profile?.username || authUser?.username || ''
  const email = profile?.email || authUser?.email || ''

  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold">LifeSync</h2>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-[#EEEDFE] text-[#534AB7]'
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
    </>
  )
}

export default function Layout() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Mobile topbar */}
      {isMobile && (
        <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center border-b border-[#E8E6DF] bg-white px-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <span className="flex-1 text-center text-base font-semibold text-[#534AB7]">
            LifeSync
          </span>
          <div className="size-8" />
        </header>
      )}

      {/* Mobile sidebar Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="flex w-[260px] flex-col bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent onNavClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
          <SidebarContent />
        </aside>
      )}

      <main className={`flex-1 overflow-auto p-4 md:p-6 ${isMobile ? 'pt-18' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}
