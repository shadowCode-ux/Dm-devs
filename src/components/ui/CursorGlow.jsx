import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * CursorGlow — a soft radial light that trails the cursor, mounted once at
 * the app root. Fixed, pointer-events-none, animates only `transform`
 * (translate) so it never touches layout. Disabled on touch devices (no
 * cursor to track) and under prefers-reduced-motion.
 */
function CursorGlow() {
  const prefersReducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)
  const x = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.4 })

  useEffect(() => {
    const isFinePointer = window.matchMedia?.('(pointer: fine)').matches
    if (!isFinePointer || prefersReducedMotion) return

    setEnabled(true)
    const handleMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [prefersReducedMotion, rawX, rawY])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[90px] [will-change:transform]"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    />
  )
}

export default CursorGlow
