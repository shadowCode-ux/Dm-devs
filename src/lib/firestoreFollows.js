import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { adjustPublicStat } from './firestorePublicStats.js'
import { createNotification } from './firestoreNotifications.js'
import { getUserProfile } from './firestoreUsers.js'

// Composite doc id keeps one follow relationship = one document,
// making it trivial to check existence or delete without a query.
function followDocId(followerId, followingId) {
  return `${followerId}_${followingId}`
}

export async function followUser(followerId, followingId) {
  await setDoc(doc(db, 'follows', followDocId(followerId, followingId)), {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  })
  await adjustPublicStat('followCount', 1)

  // Real notification for the person being followed — not a fabricated
  // count, an actual record tied to this actual follow action.
  const follower = await getUserProfile(followerId)
  await createNotification({
    recipientId: followingId,
    type: 'follow',
    actorId: followerId,
    actorName: follower?.displayName || 'Someone',
    actorPhotoURL: follower?.photoURL || '',
  })
}

export async function unfollowUser(followerId, followingId) {
  await deleteDoc(doc(db, 'follows', followDocId(followerId, followingId)))
  await adjustPublicStat('followCount', -1)
}

/**
 * Real-time subscription to who a given user is following.
 * Calls `callback` with a Set of followingIds — updates live across tabs/devices,
 * and survives page refreshes since it's read straight from Firestore.
 */
export function subscribeToFollowing(followerId, callback) {
  const q = query(collection(db, 'follows'), where('followerId', '==', followerId))
  return onSnapshot(q, (snapshot) => {
    const followingIds = new Set(snapshot.docs.map((docSnap) => docSnap.data().followingId))
    callback(followingIds)
  })
}

/**
 * Real-time subscription to a user's followers, including the timestamp each
 * follow happened — needed to plot real growth over time (used in Analytics).
 */
export function subscribeToFollowers(userId, callback) {
  const q = query(collection(db, 'follows'), where('followingId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const followers = snapshot.docs.map((docSnap) => docSnap.data())
    callback(followers)
  })
}
