import { motion, useReducedMotion } from 'framer-motion'

/**
 * HeroGlow — the ambient, breathing background glow used at the top of
 * marketing pages. Pulls double duty as visual identity + the "always
 * something moving" ambient motion the rest of the page doesn't have.
 *
 * Animates `transform: scale` + `opacity` only (not width/height), so the
 * browser never recalculates layout for a loop that runs the entire time
 * the page is open — critical for holding 60fps with multiple glows on
 * screen at once.
 *
 * Sized for a typical hero section; pass `compact` for glows inside a
 * bounded/overflow-hidden container (e.g. a CTA card) where a full-size
 * glow would just get clipped.
 */
function HeroGlow({ compact = false, topOffset = 0, left = '50%', color = 'bg-primary/40', className = '' }) {
  const prefersReducedMotion = useReducedMotion()

  const baseSize = compact ? { width: 500, height: 300 } : { width: 850, height: 580 }

  return (
    <motion.div
      aria-hidden="true"
      style={{ top: topOffset, left, width: baseSize.width, height: baseSize.height }}
      initial={{ scale: 0.75, opacity: 0.3 }}
      animate={
        prefersReducedMotion
          ? { scale: 0.9, opacity: 0.4 }
          : { scale: [0.75, 1.2, 0.75], opacity: [0.3, 0.5, 0.3] }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: compact ? 6 : 7, repeat: Infinity, ease: 'easeInOut' }
      }
      className={`pointer-events-none absolute -translate-x-1/2 rounded-full ${color} blur-[110px] [will-change:transform,opacity] ${className}`}
    />
  )
}

export default HeroGlow
