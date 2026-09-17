import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { rankName, type MlbbProfile } from '../lib/mlbb'
import MlbbVerify from '../components/MlbbVerify'
import SectionHeading from '../components/SectionHeading'
import { Empty, Loading } from '../components/States'

export default function Profile() {
  const { session, profile, loading, reloadProfile, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [discord, setDiscord] = useState('')
  const [country, setCountry] = useState('')
  const [relink, setRelink] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name ?? '')
    setDiscord(profile.discord ?? '')
    setCountry(profile.country ?? '')
  }, [profile])

  if (loading) return <Loading label="Loading your profile…" />

  if (!session || !profile)
    return (
      <Empty title="Sign in to see your profile">
        <Link to="/auth" className="text-brand-300">
          Sign in or register
        </Link>{' '}
        to link your MLBB account and join a squad.
      </Empty>
    )

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setNotice(null)
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, discord, country })
      .eq('id', profile!.id)
    setBusy(false)
    setNotice(error ? error.message : 'Saved.')
    if (!error) await reloadProfile()
  }

  async function handleRelinked(result: { token: string; profile: MlbbProfile; roleId: string; zoneId: string }) {
    setBusy(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        ml_id: result.roleId,
        ml_zone: result.zoneId,
        ign: result.profile.name ?? null,
        avatar_url: result.profile.avatar ?? null,
        level: result.profile.level ?? null,
        rank_level: result.profile.rankLevel ?? null,
        history_rank_level: result.profile.historyRankLevel ?? null,
        mlbb_verified: true,
        mlbb_token: result.token,
        mlbb_synced_at: new Date().toISOString(),
      })
      .eq('id', profile!.id)
    setBusy(false)
    setRelink(false)
    setNotice(error ? error.message : 'MLBB account linked.')
    if (!error) await reloadProfile()
  }

  const synced = profile.mlbb_synced_at
    ? new Date(profile.mlbb_synced_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="You" title="Profile" />

      <section className="card overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-400 to-crimson-600" />
        <div className="flex flex-wrap items-center gap-5 p-6">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-crimson-600 font-display text-2xl text-white">
              {(profile.display_name ?? 'NX').slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="font-display text-3xl tracking-wide text-white">
              {profile.ign ?? profile.display_name ?? 'Player'}
            </h2>
            <p className="text-sm text-slate-400">
              {profile.ml_id ? `ID ${profile.ml_id} (${profile.ml_zone})` : 'No MLBB account linked'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.mlbb_verified ? (
                <span className="chip-purple">MLBB verified</span>
              ) : (
                <span className="chip-red">Not verified</span>
              )}
              {profile.level != null && <span className="chip">Level {profile.level}</span>}
              {profile.rank_level != null && <span className="chip">{rankName(profile.rank_level)}</span>}
              {profile.role !== 'player' && <span className="chip-white">{profile.role}</span>}
            </div>
          </div>

          <button type="button" onClick={signOut} className="btn-ghost ml-auto">
            Sign out
          </button>
        </div>
        {synced && (
          <p className="border-t border-white/5 px-6 py-3 text-xs text-slate-500">
            In-game data last synced {synced}
          </p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="h2">Your details</h2>
        <form onSubmit={handleSave} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="dn">
              Display name
            </label>
            <input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="dc">
              Discord handle
            </label>
            <input id="dc" value={discord} onChange={(e) => setDiscord(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="co">
              Country
            </label>
            <input id="co" value={country} onChange={(e) => setCountry(e.target.value)} className="field" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
        {notice && <p className="mt-4 text-sm text-brand-200">{notice}</p>}
      </section>

      <section className="card p-6">
        <h2 className="h2">MLBB account</h2>
        <p className="muted mt-2">
          {profile.mlbb_verified
            ? 'Your profile refreshes itself on sign-in. Re-link only if you changed account or the sync stopped working.'
            : 'Link your account to register a squad for any bracket.'}
        </p>

        {relink || !profile.mlbb_verified ? (
          <div className="mt-5">
            <MlbbVerify onVerified={handleRelinked} submitLabel="Link this account" />
          </div>
        ) : (
          <button type="button" onClick={() => setRelink(true)} className="btn-ghost mt-5">
            Re-link my account
          </button>
        )}
      </section>
    </div>
  )
}
