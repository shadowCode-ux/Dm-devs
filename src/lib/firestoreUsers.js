import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { adjustPublicStat } from './firestorePublicStats.js'

/**
 * Creates a user's profile document the first time they sign up.
 * Called once, right after Firebase Auth account creation.
 */
export async function createUserProfile(uid, { email, displayName }) {
  await setDoc(doc(db, 'users', uid), {
    email,
    displayName: displayName || email.split('@')[0],
    bio: '',
    github: '',
    photoURL: '',
    createdAt: serverTimestamp(),
  })
  await adjustPublicStat('memberCount', 1)
}

/**
 * Creates a profile ONLY if one doesn't already exist for this uid — safe to
 * call every time someone signs in (e.g. via Google), since it won't
 * overwrite an existing profile's bio/avatar/displayName on repeat logins.
 */
export async function ensureUserProfile(uid, { email, displayName, photoURL }) {
  const existing = await getUserProfile(uid)
  if (existing) return existing

  await setDoc(doc(db, 'users', uid), {
    email,
    displayName: displayName || email.split('@')[0],
    bio: '',
    github: '',
    photoURL: photoURL || '',
    createdAt: serverTimestamp(),
  })
  await adjustPublicStat('memberCount', 1)
  return getUserProfile(uid)
}

/**
 * Updates fields on the current user's own profile document.
 * Merge: true so it only overwrites the fields passed in, not the whole doc.
 */
export async function updateUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

/**
 * One-time fetch of a single user's profile (used to pre-fill the Settings form).
 */
export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

/**
 * Deletes a user's profile document. Called right before deleting their
 * Firebase Auth account, so no orphaned profile is left behind.
 */
export async function deleteUserProfile(uid) {
  await deleteDoc(doc(db, 'users', uid))
  await adjustPublicStat('memberCount', -1)
}

/**
 * Real-time subscription to a single user's profile — used in places like the
 * Dashboard sidebar, so an avatar/name change in Settings reflects immediately
 * without needing a page refresh.
 */
export function subscribeToUserProfile(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null)
  })
}

/**
 * Real-time subscription to every user profile in the community.
 * Calls `callback` immediately with the current list, then again on any change —
 * so Discovery updates live if someone edits their profile while you're viewing it.
 * Returns an unsubscribe function for cleanup.
 */
export function subscribeToAllUsers(callback) {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    const users = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(users)
  })
}
