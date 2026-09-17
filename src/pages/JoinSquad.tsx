import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import SectionHeading from '../components/SectionHeading'
import { Empty } from '../components/States'

export default function JoinSquad() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!profile)
    return (
      <Empty title="Sign in to join a squad">
        <Link to="/auth" className="text-brand-300">
          Sign in
        </Link>{' '}
        first, then enter the invite code your captain gave you.
      </Empty>
    )

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const { data: team } = await supabase
      .from('teams')
      .select('id, name, status')
      .eq('invite_code', code.trim().toLowerCase())
      .maybeSingle()

    if (!team) {
      setBusy(false)
      setError('No squad has that invite code.')
      return
    }
    if (team.status === 'banned') {
      setBusy(false)
      setError('That squad is banned from Nexsus events.')
      return
    }

    const { error: err } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, profile_id: profile!.id, role: 'player' })

    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    navigate('/squad')
  }

  return (
    <div className="mx-auto max-w-xl">
      <SectionHeading eyebrow="Your squad" title="Join a squad">
        Your captain can copy the invite code from their my-squad page. Looking for a team instead? Browse
        the{' '}
        <Link to="/teams" className="text-brand-300">
          squads that are recruiting
        </Link>{' '}
        and message them in the server.
      </SectionHeading>

      <form onSubmit={handleJoin} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="code">
            Invite code
          </label>
          <input
            id="code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="a1b2c3d4"
            className="field tracking-[0.3em]"
          />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Joining…' : 'Join squad'}
        </button>
        {error && <p className="text-sm text-crimson-400">{error}</p>}
      </form>
    </div>
  )
}
