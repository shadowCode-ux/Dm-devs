import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'
import { auth } from '../lib/firebase.js'
import { createUserProfile, ensureUserProfile } from '../lib/firestoreUsers.js'

const AuthContext = createContext(null)
const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fires immediately with the current session, then again on any login/logout.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const signup = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfile(credential.user.uid, { email })
    // Firebase sends a real verification email — the user must click the
    // link before we treat their account as confirmed (user.emailVerified).
    await sendEmailVerification(credential.user)
    return credential
  }

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider)
    // Google already verifies the email address itself, so credential.user.emailVerified
    // is true here — no separate verification email needed for Google accounts.
    await ensureUserProfile(credential.user.uid, {
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
    })
    return credential
  }

  const resendVerificationEmail = () => {
    if (!auth.currentUser) return Promise.reject(new Error('Not logged in'))
    return sendEmailVerification(auth.currentUser)
  }

  /**
   * Sets a password on the currently signed-in account. Handles two cases:
   *  - Google-only account (no 'password' provider yet): links a brand new
   *    email/password credential onto the existing account, so the user can
   *    log back in either way from then on.
   *  - Account that already has a password: just updates it.
   *
   * Both linkWithCredential and updatePassword require a "recent" login —
   * Firebase throws `auth/requires-recent-login` if the session is old, same
   * as the existing delete-account flow in Settings, so callers should catch
   * and handle that error the same way (prompt a re-login).
   */
  const setPassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error('Not logged in')
    const hasPassword = auth.currentUser.providerData.some(
      (p) => p.providerId === 'password',
    )
    if (hasPassword) {
      await updatePassword(auth.currentUser, newPassword)
    } else {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, newPassword)
      await linkWithCredential(auth.currentUser, credential)
    }
    await refreshUser()
  }

  // Clicking the verification link happens outside our app, so Firebase's
  // local user object doesn't auto-update. reload() re-fetches the latest
  // status from Firebase, and we copy it into a new object so React
  // actually notices the change and re-renders.
  const refreshUser = async () => {
    await auth.currentUser.reload()
    setUser({ ...auth.currentUser })
  }

  const logout = () => signOut(auth)

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    resendVerificationEmail,
    setPassword,
    refreshUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
