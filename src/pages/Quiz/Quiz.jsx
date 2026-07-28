import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import { clsx } from '../../lib/clsx.js'
import { quizLanguages } from '../../data/quiz.js'
import { fadeUp, staggerContainer } from '../../lib/motion.js'

function Quiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = quizLanguages.every((lang) => answers[lang.key])

  const handleSelect = (langKey, value) => {
    setAnswers((prev) => ({ ...prev, [langKey]: value }))
  }

  const handleRetake = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Skill Level Quiz
          </h1>
          <p className="mt-4 font-body text-white/50">
            Answer honestly for each language — we'll point you to exactly where to start
            in the Learn reference.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!submitted ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {quizLanguages.map((lang) => (
                <GlassPanel key={lang.key} className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-white">
                    {lang.question}
                  </h2>
                  <div className="mt-4 flex flex-col gap-2">
                    {lang.levels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handleSelect(lang.key, level.value)}
                        className={clsx(
                          'rounded-lg border px-4 py-3 text-left font-body text-sm transition-colors',
                          answers[lang.key] === level.value
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-primary/20 hover:text-white',
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </GlassPanel>
              ))}

              <Button
                variant="primary"
                size="lg"
                disabled={!allAnswered}
                onClick={() => setSubmitted(true)}
                className="mt-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                See My Results
                <ArrowRight size={16} />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              {quizLanguages.map((lang) => {
                const result = lang.levels.find((level) => level.value === answers[lang.key])
                return (
                  <motion.div key={lang.key} variants={fadeUp}>
                    <GlassPanel className="p-6">
                      <span className="font-code text-xs text-primary">{lang.label}</span>
                      <h3 className="mt-1 font-heading text-lg font-semibold text-white">
                        {result.levelLabel}
                      </h3>
                      <p className="mt-2 font-body text-sm text-white/60">{result.description}</p>
                      <Link
                        to={`/learn?lang=${lang.key}`}
                        className="mt-4 inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline"
                      >
                        Start learning {lang.label}
                        <ArrowRight size={14} />
                      </Link>
                    </GlassPanel>
                  </motion.div>
                )
              })}

              <motion.div variants={fadeUp}>
                <Button variant="secondary" onClick={handleRetake} className="self-start">
                  <RotateCcw size={15} />
                  Retake Quiz
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Quiz
