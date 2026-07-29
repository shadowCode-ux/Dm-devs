import { forwardRef, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { clsx } from '../../lib/clsx.js'
import { springSnappy } from '../../lib/motion.js'

/**
 * GlassPanel — base glassmorphism surface used across cards, sections, and modals.
 *
 * Props:
 * - hover: adds a spring-based lift + glow on hover (default: false)
 * - as: render as a different element/tag (default: 'div')
 * - className: extra classes merged onto the panel
 *
 * Hover lift uses a Framer Motion spring on `transform` only (translateY),
 * not a CSS layout transition — keeps it on the compositor thread and gives
 * it the springy "settle" feel instead of a linear ease.
 *
 * Forwards ref to the underlying element — needed for scroll-triggered
 * animations (e.g. Framer Motion's useInView) and for TiltCard.
 */
const GlassPanel = forwardRef(function GlassPanel(
  { children, hover = false, as: Tag = 'div', className = '', ...rest },
  ref,
) {
  const prefersReducedMotion = useReducedMotion()
  // Memoized: motion.create(Tag) must NOT be called fresh every render — a
  // new component identity each time forces React to unmount/remount the
  // whole subtree underneath (e.g. any <input> inside loses focus after
  // every keystroke). Keying on Tag means it's only recreated if the
  // rendered element type actually changes.
  const MotionTag = useMemo(() => (motion.create ? motion.create(Tag) : motion(Tag)), [Tag])

  return (
    <MotionTag
      ref={ref}
      whileHover={hover && !prefersReducedMotion ? { y: -4 } : undefined}
      transition={springSnappy}
      className={clsx(
        'rounded-2xl border border-white/10 bg-glass backdrop-blur-glass [will-change:transform]',
        hover && 'transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </MotionTag>
  )
})

export default GlassPanel
