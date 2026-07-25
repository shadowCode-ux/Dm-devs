import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { subscribeToUserProfile } from '../../lib/firestoreUsers.js'
import { canModerate } from '../../lib/roles.js'

/**
 * Gates the /dashboard/admin area to admins and the owner. This is a UX
 * convenience only — the real enforcement is firestore.rules, since a client
 * check can never be trusted on its own.
 */
function AdminRoute() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProfile(user.uid, (data) => {
      setProfile(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="font-code text-sm text-white/40">Checking access...</div>
      </div>
    )
  }

  if (!canModerate(profile)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
