import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMatches, fetchMyTeam, fetchRegistrations, fetchTournamentBySlug, registerTeam } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import { formatLabels } from '../lib/types'
import { useAuth } from '../lib/auth'
import { site } from '../data/site'
import StatusChip from '../components/StatusChip'
import { Empty, ErrorState, Loading } from '../components/States'

export default function TournamentDetail() {
  const { slug } = useParams()
  const { session, profile } = useAuth()
  const { data: t, error, loading, reload } = useAsync(() => fetchTournamentBySlug(slug!), [slug])
  const { data: regs } = useAsync(async () => (t ? fetchRegistrations(t.id) : []), [t?.id])
  const { data: matches } = useAsync(async () => (t ? fetchMatches(t.id) : []), [t?.id])
  const { data: mine } = useAsync(async () => (profile ? fetchMyTeam(profile.id) : null), [profile?.id])

  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  if (loading) return <Loading label="جارٍ تحميل البطولة…" />
  if (error) return <ErrorState message={error} />
  if (!t)
    return (
      <Empty title="البطولة غير موجودة">
        ربما تمت أرشفة هذه البطولة. <Link to="/tournaments" className="text-brand-300">اطّلع على القائمة الحالية.</Link>
      </Empty>
    )

  const registered = t.registration_count ?? 0
  const pct = Math.min(100, Math.round((registered / t.max_teams) * 100))
  const isOpen = t.status === 'registration_open' && registered < t.max_teams
  const alreadyIn = !!regs?.some((r) => r.team_id === mine?.team.id)
  const canRegister = isOpen && mine?.myRole === 'leader' && !alreadyIn
  const starts = t.starts_at
    ? new Date(t.starts_at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })
    : 'يُعلن لاحقاً'
  const rules = (t.rules ?? '').split('\n').map((r) => r.trim()).filter(Boolean)

  async function handleRegister() {
    if (!mine) return
    setBusy(true)
    setNotice(null)
    try {
      await registerTeam(t!.id, mine.team.id)
      setNotice('تم إرسال طلب الفريق — سيؤكد الطاقم مقعدكم في السيرفر.')
      await reload()
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'تعذّر تسجيل هذا الفريق.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <Link to="/tournaments" className="text-sm font-semibold text-brand-300 hover:text-brand-200">
        → كل البطولات
      </Link>

      <header className="card relative overflow-hidden p-8">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={t.status} />
            <span className="chip">{t.mode}</span>
            {t.region && <span className="chip">{t.region}</span>}
            {t.discord_channel && <span className="chip" dir="ltr">#{t.discord_channel}</span>}
          </div>

          <h1 className="h1 mt-4">{t.title}</h1>
          <p className="mt-1 text-base font-semibold text-brand-300">Mobile Legends: Bang Bang</p>
          {t.summary && <p className="muted mt-4 max-w-2xl text-base">{t.summary}</p>}

          <div className="mt-7 flex flex-wrap gap-3">
            {canRegister && (
              <button type="button" onClick={handleRegister} disabled={busy} className="btn-primary disabled:opacity-60">
                {busy ? 'جارٍ الإرسال…' : `سجّل ${mine!.team.name}`}
              </button>
            )}
            {alreadyIn && <span className="chip-purple">فريقك مسجّل</span>}
            {!session && isOpen && (
              <Link to="/auth" className="btn-primary">
                سجّل الدخول للتسجيل
              </Link>
            )}
            {session && isOpen && !mine && (
              <Link to="/squad" className="btn-primary">
                أنشئ فريقاً أولاً
              </Link>
            )}
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-ghost">
              افتح السيرفر
            </a>
          </div>

          {notice && <p className="mt-4 text-sm text-brand-200">{notice}</p>}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {rules.length > 0 && (
            <section className="card p-6">
              <h2 className="h2">القوانين</h2>
              <ul className="mt-4 space-y-3">
                {rules.map((r) => (
                  <li key={r} className="flex gap-3 text-sm text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card p-6">
            <h2 className="h2">الفرق المسجّلة</h2>
            {!regs || regs.length === 0 ? (
              <p className="muted mt-3">لا توجد فرق بعد — كن أول المسجّلين.</p>
            ) : (
              <ul className="mt-4 divide-y divide-white/5">
                {regs.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-crimson-600 text-xs font-bold text-white">
                      {r.team?.tag ?? '—'}
                    </span>
                    <span className="truncate font-semibold text-white">{r.team?.name ?? 'فريق غير معروف'}</span>
                    <span className="mr-auto shrink-0 text-xs uppercase tracking-wide text-slate-400">
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {matches && matches.length > 0 && (
            <section className="card p-6">
              <h2 className="h2">جدول المباريات</h2>
              <ul className="mt-4 divide-y divide-white/5">
                {matches.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className="chip shrink-0">الجولة {m.round}</span>
                    <span className="truncate text-slate-300">
                      {regs?.find((r) => r.team_id === m.team_a_id)?.team?.name ?? 'لم يُحدد'}
                    </span>
                    <span className="shrink-0 font-bold text-white" dir="ltr">
                      {m.score_a} – {m.score_b}
                    </span>
                    <span className="truncate text-slate-300">
                      {regs?.find((r) => r.team_id === m.team_b_id)?.team?.name ?? 'لم يُحدد'}
                    </span>
                    <span className="mr-auto shrink-0 text-xs text-slate-500">
                      أفضل من {m.best_of}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h2 className="text-xs font-bold text-slate-500">نظرة سريعة</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['مجموع الجوائز', t.prize_pool ?? 'يُعلن لاحقاً'],
                ['رسوم الدخول', t.entry_fee ?? 'مجاني'],
                ['النظام', formatLabels[t.format]],
                ['تبدأ في', starts],
                ['الفرق', `${registered} من ${t.max_teams}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="mr-auto text-left font-semibold text-white">{v}</dd>
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
                {pct >= 100 ? 'الجدول مكتمل' : `متبقٍ ${t.max_teams - registered} مقعد`}
              </p>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xs font-bold text-slate-500">أين تُقام</h2>
            <p className="muted mt-3">
              تُنشر المواجهات في{' '}
              <span className="font-semibold text-brand-300" dir="ltr">#{t.discord_channel ?? 'tournaments'}</span>، وتُرسل النتائج
              إلى <span className="font-semibold text-brand-300" dir="ltr">#match-results</span>، وتُفتح النزاعات عبر
              تذكرة في <span className="font-semibold text-brand-300" dir="ltr">#support-tickets</span>.
            </p>
            <a href={site.discordInvite} target="_blank" rel="noreferrer" className="btn-red mt-5 w-full">
              انضم إلى السيرفر
            </a>
          </section>
        </aside>
      </div>
    </div>
  )
}
