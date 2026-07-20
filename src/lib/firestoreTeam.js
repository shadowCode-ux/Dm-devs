import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase.js'

/**
 * Real-time subscription to the team collection.
 * This collection is managed manually via the Firebase Console (not writable
 * from the app), since it represents your actual real team members.
 * Expected document shape: { name, role, bio, github, twitter, website, order }
 */
export function subscribeToTeam(callback) {
  const q = query(collection(db, 'team'), orderBy('order', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(members)
  })
}
