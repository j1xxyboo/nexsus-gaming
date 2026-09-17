import { Link } from 'react-router-dom'
import { site } from '../data/site'
import Logo from './Logo'

const pages = [
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/teams', label: 'Squads' },
  { to: '/join', label: 'Find a squad' },
  { to: '/community', label: 'Community' },
  { to: '/staff', label: 'Staff applications' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-medium text-white">{site.name}</span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {pages.map((p) => (
            <Link key={p.to} to={p.to} className="text-slate-400 transition-colors hover:text-white">
              {p.label}
            </Link>
          ))}
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-8 text-xs text-slate-500 sm:px-8">
        © {new Date().getFullYear()} {site.name}. A community project, not affiliated with any game publisher.
      </div>
    </footer>
  )
}
