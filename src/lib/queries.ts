import { supabase } from './supabase'
import type { Match, Registration, Team, TeamMember, Tournament } from './types'

type CountRow = { count: number }

const withCount = (rows: (Tournament & { registrations?: CountRow[] })[]): Tournament[] =>
  rows.map(({ registrations, ...t }) => ({
    ...t,
    registration_count: registrations?.[0]?.count ?? 0,
  }))

export async function fetchTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, registrations(count)')
    .neq('status', 'draft')
    .order('starts_at', { ascending: true, nullsFirst: false })
  if (error) throw new Error(error.message)
  return withCount((data ?? []) as never)
}

export async function fetchFeaturedTournaments(limit = 3) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, registrations(count)')
    .in('status', ['ongoing', 'registration_open'])
    .order('starts_at', { ascending: true, nullsFirst: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return withCount((data ?? []) as never)
}

export async function fetchTournamentBySlug(slug: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, registrations(count)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return withCount([data as never])[0]
}

export async function fetchRegistrations(tournamentId: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, team:teams(id, name, tag, logo_url)')
    .eq('tournament_id', tournamentId)
    .order('seed', { ascending: true, nullsFirst: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Registration[]
}

export async function fetchMatches(tournamentId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('round', { ascending: true })
    .order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as Match[]
}

export async function fetchTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*, team_members(count)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => {
    const { team_members, ...team } = row as Team & { team_members?: CountRow[] }
    return { ...team, member_count: team_members?.[0]?.count ?? 0 }
  })
}

export async function fetchMyTeam(profileId: string) {
  const { data: membership, error: memberError } = await supabase
    .from('team_members')
    .select('team_id, role')
    .eq('profile_id', profileId)
    .maybeSingle()
  if (memberError) throw new Error(memberError.message)
  if (!membership) return null

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', membership.team_id)
    .maybeSingle()
  if (teamError) throw new Error(teamError.message)
  if (!team) return null

  const { data: roster, error: rosterError } = await supabase
    .from('team_members')
    .select('*, profile:public_profiles(ign, display_name, avatar_url, ml_id, level)')
    .eq('team_id', membership.team_id)
    .order('joined_at', { ascending: true })
  if (rosterError) throw new Error(rosterError.message)

  return { team: team as Team, roster: (roster ?? []) as TeamMember[], myRole: membership.role }
}

export async function registerTeam(tournamentId: string, teamId: string) {
  const { error } = await supabase
    .from('registrations')
    .insert({ tournament_id: tournamentId, team_id: teamId })
  if (error) throw new Error(error.message)
}
