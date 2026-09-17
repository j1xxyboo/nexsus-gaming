import { useState } from 'react'
import { sendMlbbCode, verifyMlbbCode, type MlbbProfile } from '../lib/mlbb'

type Props = {
  onVerified: (result: { token: string; profile: MlbbProfile; roleId: string; zoneId: string }) => void
  submitLabel?: string
}

/**
 * Two-step MLBB account check: request a code to the player's in-game inbox,
 * then redeem it for an Arena session and profile snapshot.
 */
export default function MlbbVerify({ onVerified, submitLabel = 'Verify account' }: Props) {
  const [roleId, setRoleId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend() {
    setBusy(true)
    setError(null)
    const res = await sendMlbbCode(roleId.trim(), zoneId.trim())
    setBusy(false)
    if (!res.success) {
      setError(res.error ?? 'Could not send the code.')
      return
    }
    setSent(true)
  }

  async function handleVerify() {
    setBusy(true)
    setError(null)
    const res = await verifyMlbbCode(roleId.trim(), zoneId.trim(), code.trim())
    setBusy(false)
    if (!res.success || !res.token || !res.profile) {
      setError(res.error ?? 'That code did not work.')
      return
    }
    onVerified({ token: res.token, profile: res.profile, roleId: roleId.trim(), zoneId: zoneId.trim() })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="roleId">
            Player ID
          </label>
          <input
            id="roleId"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            inputMode="numeric"
            placeholder="1114917746"
            className="field"
            disabled={sent}
          />
        </div>
        <div>
          <label className="label" htmlFor="zoneId">
            Server (zone)
          </label>
          <input
            id="zoneId"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            inputMode="numeric"
            placeholder="13486"
            className="field"
            disabled={sent}
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Both numbers are in the game: tap your avatar, then the ID under your name — it reads as
        ID(server).
      </p>

      {!sent ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={busy || !roleId.trim() || !zoneId.trim()}
          className="btn-primary w-full disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Send me the code'}
        </button>
      ) : (
        <>
          <div>
            <label className="label" htmlFor="code">
              4-digit code from your in-game mail
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              className="field tracking-[0.5em]"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={busy || code.trim().length < 4}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {busy ? 'Checking…' : submitLabel}
            </button>
            <button type="button" onClick={() => setSent(false)} className="btn-ghost">
              Change ID
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-crimson-400">{error}</p>}
    </div>
  )
}
