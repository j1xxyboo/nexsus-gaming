import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { site } from '../data/site'
import { useAuth } from '../lib/auth'
import Logo from './Logo'

type Item = { to: string; channel: string; end?: boolean }

const groups: { title: string; items: Item[] }[] = [
  {
    title: 'المجتمع',
    items: [
      { to: '/', channel: 'الترحيب', end: true },
      { to: '/community', channel: 'السيرفر' },
    ],
  },
  {
    title: 'المنافسة',
    items: [
      { to: '/tournaments', channel: 'البطولات' },
      { to: '/teams', channel: 'الفرق' },
    ],
  },
  {
    title: 'فريقك',
    items: [
      { to: '/squad', channel: 'فريقي' },
      { to: '/join', channel: 'انضم-إلى-فريق' },
    ],
  },
  {
    title: 'أنت',
    items: [
      { to: '/profile', channel: 'الملف-الشخصي' },
      { to: '/staff', channel: 'طلبات-الطاقم' },
    ],
  },
]

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[11px] font-bold text-slate-500">
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

function Presence({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, session } = useAuth()
  const name = profile?.ign ?? profile?.display_name ?? 'زائر'
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div className="card mt-6 p-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {initials}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-ink-900 ${
              session ? 'animate-pulseDot bg-emerald-400' : 'bg-slate-600'
            }`}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-slate-400">
            {profile?.mlbb_verified ? 'حساب MLBB موثّق' : session ? 'غير موثّق' : 'لم تسجّل الدخول'}
          </p>
        </div>
      </div>

      {session ? (
        <NavLink to="/profile" onClick={onNavigate} className="btn-ghost mt-3 w-full">
          ملفي الشخصي
        </NavLink>
      ) : (
        <NavLink to="/auth" onClick={onNavigate} className="btn-primary mt-3 w-full">
          تسجيل الدخول
        </NavLink>
      )}

      <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-red mt-2 w-full">
        انضم إلى السيرفر
      </a>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 rounded-xl border border-white/15 bg-ink-900/90 p-2.5 text-slate-200 backdrop-blur lg:hidden"
        aria-label="فتح القائمة"
      >
        <span className="block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
        <span className="mt-1 block h-0.5 w-5 bg-current" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden" onClick={close} />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 border-l border-white/10 bg-ink-900/95 p-4 backdrop-blur transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <NavLink to="/" onClick={close} className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-xl tracking-wider text-white">NEXSUS</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-crimson-500">Gaming</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={close}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 h-px bg-gradient-to-l from-brand-600/60 via-crimson-600/40 to-transparent" />

        <div className="mt-5 max-h-[calc(100vh-19rem)] overflow-y-auto pl-1">
          <Nav onNavigate={close} />
        </div>

        <Presence onNavigate={close} />
      </aside>
    </>
  )
}
