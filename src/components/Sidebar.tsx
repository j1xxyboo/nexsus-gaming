import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { site } from '../data/site'
import Logo from './Logo'

type Item = { to: string; channel: string; end?: boolean }

const groups: { title: string; items: Item[] }[] = [
  {
    title: 'Community',
    items: [
      { to: '/', channel: 'welcome', end: true },
      { to: '/community', channel: 'the-server' },
    ],
  },
  {
    title: 'Competition',
    items: [
      { to: '/tournaments', channel: 'tournaments' },
      { to: '/teams', channel: 'teams' },
    ],
  },
  {
    title: 'Your squad',
    items: [
      { to: '/squad', channel: 'my-squad' },
      { to: '/join', channel: 'join-a-squad' },
    ],
  },
  {
    title: 'You',
    items: [
      { to: '/profile', channel: 'profile' },
      { to: '/staff', channel: 'staff-applications' },
    ],
  },
]

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <span className="text-base leading-none text-slate-500">#</span>
                <span className="truncate">{item.channel}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function Presence() {
  return (
    <div className="card mt-6 p-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
            NX
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 animate-pulseDot rounded-full border-2 border-ink-900 bg-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Guest</p>
          <p className="truncate text-xs text-slate-400">
            {site.discord.online.toLocaleString()} online
          </p>
        </div>
      </div>
      <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary mt-3 w-full">
        Join the server
      </a>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-white/15 bg-ink-900/90 p-2.5 text-slate-200 backdrop-blur lg:hidden"
        aria-label="Open navigation"
      >
        <span className="block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-ink-900/95 p-4 backdrop-blur transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-xl tracking-wider text-white">NEXSUS</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-crimson-500">Gaming</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-brand-600/60 via-crimson-600/40 to-transparent" />

        <div className="mt-5 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1">
          <Nav onNavigate={() => setOpen(false)} />
        </div>

        <Presence />
      </aside>
    </>
  )
}
