import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, TrendingUp, Users, Award, Plus, Compass } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import HeroGlow from '../../../components/ui/HeroGlow.jsx'
import Button from '../../../components/ui/Button.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProjects } from '../../../lib/firestoreProjects.js'
import { subscribeToFollowers } from '../../../lib/firestoreFollows.js'
import { subscribeToLeaderboard, POINTS_PER_PROJECT, POINTS_PER_FOLLOWER } from '../../../lib/firestoreLeaderboard.js'
import { subscribeToUserProfile } from '../../../lib/firestoreUsers.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

function Overview() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [followerCount, setFollowerCount] = useState(0)
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) return

    const unsubProjects = subscribeToUserProjects(user.uid, (data) => {
      setProjects(data)
      setLoading(false)
    })

    const unsubFollowers = subscribeToFollowers(user.uid, (data) => {
      setFollowerCount(data.length)
    })

    const unsubLeaderboard = subscribeToLeaderboard((ranked) => {
      const position = ranked.findIndex((entry) => entry.id === user.uid)
      setRank(position === -1 ? null : position + 1)
    })

    const unsubProfile = subscribeToUserProfile(user.uid, setProfile)

    return () => {
      unsubProjects()
      unsubFollowers()
      unsubLeaderboard()
      unsubProfile()
    }
  }, [user])

  const points = projects.length * POINTS_PER_PROJECT + followerCount * POINTS_PER_FOLLOWER

  const quickStats = [
    { icon: FolderKanban, label: 'Your Projects', value: projects.length },
    { icon: TrendingUp, label: 'Points', value: points.toLocaleString() },
    { icon: Award, label: 'Rank', value: rank ? `#${rank}` : '—' },
    { icon: Users, label: 'Followers', value: followerCount },
  ]

  return (
    <div>
      <div className="relative overflow-hidden">
        <HeroGlow compact topOffset={-100} />
        <div className="relative">
          <h1 className="font-heading text-3xl font-semibold text-white">
            Welcome back{profile?.displayName ? `, ${profile.displayName}` : user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-2 font-body text-white/50">
            Here's what's happening with your account.
          </p>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} variants={fadeUp}>
              <GlassPanel className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <div className="mt-4 font-heading text-2xl font-semibold text-white">
                  {loading ? (
                    <span className="inline-block h-7 w-10 animate-pulse rounded bg-white/10 align-middle" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="mt-1 font-body text-xs text-white/50">{stat.label}</div>
              </GlassPanel>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent projects */}
      <GlassPanel className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">Your Recent Projects</h2>
          <Link to="/dashboard/projects" className="font-body text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-4 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 w-full animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="mt-4 flex flex-col divide-y divide-white/10">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-3">
                <span className="font-body text-sm text-white">{project.title}</span>
                <span className="font-body text-xs text-white/40">
                  {(project.tags || []).join(', ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 font-body text-sm text-white/40">
            You haven't submitted any projects yet.
          </p>
        )}
      </GlassPanel>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <GlassPanel hover className="p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Plus size={18} />
          </div>
          <h3 className="mt-4 font-heading text-base font-semibold text-white">Add a Project</h3>
          <p className="mt-1 font-body text-sm text-white/50">
            Share what you're building with the rest of the community.
          </p>
          <Button as={Link} to="/dashboard/add-project" variant="secondary" size="sm" className="mt-4">
            Submit Project
          </Button>
        </GlassPanel>

        <GlassPanel hover className="p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass size={18} />
          </div>
          <h3 className="mt-4 font-heading text-base font-semibold text-white">Find Members</h3>
          <p className="mt-1 font-body text-sm text-white/50">
            Discover and follow other developers in the community.
          </p>
          <Button as={Link} to="/dashboard/discovery" variant="secondary" size="sm" className="mt-4">
            Go to Discovery
          </Button>
        </GlassPanel>
      </div>
    </div>
  )
}

export default Overview
