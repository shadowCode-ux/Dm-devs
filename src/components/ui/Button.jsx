import { motion } from 'framer-motion'
import { clsx } from '../../lib/clsx.js'

const variants = {
  primary:
    'bg-primary text-background font-semibold hover:shadow-glow focus-visible:shadow-glow',
  secondary:
    'bg-white/5 text-white border border-white/10 hover:border-primary/40 hover:text-primary',
  ghost: 'bg-transparent text-white/70 hover:text-primary hover:bg-white/5',
  outline:
    'bg-transparent text-primary border border-primary/40 hover:bg-primary/10 hover:shadow-glow',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

/**
 * Button — shared CTA/action primitive.
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' | 'outline' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - as: render as a different element (e.g. Link) — default 'button'
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  ...rest
}) {
  const MotionTag = motion.create ? motion.create(Tag) : motion(Tag)

  return (
    <MotionTag
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-body outline-none transition-colors duration-200',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export default Button
