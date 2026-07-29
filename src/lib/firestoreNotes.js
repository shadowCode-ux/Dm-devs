import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.js'

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to every note category, in creation order.
 * Admin/owner-only — enforced server-side by firestore.rules.
 */
export function subscribeToNoteCategories(callback) {
  const q = query(collection(db, 'noteCategories'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

export async function addNoteCategory({ name, color }) {
  const ref = await addDoc(collection(db, 'noteCategories'), {
    name: name.trim(),
    color: color || '#00bfff',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateNoteCategory(categoryId, updates) {
  await updateDoc(doc(db, 'noteCategories', categoryId), updates)
}

/**
 * Deletes a category, and cleans up after it: any connections referencing
 * it (either side) are removed in the same batch, and notes that referenced
 * it simply fall back to "Uncategorized" in the UI rather than being deleted
 * or silently orphaned — same approach as taskCategories.
 */
export async function deleteNoteCategory(categoryId, connections) {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'noteCategories', categoryId))
  connections
    .filter((c) => c.categoryAId === categoryId || c.categoryBId === categoryId)
    .forEach((c) => batch.delete(doc(db, 'noteConnections', c.id)))
  await batch.commit()
}

// ---------------------------------------------------------------------------
// Connections — undirected edges between two categories, e.g. "Frontend"
// linked to "Design System". Doc id is deterministic ("{a}_{b}", sorted) so
// the same pair can never be connected twice.
// ---------------------------------------------------------------------------

function connectionId(categoryAId, categoryBId) {
  return [categoryAId, categoryBId].sort().join('_')
}

export function subscribeToNoteConnections(callback) {
  return onSnapshot(collection(db, 'noteConnections'), (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

export async function connectNoteCategories(categoryAId, categoryBId) {
  if (categoryAId === categoryBId) return
  const [sortedA, sortedB] = [categoryAId, categoryBId].sort()
  // setDoc (not addDoc) with a deterministic id derived from the sorted pair
  // — connecting the same two categories twice just re-writes the same doc
  // rather than creating a duplicate edge.
  await setDoc(doc(db, 'noteConnections', connectionId(categoryAId, categoryBId)), {
    categoryAId: sortedA,
    categoryBId: sortedB,
    createdAt: serverTimestamp(),
  })
}

export async function disconnectNoteCategories(categoryAId, categoryBId) {
  await deleteDoc(doc(db, 'noteConnections', connectionId(categoryAId, categoryBId)))
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to every note, newest first. Admin/owner-only.
 */
export function subscribeToNotes(callback) {
  const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

/** Real-time subscription to notes within a single category. */
export function subscribeToNotesByCategory(categoryId, callback) {
  const q = query(collection(db, 'notes'), where('categoryId', '==', categoryId))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

export async function addNote({ title, content, categoryId, createdBy, createdByName }) {
  await addDoc(collection(db, 'notes'), {
    title,
    content: content || '',
    categoryId: categoryId || null,
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateNote(noteId, updates) {
  await updateDoc(doc(db, 'notes', noteId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteNote(noteId) {
  await deleteDoc(doc(db, 'notes', noteId))
}
