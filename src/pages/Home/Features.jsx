import { motion } from 'framer-motion'
import { BookOpen, Hammer, Users, TrendingUp } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'

const features = [
  {
    icon: BookOpen,
    title: 'Learn',
    description:
      'Structured learning paths covering everything from HTML fundamentals to advanced React patterns, taught by the community.',
  },
  {
    icon: Hammer,
    title: 'Build',
    description:
      'Ship real projects with real feedback. Add your work to the platform and get eyes on it from developers who care.',
  },
  {
    icon: Users,
    title: 'Network',
    description:
      'Connect with developers across every stack and skill level. Find collaborators, mentors, and future teammates.',
  },
  {
    icon: TrendingUp,
    title: 'Grow',
    description:
      'Track your progress, climb the leaderboard, and build a portfolio that shows the work — not just the words.',
  },
]

function Features() {
  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
            Everything you need to level up
          </h2>
          <p className="mt-4 font-body text-white/50">
            One community, four pillars — designed to take you from your first commit to
            shipping production software.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassPanel hover className="h-full p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-white/50">
                    {feature.description}
                  </p>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
