import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Search, Bell, User } from 'lucide-react'
import MobileDrawer from './MobileDrawer.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../lib/firestoreUsers.js'
import { clsx } from '../../lib/clsx.js'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
  { label: 'Community', to: '/community' },
  { label: 'Resources', to: '/resources' },
  { label: 'Rules', to: '/rules' },
  { label: 'Team', to: '/team' },
]

const platformLinks = [
  { label: 'Projects', to: '/platform/projects' },
  { label: 'Leaderboard', to: '/platform/leaderboard' },
  { label: 'Docs', to: '/platform/docs' },
  { label: 'Support', to: '/platform/support' },
]

function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const isPlatformActive = location.pathname.startsWith('/platform')
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-glass backdrop-blur-glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
          <img src="/images/banner-icon.png" alt="Dark Mode Devs" className="h-8 w-8 object-contain" />
          Dark<span className="text-primary">Mode</span>Devs
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'font-body text-sm transition-colors',
                  isActive ? 'text-primary' : 'text-white/70 hover:text-primary',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className={clsx(
                'flex items-center gap-1 font-body text-sm outline-none transition-colors',
                isPlatformActive ? 'text-primary' : 'text-white/70 hover:text-primary',
              )}
            >
              Platform
              <ChevronDown size={14} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={12}
                className="min-w-[180px] rounded-xl border border-white/10 bg-surface/95 p-2 shadow-glow backdrop-blur-glass"
              >
                {platformLinks.map((link) => (
                  <DropdownMenu.Item key={link.to} asChild>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        clsx(
                          'block rounded-lg px-3 py-2 font-body text-sm outline-none transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-white/70 hover:bg-white/5 hover:text-primary',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Search size={15} />
            <span className="hidden font-body text-xs sm:inline">⌘K</span>
          </button>

          <button
            aria-label="Notifications"
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-primary"
          >
            <Bell size={18} />
          </button>

          {user ? (
            <Link
              to="/dashboard"
              aria-label="Profile"
              className="hidden overflow-hidden rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-primary/40 hover:text-primary lg:block"
            >
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Your avatar" className="h-9 w-9 object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center">
                  <User size={18} />
                </span>
              )}
            </Link>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="font-body text-sm text-white/70 transition-colors hover:text-primary"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-semibold text-background transition-shadow hover:shadow-glow"
              >
                Sign up
              </Link>
            </div>
          )}

          <MobileDrawer />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
