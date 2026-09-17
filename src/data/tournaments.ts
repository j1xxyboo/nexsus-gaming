export type TournamentStatus = 'open' | 'live' | 'upcoming' | 'finished'

export type Tournament = {
  slug: string
  name: string
  game: string
  mode: string
  status: TournamentStatus
  prize: string
  entry: string
  slots: number
  registered: number
  region: string
  startsAt: string
  format: string
  summary: string
  rules: string[]
  schedule: { round: string; when: string }[]
  channel: string
}

export const tournaments: Tournament[] = [
  {
    slug: 'nexsus-open-cup-7',
    name: 'Nexsus Open Cup #7',
    game: 'Mobile Legends: Bang Bang',
    mode: '5v5',
    status: 'open',
    prize: '60,000 DZD',
    entry: 'Free',
    slots: 32,
    registered: 24,
    region: 'MENA',
    startsAt: '2026-10-03T18:00:00Z',
    format: 'Single elimination, Bo3 — Bo5 grand final',
    summary:
      'Our flagship monthly open bracket. Any five players with a Nexsus server account can enter, no rank requirement.',
    rules: [
      'Five players per roster plus up to two substitutes.',
      'Captains must be in the voice lobby ten minutes before the scheduled match.',
      'A no-show of fifteen minutes is a forfeit of the map.',
      'Result screenshots go in the match-results channel within ten minutes.',
      'Smurfing, account sharing and stream sniping are permanent bans.',
    ],
    schedule: [
      { round: 'Sign-ups close', when: 'Oct 1, 22:00' },
      { round: 'Round of 32', when: 'Oct 3, 18:00' },
      { round: 'Quarter-finals', when: 'Oct 4, 18:00' },
      { round: 'Semi-finals', when: 'Oct 4, 20:30' },
      { round: 'Grand final (cast)', when: 'Oct 5, 20:00' },
    ],
    channel: 'open-cup',
  },
  {
    slug: 'purple-reign-invitational',
    name: 'Purple Reign Invitational',
    game: 'Valorant',
    mode: '5v5',
    status: 'live',
    prize: '120,000 DZD',
    entry: 'Invite only',
    slots: 8,
    registered: 8,
    region: 'EU / MENA',
    startsAt: '2026-09-16T17:00:00Z',
    format: 'Double elimination, Bo3',
    summary:
      'Eight invited squads, two days, one trophy. Every series is cast on the Nexsus stream with a staff observer in the lobby.',
    rules: [
      'Invited rosters are locked once the bracket is published.',
      'Map veto is run by a tournament admin in the series channel.',
      'One tactical pause of five minutes per team per map.',
      'Any dispute is settled by the admin on duty — decisions are final.',
    ],
    schedule: [
      { round: 'Upper quarter-finals', when: 'Sep 16, 17:00' },
      { round: 'Upper semi-finals', when: 'Sep 16, 20:00' },
      { round: 'Lower bracket', when: 'Sep 17, 17:00' },
      { round: 'Grand final (cast)', when: 'Sep 17, 21:00' },
    ],
    channel: 'purple-reign',
  },
  {
    slug: 'red-line-solo-series',
    name: 'Red Line Solo Series',
    game: 'Rocket League',
    mode: '1v1',
    status: 'open',
    prize: '25,000 DZD',
    entry: 'Free',
    slots: 64,
    registered: 41,
    region: 'Open',
    startsAt: '2026-09-27T19:00:00Z',
    format: 'Swiss into top-8 single elimination',
    summary:
      'A solo ladder for players without a squad. Five Swiss rounds on the night, top eight carry through to the knockout.',
    rules: [
      'One account per player, verified against your server profile.',
      'Swiss pairings are posted in the tournament channel each round.',
      'You have five minutes to join your lobby after pairings drop.',
      'Ties in Swiss are broken by game difference, then head-to-head.',
    ],
    schedule: [
      { round: 'Check-in', when: 'Sep 27, 18:30' },
      { round: 'Swiss rounds 1-5', when: 'Sep 27, 19:00' },
      { round: 'Top 8 knockout', when: 'Sep 28, 19:00' },
    ],
    channel: 'red-line',
  },
  {
    slug: 'nexsus-winter-clash',
    name: 'Nexsus Winter Clash',
    game: 'Mobile Legends: Bang Bang',
    mode: '5v5',
    status: 'upcoming',
    prize: '200,000 DZD',
    entry: 'Qualifier',
    slots: 16,
    registered: 0,
    region: 'MENA',
    startsAt: '2026-12-12T17:00:00Z',
    format: 'Group stage into double elimination',
    summary:
      'The season finale. Sixteen squads qualify through the monthly open cups, then fight through groups over two weekends.',
    rules: [
      'Qualification comes from top-four finishes in Open Cups #5 to #8.',
      'Rosters lock one week before the group stage.',
      'Groups are four squads, round robin, Bo3.',
      'Top two from each group advance to the double-elimination stage.',
    ],
    schedule: [
      { round: 'Roster lock', when: 'Dec 5, 22:00' },
      { round: 'Group stage', when: 'Dec 12-13' },
      { round: 'Playoffs', when: 'Dec 19' },
      { round: 'Grand final (cast)', when: 'Dec 20, 20:00' },
    ],
    channel: 'winter-clash',
  },
  {
    slug: 'nexsus-open-cup-6',
    name: 'Nexsus Open Cup #6',
    game: 'Mobile Legends: Bang Bang',
    mode: '5v5',
    status: 'finished',
    prize: '60,000 DZD',
    entry: 'Free',
    slots: 32,
    registered: 32,
    region: 'MENA',
    startsAt: '2026-08-29T18:00:00Z',
    format: 'Single elimination, Bo3 — Bo5 grand final',
    summary:
      'Won 3-1 by Violet Vanguard over Crimson Circuit in front of 4,100 concurrent viewers on the Nexsus stream.',
    rules: [
      'Archived ruleset — see the current Open Cup for the live version.',
    ],
    schedule: [{ round: 'Grand final', when: 'Aug 31, 20:00' }],
    channel: 'archive',
  },
]

export const statusMeta: Record<TournamentStatus, { label: string; tone: 'purple' | 'red' | 'white' | 'muted' }> = {
  open: { label: 'Sign-ups open', tone: 'purple' },
  live: { label: 'Live now', tone: 'red' },
  upcoming: { label: 'Announced', tone: 'white' },
  finished: { label: 'Finished', tone: 'muted' },
}

export const findTournament = (slug?: string) => tournaments.find((t) => t.slug === slug)
