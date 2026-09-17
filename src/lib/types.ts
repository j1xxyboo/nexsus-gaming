export type ProfileRole = 'player' | 'caster' | 'moderator' | 'admin'

export type Profile = {
  id: string
  ml_id: string | null
  ml_zone: string | null
  ign: string | null
  display_name: string | null
  discord: string | null
  country: string | null
  role: ProfileRole
  banned: boolean
  ban_reason: string | null
  avatar_url: string | null
  level: number | null
  rank_level: number | null
  history_rank_level: number | null
  mlbb_verified: boolean
  mlbb_synced_at: string | null
  created_at: string
}

export type TeamStatus = 'pending' | 'approved' | 'rejected' | 'banned'

export type Team = {
  id: string
  name: string
  tag: string
  logo_url: string | null
  bio: string | null
  recruiting: boolean
  looking_for: string | null
  leader_id: string
  status: TeamStatus
  review_note: string | null
  invite_code: string
  created_at: string
}

export type TeamMember = {
  id: string
  team_id: string
  profile_id: string
  role: 'leader' | 'player' | 'sub' | 'coach'
  joined_at: string
  profile?: Pick<Profile, 'ign' | 'display_name' | 'avatar_url' | 'ml_id' | 'level'>
}

export type TournamentStatus =
  | 'draft'
  | 'registration_open'
  | 'registration_closed'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type Tournament = {
  id: string
  title: string
  slug: string
  summary: string | null
  rules: string | null
  banner_url: string | null
  format: 'single_elim' | 'double_elim' | 'group_stage' | 'swiss'
  mode: string
  region: string | null
  prize_pool: string | null
  entry_fee: string | null
  max_teams: number
  discord_channel: string | null
  reg_opens_at: string | null
  reg_closes_at: string | null
  starts_at: string | null
  status: TournamentStatus
  created_at: string
  registration_count?: number
}

export type Registration = {
  id: string
  tournament_id: string
  team_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'banned' | 'withdrawn'
  seed: number | null
  notes: string | null
  created_at: string
  team?: Pick<Team, 'id' | 'name' | 'tag' | 'logo_url'>
}

export type Match = {
  id: string
  tournament_id: string
  bracket: 'main' | 'lower' | 'final'
  round: number
  position: number
  best_of: number
  team_a_id: string | null
  team_b_id: string | null
  score_a: number
  score_b: number
  winner_id: string | null
  scheduled_at: string | null
  stream_url: string | null
  status: 'scheduled' | 'live' | 'completed' | 'walkover'
}

export type StaffApplication = {
  id: string
  profile_id: string
  position: 'admin' | 'moderator' | 'caster'
  discord: string
  timezone: string | null
  experience: string
  hours: string | null
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
  created_at: string
}

export const statusMeta: Record<
  TournamentStatus,
  { label: string; tone: 'purple' | 'red' | 'white' | 'muted' }
> = {
  draft: { label: 'Draft', tone: 'muted' },
  registration_open: { label: 'Sign-ups open', tone: 'purple' },
  registration_closed: { label: 'Sign-ups closed', tone: 'white' },
  ongoing: { label: 'Live now', tone: 'red' },
  completed: { label: 'Finished', tone: 'muted' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
}

export const formatLabels: Record<Tournament['format'], string> = {
  single_elim: 'Single elimination',
  double_elim: 'Double elimination',
  group_stage: 'Group stage into playoffs',
  swiss: 'Swiss into knockout',
}
