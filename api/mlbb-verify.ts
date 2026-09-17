import type { VercelRequest, VercelResponse } from '@vercel/node'

// Rone Arena API — https://arena.rone.dev/api/redoc
const ARENA_BASE = 'https://arena.rone.dev/api'

/**
 * Step 2 of MLBB account verification: redeem the 4-digit code the player got
 * in-game for a JWT (POST /api/user/auth/login, no auth required), then use
 * that JWT to pull their full Arena profile from GET /api/user/info
 * (avatar, name, level, rank_level, history_rank_level).
 * POST body: { roleId, zoneId, code }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' })
    return
  }

  const { roleId, zoneId, code } = (req.body ?? {}) as {
    roleId?: string | number
    zoneId?: string | number
    code?: string | number
  }
  const role_id = Number(roleId)
  const zone_id = Number(zoneId)
  const vc = Number(code)

  if (!Number.isInteger(role_id) || !Number.isInteger(zone_id) || !Number.isInteger(vc)) {
    res.status(400).json({ success: false, error: 'roleId, zoneId and code must be numeric.' })
    return
  }

  try {
    const loginRes = await fetch(`${ARENA_BASE}/user/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_id, zone_id, vc }),
    })
    const loginData = await loginRes.json().catch(() => null)

    if (!loginRes.ok || !loginData || loginData.code !== 0) {
      res.status(400).json({
        success: false,
        error: loginData?.msg || 'That code is wrong or expired. Request a new one.',
      })
      return
    }

    const jwt: string | undefined = loginData.data?.jwt
    if (!jwt) {
      res.status(502).json({ success: false, error: 'Verification succeeded but no session was returned.' })
      return
    }

    const infoRes = await fetch(`${ARENA_BASE}/user/info?lang=en`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    const infoData = await infoRes.json().catch(() => null)

    if (!infoRes.ok || !infoData || infoData.code !== 0) {
      res.status(502).json({ success: false, error: 'Verified, but could not load the profile.' })
      return
    }

    const p = infoData.data
    res.status(200).json({
      success: true,
      token: jwt,
      profile: {
        avatar: p.avatar,
        name: p.name,
        level: p.level,
        rankLevel: p.rank_level,
        historyRankLevel: p.history_rank_level,
        regCountry: p.reg_country,
        roleId: p.roleId ?? role_id,
        zoneId: p.zoneId ?? zone_id,
      },
    })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to reach the verification service.' })
  }
}
