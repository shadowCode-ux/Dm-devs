import { motion } from 'framer-motion'
import GlassPanel from './GlassPanel.jsx'
import { useTilt } from '../../hooks/useTilt.js'
import { clsx } from '../../lib/clsx.js'

/**
 * TiltCard — GlassPanel with a subtle 3D pointer-tilt and a light-sweep
 * glare, the kind of "premium card" feel used across Stripe/Linear-style
 * sites. Only `transform` is animated (GPU) — no layout thrash.
 *
 * Props mirror GlassPanel, plus:
 * - tiltMax: max rotation in degrees (default 8 — kept subtle intentionally)
 * - glare: show the light-sweep overlay (default true)
 */
function TiltCard({ children, className = '', tiltMax = 8, glare = true, hover = true, ...rest }) {
  const tilt = useTilt({ max: tiltMax, glare })

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ ...tilt.style, transformStyle: 'preserve-3d' }}
      className="[will-change:transform]"
    >
      <GlassPanel hover={hover} className={clsx('group relative overflow-hidden', className)} {...rest}>
        {!tilt.disabled && glare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              '--gx': tilt.glareX,
              '--gy': tilt.glareY,
              background: 'radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.12), transparent 55%)',
            }}
          />
        )}
        <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
      </GlassPanel>
    </motion.div>
  )
}

export default TiltCard
