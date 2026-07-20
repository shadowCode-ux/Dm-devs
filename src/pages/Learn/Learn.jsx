import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, PlayCircle, HelpCircle } from 'lucide-react'
import GlassPanel from '../../components/ui/GlassPanel.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { clsx } from '../../lib/clsx.js'
import { htmlReference } from '../../data/learn/html.js'
import { cssReference } from '../../data/learn/css.js'
import { javascriptReference } from '../../data/learn/javascript.js'
import CodePlayground, { defaultPlaygroundCode } from '../../components/learn/CodePlayground.jsx'

const languages = [
  { key: 'html', label: 'HTML', data: htmlReference },
  { key: 'css', label: 'CSS', data: cssReference },
  { key: 'javascript', label: 'JavaScript', data: javascriptReference },
]

// Demo markup with common class names used across our CSS reference examples,
// so loading a CSS snippet into the playground actually has something to style.
const cssDemoMarkup = `<div class="card" style="margin-bottom:12px;">
  <h3>Card title</h3>
  <p>Some card content.</p>
</div>
<button class="button">Click me</button>
<div class="navbar" style="margin-top:12px;">Navbar demo</div>`

function wrapForPlayground(item, lang) {
  if (lang === 'html') {
    return item.example
  }

  if (lang === 'css') {
    return `<style>\nbody { font-family: sans-serif; background: #0a0a0a; color: white; padding: 20px; }\n${item.example}\n</style>\n${cssDemoMarkup}`
  }

  // JavaScript: wrap so any console.log calls in the example are visible on the page,
  // since there's no browser devtools inside this preview iframe.
  return `<pre id="output" style="font-family: monospace; color: #00BFFF; background:#0a0a0a; padding:16px; margin:0; min-height:100px;"></pre>
<script>
  const out = document.getElementById('output');
  console.log = (...args) => {
    out.textContent += args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n';
  };
  try {
    ${item.example}
  } catch (err) {
    console.log('Error:', err.message);
  }
</script>`
}

function Learn() {
  const [searchParams] = useSearchParams()
  const initialLang = searchParams.get('lang')
  const validLang = languages.some((lang) => lang.key === initialLang) ? initialLang : 'html'

  const [activeLang, setActiveLang] = useState(validLang)
  const [query, setQuery] = useState('')
  const [activeItem, setActiveItem] = useState(null)
  const [playgroundCode, setPlaygroundCode] = useState(defaultPlaygroundCode)

  const currentData = languages.find((lang) => lang.key === activeLang).data

  const filtered = useMemo(() => {
    return currentData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    )
  }, [currentData, query])

  const selected = activeItem && currentData.find((item) => item.name === activeItem)
  const display = selected || filtered[0] || null

  const handleLangChange = (key) => {
    setActiveLang(key)
    setQuery('')
    setActiveItem(null)
  }

  const loadIntoPlayground = () => {
    if (!display) return
    setPlaygroundCode(wrapForPlayground(display, activeLang))
    document.getElementById('playground-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-white sm:text-5xl">Learn</h1>
          <p className="mt-4 font-body text-white/50">
            A quick reference for every HTML tag, CSS property, and JavaScript keyword
            you'll actually use — try any of them live below.
          </p>
          <Link
            to="/quiz"
            className="mt-4 inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline"
          >
            <HelpCircle size={14} />
            Not sure where to start? Take the skill quiz
          </Link>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.key}
              onClick={() => handleLangChange(lang.key)}
              className={clsx(
                'rounded-full px-5 py-2 font-body text-sm transition-colors',
                activeLang === lang.key
                  ? 'bg-primary text-background font-medium'
                  : 'bg-white/5 text-white/60 hover:text-primary',
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar: search + list */}
          <GlassPanel className="h-fit p-4">
            <div className="relative mb-3">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${languages.find((l) => l.key === activeLang).label}...`}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 font-body text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-primary/40 focus:shadow-glow"
              />
            </div>

            <div className="flex max-h-[420px] flex-col gap-1 overflow-y-auto">
              {filtered.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={clsx(
                    'rounded-lg px-3 py-2 text-left font-code text-sm transition-colors',
                    display?.name === item.name
                      ? 'bg-primary/10 text-primary'
                      : 'text-white/60 hover:bg-white/5 hover:text-primary',
                  )}
                >
                  {item.name}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-2 font-body text-sm text-white/40">No matches.</p>
              )}
            </div>
          </GlassPanel>

          {/* Detail panel */}
          <GlassPanel className="p-8">
            {display ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-code text-xl font-semibold text-primary">
                    {display.name}
                  </h2>
                  {display.category && <Badge variant="primary">{display.category}</Badge>}
                </div>

                <p className="mt-4 font-body text-sm leading-relaxed text-white/70">
                  {display.description}
                </p>

                {display.syntax && (
                  <div className="mt-5">
                    <span className="font-body text-xs uppercase tracking-wider text-white/40">
                      Syntax
                    </span>
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 font-code text-xs text-white/80">
                      {display.syntax}
                    </pre>
                  </div>
                )}

                {display.example && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs uppercase tracking-wider text-white/40">
                        Example
                      </span>
                      <button
                        onClick={loadIntoPlayground}
                        className="flex items-center gap-1.5 font-body text-xs text-primary hover:underline"
                      >
                        <PlayCircle size={13} />
                        Load into playground
                      </button>
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-primary/20 bg-primary/5 p-4 font-code text-xs text-white/80">
                      {display.example}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <p className="font-body text-white/40">Select an item to see details.</p>
            )}
          </GlassPanel>
        </div>

        <div id="playground-section" className="mt-8">
          <CodePlayground code={playgroundCode} onChange={setPlaygroundCode} />
        </div>
      </div>
    </section>
  )
}

export default Learn
