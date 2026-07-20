import { useEffect, useMemo, useState } from 'react'
import { Search, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import Button from '../../../components/ui/Button.jsx'
import CodeViewerModal from '../../../components/ui/CodeViewerModal.jsx'
import { clsx } from '../../../lib/clsx.js'
import { subscribeToAllProjects } from '../../../lib/firestoreProjects.js'

function Projects() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToAllProjects((data) => {
      setProjects(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Tag list is derived from real submitted projects — no hardcoded fake tags.
  const tags = useMemo(() => {
    const allTags = new Set()
    projects.forEach((project) => (project.tags || []).forEach((tag) => allTags.add(tag)))
    return ['All', ...Array.from(allTags)]
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag = activeTag === 'All' || (project.tags || []).includes(activeTag)
      const matchesQuery = project.title.toLowerCase().includes(query.toLowerCase())
      return matchesTag && matchesQuery
    })
  }, [projects, query, activeTag])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
              Projects
            </h1>
            <p className="mt-4 font-body text-white/50">
              What the community has been building lately.
            </p>
          </div>
          <Button as={Link} to="/dashboard/add-project" variant="primary">
            Submit a Project
          </Button>
        </div>

        <div className="relative mx-auto mb-6 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
          />
        </div>

        {tags.length > 1 && (
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={clsx(
                  'rounded-full px-4 py-1.5 font-body text-sm transition-colors',
                  activeTag === tag
                    ? 'bg-primary text-background font-medium'
                    : 'bg-white/5 text-white/60 hover:text-primary',
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center font-body text-white/40">Loading projects...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <GlassPanel key={project.id} hover className="overflow-hidden p-0">
                {project.screenshotUrl && (
                  <img
                    src={project.screenshotUrl}
                    alt={`${project.title} screenshot`}
                    className="h-36 w-full object-cover"
                  />
                )}
                <div className="p-5">
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
                  <button
                    onClick={() => setViewing(project)}
                    className="mt-4 flex items-center gap-1.5 font-body text-xs text-primary hover:underline"
                  >
                    <Code2 size={13} />
                    View Code
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center font-body text-white/40">
            {projects.length === 0
              ? 'No projects have been submitted yet — be the first!'
              : 'No projects match your search.'}
          </div>
        )}
      </div>

      <CodeViewerModal
        project={viewing}
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </section>
  )
}

export default Projects
