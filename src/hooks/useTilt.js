import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/**
 * useTilt — 3D pointer-tilt for cards. Tracks pointer position as a 0–1
 * percentage across the element, maps it to a rotation range, and also
 * exposes a glare position for a subtle light-sweep overlay. Spring-damped
 * so it settles instead of snapping, and returns identity transforms when
 * prefers-reduced-motion is set (caller can also just skip wiring events).
 */
export function useTilt({ max = 10, glare = true } = {}) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 }
  const springPx = useSpring(px, springConfig)
  const springPy = useSpring(py, springConfig)

  const rotateX = useTransform(springPy, [0, 1], [max, -max])
  const rotateY = useTransform(springPx, [0, 1], [-max, max])
  const glareX = useTransform(springPx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(springPy, [0, 1], ['0%', '100%'])

  const onMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const onMouseLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return {
    ref,
    style: prefersReducedMotion ? {} : { rotateX, rotateY, transformPerspective: 800 },
    glareStyle: glare && !prefersReducedMotion ? { backgroundPosition: undefined } : null,
    glareX,
    glareY,
    onMouseMove,
    onMouseLeave,
    disabled: prefersReducedMotion,
  }
}
