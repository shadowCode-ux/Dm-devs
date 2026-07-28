import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'
import { subscribeToPublicStats } from '../../lib/firestorePublicStats.js'
import TiltCard from '../../components/ui/TiltCard.jsx'

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

function StatItem({ label, value, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const count = useCountUp(value, isInView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <TiltCard tiltMax={6} className="px-6 py-8 text-center">
        <div className="font-heading text-4xl font-semibold text-primary sm:text-5xl">
          {count.toLocaleString()}
        </div>
        <div className="mt-2 font-body text-sm text-white/50">{label}</div>
      </TiltCard>
    </motion.div>
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
        {items.map((item, index) => (
          <StatItem key={item.label} {...item} index={index} />
        ))}
      </div>
    </section>
  )
}

export default Stats
