import type { VercelRequest, VercelResponse } from '@vercel/node'

// Rone Arena API — https://arena.rone.dev/api/redoc
const ARENA_BASE = 'https://arena.rone.dev/api'

/**
 * Step 1 of MLBB account verification: ask Arena to mail a 4-digit code to the
 * player's in-game inbox for the given role (player) ID + zone (server) ID.
 * No auth required for this endpoint.
 * POST body: { roleId, zoneId }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' })
    return
  }

  const { roleId, zoneId } = (req.body ?? {}) as { roleId?: string | number; zoneId?: string | number }
  const role_id = Number(roleId)
  const zone_id = Number(zoneId)

  if (!Number.isInteger(role_id) || !Number.isInteger(zone_id)) {
    res.status(400).json({ success: false, error: 'roleId and zoneId must be numeric.' })
    return
  }

  try {
    const upstream = await fetch(`${ARENA_BASE}/user/auth/send-vc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id, zone_id }),
    })
    const data = await upstream.json().catch(() => null)

    if (!upstream.ok || !data || data.code !== 0) {
      res.status(400).json({
        success: false,
        error: data?.msg || 'Could not send the verification code. Check the ID and server.',
      })
      return
    }

    res.status(200).json({ success: true })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to reach the verification service.' })
  }
}
