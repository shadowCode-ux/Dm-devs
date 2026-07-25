import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Cloud Functions provide default credentials automatically — no key file
// needed in this environment.
if (!getApps().length) {
  initializeApp()
}

export const db = getFirestore()
