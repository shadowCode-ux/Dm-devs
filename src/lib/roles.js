/**
 * Centralized role definitions for the app.
 *
 * Roles are stored on each user's Firestore profile doc (`users/{uid}.role`).
 * The OWNER role is never assignable through the UI — it's granted
 * automatically, once, at profile-creation time, to a hardcoded allowlist of
 * owner emails. Firestore rules independently enforce that only an existing
 * owner can ever write the `role` field, so this list is a convenience for
 * the client, not the actual security boundary.
 */

export const ROLES = {
  MEMBER: 'member',
  ADMIN: 'admin',
  OWNER: 'owner',
}

// Keep in sync with the `isOwnerEmail(...)` allowlist in firestore.rules.
const OWNER_EMAILS = ['leartmaloku042012@gmail.com', 'dmdevs.socials@gmail.com']

export function isOwnerEmail(email) {
  return OWNER_EMAILS.includes((email || '').toLowerCase())
}

/** Role a brand-new profile should be created with, based on its email. */
export function defaultRoleForEmail(email) {
  return isOwnerEmail(email) ? ROLES.OWNER : ROLES.MEMBER
}

export function isOwner(profile) {
  return profile?.role === ROLES.OWNER
}

export function isAdmin(profile) {
  return profile?.role === ROLES.ADMIN || isOwner(profile)
}

/** Owner + admin both reach the moderation area; only owner can manage roles. */
export function canModerate(profile) {
  return isAdmin(profile)
}
