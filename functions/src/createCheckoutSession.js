import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { getStripeClient, stripeSecretKey } from './stripeClient.js'

// The Stripe Price ID for the one-time, fixed-term premium purchase.
// Set with: firebase functions:secrets:set STRIPE_PRICE_ID
export const stripePriceId = defineSecret('STRIPE_PRICE_ID')

/**
 * Creates a Stripe Checkout Session for the calling user to purchase
 * premium (one-time payment, fixed-term access — see stripeWebhook.js for
 * what happens when it's paid).
 *
 * `client_reference_id` is set to the caller's Firebase uid so the webhook
 * can attribute a completed session back to the right profile without
 * trusting anything the client sends.
 */
export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey, stripePriceId], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in to start checkout.')
    }

    const uid = request.auth.uid
    const email = request.auth.token.email || undefined
    const origin = request.data?.origin
    if (typeof origin !== 'string' || !/^https?:\/\//.test(origin)) {
      throw new HttpsError('invalid-argument', 'A valid origin URL is required.')
    }

    const stripe = getStripeClient()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: uid,
      customer_email: email,
      line_items: [{ price: stripePriceId.value(), quantity: 1 }],
      success_url: `${origin}/dashboard/premium?checkout=success`,
      cancel_url: `${origin}/dashboard/premium?checkout=cancelled`,
      metadata: { uid },
    })

    return { url: session.url }
  },
)
