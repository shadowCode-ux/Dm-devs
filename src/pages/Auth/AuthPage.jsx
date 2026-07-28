import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, ArrowRight } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import GoogleIcon from '../../components/ui/GoogleIcon.jsx'
import PasswordInput from '../../components/ui/PasswordInput.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { loginSchema, signupSchema } from '../../validation/authSchema.js'
import { fadeScale } from '../../lib/motion.js'

// Firebase auth errors we want to show a specific message for. Anything not
// listed here (e.g. auth/invalid-api-key, auth/network-request-failed from a
// missing/misconfigured .env) falls through to a message that surfaces the
// real Firebase error code instead of silently pretending it was a wrong
// password — that swallowed the config error and made this very hard to
// diagnose.
const KNOWN_LOGIN_ERRORS = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/invalid-email': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled.',
}

function loginErrorMessage(error) {
  return (
    KNOWN_LOGIN_ERRORS[error?.code] ||
    `Could not sign in (${error?.code || error?.message || 'unknown error'}). Please try again.`
  )
}

function signupErrorMessage(error) {
  if (error?.code === 'auth/email-already-in-use') {
    return 'An account with this email already exists.'
  }
  if (error?.code === 'auth/weak-password') {
    return 'Password must be at least 6 characters.'
  }
  return `Could not create account (${error?.code || error?.message || 'unknown error'}). Please try again.`
}

function SignInForm({ onSwitchToSignUp }) {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [firebaseError, setFirebaseError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    setFirebaseError('')
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (error) {
      setFirebaseError(loginErrorMessage(error))
    }
  }

  const handleGoogle = async () => {
    setFirebaseError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setFirebaseError(loginErrorMessage(error))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 sm:px-10">
      <h2 className="font-heading text-2xl font-semibold text-white">Sign In</h2>
      <p className="mt-1 font-body text-sm text-white/50">Log in to your dashboard</p>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        type="button"
        className="mt-6 flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 font-body text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
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
          <input
            type="text"
            {...register('email')}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
          />
          {errors.email && (
            <p className="mt-1.5 font-body text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <PasswordInput {...register('password')} placeholder="••••••••" />
          {errors.password && (
            <p className="mt-1.5 font-body text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {firebaseError && <p className="font-body text-xs text-red-400">{firebaseError}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? 'Logging in...' : 'Log In'}
          <LogIn size={16} />
        </Button>
      </form>

      <button
        onClick={onSwitchToSignUp}
        className="mt-6 text-center font-body text-sm text-white/50 hover:text-primary md:hidden"
      >
        Don't have an account? <span className="text-primary">Sign up</span>
      </button>
    </div>
  )
}

function SignUpForm({ onSwitchToSignIn }) {
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [firebaseError, setFirebaseError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data) => {
    setFirebaseError('')
    try {
      await signup(data.email, data.password)
      setVerificationSent(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (error) {
      setFirebaseError(signupErrorMessage(error))
    }
  }

  const handleGoogle = async () => {
    setFirebaseError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setFirebaseError(signupErrorMessage(error))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 sm:px-10">
      <h2 className="font-heading text-2xl font-semibold text-white">Create Account</h2>
      <p className="mt-1 font-body text-sm text-white/50">Join the community</p>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        type="button"
        className="mt-6 flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 py-2.5 font-body text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        <GoogleIcon />
        {googleLoading ? 'Signing up...' : 'Continue with Google'}
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="font-body text-xs text-white/30">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            {...register('email')}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
          />
          {errors.email && (
            <p className="mt-1.5 font-body text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <PasswordInput {...register('password')} placeholder="••••••••" />
          {errors.password && (
            <p className="mt-1.5 font-body text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <PasswordInput {...register('confirmPassword')} placeholder="Confirm password" />
          {errors.confirmPassword && (
            <p className="mt-1.5 font-body text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {firebaseError && <p className="font-body text-xs text-red-400">{firebaseError}</p>}
        {verificationSent && (
          <p className="font-body text-xs text-primary">
            Account created — check your email to verify it.
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
          <UserPlus size={16} />
        </Button>
      </form>

      <button
        onClick={onSwitchToSignIn}
        className="mt-6 text-center font-body text-sm text-white/50 hover:text-primary md:hidden"
      >
        Already have an account? <span className="text-primary">Log in</span>
      </button>
    </div>
  )
}

function AuthPage() {
  const location = useLocation()
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="mb-6 text-center md:hidden">
        <Link to="/" className="inline-flex items-center gap-2 font-heading text-lg font-semibold text-white">
          <img src="/images/banner-icon.png" alt="Dark Mode Devs" className="h-7 w-7 rounded-lg object-contain" />
          Dark<span className="text-primary">Mode</span>Devs
        </Link>
      </div>

      <div className="relative mx-auto hidden w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-glow md:block">
        <motion.div
          variants={fadeScale}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2"
          style={{ minHeight: 560 }}
        >
          <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
          <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
        </motion.div>

        {/* Sliding overlay — covers whichever side is currently inactive */}
        <div
          className={`absolute inset-y-0 left-0 flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary to-blue-600 p-10 text-center transition-transform duration-500 ease-in-out ${
            isSignUp ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <Link to="/" className="mb-6 inline-flex items-center gap-2 font-heading text-lg font-semibold text-background">
            <img src="/images/banner-icon.png" alt="" className="h-7 w-7 rounded-lg object-contain" />
            DarkModeDevs
          </Link>

          {isSignUp ? (
            <>
              <h3 className="font-heading text-2xl font-semibold text-background">Welcome Back!</h3>
              <p className="mt-3 font-body text-sm text-background/80">
                Already have an account? Log in to get back to your dashboard.
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="mt-6 flex items-center gap-2 rounded-lg border border-background/40 px-6 py-2.5 font-body text-sm font-medium text-background transition-colors hover:bg-background/10"
              >
                Sign In
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <h3 className="font-heading text-2xl font-semibold text-background">Hello, Friend!</h3>
              <p className="mt-3 font-body text-sm text-background/80">
                Create an account and join a community of real developers building real things.
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="mt-6 flex items-center gap-2 rounded-lg border border-background/40 px-6 py-2.5 font-body text-sm font-medium text-background transition-colors hover:bg-background/10"
              >
                Sign Up
                <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile fallback — the sliding split layout doesn't work on narrow screens */}
      <motion.div
        variants={fadeScale}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface shadow-glow md:hidden"
      >
        {isSignUp ? (
          <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
        ) : (
          <SignInForm onSwitchToSignUp={() => setIsSignUp(true)} />
        )}
      </motion.div>
    </div>
  )
}

export default AuthPage
