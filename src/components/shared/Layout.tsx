import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, Target, User, LogOut, Menu, ChevronUp, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useLogout } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useUsers'
import useIsMobile from '@/hooks/useIsMobile'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/profile', label: 'Profile', icon: User },
]

function getInitials(displayName: string | undefined, username: string | undefined): string {
  const name = displayName || username || ''
  return name.slice(0, 2).toUpperCase()
}

function UserChip({ onNavClick }: { onNavClick?: () => void }) {
  const authUser = useAuthStore((s) => s.user)
  const { data: profile } = useCurrentUser()
  const logout = useLogout()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const [open, setOpen] = useState(false)

  const displayName = profile?.displayName || profile?.username || authUser?.username || ''
  const email = profile?.email || authUser?.email || ''
  const initials = getInitials(profile?.displayName ?? undefined, profile?.username ?? authUser?.username)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-testid="user-chip"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-sidebar-accent"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] dark:bg-[#534AB7]/20 text-xs font-semibold text-[#534AB7]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>
          </div>
          <ChevronUp
            className={`size-4 shrink-0 text-sidebar-foreground/40 transition-transform ${open ? '' : 'rotate-180'}`}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-[232px] dark:bg-[#1c1c1e] dark:border-zinc-700">
        <DropdownMenuItem
          onClick={() => {
            toggleTheme()
            onNavClick?.()
          }}
          className="dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          {theme === 'light' ? (
            <Moon className="mr-2 size-4 text-zinc-400" />
          ) : (
            <Sun className="mr-2 size-4 text-amber-400" />
          )}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="dark:text-red-400 dark:focus:text-red-300 dark:hover:bg-zinc-800"
        >
          <LogOut className="mr-2 size-4" />
          {logout.isPending ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarContent({
  onNavClick,
}: {
  onNavClick?: () => void
}) {
  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#534AB7]">LifeSync</h2>
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
                  ? 'bg-[#EEEDFE] dark:bg-[#534AB7]/20 text-[#534AB7]'
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

      <div className="p-2">
        <UserChip onNavClick={onNavClick} />
      </div>

      <span className="px-3 pb-3 text-[11px] text-muted-foreground/50 dark:text-zinc-700 select-none">
        v{__APP_VERSION__}
      </span>
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
        <header className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center border-b border-[#E8E6DF] dark:border-zinc-800 bg-white dark:bg-[#111113] px-4">
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
        <aside className="flex w-64 flex-col border-r bg-sidebar dark:bg-[#111113] text-sidebar-foreground">
          <SidebarContent />
        </aside>
      )}

      <main className={`flex-1 overflow-auto p-4 md:p-6 ${isMobile ? 'pt-18' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}
