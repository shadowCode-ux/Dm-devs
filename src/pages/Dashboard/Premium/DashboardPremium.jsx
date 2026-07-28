import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Sparkles, Zap, BarChart3, ShieldCheck, MessageCircle, CheckCircle2 } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import TiltCard from '../../../components/ui/TiltCard.jsx'
import Button from '../../../components/ui/Button.jsx'
import Badge from '../../../components/ui/Badge.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../../lib/firestoreUsers.js'
import { startPremiumCheckout } from '../../../lib/stripe.js'
import { isPremium } from '../../../lib/roles.js'
import { fadeUp, staggerContainer } from '../../../lib/motion.js'

const DISCORD_INVITE = 'https://discord.gg/xZ8wDJ6bRa'

const perks = [
  {
    icon: Zap,
    title: 'Priority project reviews',
    description: 'Jump the queue for code reviews from senior members and mentors.',
  },
  {
    icon: BarChart3,
    title: 'Advanced analytics',
    description: 'Deeper insight into your project reach, profile views, and engagement over time.',
  },
  {
    icon: ShieldCheck,
    title: 'Premium Discord role',
    description: 'A distinct role and colour in the server, plus access to premium-only channels.',
  },
  {
    icon: MessageCircle,
    title: 'Direct mentor access',
    description: 'Skip the queue and message mentors directly for 1:1 help.',
  },
]

function DashboardPremium() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const checkoutStatus = searchParams.get('checkout')

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile)
    return unsubscribe
  }, [user])

  const premium = isPremium(profile)

  const handleUpgrade = async () => {
    setError('')
    setStarting(true)
    try {
      await startPremiumCheckout()
      // Browser navigates away to Stripe on success — no need to reset
      // `starting` here.
    } catch (err) {
      setError('Something went wrong starting checkout. Please try again.')
      setStarting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Crown className="text-primary" size={28} />
        </div>
        <Badge variant="primary" className="mb-4">
          <Sparkles size={12} className="mr-1.5" />
          Premium
        </Badge>
        <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
          {premium ? 'You have premium' : 'Unlock more features'}
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-white/50">
          {premium ? (
            <>
              Your premium access is active until{' '}
              <span className="text-white/80">
                {profile.premiumUntil.toDate().toLocaleDateString()}
              </span>
              .
            </>
          ) : (
            'A one-time payment unlocks premium for a full year.'
          )}
        </p>

        {checkoutStatus === 'success' && !premium && (
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-white/50">
            Payment received — this can take a few moments to reflect here.
          </p>
        )}
        {checkoutStatus === 'cancelled' && (
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-white/40">
            Checkout was cancelled — no charge was made.
          </p>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2"
      >
        {perks.map((perk) => {
          const Icon = perk.icon
          return (
            <motion.div key={perk.title} variants={fadeUp}>
              <TiltCard className="h-full p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={18} />
                </div>
                <h2 className="font-heading text-base font-semibold text-white">
                  {perk.title}
                </h2>
                <p className="mt-1.5 font-body text-sm text-white/50">
                  {perk.description}
                </p>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>

      <GlassPanel className="mt-8 flex flex-col items-center gap-4 p-8 text-center">
        {premium ? (
          <>
            <div className="flex items-center gap-2 font-body text-sm text-primary">
              <CheckCircle2 size={18} />
              Premium is active on your account
            </div>
            <p className="font-body text-sm text-white/50">
              Head to Discord to claim your premium role and channels.
            </p>
            <Button as="a" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" variant="secondary">
              <MessageCircle size={18} />
              Open Discord
            </Button>
          </>
        ) : (
          <>
            <p className="font-body text-sm text-white/60">
              Ready to upgrade? Your payment covers one full year of premium access.
            </p>
            {error && <p className="font-body text-sm text-red-400">{error}</p>}
            <Button variant="primary" size="lg" onClick={handleUpgrade} disabled={starting}>
              <Crown size={18} />
              {starting ? 'Redirecting to checkout…' : 'Upgrade to premium'}
            </Button>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-white/40 hover:text-white/60"
            >
              Have a question first? Ask in Discord
            </a>
          </>
        )}
      </GlassPanel>
    </div>
  )
}

export default DashboardPremium
