import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { subscribeToAllProjects } from '../../lib/firestoreProjects.js'

function LatestProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAllProjects((data) => {
      setProjects(data.slice(0, 3))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (!loading && projects.length === 0) {
    return null
  }

  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
              Fresh off the showcase
            </h2>
            <p className="mt-3 font-body text-white/50">
              Real projects, submitted by real members, updated live.
            </p>
          </div>
          <Link
            to="/platform/projects"
            className="flex items-center gap-1.5 font-body text-sm text-primary hover:underline"
          >
            View all projects
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="text-center font-body text-white/40">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {projects.map((project) => (
              <GlassPanel key={project.id} hover className="p-5">
                <h3 className="font-heading text-base font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-1 font-body text-xs text-white/40">by {project.authorName}</p>
                <p className="mt-3 font-body text-sm text-white/50">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tags || []).map((tag) => (
                    <Badge key={tag} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestProjects
