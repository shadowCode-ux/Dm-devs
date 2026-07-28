import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { deleteUser } from 'firebase/auth'
import { motion } from 'framer-motion'
import { Save, LogOut, AlertTriangle, Trash2, Camera, UserCircle, Crown } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Button from '../../../components/ui/Button.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../../../lib/firestoreUsers.js'
import { uploadAvatar } from '../../../lib/firestoreStorage.js'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024

function initials(name) {
  return (name || '?').slice(0, 2).toUpperCase()
}

function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [displayNameValue, setDisplayNameValue] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      displayName: '',
      bio: '',
      github: '',
      skills: '',
    },
  })

  // Load the real profile from Firestore once, and pre-fill the form with it.
  useEffect(() => {
    if (!user) return

    let isMounted = true

    getUserProfile(user.uid).then((profile) => {
      if (!isMounted) return
      if (profile) {
        reset({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          github: profile.github || '',
          skills: (profile.skills || []).join(', '),
        })
        setDisplayNameValue(profile.displayName || '')
        setPhotoURL(profile.photoURL || '')
        // Defaults to true if the field was never set (e.g. accounts created
        // before this preference existed).
        setEmailNotifications(profile.emailNotifications !== false)
      }
      setLoadingProfile(false)
    })

    return () => {
      isMounted = false
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    await updateUserProfile(user.uid, {
      ...data,
      skills: data.skills
        ? data.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [],
    })
    setDisplayNameValue(data.displayName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    setAvatarError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Image must be under 2MB.')
      return
    }

    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(user.uid, file)
      await updateUserProfile(user.uid, { photoURL: url })
      setPhotoURL(url)
    } catch (error) {
      setAvatarError(error.message || 'Something went wrong uploading your photo.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleToggleNotifications = async () => {
    const next = !emailNotifications
    setEmailNotifications(next)
    await updateUserProfile(user.uid, { emailNotifications: next })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleting(true)
    try {
      await deleteUserProfile(user.uid)
      await deleteUser(user)
      navigate('/')
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setDeleteError('For security, please log out and log back in, then try deleting again.')
      } else {
        setDeleteError('Something went wrong deleting your account.')
      }
      setDeleting(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-white">Settings</h1>
      <p className="mt-2 font-body text-white/50">Manage your profile and account.</p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start"
      >
      <div className="flex w-full max-w-2xl flex-col gap-6">
        {/* Profile */}
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-white">Profile</h2>
          <p className="mt-1 font-body text-sm text-white/50">
            This is shown on your public member profile, visible to other members in Discovery.
          </p>

          {loadingProfile ? (
            <p className="mt-6 font-body text-sm text-white/40">Loading your profile...</p>
          ) : (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="relative">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Your avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-semibold text-primary">
                      {initials(displayNameValue || user?.email)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-body text-xs text-white/70 transition-colors hover:border-primary/40 hover:text-primary">
                    <Camera size={14} />
                    {avatarUploading ? 'Uploading...' : 'Change photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading}
                      className="hidden"
                    />
                  </label>
                  {avatarError && (
                    <p className="mt-1.5 font-body text-xs text-red-400">{avatarError}</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
              <div>
                <label className="font-body text-xs text-white/50">Display Name</label>
                <input
                  type="text"
                  {...register('displayName')}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="font-body text-xs text-white/50">Bio</label>
                <textarea
                  rows={3}
                  {...register('bio')}
                  placeholder="A short intro about you and what you build"
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="font-body text-xs text-white/50">GitHub URL</label>
                <input
                  type="text"
                  {...register('github')}
                  placeholder="https://github.com/you"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
                />
              </div>

              <div>
                <label className="font-body text-xs text-white/50">
                  Skills <span className="text-white/30">(comma-separated, shown on your public profile)</span>
                </label>
                <input
                  type="text"
                  {...register('skills')}
                  placeholder="React, Node.js, Python"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                  <Save size={15} />
                </Button>
                {saved && <span className="font-code text-xs text-primary">saved</span>}
              </div>
            </form>
            </>
          )}
        </GlassPanel>

        {/* Preferences */}
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-white">Preferences</h2>
          <p className="mt-1 font-body text-sm text-white/50">
            Stored on your account and respected wherever notifications are sent.
          </p>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="font-body text-sm text-white">Email notifications</p>
              <p className="font-body text-xs text-white/40">
                Get notified about new followers and replies.
              </p>
            </div>
            <button
              onClick={handleToggleNotifications}
              role="switch"
              aria-checked={emailNotifications}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                emailNotifications ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </GlassPanel>

        {/* Account */}
        <GlassPanel className="p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-white">Account</h2>
          <p className="mt-1 font-body text-sm text-white/50">
            Logged in as <span className="text-white">{user?.email}</span>
          </p>

          <Button variant="secondary" className="mt-5" onClick={handleLogout}>
            <LogOut size={15} />
            Log Out
          </Button>
        </GlassPanel>

        {/* Danger Zone */}
        <GlassPanel className="border-red-500/20 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={18} />
            <h2 className="font-heading text-lg font-semibold">Danger Zone</h2>
          </div>
          <p className="mt-2 font-body text-sm text-white/50">
            Deleting your account is permanent. Your profile will be removed, though your
            submitted projects will remain attributed to your account ID.
          </p>

          {!confirmingDelete ? (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="mt-5 flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 font-body text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Delete Account
            </button>
          ) : (
            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-body text-sm text-white">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-lg bg-red-500 px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, delete my account'}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="rounded-lg border border-white/10 px-4 py-2 font-body text-sm text-white/70 transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
              {deleteError && (
                <p className="font-body text-xs text-red-400">{deleteError}</p>
              )}
            </div>
          )}
        </GlassPanel>
      </div>

      <div className="flex w-full flex-col gap-4 lg:max-w-xs">
        <GlassPanel className="p-6">
          <h2 className="font-heading text-sm font-semibold text-white">Quick Links</h2>
          <div className="mt-4 flex flex-col gap-1">
            <Link
              to={`/dashboard/profile/${user?.uid}`}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-body text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary"
            >
              <UserCircle size={16} />
              View your public profile
            </Link>
            <Link
              to="/dashboard/premium"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-body text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary"
            >
              <Crown size={16} />
              Manage premium
            </Link>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="font-heading text-sm font-semibold text-white">About your data</h2>
          <p className="mt-2 font-body text-xs text-white/50">
            Your display name, bio, GitHub link, and skills are visible to other
            members on your public profile. Your email is never shown publicly.
          </p>
        </GlassPanel>
      </div>
      </motion.div>
    </div>
  )
}

export default Settings
