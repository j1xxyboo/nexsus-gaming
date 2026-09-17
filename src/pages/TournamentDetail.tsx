import { Link, useParams } from 'react-router-dom'
import { findTournament } from '../data/tournaments'
import { site } from '../data/site'
import StatusChip from '../components/StatusChip'

export default function TournamentDetail() {
  const { slug } = useParams()
  const t = findTournament(slug)

  if (!t) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-3xl tracking-wide text-white">Tournament not found</p>
        <p className="muted mx-auto mt-2 max-w-md">
          That bracket may have been archived. The current list is on the tournaments page.
        </p>
        <Link to="/tournaments" className="btn-primary mt-6">
          Back to tournaments
        </Link>
      </div>
    )
  }

  const pct = Math.min(100, Math.round((t.registered / t.slots) * 100))
  const closed = t.status === 'finished' || t.registered >= t.slots
  const starts = new Date(t.startsAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="space-y-8">
      <Link to="/tournaments" className="text-sm font-semibold text-brand-300 hover:text-brand-200">
        ← All tournaments
      </Link>

      <header className="card relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={t.status} />
            <span className="chip">{t.mode}</span>
            <span className="chip">{t.region}</span>
            <span className="chip">#{t.channel}</span>
          </div>

          <h1 className="h1 mt-4">{t.name}</h1>
          <p className="mt-1 text-base font-semibold text-brand-300">{t.game}</p>
          <p className="muted mt-4 max-w-2xl text-base">{t.summary}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={site.discordInvite}
              target="_blank"
              rel="noreferrer"
              className={closed ? 'btn-ghost' : 'btn-primary'}
            >
              {closed ? 'Watch in the server' : 'Register in Discord'}
            </a>
            <Link to="/join" className="btn-ghost">
              Need a squad?
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="h2">Ruleset</h2>
            <ul className="mt-4 space-y-3">
              {t.rules.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="h2">Schedule</h2>
            <ol className="mt-4 space-y-0">
              {t.schedule.map((s, i) => (
                <li key={s.round} className="flex gap-4 border-b border-white/5 py-3 last:border-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600/30 text-xs font-bold text-brand-100">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{s.round}</span>
                  <span className="ml-auto text-sm text-slate-400">{s.when}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">At a glance</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Prize pool', t.prize],
                ['Entry', t.entry],
                ['Format', t.format],
                ['Starts', starts],
                ['Slots', `${t.registered} of ${t.slots}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="ml-auto text-right font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${pct >= 100 ? 'bg-crimson-500' : 'bg-brand-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {pct >= 100 ? 'Bracket full' : `${t.slots - t.registered} slots left`}
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Where it runs</h2>
            <p className="muted mt-3">
              Pairings drop in <span className="font-semibold text-brand-300">#{t.channel}</span>, results go
              to <span className="font-semibold text-brand-300">#match-results</span>, and disputes open a
              ticket in <span className="font-semibold text-brand-300">#support-tickets</span>.
            </p>
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-red mt-5 w-full">
              Join the server
            </a>
          </section>
        </aside>
      </div>
    </div>
  )
}
