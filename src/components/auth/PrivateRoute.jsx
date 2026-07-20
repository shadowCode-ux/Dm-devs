import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import VerifyEmailGate from './VerifyEmailGate.jsx'

function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-code text-sm text-white/40">Checking session...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Google accounts arrive already verified. Email/password accounts must
  // click the link we sent before reaching any dashboard content.
  if (!user.emailVerified) {
    return <VerifyEmailGate />
  }

  return <Outlet />
}

export default PrivateRoute
