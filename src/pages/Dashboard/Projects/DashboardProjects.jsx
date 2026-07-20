import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Code2 } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import Button from '../../../components/ui/Button.jsx'
import CodeViewerModal from '../../../components/ui/CodeViewerModal.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProjects, deleteProject } from '../../../lib/firestoreProjects.js'

function DashboardProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProjects(user.uid, (data) => {
      setProjects(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const handleDelete = async (id) => {
    await deleteProject(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Your Projects</h1>
          <p className="mt-2 font-body text-white/50">Manage what you've submitted so far.</p>
        </div>
        <Button as={Link} to="/dashboard/add-project" variant="primary">
          <Plus size={16} />
          Add Project
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 font-body text-white/40">Loading your projects...</p>
      ) : projects.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <GlassPanel key={project.id} className="overflow-hidden p-0">
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
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
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
