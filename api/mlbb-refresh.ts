import type { VercelRequest, VercelResponse } from '@vercel/node'

// Rone Arena API — https://arena.rone.dev/api/redoc
const ARENA_BASE = 'https://arena.rone.dev/api'

/**
 * Called on every login: re-fetch the player's live Arena profile using the
 * JWT saved at registration — no new OTP needed. If the JWT has expired
 * upstream (they last ~1 day per the docs), the caller falls back to the
 * last saved snapshot and the player re-verifies to get a fresh one.
 * POST body: { token } (the saved JWT)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' })
    return
  }

  const { token } = (req.body ?? {}) as { token?: string }
  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, error: 'A session token is required.' })
    return
  }

  try {
    const infoRes = await fetch(`${ARENA_BASE}/user/info?lang=en`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const infoData = await infoRes.json().catch(() => null)

    if (!infoRes.ok || !infoData || infoData.code !== 0) {
      res.status(401).json({ success: false, error: 'Stored session expired, re-verification needed.' })
      return
    }

    const p = infoData.data
    res.status(200).json({
      success: true,
      profile: {
        avatar: p.avatar,
        name: p.name,
        level: p.level,
        rankLevel: p.rank_level,
        historyRankLevel: p.history_rank_level,
        regCountry: p.reg_country,
      },
    })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to reach the verification service.' })
  }
}
