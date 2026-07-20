import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { subscribeToPublicStats } from '../../lib/firestorePublicStats.js'
import GlassPanel from '../../components/ui/GlassPanel.jsx'

function useCountUp(target, isInView, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime = null
    let frame

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, target, duration])

  return value
}

function StatItem({ label, value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const count = useCountUp(value, isInView)

  return (
    <GlassPanel ref={ref} className="px-6 py-8 text-center">
      <div className="font-heading text-4xl font-semibold text-primary sm:text-5xl">
        {count.toLocaleString()}
      </div>
      <div className="mt-2 font-body text-sm text-white/50">{label}</div>
    </GlassPanel>
  )
}

function Stats() {
  const [stats, setStats] = useState(null)

  // Publicly readable — works for logged-out visitors, unlike reading the
  // users/follows collections directly (which require sign-in).
  useEffect(() => {
    const unsubscribe = subscribeToPublicStats(setStats)
    return unsubscribe
  }, [])

  if (!stats) return null

  const items = [
    { label: 'Members', value: stats.memberCount },
    { label: 'Projects Shipped', value: stats.projectCount },
    { label: 'Connections Made', value: stats.followCount },
  ]

  return (
    <section className="px-6 pt-12 pb-32">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <StatItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  )
}

export default Stats
