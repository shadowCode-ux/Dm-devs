import { forwardRef } from 'react'
import { clsx } from '../../lib/clsx.js'

/**
 * GlassPanel — base glassmorphism surface used across cards, sections, and modals.
 *
 * Props:
 * - hover: adds a subtle lift + glow on hover (default: false)
 * - as: render as a different element/tag (default: 'div')
 * - className: extra classes merged onto the panel
 *
 * Forwards ref to the underlying element — needed for scroll-triggered
 * animations (e.g. Framer Motion's useInView).
 */
const GlassPanel = forwardRef(function GlassPanel(
  { children, hover = false, as: Tag = 'div', className = '', ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={clsx(
        'rounded-2xl border border-white/10 bg-glass backdrop-blur-glass',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default GlassPanel
