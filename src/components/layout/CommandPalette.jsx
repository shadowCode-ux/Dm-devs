import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, Users, FolderKanban } from 'lucide-react'
import { subscribeToAllUsers } from '../../lib/firestoreUsers.js'
import { subscribeToAllProjects } from '../../lib/firestoreProjects.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const unsubUsers = subscribeToAllUsers(setUsers)
    const unsubProjects = subscribeToAllProjects(setProjects)
    return () => {
      unsubUsers()
      unsubProjects()
    }
  }, [])

  // Reset the query each time the palette closes, so it's fresh next open.
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const matchedUsers = useMemo(() => {
    if (!query.trim()) return []
    return users
      .filter((u) => (u.displayName || '').toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
  }, [users, query])

  const matchedProjects = useMemo(() => {
    if (!query.trim()) return []
    return projects
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
  }, [projects, query])

  const handleSelectUser = (id) => {
    onOpenChange(false)
    navigate(`/dashboard/profile/${id}`)
  }

  const handleSelectProject = () => {
    onOpenChange(false)
    navigate('/platform/projects')
  }

  const hasResults = matchedUsers.length > 0 || matchedProjects.length > 0

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-glow">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Search size={16} className="text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members or projects..."
              className="w-full bg-transparent font-body text-sm text-white outline-none placeholder:text-white/30"
            />
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-code text-[10px] text-white/30">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {!query.trim() ? (
              <p className="px-2 py-8 text-center font-body text-sm text-white/40">
                Start typing to search members and projects.
              </p>
            ) : !hasResults ? (
              <p className="px-2 py-8 text-center font-body text-sm text-white/40">
                No results for "{query}"
              </p>
            ) : (
              <>
                {matchedUsers.length > 0 && (
                  <div className="mb-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 font-body text-xs uppercase tracking-wider text-white/40">
                      <Users size={11} />
                      Members
                    </span>
                    {matchedUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUser(u.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
                      >
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-heading text-[10px] font-semibold text-primary">
                            {initials(u.displayName)}
                          </div>
                        )}
                        <span className="font-body text-sm text-white">{u.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedProjects.length > 0 && (
                  <div>
                    <span className="flex items-center gap-1.5 px-2 py-1 font-body text-xs uppercase tracking-wider text-white/40">
                      <FolderKanban size={11} />
                      Projects
                    </span>
                    {matchedProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProject(p)}
                        className="flex w-full flex-col rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="font-body text-sm text-white">{p.title}</span>
                        <span className="font-body text-xs text-white/40">by {p.authorName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CommandPalette
