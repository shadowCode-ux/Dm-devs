import { doc, setDoc, onSnapshot, increment } from 'firebase/firestore'
import { db } from './firebase.js'

const statsRef = doc(db, 'publicStats', 'counts')

/**
 * Real-time subscription to public homepage stats. Publicly readable —
 * works for logged-out visitors, unlike reading the users/follows
 * collections directly (which require sign-in under our security rules).
 */
export function subscribeToPublicStats(callback) {
  return onSnapshot(statsRef, (snapshot) => {
    const data = snapshot.data() || {}
    callback({
      memberCount: data.memberCount || 0,
      projectCount: data.projectCount || 0,
      followCount: data.followCount || 0,
    })
  })
}

/**
 * Increments (or decrements, with a negative amount) one counter field.
 * setDoc with merge:true creates the document on first use, so no manual
 * "initialize the counters" step is needed.
 */
export async function adjustPublicStat(field, amount) {
  await setDoc(statsRef, { [field]: increment(amount) }, { merge: true })
}
