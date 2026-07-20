import { clsx } from '../../lib/clsx.js'

const variants = {
  default: 'bg-white/5 text-white/70 border border-white/10',
  primary: 'bg-primary/10 text-primary border border-primary/30',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
}

/**
 * Badge — small pill label for tags, statuses, and roles.
 *
 * Props:
 * - variant: 'default' | 'primary' | 'success' | 'warning' (default: 'default')
 */
function Badge({ children, variant = 'default', className = '', ...rest }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

export default Badge
