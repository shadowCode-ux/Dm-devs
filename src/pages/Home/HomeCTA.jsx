import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import HeroGlow from '../../components/ui/HeroGlow.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { fadeScale, viewportOnce } from '../../lib/motion.js'

function HomeCTA() {
  const { user } = useAuth()

  return (
    <section className="px-6 pb-32">
      <motion.div
        variants={fadeScale}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-4xl"
      >
        <GlassPanel className="relative overflow-hidden p-10 text-center sm:p-14">
          <HeroGlow compact />
          <div className="relative">
            <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
              {user ? 'Ready to ship something new?' : 'Ready to join the community?'}
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-white/50">
              {user
                ? 'Head to your dashboard and share your latest project with everyone.'
                : "It's free, it takes a minute, and there's no fake data waiting for you — just a real community."}
            </p>
            <div className="mt-8 flex justify-center">
              <Button as={Link} to={user ? '/dashboard/add-project' : '/signup'} variant="primary" size="lg">
                {user ? 'Add a Project' : 'Create Your Account'}
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  )
}

export default HomeCTA
