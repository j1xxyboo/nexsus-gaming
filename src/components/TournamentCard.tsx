import { Link } from 'react-router-dom'
import type { Tournament } from '../lib/types'
import StatusChip from './StatusChip'

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-white">{value}</dd>
    </div>
  )
}

export default function TournamentCard({ t }: { t: Tournament }) {
  const registered = t.registration_count ?? 0
  const pct = t.max_teams ? Math.min(100, Math.round((registered / t.max_teams) * 100)) : 0
  const full = pct >= 100

  return (
    <Link to={`/tournaments/${t.slug}`} className="card card-hover group flex flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <StatusChip status={t.status} />
        <span className="truncate text-xs text-slate-500">
          {t.mode}
          {t.region ? ` · ${t.region}` : ''}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-brand-200">
        {t.title}
      </h3>
      {t.summary && <p className="muted mt-2 line-clamp-2">{t.summary}</p>}

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-4">
        <Meta label="Prize" value={t.prize_pool ?? 'TBA'} />
        <Meta label="Entry" value={t.entry_fee ?? 'Free'} />
        <Meta label="Squads" value={`${registered}/${t.max_teams}`} />
      </dl>

      <div className="mt-auto pt-4">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${full ? 'bg-crimson-500' : 'bg-brand-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {full ? 'Bracket full' : `${t.max_teams - registered} slots left`}
          {t.discord_channel ? ` · #${t.discord_channel}` : ''}
        </p>
      </div>
    </Link>
  )
}
