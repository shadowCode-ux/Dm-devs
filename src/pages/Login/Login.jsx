import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Button from '../../components/ui/Button.jsx'
import GoogleIcon from '../../components/ui/GoogleIcon.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { loginSchema } from '../../validation/authSchema.js'

function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [firebaseError, setFirebaseError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setFirebaseError('')
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (error) {
      setFirebaseError('Invalid email or password.')
    }
  }

  const handleGoogleLogin = async () => {
    setFirebaseError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setFirebaseError('Could not sign in with Google. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <GlassPanel className="w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-white">
            <img src="/images/banner-icon.png" alt="Dark Mode Devs" className="h-7 w-7 object-contain rounded-lg" />
            Dark<span className="text-primary">Mode</span>Devs
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 font-body text-sm text-white/50">Log in to your dashboard</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 font-body text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <GoogleIcon />
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-body text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-xs text-white/50">Email</label>
            <input
              type="text"
              {...register('email')}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.email && (
              <p className="mt-1.5 font-body text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="font-body text-xs text-white/50">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.password && (
              <p className="mt-1.5 font-body text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {firebaseError && (
            <p className="font-body text-xs text-red-400">{firebaseError}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Logging in...' : 'Log In'}
            <LogIn size={16} />
          </Button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-white/50">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </GlassPanel>
    </div>
  )
}

export default Login
