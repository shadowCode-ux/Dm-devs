import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Image, X } from 'lucide-react'
import GlassPanel from '../../../components/ui/GlassPanel.jsx'
import Button from '../../../components/ui/Button.jsx'
import { projectSchema } from '../../../validation/projectSchema.js'
import { useAuth } from '../../../context/AuthContext.jsx'
import { getUserProfile } from '../../../lib/firestoreUsers.js'
import { addProject } from '../../../lib/firestoreProjects.js'
import { uploadProjectScreenshot } from '../../../lib/firestoreStorage.js'

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024

function AddProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [screenshotError, setScreenshotError] = useState('')
  const [hideCode, setHideCode] = useState(false)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
  })

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0]
    setScreenshotError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setScreenshotError('Please choose an image file.')
      return
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setScreenshotError('Image must be under 5MB.')
      return
    }

    setScreenshotFile(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  const removeScreenshot = () => {
    setScreenshotFile(null)
    setScreenshotPreview(null)
    setScreenshotError('')
  }

  const onSubmit = async (data) => {
    setSubmitError('')
    try {
      const profile = await getUserProfile(user.uid)

      let screenshotUrl = ''
      if (screenshotFile) {
        setUploadingScreenshot(true)
        screenshotUrl = await uploadProjectScreenshot(user.uid, screenshotFile)
        setUploadingScreenshot(false)
      }

      await addProject({
        authorId: user.uid,
        authorName: profile?.displayName || user.email.split('@')[0],
        title: data.title,
        description: data.description,
        tags: data.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        url: data.url || '',
        codeSnippet: data.codeSnippet || '',
        screenshotUrl,
        isCodePublic: !hideCode,
      })
      setSubmitted(true)
      setTimeout(() => navigate('/dashboard/projects'), 1200)
    } catch (error) {
      setUploadingScreenshot(false)
      setSubmitError(error.message || 'Something went wrong submitting your project. Please try again.')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-white">Add Project</h1>
      <p className="mt-2 font-body text-white/50">
        Share what you've been building with the community.
      </p>

      <GlassPanel className="mt-8 max-w-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="font-body text-xs text-white/50">Project Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="Weather Dashboard"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.title && (
              <p className="mt-1.5 font-body text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="font-body text-xs text-white/50">Description</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="What does it do, and what did you use to build it?"
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.description && (
              <p className="mt-1.5 font-body text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-body text-xs text-white/50">
              Tags <span className="text-white/30">(comma-separated)</span>
            </label>
            <input
              type="text"
              {...register('tags')}
              placeholder="React, Node.js, API"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.tags && (
              <p className="mt-1.5 font-body text-xs text-red-400">{errors.tags.message}</p>
            )}
          </div>

          <div>
            <label className="font-body text-xs text-white/50">
              Project URL <span className="text-white/30">(optional if you add code below)</span>
            </label>
            <input
              type="text"
              {...register('url')}
              placeholder="https://github.com/you/project"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {errors.url && (
              <p className="mt-1.5 font-body text-xs text-red-400">{errors.url.message}</p>
            )}
          </div>

          {/* Screenshot upload */}
          <div>
            <label className="font-body text-xs text-white/50">
              Screenshot <span className="text-white/30">(optional — shows how your project looks)</span>
            </label>

            {screenshotPreview ? (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-white/10">
                <img src={screenshotPreview} alt="Project screenshot preview" className="max-h-56 w-full object-cover" />
                <button
                  type="button"
                  onClick={removeScreenshot}
                  className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80"
                  aria-label="Remove screenshot"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/5 py-8 text-white/40 transition-colors hover:border-primary/40 hover:text-primary">
                <Image size={22} />
                <span className="font-body text-xs">Click to upload an image</span>
                <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
              </label>
            )}
            {screenshotError && (
              <p className="mt-1.5 font-body text-xs text-red-400">{screenshotError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-body text-xs text-white/50">
                Code Snippet <span className="text-white/30">(optional)</span>
              </label>
              <label className="flex items-center gap-2 font-body text-xs text-white/50">
                <input
                  type="checkbox"
                  checked={hideCode}
                  onChange={(e) => setHideCode(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                />
                Hide code from other viewers
              </label>
            </div>
            <textarea
              rows={8}
              {...register('codeSnippet')}
              placeholder={'function App() {\n  return <h1>Hello world</h1>;\n}'}
              className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 font-code text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
            />
            {hideCode && (
              <p className="mt-1.5 font-body text-xs text-white/40">
                Your code will be saved but not shown to other members — only the
                description, tags, screenshot, and link (if provided) will be public.
              </p>
            )}
          </div>

          {submitError && (
            <p className="font-body text-xs text-red-400">{submitError}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="mt-2">
            {uploadingScreenshot ? 'Uploading screenshot...' : isSubmitting ? 'Submitting...' : 'Submit Project'}
            <Send size={16} />
          </Button>

          {submitted && (
            <p className="text-center font-code text-xs text-primary">
              project submitted — redirecting to your projects...
            </p>
          )}
        </form>
      </GlassPanel>
    </div>
  )
}

export default AddProject
