import { useMemo, useState } from 'react'
import { fetchTournaments } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import type { TournamentStatus } from '../lib/types'
import TournamentCard from '../components/TournamentCard'
import SectionHeading from '../components/SectionHeading'
import { Empty, ErrorState, Loading } from '../components/States'

const filters: { key: TournamentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'registration_open', label: 'التسجيل مفتوح' },
  { key: 'ongoing', label: 'جارية' },
  { key: 'registration_closed', label: 'مغلقة' },
  { key: 'completed', label: 'منتهية' },
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
      <SectionHeading eyebrow="المنافسة" title="البطولات">
        كؤوس مفتوحة، وبطولات بالدعوة، والنهائي الموسمي. اختر بطولة، واطّلع على القوانين، ثم سجّل فريقك.
      </SectionHeading>

      <div className="card mb-6 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
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
          placeholder="ابحث بالاسم أو النمط أو المنطقة…"
          className="field lg:mr-auto lg:max-w-xs"
        />
      </div>

      {loading && <Loading label="جارٍ تحميل البطولات…" />}
      {error && <ErrorState message={error} />}
      {data && list.length === 0 && (
        <Empty title="لا توجد نتائج مطابقة">
          جرّب فلتراً آخر، أو تابع قناة الإعلانات — تُنشر كؤوس جديدة كل أسبوعين تقريباً.
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
