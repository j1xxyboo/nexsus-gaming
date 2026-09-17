import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { MlbbProfile } from '../lib/mlbb'
import MlbbVerify from '../components/MlbbVerify'
import SectionHeading from '../components/SectionHeading'

type Verified = { token: string; profile: MlbbProfile; roleId: string; zoneId: string }

export default function Auth() {
  const navigate = useNavigate()
  const { session, reloadProfile } = useAuth()
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [discord, setDiscord] = useState('')
  const [verified, setVerified] = useState<Verified | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (session) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <p className="font-display text-2xl tracking-wide text-white">You are signed in</p>
        <p className="muted mt-2">Head to your profile or pick a bracket to enter.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/profile" className="btn-primary">
            My profile
          </Link>
          <Link to="/tournaments" className="btn-ghost">
            Tournaments
          </Link>
        </div>
      </div>
    )
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    navigate('/profile')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!verified) return
    setBusy(true)
    setError(null)

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ml_id: verified.roleId,
          ml_zone: verified.zoneId,
          ign: verified.profile.name ?? '',
          display_name: verified.profile.name ?? '',
          discord,
          country: verified.profile.regCountry ?? '',
        },
      },
    })

    if (err) {
      setBusy(false)
      setError(err.message)
      return
    }

    // With email confirmation on, there is no session yet — the Arena snapshot
    // is saved on the next sign-in from the profile page instead.
    if (data.session?.user) {
      await supabase
        .from('profiles')
        .update({
          avatar_url: verified.profile.avatar ?? null,
          level: verified.profile.level ?? null,
          rank_level: verified.profile.rankLevel ?? null,
          history_rank_level: verified.profile.historyRankLevel ?? null,
          mlbb_verified: true,
          mlbb_token: verified.token,
          mlbb_synced_at: new Date().toISOString(),
        })
        .eq('id', data.session.user.id)
      await reloadProfile()
      setBusy(false)
      navigate('/profile')
      return
    }

    setBusy(false)
    setMessage('Account created — confirm your email, then sign in to finish linking your MLBB profile.')
  }

  return (
    <div className="mx-auto max-w-xl">
      <SectionHeading eyebrow="Account" title={mode === 'signin' ? 'Sign in' : 'Create your account'}>
        {mode === 'signin'
          ? 'Your squad, registrations and verified MLBB profile live here.'
          : 'We verify your Mobile Legends account with a code sent to your in-game inbox — no password for the game is ever asked for.'}
      </SectionHeading>

      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1">
          {(['signin', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
                setMessage(null)
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === m ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        {mode === 'register' && !verified && (
          <>
            <p className="mb-4 text-sm font-semibold text-white">Step 1 — verify your MLBB account</p>
            <MlbbVerify onVerified={setVerified} submitLabel="Verify and continue" />
          </>
        )}

        {mode === 'register' && verified && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-brand-500/40 bg-brand-600/15 p-3">
              {verified.profile.avatar && (
                <img src={verified.profile.avatar} alt="" className="h-10 w-10 rounded-full" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{verified.profile.name}</p>
                <p className="text-xs text-brand-200">
                  Level {verified.profile.level ?? '—'} · ID {verified.roleId} ({verified.zoneId})
                </p>
              </div>
              <span className="chip-purple ml-auto shrink-0">Verified</span>
            </div>

            <p className="text-sm font-semibold text-white">Step 2 — your Nexsus login</p>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="discord">
                Discord handle
              </label>
              <input
                id="discord"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="yourname"
                className="field"
              />
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>
        )}

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="label" htmlFor="email-in">
                Email
              </label>
              <input
                id="email-in"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="password-in">
                Password
              </label>
              <input
                id="password-in"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm text-brand-200">{message}</p>}
        {error && <p className="mt-4 text-sm text-crimson-400">{error}</p>}
      </div>
    </div>
  )
}
