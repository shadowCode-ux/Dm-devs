import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Search, User } from 'lucide-react'
import MobileDrawer from './MobileDrawer.jsx'
import NotificationsDropdown from './NotificationsDropdown.jsx'
import CommandPalette from './CommandPalette.jsx'
import Button from '../ui/Button.jsx'
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  // Global Cmd/Ctrl+K shortcut to open search, from anywhere on the site.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-300',
        scrolled ? 'border-white/10 bg-surface/90 backdrop-blur-glass' : 'border-white/0 bg-glass backdrop-blur-glass',
      )}
    >
      <motion.nav
        animate={{ height: scrolled ? 60 : 64 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6"
      >
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
          <img src="/images/banner-icon.png" alt="Dark Mode Devs" className="h-8 w-8 rounded-lg object-contain" />
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
                sideOffset={20}
                className="flex min-w-[180px] flex-col gap-1 rounded-xl border border-white/10 bg-surface/95 p-2 shadow-glow backdrop-blur-glass"
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
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/50 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Search size={15} />
            <span className="hidden font-body text-xs sm:inline">⌘K</span>
          </button>

          <NotificationsDropdown />

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
              <Button as={Link} to="/signup" variant="primary" size="sm">
                Sign up
              </Button>
            </div>
          )}

          <MobileDrawer />
        </div>
      </motion.nav>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}

export default Navbar
