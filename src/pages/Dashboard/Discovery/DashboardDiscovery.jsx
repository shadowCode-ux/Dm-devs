import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, UserPlus, UserCheck } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { clsx } from '../../../lib/clsx.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToAllUsers } from '../../../lib/firestoreUsers.js'
import {
  subscribeToFollowing,
  followUser,
  unfollowUser,
} from '../../../lib/firestoreFollows.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function DashboardDiscovery() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [following, setFollowing] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // Real-time: updates live if someone else edits their profile or joins.
  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((users) => {
      setAllUsers(users)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Real-time: who the current user is following, persisted in Firestore —
  // survives refresh, unlike the old local-state-only version.
  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToFollowing(user.uid, setFollowing)
    return unsubscribe
  }, [user])

  const members = useMemo(() => {
    return allUsers.filter((member) => member.id !== user?.uid)
  }, [allUsers, user])

  const filtered = useMemo(() => {
    return members.filter((member) =>
      (member.displayName || '').toLowerCase().includes(query.toLowerCase()),
    )
  }, [members, query])

  const toggleFollow = async (memberId) => {
    if (following.has(memberId)) {
      await unfollowUser(user.uid, memberId)
    } else {
      await followUser(user.uid, memberId)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-white">Discovery</h1>
      <p className="mt-2 font-body text-white/50">Find developers to follow and collaborate with.</p>

      <div className="relative mt-8 mb-8 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
        />
      </div>

      {loading ? (
        <p className="font-body text-white/40">Loading members...</p>
      ) : filtered.length > 0 ? (
        <motion.div
          key={query}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((member) => {
            const isFollowing = following.has(member.id)
            return (
              <motion.div key={member.id} variants={fadeUp}>
              <GlassPanel hover className="p-5">
                <Link to={`/dashboard/profile/${member.id}`} className="flex items-center gap-3">
                  {member.photoURL ? (
                    <img
                      src={member.photoURL}
                      alt={`${member.displayName || 'Member'} avatar`}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
                      {initials(member.displayName)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-body text-sm font-medium text-white hover:text-primary">
                      {member.displayName || 'Unnamed'}
                    </h3>
                    <p className="font-body text-xs text-white/40">{member.email}</p>
                  </div>
                </Link>

                {member.bio && (
                  <p className="mt-3 font-body text-sm text-white/50">{member.bio}</p>
                )}

                {member.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => toggleFollow(member.id)}
                  className={clsx(
                    'mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 font-body text-sm transition-colors',
                    isFollowing
                      ? 'bg-white/5 text-white/60 hover:text-red-400'
                      : 'bg-primary/10 text-primary hover:bg-primary/20',
                  )}
                >
                  {isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </GlassPanel>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <div className="py-16 text-center font-body text-white/40">
          {members.length === 0
            ? "No other members have joined yet — invite someone!"
            : 'No members match your search.'}
        </div>
      )}
    </div>
  )
}

export default DashboardDiscovery
