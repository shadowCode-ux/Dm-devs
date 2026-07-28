/**
 * motion.js — shared animation tokens for the whole app.
 *
 * Goal: every entrance, hover, and transition on the site pulls from the
 * same small set of springs/eases so motion feels like one system, not a
 * pile of one-off tunings. Everything here animates `transform`/`opacity`
 * only — never layout properties (width/height/top/left) — so it stays on
 * the compositor thread and holds 60fps even on mid-tier mobile hardware.
 */

// --- Core springs --------------------------------------------------------

/** Snappy, slightly bouncy — buttons, tiles, small UI. */
export const springSnappy = { type: 'spring', stiffness: 400, damping: 28, mass: 0.7 }

/** Softer, more travel — page-level entrances, panels, modals. */
export const springSoft = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }

/** Slow, heavy settle — hero elements, large cinematic reveals. */
export const springHeavy = { type: 'spring', stiffness: 180, damping: 26, mass: 1.1 }

/** For magnetic/tilt effects that need to feel instantaneous and alive. */
export const springMagnetic = { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }

export const easeCinematic = [0.16, 1, 0.3, 1] // strong ease-out, no overshoot

// --- Entrance variants -----------------------------------------------------

/**
 * fadeUp — the workhorse entrance used across cards, headings, and sections.
 * Pass `custom` (index) to stagger via delay on the parent, or use with
 * `staggerContainer` below for automatic child staggering.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springSoft, delay: i * 0.08 },
  }),
}

export const fadeUpReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
}

/** Container that staggers any `fadeUp`/`fadeScale` children automatically. */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: springSoft },
}

export const fadeScaleReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
}

/** Standard viewport config for whileInView entrances — trigger once, slightly early. */
export const viewportOnce = { once: true, margin: '-80px' }

// --- Page transitions ------------------------------------------------------

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeCinematic } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeCinematic } },
}

export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}
