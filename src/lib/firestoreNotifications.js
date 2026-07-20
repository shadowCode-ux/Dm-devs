import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

/**
 * Creates a real notification for `recipientId` — currently only used when
 * someone follows another member. Not user-facing directly; called from
 * followUser() in firestoreFollows.js.
 */
export async function createNotification({ recipientId, type, actorId, actorName, actorPhotoURL }) {
  await addDoc(collection(db, 'notifications'), {
    recipientId,
    type,
    actorId,
    actorName,
    actorPhotoURL: actorPhotoURL || '',
    read: false,
    createdAt: serverTimestamp(),
  })
}

/**
 * Real-time subscription to the current user's most recent notifications.
 */
export function subscribeToNotifications(userId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20),
  )
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(notifications)
  })
}

export async function markNotificationRead(notificationId) {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true })
}

/**
 * Marks every currently-unread notification as read in one batch — used by
 * "mark all as read" in the notifications dropdown.
 */
export async function markAllNotificationsRead(notificationIds) {
  if (notificationIds.length === 0) return
  const batch = writeBatch(db)
  notificationIds.forEach((id) => {
    batch.update(doc(db, 'notifications', id), { read: true })
  })
  await batch.commit()
}
