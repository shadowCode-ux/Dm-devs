import { onRequest } from 'firebase-functions/v2/https'
import { logger } from 'firebase-functions'
import { Timestamp } from 'firebase-admin/firestore'
import { getStripeClient, stripeSecretKey, stripeWebhookSecret } from './stripeClient.js'
import { db } from './admin.js'

// Fixed premium term granted per successful one-time payment, per the
// product decision to sell "premium for a year" rather than a recurring
// subscription.
const PREMIUM_DURATION_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Stripe webhook endpoint. Configure this URL (shown after `firebase deploy
 * --only functions`) in the Stripe Dashboard under Developers > Webhooks,
 * subscribed to the `checkout.session.completed` event, and set
 * STRIPE_WEBHOOK_SECRET to the signing secret Stripe gives you for it.
 *
 * This is the ONLY place `premiumUntil` is ever written — it uses the Admin
 * SDK, which bypasses firestore.rules, and firestore.rules independently
 * blocks every client write path from touching that field (see
 * firestore.rules). A forged client request can never grant itself premium;
 * only a payload with a valid Stripe signature reaches this code path.
 */
export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (req, res) => {
    const stripe = getStripeClient()
    const signature = req.headers['stripe-signature']

    let event
    try {
      // req.rawBody is required (not req.body) — Stripe signs the exact raw
      // bytes, and re-serializing a parsed JSON body would break verification.
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        stripeWebhookSecret.value(),
      )
    } catch (err) {
      logger.warn('Stripe webhook signature verification failed', { error: err.message })
      res.status(400).send(`Webhook signature verification failed: ${err.message}`)
      return
    }

    try {
      if (event.type === 'checkout.session.completed') {
        await handleCheckoutCompleted(event.data.object)
      }
      // Other event types are intentionally ignored — this integration only
      // needs to react to a completed one-time payment.
    } catch (err) {
      logger.error('Error handling Stripe webhook event', { type: event.type, error: err.message })
      res.status(500).send('Internal error handling webhook event')
      return
    }

    res.status(200).send({ received: true })
  },
)

async function handleCheckoutCompleted(session) {
  if (session.payment_status !== 'paid') {
    logger.info('Checkout session completed but not paid — ignoring', { sessionId: session.id })
    return
  }

  const uid = session.client_reference_id || session.metadata?.uid
  if (!uid) {
    logger.error('Checkout session completed with no attributable uid', { sessionId: session.id })
    return
  }

  const userRef = db.collection('users').doc(uid)
  const snapshot = await userRef.get()
  if (!snapshot.exists) {
    logger.error('Checkout completed for a uid with no profile doc', { uid, sessionId: session.id })
    return
  }

  // Extend from the current expiry if they still have active premium time
  // left (e.g. renewing early), otherwise from now.
  const existing = snapshot.data()
  const existingUntilMs = existing.premiumUntil?.toMillis?.() ?? 0
  const baseMs = Math.max(existingUntilMs, Date.now())
  const premiumUntil = Timestamp.fromMillis(baseMs + PREMIUM_DURATION_MS)

  await userRef.set(
    {
      premiumUntil,
      stripeCustomerId: session.customer ?? existing.stripeCustomerId ?? null,
      lastPremiumPurchaseAt: Timestamp.now(),
    },
    { merge: true },
  )

  logger.info('Granted premium', { uid, premiumUntil: premiumUntil.toDate().toISOString() })
}
