import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase.js'

/**
 * Kicks off Stripe Checkout for the signed-in user and redirects them to it.
 * The Cloud Function derives the buyer from the caller's auth token, so
 * nothing about who's paying is trusted from client input here.
 */
export async function startPremiumCheckout() {
  const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession')
  const { data } = await createCheckoutSession({ origin: window.location.origin })
  window.location.href = data.url
}
