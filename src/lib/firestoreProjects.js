import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'
import { adjustPublicStat } from './firestorePublicStats.js'

/**
 * Submits a new project. tags is stored as an array so it can be filtered on later.
 * codeSnippet is optional — lets a member paste real code to display, instead of
 * only linking out to an external repo. isCodePublic lets the author hide their
 * code from other viewers while still showing the screenshot/description/link.
 */
export async function addProject({
  authorId,
  authorName,
  title,
  description,
  tags,
  url,
  codeSnippet,
  screenshotUrl,
  isCodePublic,
}) {
  await addDoc(collection(db, 'projects'), {
    authorId,
    authorName,
    title,
    description,
    tags,
    url,
    codeSnippet: codeSnippet || '',
    screenshotUrl: screenshotUrl || '',
    isCodePublic: isCodePublic !== false,
    createdAt: serverTimestamp(),
  })
  await adjustPublicStat('projectCount', 1)
}

export async function deleteProject(projectId) {
  await deleteDoc(doc(db, 'projects', projectId))
  await adjustPublicStat('projectCount', -1)
}

/**
 * Real-time subscription to every submitted project, newest first.
 * Used on the public Platform Projects showcase page.
 */
export function subscribeToAllProjects(callback) {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(projects)
  })
}

/**
 * Real-time subscription to only the current user's own submitted projects.
 * Used on the Dashboard Projects page.
 */
export function subscribeToUserProjects(userId, callback) {
  const q = query(
    collection(db, 'projects'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    callback(projects)
  })
}
