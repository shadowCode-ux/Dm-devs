import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import PageTransition from './PageTransition.jsx'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Compass,
  PlusCircle,
  Settings,
  LogOut,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../lib/firestoreUsers.js'
import { clsx } from '../../lib/clsx.js'
import { canModerate, isOwner, isPremium } from '../../lib/roles.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Projects', to: '/dashboard/projects', icon: FolderKanban },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Discovery', to: '/dashboard/discovery', icon: Compass },
  { label: 'Add Project', to: '/dashboard/add-project', icon: PlusCircle },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
]

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('dashboard-sidebar-collapsed') === 'true',
  )

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  useEffect(() => {
    localStorage.setItem('dashboard-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex shrink-0 flex-col border-r border-white/10 bg-glass backdrop-blur-glass transition-[width] duration-200',
          collapsed ? 'w-[68px]' : 'w-64',
        )}
      >
        <div className={clsx('flex items-center py-6', collapsed ? 'justify-center px-2' : 'justify-between px-6')}>
          {!collapsed && (
            <NavLink to="/" className="font-heading text-lg font-semibold text-white">
              Dark<span className="text-primary">Mode</span>Devs
            </NavLink>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-primary"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:bg-white/5 hover:text-primary',
                  )
                }
              >
                <Icon size={17} />
                {!collapsed && item.label}
              </NavLink>
            )
          })}

          {user && (
            <NavLink
              to={`/dashboard/profile/${user.uid}`}
              title={collapsed ? 'My Profile' : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/60 hover:bg-white/5 hover:text-primary',
                )
              }
            >
              <UserCircle size={17} />
              {!collapsed && 'My Profile'}
            </NavLink>
          )}

          {canModerate(profile) && (
            <NavLink
              to="/dashboard/admin"
              title={collapsed ? (isOwner(profile) ? 'Owner Admin' : 'Admin') : undefined}
              className={({ isActive }) =>
                clsx(
                  'mt-2 flex items-center gap-3 rounded-lg border-t border-white/10 px-3 pt-3.5 pb-2.5 font-body text-sm transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'text-primary'
                    : 'text-white/60 hover:text-primary',
                )
              }
            >
              <Crown size={17} />
              {!collapsed && (isOwner(profile) ? 'Owner Admin' : 'Admin')}
            </NavLink>
          )}
        </nav>

        <div className="px-3 pb-3">
          <NavLink
            to="/dashboard/premium"
            title={collapsed ? 'Unlock more features' : undefined}
            className={clsx(
              'group flex flex-col gap-1 rounded-lg border border-primary/20 bg-primary/5 transition-colors hover:border-primary/40 hover:bg-primary/10',
              collapsed ? 'items-center px-0 py-2.5' : 'px-3 py-2.5',
            )}
          >
            <div className="flex items-center gap-2 font-body text-sm font-medium text-primary">
              <Crown size={15} />
              {!collapsed && (isPremium(profile) ? 'Premium' : 'Unlock more features')}
            </div>
            {!collapsed && (
              <span className="font-body text-[11px] text-white/40 group-hover:text-white/60">
                {isPremium(profile)
                  ? `Active until ${profile.premiumUntil.toDate().toLocaleDateString()}`
                  : 'Upgrade to premium'}
              </span>
            )}
          </NavLink>
        </div>

        <div className="shrink-0 border-t border-white/10 p-4">
          <div className={clsx('mb-3 flex items-center gap-2.5', collapsed ? 'justify-center' : 'px-2')}>
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Your avatar"
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-semibold text-primary">
                {initials(profile?.displayName || user?.email)}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-body text-xs text-white">
                  {profile?.displayName || user?.email?.split('@')[0]}
                </p>
                <p className="truncate font-body text-[10px] text-white/40">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Log out' : undefined}
            className={clsx(
              'flex w-full items-center gap-3 rounded-lg py-2.5 font-body text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-red-400',
              collapsed ? 'justify-center px-0' : 'px-3',
            )}
          >
            <LogOut size={17} />
            {!collapsed && 'Log out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="flex-1">
          <PageTransition />
        </div>
        <footer className="mt-10 border-t border-white/10 pt-4 text-center font-body text-xs text-white/30">
          © {new Date().getFullYear()} Dark Mode Devs. All rights reserved.
        </footer>
      </main>
    </div>
  )
}

export default DashboardLayout
