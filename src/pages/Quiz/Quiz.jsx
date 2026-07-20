import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import { clsx } from '../../lib/clsx.js'
import { quizLanguages } from '../../data/quiz.js'

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

        {!submitted ? (
          <div className="flex flex-col gap-6">
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
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {quizLanguages.map((lang) => {
              const result = lang.levels.find((level) => level.value === answers[lang.key])
              return (
                <GlassPanel key={lang.key} className="p-6">
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
              )
            })}

            <Button variant="secondary" onClick={handleRetake} className="mt-2 self-start">
              <RotateCcw size={15} />
              Retake Quiz
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Quiz
