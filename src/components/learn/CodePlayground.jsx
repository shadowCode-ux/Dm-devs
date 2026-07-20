import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import GlassPanel from '../ui/GlassPanel.jsx'

export const defaultPlaygroundCode = `<h1 style="color: #00BFFF; font-family: sans-serif;">
  Hello world
</h1>
<p style="color: white; font-family: sans-serif;">
  Edit this code and watch it update live.
</p>`

/**
 * CodePlayground — controlled from the parent (`code`/`onChange`) so other
 * parts of the page (like "Load into playground" buttons) can inject code.
 */
function CodePlayground({ code, onChange }) {
  const [renderedCode, setRenderedCode] = useState(code)

  // Debounce: wait 300ms after the user stops typing before re-rendering the
  // iframe, so it doesn't re-render on every single keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => setRenderedCode(code), 300)
    return () => clearTimeout(timeout)
  }, [code])

  return (
    <GlassPanel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="font-heading text-sm font-semibold text-white">Try it yourself</span>
        <button
          onClick={() => onChange(defaultPlaygroundCode)}
          className="flex items-center gap-1.5 font-body text-xs text-white/50 transition-colors hover:text-primary"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="h-80 w-full resize-none border-b border-white/10 bg-black/30 p-4 font-code text-xs text-white/90 outline-none lg:border-b-0 lg:border-r"
        />
        <iframe
          title="Live code preview"
          srcDoc={renderedCode}
          sandbox="allow-scripts"
          className="h-80 w-full bg-white"
        />
      </div>
    </GlassPanel>
  )
}

export default CodePlayground
