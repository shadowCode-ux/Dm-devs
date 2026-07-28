import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import HeroGlow from '../../components/ui/HeroGlow.jsx'
import Stats from './Stats.jsx'
import Features from './Features.jsx'
import HowItWorks from './HowItWorks.jsx'
import LatestProjects from './LatestProjects.jsx'
import HomeCTA from './HomeCTA.jsx'
import { fadeUp, fadeUpReduced } from '../../lib/motion.js'

function Home() {
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef(null)

  // Subtle parallax: the glow drifts slower than scroll, the copy drifts
  // slightly faster and fades — both driven by scroll progress through the
  // hero only, so it settles the instant you scroll past it rather than
  // following you down the whole page.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const glowY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 80])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -40])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, prefersReducedMotion ? 1 : 0.2])

  const variants = prefersReducedMotion ? fadeUpReduced : fadeUp

  return (
    <>
      <section ref={heroRef} className="relative overflow-hidden px-6 pt-28 pb-32">
        {/* Ambient glow background — two layered glows breathing on offset
            cycles, so the hero has real, obvious ambient motion instead of
            a barely-perceptible shift. Static for prefers-reduced-motion. */}
        <motion.div style={{ y: glowY }} className="contents">
          <HeroGlow topOffset={-80} />
          <HeroGlow
            compact
            topOffset={20}
            left="60%"
            color="bg-primary/50"
          />
        </motion.div>

        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative mx-auto max-w-4xl text-center">
          <motion.div
            variants={variants}
            initial="hidden"
            animate="show"
            custom={0}
            className="flex justify-center"
          >
            <Badge variant="primary" className="mb-6">
              <Sparkles size={12} className="mr-1.5" />
              Now open to new members
            </Badge>
          </motion.div>

          <motion.h1
            variants={variants}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-heading text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            Build. Learn. Ship.
            <br />
            <span className="text-primary">Together.</span>
          </motion.h1>

          <motion.p
            variants={variants}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-xl font-body text-lg text-white/60"
          >
            Dark Mode Devs is a developer-first community for builders who want to learn
            faster, ship real projects, and grow alongside people who get it.
          </motion.p>

          <motion.div
            variants={variants}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button as={Link} to="/signup" variant="primary" size="lg">
              Join the Community
              <ArrowRight size={18} />
            </Button>
            <Button as={Link} to="/platform/projects" variant="secondary" size="lg">
              Explore Platform
            </Button>
          </motion.div>
        </motion.div>
      </section>
      <Stats />
      <Features />
      <HowItWorks />
      <LatestProjects />
      <HomeCTA />
    </>
  )
}

export default Home
