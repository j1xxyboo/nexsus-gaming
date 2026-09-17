import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { fetchFeaturedTournaments } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import TournamentCard from '../components/TournamentCard'
import { Empty, ErrorState, Loading } from '../components/States'

const steps = [
  {
    n: '1',
    title: 'انضم إلى السيرفر',
    body: 'كل شيء يبدأ في ديسكورد. اقرأ القوانين، واحصل على رتبك، وألقِ التحية.',
  },
  {
    n: '2',
    title: 'وثّق حساب MLBB الخاص بك',
    body: 'أدخل معرّف اللاعب والسيرفر، ثم اكتب الرمز الذي نرسله إلى صندوق بريدك داخل اللعبة.',
  },
  {
    n: '3',
    title: 'سجّل فريقاً',
    body: 'أنشئ فريقاً أو انضم إلى واحد، ثم سجّله في أي بطولة مفتوحة.',
  },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-900 p-5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-white">{value}</dd>
    </div>
  )
}

export default function Home() {
  const { data, error, loading } = useAsync(() => fetchFeaturedTournaments(3), [])

  return (
    <div className="space-y-20">
      <section className="grid gap-10 pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-medium text-brand-300">
            Mobile Legends: Bang Bang · بطولات مجتمعية
          </p>
          <h1 className="h1 mt-4 max-w-xl">منافسات MLBB تنافسية، تُدار كما يجب.</h1>
          <p className="muted mt-5 max-w-lg text-base">{site.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary">
              انضم إلى ديسكورد
            </a>
            <Link to="/tournaments" className="btn-ghost">
              تصفّح البطولات
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08]">
          <Stat label="الأعضاء" value={site.discord.members.toLocaleString('ar-EG')} />
          <Stat label="متصلون الآن" value={site.discord.online.toLocaleString('ar-EG')} />
          <Stat label="اللعبة" value="MLBB" />
        </dl>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="h2">التسجيل مفتوح</h2>
            <p className="muted mt-1">الجداول يُعدّها ويديرها طاقم Nexsus داخل السيرفر.</p>
          </div>
          <Link to="/tournaments" className="shrink-0 text-sm font-medium text-brand-300 hover:text-brand-200">
            كل البطولات ←
          </Link>
        </div>

        {loading && <Loading label="جارٍ تحميل البطولات…" />}
        {error && <ErrorState message={error} />}
        {data && data.length === 0 && (
          <Empty title="لا توجد بطولات مفتوحة حالياً">
            تُعلَن الكؤوس الجديدة في السيرفر كل أسبوعين تقريباً.
          </Empty>
        )}
        {data && data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="h2">كيف تلعب مباراتك الأولى</h2>
        <ol className="mt-6 grid gap-8 border-t border-white/[0.08] pt-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <p className="font-display text-sm font-semibold text-brand-300">الخطوة {s.n}</p>
              <h3 className="mt-2 text-base font-semibold text-white">{s.title}</h3>
              <p className="muted mt-1.5">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card grid overflow-hidden md:grid-cols-2">
        <div className="p-7 sm:p-8">
          <h2 className="h2">المباريات تُقام في ديسكورد</h2>
          <p className="muted mt-3">
            هذا الموقع مخصص للتسجيل وإدارة التشكيلات. أما اللوبيات والمواجهات والنزاعات والنتائج فكلها تُدار عبر
            سيرفر Nexsus.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-primary">
              افتح رابط الدعوة
            </a>
            <Link to="/community" className="btn-ghost">
              ماذا يوجد داخل السيرفر
            </Link>
          </div>
        </div>

        <ul className="divide-y divide-white/[0.08] border-t border-white/[0.08] md:border-r md:border-t-0">
          {site.channels.slice(0, 4).map((c) => (
            <li key={c.name} className="flex gap-3 px-7 py-4 sm:px-8">
              <span className="text-slate-600">#</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white" dir="ltr">{c.name}</p>
                <p className="text-xs text-slate-400">{c.purpose}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
