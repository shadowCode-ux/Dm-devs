/**
 * clsx — joins class name values together, skipping falsy ones.
 * Usage: clsx('base', isActive && 'active', className)
 */
export function clsx(...values) {
  return values.filter(Boolean).join(' ')
}
