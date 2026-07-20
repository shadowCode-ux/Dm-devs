import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase.js'

/**
 * Real-time subscription to upcoming community events.
 * Managed manually via the Firebase Console — expected shape:
 * { title, date (string, e.g. "July 22"), time (string, e.g. "4:00 PM UTC"), order }
 */
export function subscribeToEvents(callback) {
  const q = query(collection(db, 'events'), orderBy('order', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(events)
  })
}
