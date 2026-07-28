import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, Volume2, Calendar, GitBranch } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import TiltCard from '../../components/ui/TiltCard.jsx'
import HeroGlow from '../../components/ui/HeroGlow.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { subscribeToEvents } from '../../lib/firestoreEvents.js'
import { subscribeToAllProjects } from '../../lib/firestoreProjects.js'
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/motion.js'

// This reflects your actual Discord server structure — edit this list to
// match your real channels. It's static because channel structure rarely
// changes and isn't something Firestore needs to manage.
const channels = [
  { name: 'general', type: 'text' },
  { name: 'introductions', type: 'text' },
  { name: 'showcase', type: 'text' },
  { name: 'help-frontend', type: 'text' },
  { name: 'help-backend', type: 'text' },
  { name: 'job-board', type: 'text' },
  { name: 'voice-lounge', type: 'voice' },
  { name: 'pair-programming', type: 'voice' },
]

function Community() {
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data)
      setEventsLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAllProjects((data) => {
      setProjects(data.slice(0, 4))
      setProjectsLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative mb-14 overflow-hidden text-center">
          <HeroGlow compact topOffset={-40} />
          <div className="relative">
            <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
              Community
            </h1>
            <p className="mt-4 font-body text-white/50">
              A look inside the server — channels, events, and what people are building.
            </p>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]"
        >
          {/* Channel sidebar */}
          <motion.div variants={fadeUp}>
            <GlassPanel className="h-fit p-4">
            <span className="px-2 font-body text-xs font-medium uppercase tracking-wider text-white/40">
              Channels
            </span>
            <div className="mt-3 flex flex-col gap-1">
              {channels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-body text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-primary"
                >
                  {channel.type === 'text' ? (
                    <Hash size={15} />
                  ) : (
                    <Volume2 size={15} />
                  )}
                  {channel.name}
                </div>
              ))}
            </div>
            </GlassPanel>
          </motion.div>

          {/* Main content */}
          <motion.div variants={fadeUp} className="flex flex-col gap-10">
            {/* Events */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <h2 className="font-heading text-xl font-semibold text-white">
                  Upcoming Events
                </h2>
              </div>
              {eventsLoading ? (
                <p className="font-body text-sm text-white/40">Loading events...</p>
              ) : events.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {events.map((event) => (
                    <GlassPanel
                      key={event.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div>
                        <h3 className="font-body text-sm font-medium text-white">
                          {event.title}
                        </h3>
                        <p className="mt-1 font-body text-xs text-white/40">{event.date}</p>
                      </div>
                      <Badge variant="primary">{event.time}</Badge>
                    </GlassPanel>
                  ))}
                </div>
              ) : (
                <GlassPanel className="p-6 text-center">
                  <p className="font-body text-sm text-white/40">
                    No upcoming events scheduled right now — check back soon.
                  </p>
                </GlassPanel>
              )}
            </div>

            {/* Project feed */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <GitBranch size={18} className="text-primary" />
                <h2 className="font-heading text-xl font-semibold text-white">
                  Project Feed
                </h2>
              </div>
              {projectsLoading ? (
                <p className="font-body text-sm text-white/40">Loading projects...</p>
              ) : projects.length > 0 ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={fadeUp}>
                      <TiltCard className="p-5">
                        <h3 className="font-heading text-base font-semibold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-1 font-body text-xs text-white/40">
                          by {project.authorName}
                        </p>
                        <p className="mt-3 font-body text-sm text-white/50">
                          {project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(project.tags || []).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <GlassPanel className="p-6 text-center">
                  <p className="font-body text-sm text-white/40">
                    No projects submitted yet — be the first to share what you're building.
                  </p>
                </GlassPanel>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Community
