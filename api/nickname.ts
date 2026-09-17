import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Resolves a Mobile Legends in-game name from a numeric ID + server (zone).
 * Usage: /api/nickname?id=1114917746&zone=13486
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, zone } = req.query

  if (!id || !zone || Array.isArray(id) || Array.isArray(zone)) {
    res.status(400).json({
      success: false,
      error: 'Both "id" and "zone" query parameters are required.',
    })
    return
  }

  try {
    const url = `https://api.isan.eu.org/nickname/ml?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`
    const response = await fetch(url)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json(data)
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nickname from upstream API.',
    })
  }
}
