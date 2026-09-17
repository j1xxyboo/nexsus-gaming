import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { useAuth } from '../lib/auth'
import Logo from './Logo'

const links = [
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/teams', label: 'Squads' },
  { to: '/join', label: 'Find a squad' },
  { to: '/community', label: 'Community' },
  { to: '/staff', label: 'Staff' },
]

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M19.54 5.34A16.3 16.3 0 0 0 15.6 4l-.2.4a15 15 0 0 1 3.6 1.8 13.4 13.4 0 0 0-14 0 15 15 0 0 1 3.6-1.8L8.4 4a16.3 16.3 0 0 0-3.94 1.34C2 9.1 1.3 12.8 1.65 16.4A16.4 16.4 0 0 0 6.5 19l1-1.5a10.5 10.5 0 0 1-1.7-.8l.4-.3a11.7 11.7 0 0 0 11.6 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.5a16.4 16.4 0 0 0 4.85-2.6c.4-4.2-.7-7.8-2.84-11.06ZM8.7 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  )
}

export default function Topbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { profile, session } = useAuth()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const name = profile?.ign ?? profile?.display_name ?? 'Account'
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-ink-950/95">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="font-display text-base font-semibold tracking-tight text-white">Nexsus Gaming</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={site.discordInvite}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost hidden h-9 px-3 sm:inline-flex"
          >
            <DiscordIcon />
            Discord
          </a>

          {session ? (
            <Link
              to="/profile"
              className="flex h-9 items-center gap-2 rounded-md border border-white/10 pl-1 pr-3 text-sm text-slate-200 transition-colors hover:bg-white/5"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded object-cover" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded bg-brand-500 text-xs font-semibold text-white">
                  {initials}
                </span>
              )}
              <span className="hidden max-w-[8rem] truncate sm:inline">{name}</span>
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary h-9 px-3">
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-200 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-ink-950 md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8">
            <NavLink to="/" end className={({ isActive }) => `nav-link py-2.5 ${isActive ? 'nav-link-active' : ''}`}>
              Home
            </NavLink>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav-link py-2.5 ${isActive ? 'nav-link-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
            {session && (
              <NavLink to="/profile" className={({ isActive }) => `nav-link py-2.5 ${isActive ? 'nav-link-active' : ''}`}>
                Profile
              </NavLink>
            )}
            <a
              href={site.discordInvite}
              target="_blank"
              rel="noreferrer"
              className="nav-link flex items-center gap-2 py-2.5"
            >
              <DiscordIcon />
              Discord server
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
