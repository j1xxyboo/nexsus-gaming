import { useMemo, useState } from 'react'
import { fetchTournaments } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import type { TournamentStatus } from '../lib/types'
import TournamentCard from '../components/TournamentCard'
import SectionHeading from '../components/SectionHeading'
import { Empty, ErrorState, Loading } from '../components/States'

const filters: { key: TournamentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'registration_open', label: 'Sign-ups open' },
  { key: 'ongoing', label: 'Live' },
  { key: 'registration_closed', label: 'Closed' },
  { key: 'completed', label: 'Finished' },
]

export default function Tournaments() {
  const { data, error, loading } = useAsync(fetchTournaments, [])
  const [filter, setFilter] = useState<TournamentStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((t) => {
      const byStatus = filter === 'all' || t.status === filter
      const byQuery = !q || `${t.title} ${t.mode} ${t.region ?? ''}`.toLowerCase().includes(q)
      return byStatus && byQuery
    })
  }, [data, filter, query])

  return (
    <div>
      <SectionHeading eyebrow="Competition" title="Tournaments">
        Open cups, invitationals and the seasonal finale. Pick a bracket, check the ruleset, then register
        your squad.
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
          placeholder="Search by name, mode or region…"
          className="field lg:ml-auto lg:max-w-xs"
        />
      </div>

      {loading && <Loading label="Loading tournaments…" />}
      {error && <ErrorState message={error} />}
      {data && list.length === 0 && (
        <Empty title="Nothing matches that">
          Try another filter, or watch the announcements channel — new cups are posted every couple of weeks.
        </Empty>
      )}
      {list.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <TournamentCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  )
}
