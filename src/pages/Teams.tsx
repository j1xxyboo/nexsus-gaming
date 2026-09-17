import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { teams } from '../data/teams'
import SectionHeading from '../components/SectionHeading'

export default function Teams() {
  const [onlyRecruiting, setOnlyRecruiting] = useState(false)
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teams.filter((t) => {
      const byRecruit = !onlyRecruiting || t.recruiting
      const byQuery = !q || `${t.name} ${t.tag} ${t.game} ${t.captain}`.toLowerCase().includes(q)
      return byRecruit && byQuery
    })
  }, [onlyRecruiting, query])

  return (
    <div>
      <SectionHeading
        eyebrow="Directory"
        title="Squads"
        action={
          <Link to="/join" className="btn-primary">
            Post yourself as a free agent
          </Link>
        }
      >
        Every squad registered for a Nexsus bracket. Captains are reachable by their server handle.
      </SectionHeading>

      <div className="card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => setOnlyRecruiting((v) => !v)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
            onlyRecruiting
              ? 'bg-crimson-600 text-white shadow-red'
              : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          {onlyRecruiting ? 'Recruiting only' : 'Show all squads'}
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search squads, tags or captains…"
          className="field sm:ml-auto sm:max-w-xs"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <article key={t.tag} className="card card-hover p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-crimson-600 font-display text-lg tracking-wider text-white">
                {t.tag}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-display text-xl tracking-wide text-white">{t.name}</h3>
                <p className="truncate text-sm text-brand-300">{t.game}</p>
              </div>
              {t.recruiting && <span className="chip-red ml-auto shrink-0">Recruiting</span>}
            </div>

            <p className="muted mt-4">{t.bio}</p>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex gap-4">
                <dt className="text-slate-400">Captain</dt>
                <dd className="ml-auto font-semibold text-white">{t.captain}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-slate-400">Roster</dt>
                <dd className="ml-auto font-semibold text-white">{t.members} players</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-slate-400">Looking for</dt>
                <dd className="ml-auto text-right font-semibold text-white">{t.looking}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
