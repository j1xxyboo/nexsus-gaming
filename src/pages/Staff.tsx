import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { site } from '../data/site'
import SectionHeading from '../components/SectionHeading'
import { Empty } from '../components/States'

export default function Staff() {
  const { profile } = useAuth()
  const [position, setPosition] = useState<'admin' | 'moderator' | 'caster'>('moderator')
  const [discord, setDiscord] = useState('')
  const [timezone, setTimezone] = useState('')
  const [hours, setHours] = useState('')
  const [experience, setExperience] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.from('staff_applications').insert({
      profile_id: profile!.id,
      position,
      discord: discord.trim(),
      timezone: timezone.trim() || null,
      hours: hours.trim() || null,
      experience: experience.trim(),
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setNotice('Application in. Staff review these weekly and reply by Discord DM.')
  }

  if (!profile)
    return (
      <Empty title="Sign in to apply">
        Staff applications are tied to your account.{' '}
        <Link to="/auth" className="text-brand-300">
          Sign in
        </Link>{' '}
        to continue.
      </Empty>
    )

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading eyebrow="Join the team" title="Staff applications">
        Nexsus runs on volunteers. Tell us what you want to do and roughly when you are around — we do not
        expect full availability.
      </SectionHeading>

      <div className="card mb-6 divide-y divide-white/5">
        {site.roles
          .filter((r) => r.name !== 'Competitor' && r.name !== 'Founder')
          .map((r) => (
            <div key={r.name} className="p-5">
              <span className={r.color === 'crimson' ? 'chip-red' : r.color === 'white' ? 'chip-white' : 'chip-purple'}>
                {r.name}
              </span>
              <p className="muted mt-2">{r.desc}</p>
            </div>
          ))}
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="pos">
            Position
          </label>
          <select
            id="pos"
            value={position}
            onChange={(e) => setPosition(e.target.value as typeof position)}
            className="field"
          >
            <option value="moderator">Moderator</option>
            <option value="admin">Tournament admin</option>
            <option value="caster">Caster</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="dh">
              Discord handle
            </label>
            <input id="dh" required value={discord} onChange={(e) => setDiscord(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="tz">
              Timezone
            </label>
            <input
              id="tz"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="GMT+1"
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="hrs">
            When are you usually free?
          </label>
          <input
            id="hrs"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Weeknights after 19:00, weekends"
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="exp">
            Relevant experience
          </label>
          <textarea
            id="exp"
            required
            rows={5}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Servers you have moderated, brackets you have run, casts you have done…"
            className="field"
          />
        </div>

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Submitting…' : 'Submit application'}
        </button>

        {notice && <p className="text-sm text-brand-200">{notice}</p>}
        {error && <p className="text-sm text-crimson-400">{error}</p>}
      </form>
    </div>
  )
}
