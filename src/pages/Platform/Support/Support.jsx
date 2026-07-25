import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle, BookOpen, HelpCircle, Send } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Button from '../../../components/ui/Button.jsx'
import { supportSchema } from '../../../validation/supportSchema.js'

const quickLinks = [
  {
    icon: MessageCircle,
    title: 'Ask in Discord',
    description: 'Fastest way to get help — post in #help-frontend or #help-backend.',
    href: 'https://discord.gg/xZ8wDJ6bRa',
    external: true,
  },
  {
    icon: BookOpen,
    title: 'Browse the Docs',
    description: 'Answers to common platform questions, from profiles to points.',
    to: '/platform/docs',
  },
  {
    icon: HelpCircle,
    title: 'Check the FAQ',
    description: 'Quick answers to the questions members ask most.',
    to: '/faq',
  },
]

const categories = ['Technical', 'Account', 'Community', 'Other']

function Support() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(supportSchema),
  })

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Support ticket submitted:', data)
    reset()
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Support
          </h1>
          <p className="mt-4 font-body text-white/50">
            Need help? Here's the fastest way to get an answer.
          </p>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            const CardTag = link.external ? 'a' : link.to ? Link : 'div'
            const extraProps = link.external
              ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
              : link.to
              ? { to: link.to }
              : {}
            return (
              <GlassPanel
                key={link.title}
                hover
                as={CardTag}
                {...extraProps}
                className="p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-white">
                  {link.title}
                </h3>
                <p className="mt-1.5 font-body text-xs text-white/50">{link.description}</p>
              </GlassPanel>
            )
          })}
        </div>

        <GlassPanel className="mx-auto max-w-xl p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-white">Submit a Ticket</h2>
          <p className="mt-1 font-body text-sm text-white/50">
            For anything that needs a direct, private response.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
            <div>
              <label className="font-body text-xs text-white/50">Category</label>
              <select
                {...register('category')}
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors focus:border-primary/40 focus:shadow-glow"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-surface">
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 font-body text-xs text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-xs text-white/50">Subject</label>
              <input
                type="text"
                {...register('subject')}
                placeholder="Brief summary of the issue"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
              {errors.subject && (
                <p className="mt-1.5 font-body text-xs text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-xs text-white/50">Details</label>
              <textarea
                rows={4}
                {...register('details')}
                placeholder="What happened, and what did you expect instead?"
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
              {errors.details && (
                <p className="mt-1.5 font-body text-xs text-red-400">
                  {errors.details.message}
                </p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              <Send size={16} />
            </Button>

            {isSubmitSuccessful && (
              <p className="text-center font-code text-xs text-primary">
                ticket received — we'll follow up soon
              </p>
            )}
          </form>
        </GlassPanel>
      </div>
    </section>
  )
}

export default Support
