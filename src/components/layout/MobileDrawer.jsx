import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
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

function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="rounded-lg p-2 text-white/70 transition-colors hover:text-primary lg:hidden"
      >
        <Menu size={22} />
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                className="fixed right-0 top-0 z-50 flex h-full w-[80%] max-w-sm flex-col bg-surface/95 p-6 shadow-glow backdrop-blur-glass"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <Dialog.Title className="font-heading text-lg font-semibold text-white">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="rounded-lg p-2 text-white/70 transition-colors hover:text-primary"
                  >
                    <X size={20} />
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'rounded-lg px-3 py-3 font-body transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-white/80 hover:bg-white/5 hover:text-primary',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}

                  <div className="mt-4 mb-2 px-3 font-body text-xs uppercase tracking-wider text-white/40">
                    Platform
                  </div>
                  {platformLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'rounded-lg px-3 py-3 font-body transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-white/80 hover:bg-white/5 hover:text-primary',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export default MobileDrawer
