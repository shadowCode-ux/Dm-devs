import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Compass,
  PlusCircle,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../lib/firestoreUsers.js'
import { clsx } from '../../lib/clsx.js'
import { canModerate, isOwner } from '../../lib/roles.js'

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

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-glass backdrop-blur-glass">
        <div className="px-6 py-6">
          <NavLink to="/" className="font-heading text-lg font-semibold text-white">
            Dark<span className="text-primary">Mode</span>Devs
          </NavLink>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:bg-white/5 hover:text-primary',
                  )
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            )
          })}

          {canModerate(profile) && (
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                clsx(
                  'mt-2 flex items-center gap-3 rounded-lg border-t border-white/10 px-3 pt-3.5 pb-2.5 font-body text-sm transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-white/60 hover:text-primary',
                )
              }
            >
              <Crown size={17} />
              {isOwner(profile) ? 'Owner Admin' : 'Admin'}
            </NavLink>
          )}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2.5 px-2">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Your avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-semibold text-primary">
                {initials(profile?.displayName || user?.email)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-body text-xs text-white">
                {profile?.displayName || user?.email?.split('@')[0]}
              </p>
              <p className="truncate font-body text-[10px] text-white/40">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
