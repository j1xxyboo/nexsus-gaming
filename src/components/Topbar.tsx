import { useLocation } from 'react-router-dom'
import { site } from '../data/site'

const titles: Record<string, string> = {
  '/': 'welcome',
  '/community': 'the-server',
  '/tournaments': 'tournaments',
  '/teams': 'teams',
  '/squad': 'my-squad',
  '/join': 'join-a-squad',
  '/profile': 'profile',
  '/staff': 'staff-applications',
  '/auth': 'sign-in',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const key = Object.keys(titles).find((k) => (k === '/' ? pathname === '/' : pathname.startsWith(k)))
  const channel = key ? titles[key] : 'nexsus'

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-5 pl-16 sm:px-8 lg:px-12 lg:pl-12">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-lg font-bold text-slate-500">#</span>
          <span className="truncate font-semibold text-white">{channel}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-emerald-400" />
            {site.discord.online.toLocaleString()} online
            <span className="text-slate-600">·</span>
            {site.discord.members.toLocaleString()} members
          </span>
          <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-red px-3 py-2">
            Join Discord
          </a>
        </div>
      </div>
    </header>
  )
}
