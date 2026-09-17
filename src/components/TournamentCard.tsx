import { Link } from 'react-router-dom'
import type { Tournament } from '../lib/types'
import StatusChip from './StatusChip'

export default function TournamentCard({ t }: { t: Tournament }) {
  const registered = t.registration_count ?? 0
  const pct = t.max_teams ? Math.min(100, Math.round((registered / t.max_teams) * 100)) : 0

  return (
    <Link to={`/tournaments/${t.slug}`} className="card card-hover group block overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-400 to-crimson-600" />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={t.status} />
          <span className="chip">{t.mode}</span>
          {t.region && <span className="chip">{t.region}</span>}
        </div>

        <h3 className="mt-4 font-display text-2xl tracking-wide text-white group-hover:text-brand-200">
          {t.title}
        </h3>
        <p className="text-sm font-medium text-brand-300">Mobile Legends: Bang Bang</p>
        {t.summary && <p className="muted mt-3 line-clamp-2">{t.summary}</p>}

        <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prize</dt>
            <dd className="mt-1 text-sm font-bold text-white">{t.prize_pool ?? 'TBA'}</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entry</dt>
            <dd className="mt-1 text-sm font-bold text-white">{t.entry_fee ?? 'Free'}</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Squads</dt>
            <dd className="mt-1 text-sm font-bold text-white">
              {registered}/{t.max_teams}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${pct >= 100 ? 'bg-crimson-500' : 'bg-brand-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {pct >= 100 ? 'Bracket full' : `${t.max_teams - registered} slots left`}
            {t.discord_channel ? ` · #${t.discord_channel}` : ''}
          </p>
        </div>
      </div>
    </Link>
  )
}
