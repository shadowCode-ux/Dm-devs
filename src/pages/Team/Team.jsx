import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Globe } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { subscribeToTeam } from '../../lib/firestoreTeam.js'

function initials(name) {
  return (name || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Team() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToTeam((data) => {
      setTeam(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Our Team
          </h1>
          <p className="mt-4 font-body text-white/50">
            The people keeping the lights on and the community running.
          </p>
        </div>

        {loading ? (
          <p className="text-center font-body text-white/40">Loading team...</p>
        ) : team.length === 0 ? (
          <div className="py-16 text-center font-body text-white/40">
            Team profiles haven't been added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <GlassPanel hover className="flex h-full flex-col items-center p-6 text-center">
                  {member.photoURL ? (
                    <img
                      src={member.photoURL}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-semibold text-primary">
                      {initials(member.name)}
                    </div>
                  )}
                  <h3 className="mt-4 font-heading text-base font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 font-body text-xs text-primary">{member.role}</p>
                  {member.bio && (
                    <p className="mt-3 font-body text-sm text-white/50">{member.bio}</p>
                  )}

                  {member.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {member.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {(member.github || member.twitter || member.website) && (
                    <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className="text-white/40 hover:text-primary"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter"
                          className="text-white/40 hover:text-primary"
                        >
                          <Twitter size={16} />
                        </a>
                      )}
                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Website"
                          className="text-white/40 hover:text-primary"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Team