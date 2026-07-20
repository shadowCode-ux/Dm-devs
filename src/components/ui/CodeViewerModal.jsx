import * as Dialog from '@radix-ui/react-dialog'
import { X, ExternalLink, Lock } from 'lucide-react'
import Badge from './Badge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * CodeViewerModal — shows a project's screenshot, description, tags, code
 * snippet (if public or you're the owner), and/or external link.
 * Controlled from the parent via `open`/`onOpenChange`.
 */
function CodeViewerModal({ project, open, onOpenChange }) {
  const { user } = useAuth()
  if (!project) return null

  const isOwner = user?.uid === project.authorId
  const codeIsVisible = project.codeSnippet && (project.isCodePublic !== false || isOwner)
  const codeIsHiddenByAuthor = project.codeSnippet && project.isCodePublic === false && !isOwner

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6 shadow-glow sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-heading text-xl font-semibold text-white">
                {project.title}
              </Dialog.Title>
              <p className="mt-1 font-body text-xs text-white/40">
                by {project.authorName}
              </p>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:text-primary"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {project.screenshotUrl && (
            <img
              src={project.screenshotUrl}
              alt={`${project.title} screenshot`}
              className="mt-4 max-h-72 w-full rounded-lg border border-white/10 object-cover"
            />
          )}

          <p className="mt-4 font-body text-sm text-white/60">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(project.tags || []).map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>

          {codeIsVisible && (
            <div className="mt-5">
              <span className="font-body text-xs uppercase tracking-wider text-white/40">
                Code {isOwner && project.isCodePublic === false && '(hidden from others)'}
              </span>
              <pre className="mt-2 max-h-72 overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 font-code text-xs text-white/80">
                {project.codeSnippet}
              </pre>
            </div>
          )}

          {codeIsHiddenByAuthor && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-body text-xs text-white/40">
              <Lock size={13} />
              The author has kept this project's code private.
            </div>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-fit items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-body text-sm text-primary transition-colors hover:bg-primary/20"
            >
              <ExternalLink size={15} />
              View Live / Repo
            </a>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CodeViewerModal
