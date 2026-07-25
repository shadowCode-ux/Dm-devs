import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { adjustPublicStat } from './firestorePublicStats.js'
import { defaultRoleForEmail } from './roles.js'

/**
 * Creates a user's profile document the first time they sign up.
 * Called once, right after Firebase Auth account creation.
 *
 * `role` is derived from the owner-email allowlist rather than ever being
 * passed in by the caller, so a client can't self-assign elevated access.
 */
export async function createUserProfile(uid, { email, displayName }) {
  await setDoc(doc(db, 'users', uid), {
    email,
    displayName: displayName || email.split('@')[0],
    bio: '',
    github: '',
    photoURL: '',
    skills: [],
    views: 0,
    role: defaultRoleForEmail(email),
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
    skills: [],
    views: 0,
    role: defaultRoleForEmail(email),
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
 * One-time fetch of a single user's profile (used to pre-fill the Settings form,
 * and to load a public profile page).
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
 * Promotes or demotes a member between 'member' and 'admin'. Only the owner
 * can call this successfully — firestore.rules rejects any `role` write from
 * a non-owner, including this function's own caller if they aren't one.
 * The owner role itself is never assignable here; it's only ever set
 * automatically for the hardcoded owner emails in roles.js.
 */
export async function updateUserRole(uid, role) {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true })
}

/**
 * Deletes another member's profile document. Only usable by an admin/owner —
 * enforced server-side by firestore.rules, not just this client check.
 *
 * NOTE: this removes the Firestore profile only. It does NOT delete the
 * person's underlying Firebase Auth account — client SDKs can only delete
 * the currently signed-in user's own Auth account. Fully deleting another
 * user's Auth account requires the Admin SDK (e.g. a Cloud Function you
 * trigger from here, or the Firebase Console).
 */
export async function deleteUserAsAdmin(uid) {
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

/**
 * Increments a profile's real view counter by 1. Called once when someone
 * loads that profile's public page — genuine traffic, not a fabricated number.
 */
export async function incrementProfileViews(uid) {
  await setDoc(doc(db, 'users', uid), { views: increment(1) }, { merge: true })
}
