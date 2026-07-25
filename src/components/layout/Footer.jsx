import { Link } from 'react-router-dom'
import { Github, MessageCircle, Twitter } from 'lucide-react'

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Projects', to: '/platform/projects' },
      { label: 'Leaderboard', to: '/platform/leaderboard' },
      { label: 'Docs', to: '/platform/docs' },
      { label: 'Support', to: '/platform/support' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Community', to: '/community' },
      { label: 'Team', to: '/team' },
      { label: 'Rules', to: '/rules' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resource Library', to: '/resources' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-glass backdrop-blur-glass">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-heading text-xl font-semibold text-white">
              <img src="/images/banner-icon.png" alt="Dark Mode Devs" className="h-8 w-8 rounded-lg object-contain" />
              Dark<span className="text-primary">Mode</span>Devs
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm text-white/50">
              A developer-first community for building, learning, and growing together.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://discord.gg/xZ8wDJ6bRa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="text-white/50 transition-colors hover:text-primary"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-white/50 transition-colors hover:text-primary"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-white/50 transition-colors hover:text-primary"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-heading text-sm font-semibold text-white">{column.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="font-body text-sm text-white/50 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Dark Mode Devs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-white/40 hover:text-primary">
              Privacy
            </a>
            <a href="#" className="font-body text-xs text-white/40 hover:text-primary">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
