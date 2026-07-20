import { useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { FolderKanban, Users, UserPlus } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProjects } from '../../../lib/firestoreProjects.js'
import {
  subscribeToFollowers,
  subscribeToFollowing,
} from '../../../lib/firestoreFollows.js'
import {
  POINTS_PER_PROJECT,
  POINTS_PER_FOLLOWER,
} from '../../../lib/firestoreLeaderboard.js'

const pieColors = ['#00BFFF', '#8AE4FF', '#3b82f6']

function monthKey(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

// Builds a real cumulative points-per-month series from actual timestamped
// events (projects submitted, followers gained) — no invented numbers.
function buildPointsOverTime(projects, followers) {
  const events = [
    ...projects.map((p) => ({ date: p.createdAt?.toDate?.(), points: POINTS_PER_PROJECT })),
    ...followers.map((f) => ({ date: f.createdAt?.toDate?.(), points: POINTS_PER_FOLLOWER })),
  ].filter((e) => e.date)

  events.sort((a, b) => a.date - b.date)

  const buckets = new Map()
  let cumulative = 0
  for (const event of events) {
    cumulative += event.points
    buckets.set(monthKey(event.date), cumulative)
  }

  return Array.from(buckets.entries()).map(([month, points]) => ({ month, points }))
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-surface px-3 py-2 font-body text-xs text-white shadow-glow">
      {label ? `${label}: ` : ''}
      {payload[0].value.toLocaleString()}
      {label ? ' pts' : ''}
    </div>
  )
}

function DashboardAnalytics() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubProjects = subscribeToUserProjects(user.uid, (data) => {
      setProjects(data)
      setLoading(false)
    })
    const unsubFollowers = subscribeToFollowers(user.uid, setFollowers)
    const unsubFollowing = subscribeToFollowing(user.uid, setFollowing)

    return () => {
      unsubProjects()
      unsubFollowers()
      unsubFollowing()
    }
  }, [user])

  const pointsOverTime = useMemo(
    () => buildPointsOverTime(projects, followers),
    [projects, followers],
  )

  const totalPoints =
    projects.length * POINTS_PER_PROJECT + followers.length * POINTS_PER_FOLLOWER

  const activityBreakdown = [
    { name: 'Projects', value: projects.length },
    { name: 'Followers', value: followers.length },
    { name: 'Following', value: following.size },
  ].filter((entry) => entry.value > 0)

  const recentActivity = useMemo(() => {
    return [...projects]
      .filter((p) => p.createdAt?.toDate)
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
      .slice(0, 5)
  }, [projects])

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-white">Analytics</h1>
      <p className="mt-2 font-body text-white/50">Your activity and growth over time — all real, computed live.</p>

      {loading ? (
        <p className="mt-8 font-body text-white/40">Loading your analytics...</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <GlassPanel className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FolderKanban size={18} />
              </div>
              <div className="mt-4 font-heading text-2xl font-semibold text-white">
                {projects.length}
              </div>
              <div className="mt-1 font-body text-xs text-white/50">Projects submitted</div>
            </GlassPanel>
            <GlassPanel className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>
              <div className="mt-4 font-heading text-2xl font-semibold text-white">
                {followers.length}
              </div>
              <div className="mt-1 font-body text-xs text-white/50">Followers</div>
            </GlassPanel>
            <GlassPanel className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserPlus size={18} />
              </div>
              <div className="mt-4 font-heading text-2xl font-semibold text-white">
                {totalPoints.toLocaleString()}
              </div>
              <div className="mt-1 font-body text-xs text-white/50">Total points</div>
            </GlassPanel>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Points over time */}
            <GlassPanel className="p-6">
              <h2 className="mb-4 font-heading text-sm font-semibold text-white">
                Points Over Time
              </h2>
              {pointsOverTime.length > 0 ? (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={pointsOverTime} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(0,191,255,0.2)' }} />
                      <Line
                        type="monotone"
                        dataKey="points"
                        stroke="#00BFFF"
                        strokeWidth={2.5}
                        dot={{ fill: '#00BFFF', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-16 text-center font-body text-sm text-white/40">
                  Submit a project or gain a follower to start tracking growth.
                </p>
              )}
            </GlassPanel>

            {/* Activity breakdown */}
            <GlassPanel className="p-6">
              <h2 className="mb-4 font-heading text-sm font-semibold text-white">
                Activity Breakdown
              </h2>
              {activityBreakdown.length > 0 ? (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={activityBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {activityBreakdown.map((entry, index) => (
                          <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-16 text-center font-body text-sm text-white/40">
                  No activity yet.
                </p>
              )}
            </GlassPanel>
          </div>

          {/* Recent activity */}
          <GlassPanel className="mt-6 p-6">
            <h2 className="mb-4 font-heading text-sm font-semibold text-white">
              Recent Project Submissions
            </h2>
            {recentActivity.length > 0 ? (
              <div className="flex flex-col divide-y divide-white/10">
                {recentActivity.map((project) => (
                  <div key={project.id} className="flex items-center justify-between py-3">
                    <span className="font-body text-sm text-white">{project.title}</span>
                    <span className="font-body text-xs text-white/40">
                      {project.createdAt.toDate().toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-white/40">No projects submitted yet.</p>
            )}
          </GlassPanel>
        </>
      )}
    </div>
  )
}

export default DashboardAnalytics
