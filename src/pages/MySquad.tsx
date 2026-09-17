import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { fetchMyTeam } from '../lib/queries'
import { useAsync } from '../lib/useAsync'
import SectionHeading from '../components/SectionHeading'
import { Empty, ErrorState, Loading } from '../components/States'

export default function MySquad() {
  const { profile, loading: authLoading } = useAuth()
  const { data, error, loading, reload } = useAsync(
    async () => (profile ? fetchMyTeam(profile.id) : null),
    [profile?.id],
  )

  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [bio, setBio] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  if (authLoading || loading) return <Loading label="Loading your squad…" />

  if (!profile)
    return (
      <Empty title="Sign in to manage a squad">
        <Link to="/auth" className="text-brand-300">
          Sign in
        </Link>{' '}
        first — squads are tied to a verified MLBB account.
      </Empty>
    )

  if (error) return <ErrorState message={error} />

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setNotice(null)
    const { error: err } = await supabase.from('teams').insert({
      name: name.trim(),
      tag: tag.trim().toUpperCase(),
      bio: bio.trim() || null,
      leader_id: profile!.id,
    })
    setBusy(false)
    if (err) {
      setNotice(err.message)
      return
    }
    setNotice('Squad created — staff will review it before it appears in the directory.')
    await reload()
  }

  async function toggleRecruiting() {
    if (!data) return
    setBusy(true)
    await supabase.from('teams').update({ recruiting: !data.team.recruiting }).eq('id', data.team.id)
    setBusy(false)
    await reload()
  }

  async function leaveSquad() {
    if (!data) return
    setBusy(true)
    await supabase.from('team_members').delete().eq('team_id', data.team.id).eq('profile_id', profile!.id)
    setBusy(false)
    await reload()
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl">
        <SectionHeading eyebrow="Your squad" title="Create a squad">
          You need a squad to enter a 5v5 bracket. Create one as captain, then share the invite code with
          your players — or{' '}
          <Link to="/join" className="text-brand-300">
            join an existing squad
          </Link>
          .
        </SectionHeading>

        <form onSubmit={handleCreate} className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="sq-name">
              Squad name
            </label>
            <input id="sq-name" required value={name} onChange={(e) => setName(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="sq-tag">
              Tag (2–4 letters)
            </label>
            <input
              id="sq-tag"
              required
              maxLength={4}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="field uppercase"
            />
          </div>
          <div>
            <label className="label" htmlFor="sq-bio">
              Short bio
            </label>
            <textarea id="sq-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="field" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? 'Creating…' : 'Create squad'}
          </button>
          {notice && <p className="text-sm text-brand-200">{notice}</p>}
        </form>
      </div>
    )
  }

  const { team, roster, myRole } = data
  const isLeader = myRole === 'leader'

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Your squad" title={team.name} />

      <section className="card overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-400 to-crimson-600" />
        <div className="flex flex-wrap items-center gap-5 p-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-crimson-600 font-display text-xl tracking-wider text-white">
            {team.tag}
          </div>
          <div>
            <p className="font-display text-2xl tracking-wide text-white">{team.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={team.status === 'approved' ? 'chip-purple' : 'chip'}>{team.status}</span>
              {team.recruiting && <span className="chip-red">Recruiting</span>}
              <span className="chip">{roster.length} players</span>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap gap-3">
            {isLeader && (
              <button type="button" onClick={toggleRecruiting} disabled={busy} className="btn-ghost">
                {team.recruiting ? 'Stop recruiting' : 'Open recruitment'}
              </button>
            )}
            {!isLeader && (
              <button type="button" onClick={leaveSquad} disabled={busy} className="btn-ghost">
                Leave squad
              </button>
            )}
          </div>
        </div>
        {team.review_note && (
          <p className="border-t border-white/5 px-6 py-3 text-sm text-slate-400">
            Staff note: {team.review_note}
          </p>
        )}
      </section>

      {isLeader && (
        <section className="card p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Invite code</h2>
          <p className="mt-2 font-display text-3xl tracking-[0.3em] text-brand-300">{team.invite_code}</p>
          <p className="muted mt-2">
            Players enter this on the join-a-squad page to add themselves to your roster.
          </p>
        </section>
      )}

      <section className="card p-6">
        <h2 className="h2">Roster</h2>
        <ul className="mt-4 divide-y divide-white/5">
          {roster.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              {m.profile?.avatar_url ? (
                <img src={m.profile.avatar_url} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600/40 text-xs font-bold text-white">
                  {(m.profile?.ign ?? '?').slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {m.profile?.ign ?? m.profile?.display_name ?? 'Player'}
                </p>
                <p className="text-xs text-slate-500">
                  {m.profile?.ml_id ? `ID ${m.profile.ml_id}` : 'no linked ID'}
                  {m.profile?.level != null ? ` · level ${m.profile.level}` : ''}
                </p>
              </div>
              <span className="ml-auto chip shrink-0">{m.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
