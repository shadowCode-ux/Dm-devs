import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

export const TASK_PRIORITY_ORDER = [
  TASK_PRIORITIES.URGENT,
  TASK_PRIORITIES.HIGH,
  TASK_PRIORITIES.MEDIUM,
  TASK_PRIORITIES.LOW,
]

export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to every task category, in the order admins created
 * them. Admin-only — enforced server-side by firestore.rules, not just this
 * client call.
 */
export function subscribeToTaskCategories(callback) {
  const q = query(collection(db, 'taskCategories'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

export async function addTaskCategory(name) {
  await addDoc(collection(db, 'taskCategories'), {
    name: name.trim(),
    createdAt: serverTimestamp(),
  })
}

export async function renameTaskCategory(categoryId, name) {
  await updateDoc(doc(db, 'taskCategories', categoryId), { name: name.trim() })
}

/**
 * Deletes a category. Tasks that referenced it are NOT deleted or
 * reassigned — they simply keep a `categoryId` that no longer resolves to a
 * category, and the tasks UI groups those under an "Uncategorized" bucket
 * rather than silently losing them.
 */
export async function deleteTaskCategory(categoryId) {
  await deleteDoc(doc(db, 'taskCategories', categoryId))
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to every server task, newest first. Admin-only —
 * enforced server-side by firestore.rules.
 */
export function subscribeToTasks(callback) {
  const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
  })
}

/**
 * Creates a new task. `createdBy`/`createdByName` record who actually made
 * it — firestore.rules independently requires createdBy to match the real
 * caller's uid, so this can't be spoofed onto someone else's name.
 */
export async function addTask({
  title,
  description,
  categoryId,
  priority,
  createdBy,
  createdByName,
}) {
  await addDoc(collection(db, 'tasks'), {
    title,
    description: description || '',
    categoryId: categoryId || null,
    priority: priority || TASK_PRIORITIES.MEDIUM,
    status: TASK_STATUSES.TODO,
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Edits a task's editable fields. Any admin/owner may edit any task, not
 * just its original creator — this is shared operational data, not
 * per-author content like a submitted project.
 */
export async function updateTask(taskId, updates) {
  await updateDoc(doc(db, 'tasks', taskId), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTask(taskId) {
  await deleteDoc(doc(db, 'tasks', taskId))
}
