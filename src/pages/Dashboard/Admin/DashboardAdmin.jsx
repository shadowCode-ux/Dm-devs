import { useEffect, useState } from 'react'
import { Trash2, ShieldCheck, Crown, Users, FolderKanban } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToAllUsers, deleteUserAsAdmin, updateUserRole } from '../../../lib/firestoreUsers.js'
import { subscribeToAllProjects, deleteProjectAsAdmin } from '../../../lib/firestoreProjects.js'
import { ROLES, isOwner as checkIsOwner } from '../../../lib/roles.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function roleBadge(role) {
  if (role === ROLES.OWNER) return <Badge variant="primary">Owner</Badge>
  if (role === ROLES.ADMIN) return <Badge variant="success">Admin</Badge>
  return <Badge>Member</Badge>
}

function DashboardAdmin() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tab, setTab] = useState('users')
  const [busyId, setBusyId] = useState(null)

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
      </div>

      {tab === 'users' && (
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
      )}

      {tab === 'projects' && (
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
