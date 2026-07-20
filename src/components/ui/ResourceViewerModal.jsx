import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Badge from './Badge.jsx'

// Very small markdown-ish renderer: splits into paragraphs on blank lines,
// and turns **bold** into real <strong> tags. Enough for our own written
// content without pulling in a full markdown library.
function renderContent(content) {
  return content.split('\n\n').map((paragraph, i) => {
    const parts = paragraph.split(/\*\*(.+?)\*\*/g)
    return (
      <p key={i} className="mb-4 last:mb-0">
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-white">
              {part}
            </strong>
          ) : (
            part
          ),
        )}
      </p>
    )
  })
}

function ResourceViewerModal({ resource, open, onOpenChange }) {
  if (!resource) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6 shadow-glow sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="primary">{resource.category}</Badge>
              <Dialog.Title className="mt-3 font-heading text-xl font-semibold text-white">
                {resource.title}
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:text-primary"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="mt-6 font-body text-sm leading-relaxed text-white/70">
            {renderContent(resource.content)}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ResourceViewerModal
