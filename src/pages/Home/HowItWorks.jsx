import { motion } from 'framer-motion'
import { UserPlus, Users, Rocket } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your account',
    description: 'Sign up and set your profile — a display name and a short bio is all it takes.',
  },
  {
    icon: Users,
    step: '02',
    title: 'Find your people',
    description: 'Browse Discovery to find developers building similar things, and follow them.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Ship and share',
    description: 'Submit your projects to the showcase — real code, real feedback, real growth.',
  },
]

function HowItWorks() {
  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 font-body text-white/50">
            Getting started takes minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassPanel className="h-full p-6">
                  <span className="font-code text-xs text-primary">{item.step}</span>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-white/50">{item.description}</p>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
