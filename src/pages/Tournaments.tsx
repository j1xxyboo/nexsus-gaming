import { useMemo, useState } from 'react'
import { tournaments, type TournamentStatus } from '../data/tournaments'
import TournamentCard from '../components/TournamentCard'
import SectionHeading from '../components/SectionHeading'

const filters: { key: TournamentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Sign-ups open' },
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Announced' },
  { key: 'finished', label: 'Finished' },
]

export default function Tournaments() {
  const [filter, setFilter] = useState<TournamentStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tournaments.filter((t) => {
      const byStatus = filter === 'all' || t.status === filter
      const byQuery = !q || `${t.name} ${t.game} ${t.mode} ${t.region}`.toLowerCase().includes(q)
      return byStatus && byQuery
    })
  }, [filter, query])

  return (
    <div>
      <SectionHeading eyebrow="Competition" title="Tournaments">
        Open cups, invitationals and the seasonal finale. Pick a bracket, check the ruleset, then register
        your roster in the server.
      </SectionHeading>

      <div className="card mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                filter === f.key
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, game or region…"
          className="field lg:ml-auto lg:max-w-xs"
        />
      </div>

      {list.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-2xl tracking-wide text-white">Nothing matches that</p>
          <p className="muted mx-auto mt-2 max-w-md">
            Try another filter, or ask in the announcements channel — new cups are posted every couple of
            weeks.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <TournamentCard key={t.slug} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}
