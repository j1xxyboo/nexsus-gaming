import { Link } from 'react-router-dom'
import { site } from '../data/site'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-12">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <p className="font-display text-xl tracking-wider text-white">NEXSUS GAMING</p>
          </div>
          <p className="muted mt-3 max-w-sm">{site.blurb}</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Pages</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tournaments" className="text-slate-300 hover:text-white">Tournaments</Link></li>
            <li><Link to="/teams" className="text-slate-300 hover:text-white">Teams</Link></li>
            <li><Link to="/join" className="text-slate-300 hover:text-white">Join a squad</Link></li>
            <li><Link to="/staff" className="text-slate-300 hover:text-white">Staff applications</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5 text-center text-xs text-slate-500 sm:px-8 lg:px-12">
        © {new Date().getFullYear()} {site.name}. A community project — not affiliated with any game publisher.
      </div>
    </footer>
  )
}
