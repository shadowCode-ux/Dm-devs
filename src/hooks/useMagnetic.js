import { useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * useMagnetic — pulls an element toward the cursor within a radius, then
 * releases it back to rest. Pointer-only (skips touch, since there's no
 * hover state to magnetize toward) and fully disabled under
 * prefers-reduced-motion.
 *
 * Usage:
 *   const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic()
 *   <motion.button ref={ref} style={{ x, y }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
 */
export function useMagnetic({ strength = 0.35, max = 14 } = {}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.15 })
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.15 })

  const onMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current || e.pointerType === 'touch') return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    rawX.set(Math.max(Math.min(relX * strength, max), -max))
    rawY.set(Math.max(Math.min(relY * strength, max), -max))
  }

  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return { ref, x, y, onMouseMove, onMouseLeave }
}
