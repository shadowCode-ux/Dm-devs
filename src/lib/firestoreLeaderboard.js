import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

export const POINTS_PER_PROJECT = 10
export const POINTS_PER_FOLLOWER = 2

/**
 * Real-time leaderboard built from actual data — no hardcoded scores.
 * Combines three live collections (users, projects, follows) and recomputes
 * rankings whenever any of them change. Calls `callback` with a sorted array:
 * [{ id, displayName, projectCount, followerCount, points }, ...]
 */
export function subscribeToLeaderboard(callback) {
  let users = []
  let projects = []
  let follows = []

  const recompute = () => {
    const ranked = users.map((user) => {
      const projectCount = projects.filter((p) => p.authorId === user.id).length
      const followerCount = follows.filter((f) => f.followingId === user.id).length
      const points = projectCount * POINTS_PER_PROJECT + followerCount * POINTS_PER_FOLLOWER

      return {
        id: user.id,
        displayName: user.displayName || 'Unnamed',
        projectCount,
        followerCount,
        points,
      }
    })

    ranked.sort((a, b) => b.points - a.points)
    callback(ranked)
  }

  const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
    users = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    recompute()
  })

  const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
    projects = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    recompute()
  })

  const unsubFollows = onSnapshot(collection(db, 'follows'), (snapshot) => {
    follows = snapshot.docs.map((docSnap) => docSnap.data())
    recompute()
  })

  // Return a single cleanup function that unsubscribes from all three.
  return () => {
    unsubUsers()
    unsubProjects()
    unsubFollows()
  }
}
