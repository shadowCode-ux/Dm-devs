import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import HeroGlow from '../../../components/ui/HeroGlow.jsx'
import Button from '../../../components/ui/Button.jsx'
import { clsx } from '../../../lib/clsx.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToLeaderboard } from '../../../lib/firestoreLeaderboard.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

const rankColors = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
}

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-surface px-3 py-2 font-body text-xs text-white shadow-glow">
      {payload[0].payload.displayName}: {payload[0].value.toLocaleString()} pts
    </div>
  )
}

function Leaderboard() {
  const { user } = useAuth()
  const [ranked, setRanked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToLeaderboard((data) => {
      setRanked(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  if (!user) {
    return (
      <section className="relative overflow-hidden px-6 py-24">
        <HeroGlow compact />
        <div className="relative mx-auto max-w-md text-center">
          <h1 className="font-heading text-3xl font-semibold text-white">Leaderboard</h1>
          <p className="mt-4 font-body text-white/50">
            Sign in to see how the community ranks — based on real projects submitted and
            real followers earned.
          </p>
          <Button as={Link} to="/login" variant="primary" className="mt-6">
            Log In
          </Button>
        </div>
      </section>
    )
  }

  const chartData = ranked.slice(0, 10)

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative mb-14 overflow-hidden text-center">
          <HeroGlow compact topOffset={-40} />
          <div className="relative">
            <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
              Leaderboard
            </h1>
            <p className="mt-4 font-body text-white/50">
              10 points per project submitted, 2 points per follower earned. Real data, updated live.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center font-body text-white/40">Loading rankings...</p>
        ) : ranked.length === 0 ? (
          <div className="py-16 text-center font-body text-white/40">
            No members yet — the leaderboard fills in as people join and submit projects.
          </div>
        ) : (
          <>
            <GlassPanel className="mb-8 p-6">
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="displayName"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,191,255,0.05)' }} />
                    <Bar dataKey="points" fill="#00BFFF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="divide-y divide-white/10"
              >
                {ranked.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={fadeUp}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={clsx(
                          'w-6 font-code text-sm font-semibold',
                          rankColors[index + 1] || 'text-white/40',
                        )}
                      >
                        {index < 3 ? <Trophy size={16} /> : index + 1}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-semibold text-primary">
                        {initials(member.displayName)}
                      </div>
                      <div>
                        <span className="font-body text-sm text-white">{member.displayName}</span>
                        <p className="font-body text-xs text-white/40">
                          {member.projectCount} project{member.projectCount !== 1 ? 's' : ''} ·{' '}
                          {member.followerCount} follower{member.followerCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-code text-sm text-white/60">
                      {member.points.toLocaleString()} pts
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </GlassPanel>
          </>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
