import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Stats from './Stats.jsx'
import Features from './Features.jsx'
import HowItWorks from './HowItWorks.jsx'
import LatestProjects from './LatestProjects.jsx'
import HomeCTA from './HomeCTA.jsx'

function Home() {
  return (
    <>
    <section className="relative overflow-hidden px-6 pt-28 pb-32">
      {/* Ambient glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge variant="primary" className="mb-6">
            <Sparkles size={12} className="mr-1.5" />
            Now open to new members
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          Build. Learn. Ship.
          <br />
          <span className="text-primary">Together.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl font-body text-lg text-white/60"
        >
          Dark Mode Devs is a developer-first community for builders who want to learn
          faster, ship real projects, and grow alongside people who get it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
      </div>
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
