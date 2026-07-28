import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen } from 'lucide-react'
import TiltCard from '../../components/ui/TiltCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ResourceViewerModal from '../../components/ui/ResourceViewerModal.jsx'
import { clsx } from '../../lib/clsx.js'
import { resources } from '../../data/resources.js'
import { fadeUp, staggerContainer } from '../../lib/motion.js'

const categories = ['All', 'AI', 'React', 'Backend', 'JavaScript', 'CSS', 'HTML']

function Resources() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [reading, setReading] = useState(null)

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'All' || resource.category === activeCategory
      const matchesQuery = resource.title.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">
            Resource Library
          </h1>
          <p className="mt-4 font-body text-white/50">
            Curated guides and references, organized by topic. Click any card to read it.
          </p>
        </div>

        <div className="relative mx-auto mb-6 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
          />
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={clsx(
                'rounded-full px-4 py-1.5 font-body text-sm transition-colors',
                activeCategory === category
                  ? 'bg-primary text-background font-medium'
                  : 'bg-white/5 text-white/60 hover:text-primary',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <motion.div
            key={`${query}-${activeCategory}`}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {filtered.map((resource) => (
              <motion.div key={resource.title} variants={fadeUp}>
                <button onClick={() => setReading(resource)} className="block w-full text-left">
                  <TiltCard className="h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-base font-semibold text-white">
                        {resource.title}
                      </h3>
                      <BookOpen size={15} className="mt-1 shrink-0 text-white/30" />
                    </div>
                    <p className="mt-2 font-body text-sm text-white/50">{resource.description}</p>
                    <Badge variant="primary" className="mt-4">
                      {resource.category}
                    </Badge>
                  </TiltCard>
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-16 text-center font-body text-white/40">
            No resources match your search.
          </div>
        )}
      </div>

      <ResourceViewerModal
        resource={reading}
        open={!!reading}
        onOpenChange={(open) => !open && setReading(null)}
      />
    </section>
  )
}

export default Resources
