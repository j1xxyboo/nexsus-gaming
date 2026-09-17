// Client-side wrappers around the serverless MLBB endpoints in /api.
// The Arena flow is: send-code -> player reads a 4-digit code in their in-game
// inbox -> verify -> we store the returned JWT and refresh the profile on login.

export type MlbbProfile = {
  avatar?: string
  name?: string
  level?: number
  rankLevel?: number
  historyRankLevel?: number
  regCountry?: string
  roleId?: number
  zoneId?: number
}

type SendCodeResult = { success: boolean; error?: string }
type VerifyResult = { success: boolean; error?: string; token?: string; profile?: MlbbProfile }
type RefreshResult = { success: boolean; error?: string; profile?: MlbbProfile }

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json().catch(() => ({ success: false, error: 'Unexpected response.' }))) as T
}

/** Ask Arena to mail a 4-digit code to the player's in-game inbox. */
export const sendMlbbCode = (roleId: string, zoneId: string) =>
  post<SendCodeResult>('/api/mlbb-send-code', { roleId, zoneId })

/** Redeem the code for a JWT and the player's Arena profile. */
export const verifyMlbbCode = (roleId: string, zoneId: string, code: string) =>
  post<VerifyResult>('/api/mlbb-verify', { roleId, zoneId, code })

/** Re-pull a live profile with a stored JWT. Returns 401 once it expires. */
export const refreshMlbbProfile = (token: string) =>
  post<RefreshResult>('/api/mlbb-refresh', { token })

/** Resolve an in-game name from a numeric ID + server, no code needed. */
export async function lookupNickname(id: string, zone: string) {
  const res = await fetch(`/api/nickname?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`)
  return (await res.json().catch(() => null)) as { success?: boolean; name?: string } | null
}

/** MLBB ranks are returned as an integer tier index by Arena. */
export const rankName = (rank?: number | null) => {
  if (rank == null) return 'Unranked'
  const tiers = ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory']
  return tiers[Math.min(Math.max(rank - 1, 0), tiers.length - 1)] ?? 'Unranked'
}
