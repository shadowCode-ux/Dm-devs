import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, UserPlus2, FolderKanban, Calendar, Eye, UserPlus, UserCheck, Code2 } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import TiltCard from '../../../components/ui/TiltCard.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import CodeViewerModal from '../../../components/ui/CodeViewerModal.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProfile, incrementProfileViews } from '../../../lib/firestoreUsers.js'
import { subscribeToUserProjects } from '../../../lib/firestoreProjects.js'
import {
  subscribeToFollowers,
  subscribeToFollowing,
  followUser,
  unfollowUser,
} from '../../../lib/firestoreFollows.js'
import { fadeUp, fadeScale, staggerContainer, viewportOnce } from '../../../lib/motion.js'

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function formatJoinDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function PublicProfile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState(new Set())
  const [myFollowing, setMyFollowing] = useState(new Set())
  const [viewing, setViewing] = useState(null)

  const isOwnProfile = currentUser?.uid === id

  useEffect(() => {
    const unsubscribe = subscribeToUserProfile(id, (data) => {
      setProfile(data)
      setLoading(false)
    })
    return unsubscribe
  }, [id])

  useEffect(() => {
    const unsubscribe = subscribeToUserProjects(id, setProjects)
    return unsubscribe
  }, [id])

  useEffect(() => {
    const unsubFollowers = subscribeToFollowers(id, setFollowers)
    const unsubFollowing = subscribeToFollowing(id, setFollowing)
    return () => {
      unsubFollowers()
      unsubFollowing()
    }
  }, [id])

  useEffect(() => {
    if (!currentUser) return
    const unsubscribe = subscribeToFollowing(currentUser.uid, setMyFollowing)
    return unsubscribe
  }, [currentUser])

  // Increment the real view counter once per visit — but never count your
  // own visits to your own profile.
  useEffect(() => {
    if (!id || isOwnProfile) return
    incrementProfileViews(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const isFollowing = myFollowing.has(id)

  const handleFollowToggle = async () => {
    if (!currentUser) return
    if (isFollowing) {
      await unfollowUser(currentUser.uid, id)
    } else {
      await followUser(currentUser.uid, id)
    }
  }

  const handleViewProject = async (project) => {
    setViewing(project)
  }

  const stats = useMemo(
    () => [
      { icon: Users, label: 'Followers', value: followers.length },
      { icon: UserPlus2, label: 'Following', value: following.size },
      { icon: FolderKanban, label: 'Projects', value: projects.length },
      { icon: Eye, label: 'Profile Views', value: profile?.views || 0 },
    ],
    [followers, following, projects, profile],
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-white/40">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="font-body text-white/40">This profile doesn't exist.</p>
        <button onClick={() => navigate(-1)} className="font-body text-sm text-primary hover:underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1.5 font-body text-sm text-white/50 hover:text-primary"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Header */}
      <motion.div variants={fadeScale} initial="hidden" animate="show">
      <GlassPanel className="p-8 text-center">
        {profile.photoURL ? (
          <img
            src={profile.photoURL}
            alt={`${profile.displayName}'s avatar`}
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-semibold text-primary">
            {initials(profile.displayName)}
          </div>
        )}

        <h1 className="mt-4 font-heading text-2xl font-semibold text-white">
          {profile.displayName}
        </h1>
        <p className="mt-1 font-body text-xs text-white/40">
          <Calendar size={12} className="mr-1 inline -mt-0.5" />
          Joined {formatJoinDate(profile.createdAt)}
        </p>

        {!isOwnProfile && currentUser && (
          <button
            onClick={handleFollowToggle}
            className={`mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2 font-body text-sm transition-colors ${
              isFollowing
                ? 'bg-white/5 text-white/60 hover:text-red-400'
                : 'bg-primary text-background hover:shadow-glow'
            }`}
          >
            {isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}

        {isOwnProfile && (
          <Link
            to="/dashboard/settings"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-body text-sm text-white/70 hover:border-primary/40 hover:text-primary"
          >
            Edit Profile
          </Link>
        )}
      </GlassPanel>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassPanel className="p-4 text-center">
                <Icon size={16} className="mx-auto text-primary" />
                <div className="mt-2 font-heading text-xl font-semibold text-white">
                  {stat.value}
                </div>
                <div className="mt-0.5 font-body text-xs text-white/40">{stat.label}</div>
              </GlassPanel>
            </motion.div>
          )
        })}
      </motion.div>

      {/* About + Skills */}
      <GlassPanel className="mt-5 p-6">
        <h2 className="font-heading text-sm font-semibold text-white">About</h2>
        <p className="mt-2 font-body text-sm text-white/60">
          {profile.bio || 'This member hasn\'t added a bio yet.'}
        </p>

        {profile.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="primary">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Projects */}
      <div className="mt-5">
        <h2 className="mb-3 font-heading text-sm font-semibold text-white">
          Projects ({projects.length})
        </h2>
        {projects.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={fadeUp}>
                <TiltCard className="h-full overflow-hidden p-0" tiltMax={6}>
                  {project.screenshotUrl && (
                    <img
                      src={project.screenshotUrl}
                      alt={`${project.title} screenshot`}
                      className="h-32 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1 font-body text-xs text-white/50">{project.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tags || []).slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                      <button
                        onClick={() => handleViewProject(project)}
                        className="flex shrink-0 items-center gap-1 font-body text-xs text-primary hover:underline"
                      >
                        <Code2 size={12} />
                        View
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <GlassPanel className="p-8 text-center">
            <p className="font-body text-sm text-white/40">No projects submitted yet.</p>
          </GlassPanel>
        )}
      </div>

      <CodeViewerModal
        project={viewing}
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />
    </div>
  )
}

export default PublicProfile
