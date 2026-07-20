import { motion } from 'framer-motion'
import GlassPanel from '../../components/ui/GlassPanel.jsx'

const rules = [
  {
    title: 'Be respectful',
    description: 'No harassment, hate speech, or personal attacks. Disagree with ideas, not people.',
  },
  {
    title: 'Keep it on topic',
    description: 'Use the right channel for the right conversation. Off-topic chat has its own space.',
  },
  {
    title: 'No self-promotion spam',
    description: 'Sharing your work is welcome. Repeatedly dropping links with no engagement is not.',
  },
  {
    title: 'Give real feedback',
    description: 'If you\'re reviewing someone\'s project, be specific and constructive — not just "nice" or "bad".',
  },
  {
    title: 'No plagiarism',
    description: "Don't present someone else's work as your own, in projects or in help requests.",
  },
  {
    title: 'Protect member privacy',
    description: "Don't share personal information about other members without their consent.",
  },
  {
    title: 'Follow platform ToS',
    description: 'This includes Discord\'s Terms of Service and Community Guidelines at all times.',
  },
  {
    title: 'Listen to moderators',
    description: 'Mod decisions are final in the moment. Appeal calmly through the proper channel if you disagree.',
  },
]

function Rules() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Community Rules
          </h1>
          <p className="mt-4 font-body text-white/50">
            Simple guidelines that keep this a good place to build and learn.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <GlassPanel className="flex gap-5 p-5">
                <span className="font-code text-lg font-semibold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-white/50">{rule.description}</p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Rules
