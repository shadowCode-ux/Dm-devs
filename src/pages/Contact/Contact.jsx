import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Terminal } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import { contactSchema } from '../../validation/contactSchema.js'

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    // No backend yet — simulate a request so the form UX is real.
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Contact form submitted:', data)
    reset()
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 font-body text-white/50">
            Questions, feedback, or partnership ideas — send them our way.
          </p>
        </div>

        <GlassPanel className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Terminal size={16} className="text-primary" />
            <span className="font-code text-xs text-white/40">contact@dark-mode-devs</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="font-code text-xs text-primary">{'>'} name</label>
              <input
                type="text"
                {...register('name')}
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
              {errors.name && (
                <p className="mt-1.5 font-body text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="font-code text-xs text-primary">{'>'} email</label>
              <input
                type="text"
                {...register('email')}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
              {errors.email && (
                <p className="mt-1.5 font-body text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-code text-xs text-primary">{'>'} message</label>
              <textarea
                rows={5}
                {...register('message')}
                placeholder="What's on your mind?"
                className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
              {errors.message && (
                <p className="mt-1.5 font-body text-xs text-red-400">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <Send size={16} />
            </Button>

            {isSubmitSuccessful && (
              <p className="text-center font-code text-xs text-primary">
                message sent — we'll get back to you soon
              </p>
            )}
          </form>
        </GlassPanel>
      </div>
    </section>
  )
}

export default Contact
