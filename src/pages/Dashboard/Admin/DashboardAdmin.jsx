import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trash2,
  ShieldCheck,
  Crown,
  Users,
  FolderKanban,
  ClipboardList,
  Plus,
  Pencil,
  X,
  Tag,
  Lock,
} from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToAllUsers, deleteUserAsAdmin, updateUserRole } from '../../../lib/firestoreUsers.js'
import { subscribeToAllProjects, deleteProjectAsAdmin } from '../../../lib/firestoreProjects.js'
import { ROLES, isOwner as checkIsOwner, canModerate } from '../../../lib/roles.js'
import {
  subscribeToTaskCategories,
  addTaskCategory,
  renameTaskCategory,
  deleteTaskCategory,
  subscribeToTasks,
  addTask,
  updateTask,
  deleteTask,
  TASK_PRIORITIES,
  TASK_PRIORITY_ORDER,
  TASK_STATUSES,
} from '../../../lib/firestoreTasks.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function roleBadge(role) {
  if (role === ROLES.OWNER) return <Badge variant="primary">Owner</Badge>
  if (role === ROLES.ADMIN) return <Badge variant="success">Admin</Badge>
  return <Badge>Member</Badge>
}

const PRIORITY_META = {
  [TASK_PRIORITIES.URGENT]: { label: 'Urgent', className: 'border-red-500/30 bg-red-500/10 text-red-400' },
  [TASK_PRIORITIES.HIGH]: { label: 'High', className: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
  [TASK_PRIORITIES.MEDIUM]: { label: 'Medium', className: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' },
  [TASK_PRIORITIES.LOW]: { label: 'Low', className: 'border-white/15 bg-white/5 text-white/50' },
}

const STATUS_META = {
  [TASK_STATUSES.TODO]: { label: 'To Do' },
  [TASK_STATUSES.IN_PROGRESS]: { label: 'In Progress' },
  [TASK_STATUSES.DONE]: { label: 'Done' },
}

function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META[TASK_PRIORITIES.MEDIUM]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-body text-[11px] font-medium ${meta.className}`}>
      {meta.label}
    </span>
  )
}

function DashboardAdmin() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tab, setTab] = useState('users')
  const [busyId, setBusyId] = useState(null)

  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: TASK_PRIORITIES.MEDIUM,
  })
  const [taskFormError, setTaskFormError] = useState('')

  useEffect(() => {
    const unsubUsers = subscribeToAllUsers(setUsers)
    const unsubProjects = subscribeToAllProjects(setProjects)
    return () => {
      unsubUsers()
      unsubProjects()
    }
  }, [])

  useEffect(() => {
    const mine = users.find((u) => u.id === user?.uid)
    if (mine) setProfile(mine)
  }, [users, user])

  // Tasks/categories are admin-only data — firestore.rules is the real
  // enforcement, but there's no reason to even open these subscriptions for
  // a member who briefly lands on this tab before the guard below renders.
  useEffect(() => {
    if (!canModerate(profile)) return
    const unsubCategories = subscribeToTaskCategories(setCategories)
    const unsubTasks = subscribeToTasks(setTasks)
    return () => {
      unsubCategories()
      unsubTasks()
    }
  }, [profile])

  const ownerView = checkIsOwner(profile)

  const handleDeleteUser = async (uid) => {
    if (uid === user?.uid) return // never let an admin delete themselves here
    if (!confirm('Delete this member\'s profile? This cannot be undone.')) return
    setBusyId(uid)
    try {
      await deleteUserAsAdmin(uid)
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setBusyId(id)
    try {
      await deleteProjectAsAdmin(id)
    } finally {
      setBusyId(null)
    }
  }

  const handleRoleChange = async (uid, role) => {
    setBusyId(uid)
    try {
      await updateUserRole(uid, role)
    } finally {
      setBusyId(null)
    }
  }

  // --- Task categories ---

  const handleAddCategory = async (e) => {
    e.preventDefault()
    const name = newCategoryName.trim()
    if (!name) return
    setNewCategoryName('')
    await addTaskCategory(name)
  }

  const handleStartRenameCategory = (category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleSaveRenameCategory = async (categoryId) => {
    const name = editingCategoryName.trim()
    if (!name) return
    await renameTaskCategory(categoryId, name)
    setEditingCategoryId(null)
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Delete this category? Tasks in it will move to Uncategorized.')) return
    await deleteTaskCategory(categoryId)
  }

  // --- Tasks ---

  const openNewTaskForm = (categoryId = '') => {
    setEditingTask(null)
    setTaskForm({ title: '', description: '', categoryId, priority: TASK_PRIORITIES.MEDIUM })
    setTaskFormError('')
    setShowTaskForm(true)
  }

  const openEditTaskForm = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      categoryId: task.categoryId || '',
      priority: task.priority || TASK_PRIORITIES.MEDIUM,
    })
    setTaskFormError('')
    setShowTaskForm(true)
  }

  const closeTaskForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      setTaskFormError('A title is required.')
      return
    }
    setTaskFormError('')
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          categoryId: taskForm.categoryId || null,
          priority: taskForm.priority,
        })
      } else {
        await addTask({
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
          categoryId: taskForm.categoryId || null,
          priority: taskForm.priority,
          createdBy: user.uid,
          createdByName: profile?.displayName || user.email?.split('@')[0] || 'Unknown',
        })
      }
      closeTaskForm()
    } catch (err) {
      setTaskFormError(err.message || 'Something went wrong saving this task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task? This cannot be undone.')) return
    await deleteTask(taskId)
  }

  const handleStatusChange = async (taskId, status) => {
    await updateTask(taskId, { status })
  }

  if (users.length > 0 && !canModerate(profile)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <Lock className="text-white/30" size={28} />
        <p className="font-body text-white/50">
          You don't have access to this page.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Crown className="text-primary" size={26} />
        <div>
          <h1 className="font-heading text-3xl font-semibold text-white">Admin</h1>
          <p className="mt-1 font-body text-white/50">
            {ownerView
              ? 'Full moderation access — manage members, projects, and roles.'
              : 'Moderation access — manage members and projects.'}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-white/10">
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-body text-sm transition-colors ${
            tab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Users size={15} />
          Users ({users.length})
        </button>
        <button
          onClick={() => setTab('projects')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-body text-sm transition-colors ${
            tab === 'projects'
              ? 'border-primary text-primary'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <FolderKanban size={15} />
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setTab('tasks')}
          className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-body text-sm transition-colors ${
            tab === 'tasks'
              ? 'border-primary text-primary'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <ClipboardList size={15} />
          Tasks ({tasks.length})
        </button>
      </div>

      {tab === 'users' && (
        <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <GlassPanel className="mt-6 overflow-hidden p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 font-body text-xs uppercase tracking-wide text-white/40">
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                {ownerView && <th className="px-5 py-3 font-medium">Set Role</th>}
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-heading text-[10px] font-semibold text-primary">
                          {initials(u.displayName || u.email)}
                        </div>
                      )}
                      <span className="font-body text-sm text-white">
                        {u.displayName || u.email?.split('@')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-body text-sm text-white/50">{u.email}</td>
                  <td className="px-5 py-3">{roleBadge(u.role)}</td>
                  {ownerView && (
                    <td className="px-5 py-3">
                      {u.role === ROLES.OWNER ? (
                        <span className="font-body text-xs text-white/30">—</span>
                      ) : (
                        <select
                          value={u.role || ROLES.MEMBER}
                          disabled={busyId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-body text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value={ROLES.MEMBER}>Member</option>
                          <option value={ROLES.ADMIN}>Admin</option>
                        </select>
                      )}
                    </td>
                  )}
                  <td className="px-5 py-3 text-right">
                    {u.role !== ROLES.OWNER && u.id !== user?.uid && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
        </motion.div>
      )}

      {tab === 'projects' && (
        <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <GlassPanel className="mt-6 overflow-hidden p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 font-body text-xs uppercase tracking-wide text-white/40">
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-body text-sm text-white">{p.title}</td>
                  <td className="px-5 py-3 font-body text-sm text-white/50">{p.authorName}</td>
                  <td className="px-5 py-3 font-body text-sm text-white/50">{p.views ?? 0}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      disabled={busyId === p.id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
        </motion.div>
      )}

      {tab === 'tasks' && (
        <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <div className="mt-6 flex flex-col gap-6">
          {/* Category management */}
          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 text-white/70">
              <Tag size={15} />
              <h2 className="font-heading text-sm font-semibold text-white">Categories</h2>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1 pl-3 pr-1.5"
                >
                  {editingCategoryId === category.id ? (
                    <>
                      <input
                        autoFocus
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRenameCategory(category.id)}
                        className="w-28 bg-transparent font-body text-xs text-white outline-none"
                      />
                      <button
                        onClick={() => handleSaveRenameCategory(category.id)}
                        className="rounded px-1.5 py-0.5 font-body text-[11px] text-primary hover:bg-primary/10"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategoryId(null)}
                        className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white/70"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="font-body text-xs text-white">{category.name}</span>
                      <button
                        onClick={() => handleStartRenameCategory(category)}
                        aria-label={`Rename ${category.name}`}
                        className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-primary"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </>
                  )}
                </div>
              ))}

              <form onSubmit={handleAddCategory} className="flex items-center gap-1.5">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category"
                  className="w-28 rounded-lg border border-dashed border-white/15 bg-transparent px-3 py-1.5 font-body text-xs text-white outline-none placeholder:text-white/30 focus:border-primary/40"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-xs text-white/70 hover:border-primary/40 hover:text-primary"
                >
                  <Plus size={12} />
                  Add
                </button>
              </form>
            </div>
          </GlassPanel>

          {/* Task form */}
          {showTaskForm && (
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold text-white">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={closeTaskForm}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white/70"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="font-body text-xs text-white/50">Title</label>
                  <input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Review new project submissions"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-white/50">Description</label>
                  <textarea
                    rows={3}
                    value={taskForm.description}
                    onChange={(e) => setTaskForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Any extra detail about what needs to happen"
                    className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-body text-xs text-white/50">Category</label>
                    <select
                      value={taskForm.categoryId}
                      onChange={(e) => setTaskForm((f) => ({ ...f, categoryId: e.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="font-body text-xs text-white/50">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm((f) => ({ ...f, priority: e.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                    >
                      {TASK_PRIORITY_ORDER.map((p) => (
                        <option key={p} value={p}>{PRIORITY_META[p].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {taskFormError && (
                  <p className="font-body text-xs text-red-400">{taskFormError}</p>
                )}

                <button
                  type="submit"
                  className="self-start rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-background transition-shadow hover:shadow-glow"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </form>
            </GlassPanel>
          )}

          {!showTaskForm && (
            <button
              onClick={() => openNewTaskForm()}
              className="flex w-fit items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 font-body text-sm text-primary hover:bg-primary/10"
            >
              <Plus size={15} />
              New Task
            </button>
          )}

          {/* Tasks grouped by category, sorted by priority within each group */}
          {[...categories, { id: null, name: 'Uncategorized' }].map((category) => {
            const tasksInCategory = tasks
              .filter((t) => (t.categoryId || null) === category.id)
              .sort(
                (a, b) =>
                  TASK_PRIORITY_ORDER.indexOf(a.priority) - TASK_PRIORITY_ORDER.indexOf(b.priority),
              )

            if (tasksInCategory.length === 0) return null

            return (
              <div key={category.id ?? 'uncategorized'}>
                <h3 className="mb-2 font-body text-xs font-medium uppercase tracking-wide text-white/40">
                  {category.name} ({tasksInCategory.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {tasksInCategory.map((task) => (
                    <GlassPanel key={task.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-body text-sm font-medium text-white">{task.title}</h4>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          {task.description && (
                            <p className="mt-1.5 font-body text-xs text-white/50">{task.description}</p>
                          )}
                          <p className="mt-2 font-body text-[11px] text-white/30">
                            Created by <span className="text-white/50">{task.createdByName || 'Unknown'}</span>
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => openEditTaskForm(task)}
                            aria-label="Edit task"
                            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-primary"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-1.5 border-t border-white/10 pt-3">
                        {Object.entries(STATUS_META).map(([status, meta]) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(task.id, status)}
                            className={`rounded-md px-2.5 py-1 font-body text-[11px] transition-colors ${
                              task.status === status
                                ? 'bg-primary/15 text-primary'
                                : 'bg-white/5 text-white/40 hover:text-white/70'
                            }`}
                          >
                            {meta.label}
                          </button>
                        ))}
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            )
          })}

          {tasks.length === 0 && (
            <GlassPanel className="flex flex-col items-center gap-2 p-10 text-center">
              <ClipboardList className="text-white/20" size={24} />
              <p className="font-body text-sm text-white/40">No tasks yet.</p>
            </GlassPanel>
          )}
        </div>
        </motion.div>
      )}

      {ownerView && (
        <GlassPanel className="mt-6 flex items-center gap-3 p-5">
          <ShieldCheck className="shrink-0 text-primary" size={20} />
          <p className="font-body text-sm text-white/50">
            You're signed in as the <span className="text-primary">Owner</span>. Only you can
            promote members to Admin or revoke that access.
          </p>
        </GlassPanel>
      )}
    </div>
  )
}

export default DashboardAdmin
