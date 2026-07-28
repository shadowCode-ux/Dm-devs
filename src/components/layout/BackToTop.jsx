import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_PX = 400

function BackToTop() {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 1,
            scale: 1,
            // A quick double-jump, then a 5s pause before it repeats — not a
            // continuous bounce, so it reads as an occasional nudge rather
            // than a distraction. Skipped entirely for prefers-reduced-motion.
            y: prefersReducedMotion ? 0 : [0, -14, 0, -6, 0],
          }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            y: prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  times: [0, 0.3, 0.5, 0.7, 1],
                  repeat: Infinity,
                  repeatDelay: 4.2,
                  ease: 'easeOut',
                },
          }}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-glass text-primary shadow-glow backdrop-blur-glass transition-colors hover:bg-primary/10"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
