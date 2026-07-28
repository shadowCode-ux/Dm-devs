import { useLocation, Outlet } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { pageVariants, pageVariantsReduced } from '../../lib/motion.js'

/**
 * PageTransition — cross-fades + slightly lifts each route's content on
 * navigation. Keyed by pathname so AnimatePresence knows to run exit/enter
 * across route changes; `mode="wait"` keeps it from overlapping outgoing
 * and incoming pages (avoids double scrollbars / layout jumps).
 */
function PageTransition() {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()
  const variants = prefersReducedMotion ? pageVariantsReduced : pageVariants

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
