import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'

const faqs = [
  {
    question: 'Is Dark Mode Devs free to join?',
    answer: 'Yes, joining the community and using the platform is completely free.',
  },
  {
    question: 'Do I need to already know how to code?',
    answer: 'No. We have members ranging from complete beginners to senior engineers. Our learning paths and help channels are built to support all levels.',
  },
  {
    question: 'What tech stacks does the community focus on?',
    answer: 'We\'re stack-agnostic — frontend, backend, mobile, AI, and everything in between. Whatever you\'re building, there\'s likely someone here who can help.',
  },
  {
    question: 'How do I showcase my project?',
    answer: 'Once you\'re a member, you can add your project through the dashboard, and it\'ll appear in the community project feed and your public profile.',
  },
  {
    question: 'Are there real events, or just chat?',
    answer: 'Both. We run weekly code reviews, workshops, and occasional game jams, alongside always-on text and voice channels.',
  },
  {
    question: 'How do I report a rule violation?',
    answer: 'Use the report feature in Discord or message a moderator directly. Reports are handled privately and taken seriously.',
  },
]

function FAQ() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 font-body text-white/50">
            Everything you might be wondering before you join.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <Accordion.Item key={faq.question} value={faq.question} asChild>
              <GlassPanel className="overflow-hidden">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left font-body text-sm font-medium text-white outline-none">
                    {faq.question}
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-white/40 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden px-5 font-body text-sm text-white/50 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="pb-4">{faq.answer}</p>
                </Accordion.Content>
              </GlassPanel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}

export default FAQ
