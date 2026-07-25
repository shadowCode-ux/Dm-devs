import Stripe from 'stripe'
import { defineSecret } from 'firebase-functions/params'

// Defined once, bound into whichever function needs it via `secrets: [...]`
// in that function's options. Set the real values with:
//   firebase functions:secrets:set STRIPE_SECRET_KEY
//   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
export const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY')
export const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET')

let cachedClient = null

/** Lazily constructs the Stripe client from the resolved secret value. */
export function getStripeClient() {
  if (!cachedClient) {
    // No explicit `apiVersion` override — stripe@22.3.2 (pinned in
    // package.json) already targets a specific, tested API version.
    // Overriding it here risks silently drifting out of sync with the
    // installed SDK; upgrade both together instead.
    cachedClient = new Stripe(stripeSecretKey.value())
  }
  return cachedClient
}
