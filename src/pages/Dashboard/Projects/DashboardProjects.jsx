import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Code2 } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import HeroGlow from '../../../components/ui/HeroGlow.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import Button from '../../../components/ui/Button.jsx'
import CodeViewerModal from '../../../components/ui/CodeViewerModal.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProjects, deleteProject } from '../../../lib/firestoreProjects.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

function DashboardProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProjects(user.uid, (data) => {
      setProjects(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteProject(id)
    } finally {
      setDeletingId(null)
      setConfirmingDeleteId(null)
    }
  }

  return (
    <div>
      <div className="relative overflow-hidden">
        <HeroGlow compact topOffset={-100} />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-white">Your Projects</h1>
            <p className="mt-2 font-body text-white/50">Manage what you've submitted so far.</p>
          </div>
          <Button as={Link} to="/dashboard/add-project" variant="primary">
            <Plus size={16} />
            Add Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <GlassPanel key={i} className="overflow-hidden p-0">
              <div className="h-36 w-full animate-pulse bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
              </div>
            </GlassPanel>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={fadeUp}>
            <GlassPanel className="overflow-hidden p-0">
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
                <p className="mt-2 font-body text-sm text-white/50">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tags || []).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => setViewing(project)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-primary"
                  >
                    <Code2 size={13} />
                    View Code
                  </button>
                  {confirmingDeleteId === project.id ? (
                    <div className="ml-auto flex items-center gap-2">
                      <span className="font-body text-xs text-white/50">Delete?</span>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="rounded-lg bg-red-500 px-2.5 py-1 font-body text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingId === project.id ? 'Deleting...' : 'Yes, delete'}
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        disabled={deletingId === project.id}
                        className="rounded-lg border border-white/10 px-2.5 py-1 font-body text-xs text-white/70 transition-colors hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingDeleteId(project.id)}
                      className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <GlassPanel className="mt-8 flex flex-col items-center gap-3 p-12 text-center">
          <p className="font-body text-white/50">You haven't submitted any projects yet.</p>
          <Button as={Link} to="/dashboard/add-project" variant="secondary" size="sm">
            Add your first project
          </Button>
        </GlassPanel>
      )}

      <CodeViewerModal
        project={viewing}
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </div>
  )
}

export default DashboardProjects
