import { Link } from 'react-router-dom'
import type { Tournament } from '../data/tournaments'
import StatusChip from './StatusChip'

export default function TournamentCard({ t }: { t: Tournament }) {
  const pct = Math.min(100, Math.round((t.registered / t.slots) * 100))

  return (
    <Link to={`/tournaments/${t.slug}`} className="card card-hover group block overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-400 to-crimson-600" />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={t.status} />
          <span className="chip">{t.mode}</span>
          <span className="chip">{t.region}</span>
        </div>

        <h3 className="mt-4 font-display text-2xl tracking-wide text-white group-hover:text-brand-200">
          {t.name}
        </h3>
        <p className="text-sm font-medium text-brand-300">{t.game}</p>
        <p className="muted mt-3 line-clamp-2">{t.summary}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prize</dt>
            <dd className="mt-1 text-sm font-bold text-white">{t.prize}</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Entry</dt>
            <dd className="mt-1 text-sm font-bold text-white">{t.entry}</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Slots</dt>
            <dd className="mt-1 text-sm font-bold text-white">
              {t.registered}/{t.slots}
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
            {pct >= 100 ? 'Bracket full' : `${t.slots - t.registered} slots left`} · #{t.channel}
          </p>
        </div>
      </div>
    </Link>
  )
}
