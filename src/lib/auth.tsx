import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { refreshMlbbProfile } from './mlbb'
import type { Profile } from './types'

type AuthValue = {
  session: Session | null
  profile: Profile | null
  loading: boolean
  isStaff: boolean
  isAdmin: boolean
  reloadProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (!data) return null
    setProfile(data as Profile)
    return data as Profile
  }, [])

  // Silent MLBB refresh: reuse the stored Arena JWT, fall back to the last
  // snapshot when it has expired rather than forcing a new in-game code.
  const syncMlbb = useCallback(async (p: Profile & { mlbb_token?: string | null }) => {
    if (!p.mlbb_token) return
    const res = await refreshMlbbProfile(p.mlbb_token)
    if (!res.success || !res.profile) return
    const patch = {
      ign: res.profile.name ?? p.ign,
      avatar_url: res.profile.avatar ?? p.avatar_url,
      level: res.profile.level ?? p.level,
      rank_level: res.profile.rankLevel ?? p.rank_level,
      history_rank_level: res.profile.historyRankLevel ?? p.history_rank_level,
      mlbb_synced_at: new Date().toISOString(),
    }
    await supabase.from('profiles').update(patch).eq('id', p.id)
    setProfile({ ...p, ...patch })
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        const p = await loadProfile(data.session.user.id)
        if (p) void syncMlbb(p)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      if (next?.user) void loadProfile(next.user.id)
      else setProfile(null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile, syncMlbb])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      profile,
      loading,
      isStaff: !!profile && ['admin', 'moderator', 'caster'].includes(profile.role),
      isAdmin: profile?.role === 'admin',
      reloadProfile: async () => {
        if (session?.user) await loadProfile(session.user.id)
      },
      signOut: async () => {
        await supabase.auth.signOut()
        setProfile(null)
      },
    }),
    [session, profile, loading, loadProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
