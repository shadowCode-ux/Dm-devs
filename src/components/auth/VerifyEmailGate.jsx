import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MailCheck, RefreshCw, LogOut, AlertTriangle } from 'lucide-react'
import GlassPanel from '../ui/GlassPanel.jsx'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

function VerifyEmailGate() {
  const { user, resendVerificationEmail, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await resendVerificationEmail()
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } catch (err) {
      setError('Could not resend right now — please try again shortly.')
    } finally {
      setResending(false)
    }
  }

  const handleCheckAgain = async () => {
    setChecking(true)
    setError('')
    try {
      await refreshUser()
    } catch (err) {
      setError('Could not check verification status. Try refreshing the page.')
    } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <GlassPanel className="w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck size={26} />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-white">
          Verify your email
        </h1>
        <p className="mt-3 font-body text-sm text-white/50">
          We sent a verification link to <span className="text-white">{user?.email}</span>.
          Click it, then come back here.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-left">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="font-body text-xs text-amber-200/80">
            Don't see it? Check your spam or junk folder — verification emails
            sometimes end up there.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" onClick={handleCheckAgain} disabled={checking}>
            <RefreshCw size={15} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : "I've verified — check again"}
          </Button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="font-body text-sm text-primary hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending...' : resent ? 'Verification email sent' : 'Resend verification email'}
          </button>

          {error && <p className="font-body text-xs text-red-400">{error}</p>}

          <button
            onClick={handleLogout}
            className="mt-2 flex items-center justify-center gap-1.5 font-body text-xs text-white/40 hover:text-white/70"
          >
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </GlassPanel>
    </div>
  )
}

export default VerifyEmailGate
