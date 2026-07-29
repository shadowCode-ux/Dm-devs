import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  StickyNote,
  Plus,
  X,
  Pencil,
  Trash2,
  Link2,
  Link2Off,
  Crown,
} from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Button from '../../../components/ui/Button.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../../lib/firestoreUsers.js'
import { isOwner } from '../../../lib/roles.js'
import {
  subscribeToNoteCategories,
  addNoteCategory,
  deleteNoteCategory,
  subscribeToNoteConnections,
  connectNoteCategories,
  disconnectNoteCategories,
  subscribeToNotes,
  addNote,
  updateNote,
  deleteNote,
} from '../../../lib/firestoreNotes.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

const PALETTE = ['#00bfff', '#8b5cf6', '#f472b6', '#4ade80', '#fb923c', '#facc15', '#f87171', '#94a3b8']

/** Lays categories out evenly around a circle so connection lines are legible. */
function layoutPositions(count, radius, cx, cy) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  })
}

function CategoryGraph({ categories, connections, connectMode, connectFrom, selectedId, onNodeClick, onDeleteCategory }) {
  const size = 340
  const radius = 120
  const cx = size / 2
  const cy = size / 2
  const positions = useMemo(() => layoutPositions(categories.length, radius, cx, cy), [categories.length, radius, cx, cy])
  const posById = Object.fromEntries(categories.map((c, i) => [c.id, positions[i]]))

  if (categories.length === 0) {
    return (
      <div className="flex h-[340px] items-center justify-center font-body text-sm text-white/30">
        Add a category below to start mapping connections.
      </div>
    )
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[340px]">
      {/* Edges */}
      {connections.map((conn) => {
        const a = posById[conn.categoryAId]
        const b = posById[conn.categoryBId]
        if (!a || !b) return null
        return (
          <line
            key={conn.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(0,191,255,0.35)"
            strokeWidth={1.5}
          />
        )
      })}

      {/* In-progress connection preview */}
      {connectMode && connectFrom && posById[connectFrom] && (
        <circle cx={posById[connectFrom].x} cy={posById[connectFrom].y} r={20} fill="none" stroke="#00bfff" strokeWidth={1.5} strokeDasharray="3 3" />
      )}

      {/* Nodes */}
      {categories.map((category, i) => {
        const pos = positions[i]
        const isSelected = selectedId === category.id
        const isConnectSource = connectFrom === category.id
        return (
          <g
            key={category.id}
            transform={`translate(${pos.x}, ${pos.y})`}
            className="cursor-pointer"
            onClick={() => onNodeClick(category.id)}
          >
            <circle
              r={14}
              fill={category.color || '#00bfff'}
              fillOpacity={isSelected || isConnectSource ? 1 : 0.75}
              stroke={isSelected || isConnectSource ? '#fff' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isSelected || isConnectSource ? 2 : 1}
            />
            <text
              y={28}
              textAnchor="middle"
              className="select-none font-body text-[10px] fill-white/70"
            >
              {category.name.length > 12 ? `${category.name.slice(0, 11)}…` : category.name}
            </text>
            {!connectMode && (
              <g
                transform="translate(10, -18)"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteCategory(category.id)
                }}
                className="opacity-0 transition-opacity hover:opacity-100"
              >
                <circle r={7} fill="rgba(248,113,113,0.9)" />
                <text y={2.5} textAnchor="middle" className="select-none font-body text-[9px] fill-white">×</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function DashboardNotes() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  const [categories, setCategories] = useState([])
  const [connections, setConnections] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(PALETTE[0])
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [noteForm, setNoteForm] = useState({ title: '', content: '', categoryId: '' })

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  useEffect(() => {
    const unsubCategories = subscribeToNoteCategories(setCategories)
    const unsubConnections = subscribeToNoteConnections(setConnections)
    const unsubNotes = subscribeToNotes((data) => {
      setNotes(data)
      setLoading(false)
    })
    return () => {
      unsubCategories()
      unsubConnections()
      unsubNotes()
    }
  }, [])

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))

  const visibleNotes = selectedCategoryId
    ? notes.filter((n) => n.categoryId === selectedCategoryId)
    : notes

  const isConnected = (a, b) =>
    connections.some(
      (c) =>
        (c.categoryAId === a && c.categoryBId === b) ||
        (c.categoryAId === b && c.categoryBId === a),
    )

  // --- Category handlers ----------------------------------------------------

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    await addNoteCategory({ name: newCategoryName, color: newCategoryColor })
    setNewCategoryName('')
  }

  const handleDeleteCategory = async (categoryId) => {
    if (selectedCategoryId === categoryId) setSelectedCategoryId(null)
    await deleteNoteCategory(categoryId, connections)
  }

  const handleNodeClick = async (categoryId) => {
    if (connectMode) {
      if (!connectFrom) {
        setConnectFrom(categoryId)
        return
      }
      if (connectFrom === categoryId) {
        setConnectFrom(null)
        return
      }
      if (isConnected(connectFrom, categoryId)) {
        await disconnectNoteCategories(connectFrom, categoryId)
      } else {
        await connectNoteCategories(connectFrom, categoryId)
      }
      setConnectFrom(null)
      return
    }
    setSelectedCategoryId((current) => (current === categoryId ? null : categoryId))
  }

  // --- Note handlers ---------------------------------------------------------

  const openNewNoteForm = () => {
    setEditingNote(null)
    setNoteForm({ title: '', content: '', categoryId: selectedCategoryId || '' })
    setShowNoteForm(true)
  }

  const openEditNoteForm = (note) => {
    setEditingNote(note)
    setNoteForm({
      title: note.title,
      content: note.content || '',
      categoryId: note.categoryId || '',
    })
    setShowNoteForm(true)
  }

  const closeNoteForm = () => {
    setShowNoteForm(false)
    setEditingNote(null)
  }

  const handleSubmitNote = async (e) => {
    e.preventDefault()
    if (!noteForm.title.trim()) return

    if (editingNote) {
      await updateNote(editingNote.id, {
        title: noteForm.title,
        content: noteForm.content,
        categoryId: noteForm.categoryId || null,
      })
    } else {
      await addNote({
        title: noteForm.title,
        content: noteForm.content,
        categoryId: noteForm.categoryId || null,
        createdBy: user.uid,
        createdByName: profile?.displayName || user.email.split('@')[0],
      })
    }
    closeNoteForm()
  }

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StickyNote className="text-primary" size={26} />
          <div>
            <h1 className="font-heading text-3xl font-semibold text-white">Notes</h1>
            <p className="mt-1 font-body text-white/50">
              Internal knowledge base — organize notes into categories and map how they relate.
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={openNewNoteForm}>
          <Plus size={15} />
          New Note
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Category graph */}
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-white">Category Map</h2>
            <button
              onClick={() => {
                setConnectMode((m) => !m)
                setConnectFrom(null)
              }}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-body text-xs transition-colors ${
                connectMode
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {connectMode ? <Link2 size={12} /> : <Link2Off size={12} />}
              {connectMode ? 'Connecting...' : 'Connect'}
            </button>
          </div>

          <p className="mt-1 font-body text-[11px] text-white/40">
            {connectMode
              ? 'Click two categories to link (or unlink) them.'
              : 'Click a category to filter notes. Toggle "Connect" to map relationships.'}
          </p>

          <div className="mt-4">
            <CategoryGraph
              categories={categories}
              connections={connections}
              connectMode={connectMode}
              connectFrom={connectFrom}
              selectedId={selectedCategoryId}
              onNodeClick={handleNodeClick}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>

          {/* Category list / creation */}
          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"
              >
                <button
                  onClick={() => handleNodeClick(category.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate font-body text-xs text-white/70">{category.name}</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  aria-label={`Delete ${category.name}`}
                  className="shrink-0 rounded p-1 text-white/30 hover:bg-white/5 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <form onSubmit={handleAddCategory} className="mt-2 flex flex-col gap-2">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="w-full rounded-lg border border-dashed border-white/15 bg-transparent px-3 py-1.5 font-body text-xs text-white outline-none placeholder:text-white/30 focus:border-primary/40"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      aria-label={`Use color ${color}`}
                      className="h-4 w-4 rounded-full transition-all"
                      style={{
                        backgroundColor: color,
                        outline: newCategoryColor === color ? '2px solid white' : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-body text-xs text-white/70 hover:border-primary/40 hover:text-primary"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
            </form>
          </div>
        </GlassPanel>

        {/* Notes */}
        <div className="flex flex-col gap-4">
          {selectedCategoryId && (
            <div className="flex items-center gap-2 font-body text-xs text-white/50">
              Filtering by
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: categoryById[selectedCategoryId]?.color }}
                />
                {categoryById[selectedCategoryId]?.name}
              </span>
              <button onClick={() => setSelectedCategoryId(null)} className="text-primary hover:underline">
                Clear
              </button>
            </div>
          )}

          {showNoteForm && (
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold text-white">
                  {editingNote ? 'Edit Note' : 'New Note'}
                </h2>
                <button
                  onClick={closeNoteForm}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white/70"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitNote} className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="font-body text-xs text-white/50">Title</label>
                  <input
                    value={noteForm.title}
                    onChange={(e) => setNoteForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Onboarding flow decisions"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-white/50">Content</label>
                  <textarea
                    rows={5}
                    value={noteForm.content}
                    onChange={(e) => setNoteForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Write the note..."
                    className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-white/50">Category</label>
                  <select
                    value={noteForm.categoryId}
                    onChange={(e) => setNoteForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-sm text-white outline-none focus:border-primary/40"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="primary" size="sm">
                    {editingNote ? 'Save Changes' : 'Create Note'}
                  </Button>
                  <button
                    type="button"
                    onClick={closeNoteForm}
                    className="rounded-lg border border-white/10 px-4 py-2 font-body text-sm text-white/70 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </GlassPanel>
          )}

          {loading ? (
            <p className="font-body text-sm text-white/40">Loading notes...</p>
          ) : visibleNotes.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {visibleNotes.map((note) => {
                const category = note.categoryId ? categoryById[note.categoryId] : null
                return (
                  <motion.div key={note.id} variants={fadeUp}>
                    <GlassPanel className="flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-sm font-semibold text-white">{note.title}</h3>
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => openEditNoteForm(note)}
                            aria-label="Edit note"
                            className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-primary"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            aria-label="Delete note"
                            className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      {category && (
                        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 font-body text-[11px] text-white/60">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </span>
                      )}
                      <p className="mt-3 flex-1 whitespace-pre-wrap font-body text-xs text-white/50">
                        {note.content || 'No content yet.'}
                      </p>
                      <p className="mt-3 font-body text-[11px] text-white/30">by {note.createdByName}</p>
                    </GlassPanel>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <GlassPanel className="p-8 text-center">
              <p className="font-body text-sm text-white/40">
                {selectedCategoryId ? 'No notes in this category yet.' : 'No notes yet — create the first one.'}
              </p>
            </GlassPanel>
          )}
        </div>
      </div>

      {isOwner(profile) && (
        <GlassPanel className="mt-6 flex items-center gap-3 p-5">
          <Crown className="shrink-0 text-primary" size={20} />
          <p className="font-body text-sm text-white/50">
            Notes are only visible to admins and the owner — never shown to regular members.
          </p>
        </GlassPanel>
      )}
    </div>
  )
}

export default DashboardNotes
