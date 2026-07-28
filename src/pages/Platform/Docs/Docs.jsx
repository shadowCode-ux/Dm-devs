import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import { clsx } from '../../../lib/clsx.js'

const docs = [
  {
    category: 'Getting Started',
    items: [
      {
        title: 'Welcome to Dark Mode Devs',
        content:
          'This is the home for everything platform-related — how to join, how points work, and how to get the most out of the community.',
      },
      {
        title: 'Setting Up Your Profile',
        content:
          'Add a bio, link your GitHub, and pick your tech stack tags so other members can find you. A complete profile also unlocks the Discovery page.',
      },
    ],
  },
  {
    category: 'Platform',
    items: [
      {
        title: 'How the Leaderboard Works',
        content:
          'Points are earned by submitting projects, helping others in support channels, and attending events. Rankings reset quarterly.',
      },
      {
        title: 'Submitting a Project',
        content:
          'Go to your Dashboard → Add Project. Include a title, description, tech tags, and a link to the live project or repo.',
      },
    ],
  },
  {
    category: 'Community',
    items: [
      {
        title: 'Roles & Permissions',
        content:
          'Members progress through roles based on activity — Newcomer, Contributor, Core, and Moderator — each unlocking new channels and permissions.',
      },
    ],
  },
]

function Docs() {
  const [active, setActive] = useState(docs[0].items[0])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">Docs</h1>
          <p className="mt-4 font-body text-white/50">
            Everything you need to know about using the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <GlassPanel className="h-fit p-4">
            {docs.map((section) => (
              <div key={section.category} className="mb-5 last:mb-0">
                <span className="px-2 font-body text-xs font-medium uppercase tracking-wider text-white/40">
                  {section.category}
                </span>
                <div className="mt-2 flex flex-col gap-1">
                  {section.items.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => setActive(item)}
                      className={clsx(
                        'rounded-lg px-2 py-1.5 text-left font-body text-sm transition-colors',
                        active.title === item.title
                          ? 'bg-primary/10 text-primary'
                          : 'text-white/60 hover:bg-white/5 hover:text-primary',
                      )}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </GlassPanel>

          {/* Content */}
          <GlassPanel className="p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <FileText size={16} />
                  <span className="font-code text-xs">doc</span>
                </div>
                <h2 className="font-heading text-2xl font-semibold text-white">{active.title}</h2>
                <p className="mt-4 font-body text-sm leading-relaxed text-white/60">
                  {active.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </GlassPanel>
        </div>
      </div>
    </section>
  )
}

export default Docs
