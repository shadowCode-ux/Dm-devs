import { motion } from 'framer-motion'
import { ShieldCheck, Heart, Zap, Code2 } from 'lucide-react'
import TiltCard from '../../components/ui/TiltCard.jsx'
import HeroGlow from '../../components/ui/HeroGlow.jsx'
import { fadeUp, staggerContainer, viewportOnce } from '../../lib/motion.js'

const timeline = [
  {
    year: '2022',
    title: 'The idea',
    description: 'Dark Mode Devs started as a small Discord server for a handful of developers who wanted a calmer, more focused place to talk shop.',
  },
  {
    year: '2023',
    title: 'Community forms',
    description: 'Structured channels, weekly events, and our first community-built projects. The server crossed 1,000 members.',
  },
  {
    year: '2024',
    title: 'Platform launches',
    description: 'We built our own tools — project showcases, a leaderboard, and a resource library — so the community had a home beyond chat.',
  },
  {
    year: '2025',
    title: 'Growing together',
    description: 'Thousands of developers now learn, build, and ship together here, across every stack and experience level.',
  },
]

const standards = [
  {
    icon: Heart,
    title: 'Respect first',
    description: 'Every member is here to grow. We critique code, never people.',
  },
  {
    icon: Code2,
    title: 'Show the work',
    description: 'Talk is easy. We value people who build, ship, and iterate in public.',
  },
  {
    icon: Zap,
    title: 'Move with intent',
    description: 'Ask good questions, give real feedback, and follow through on what you start.',
  },
  {
    icon: ShieldCheck,
    title: 'Protect the space',
    description: 'No gatekeeping, no toxicity. This is a space built to last.',
  },
]

function About() {
  return (
    <>
      {/* Mission */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20">
        <HeroGlow />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Our mission
          </h1>
          <p className="mt-6 font-body text-lg text-white/60">
            We believe the best way to become a great developer is alongside other developers
            who push you, teach you, and build with you. Dark Mode Devs exists to be that
            place — a community where learning and shipping happen side by side.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-semibold text-white">
            Where we've been
          </h2>

          <div className="relative mt-16 border-l border-white/10 pl-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pb-12 last:pb-0"
              >
                <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-background">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-glow" />
                </div>
                <span className="font-code text-xs text-primary">{item.year}</span>
                <h3 className="mt-1 font-heading text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm text-white/50">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Standards */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-heading text-3xl font-semibold text-white">
            Protocol standards
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center font-body text-white/50">
            The principles every member agrees to when they join.
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {standards.map((standard) => {
              const Icon = standard.icon
              return (
                <motion.div key={standard.title} variants={fadeUp}>
                  <TiltCard className="h-full p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-5 font-heading text-base font-semibold text-white">
                      {standard.title}
                    </h3>
                    <p className="mt-2 font-body text-sm text-white/50">
                      {standard.description}
                    </p>
                  </TiltCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
