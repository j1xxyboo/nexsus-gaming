export type Team = {
  tag: string
  name: string
  game: string
  captain: string
  members: number
  recruiting: boolean
  looking: string
  bio: string
}

export const teams: Team[] = [
  {
    tag: 'VVG',
    name: 'Violet Vanguard',
    game: 'Mobile Legends: Bang Bang',
    captain: 'zeryn',
    members: 6,
    recruiting: false,
    looking: '—',
    bio: 'Open Cup #6 champions. Scrims four nights a week and streams their reviews in the server.',
  },
  {
    tag: 'CRC',
    name: 'Crimson Circuit',
    game: 'Mobile Legends: Bang Bang',
    captain: 'nadirr',
    members: 5,
    recruiting: true,
    looking: 'Substitute jungler',
    bio: 'Runners-up last cup, rebuilding the bench before Winter Clash qualifiers.',
  },
  {
    tag: 'NXB',
    name: 'Nexsus Blackout',
    game: 'Valorant',
    captain: 'saph',
    members: 7,
    recruiting: true,
    looking: 'Controller main, Immortal+',
    bio: 'Invitational regulars. Structured VOD reviews after every series.',
  },
  {
    tag: 'ORB',
    name: 'Orbit Collective',
    game: 'Valorant',
    captain: 'mehdi.k',
    members: 5,
    recruiting: false,
    looking: '—',
    bio: 'A mixed-region roster that plays exclusively in the late slots.',
  },
  {
    tag: 'SLC',
    name: 'Solace',
    game: 'Rocket League',
    captain: 'tayeb',
    members: 3,
    recruiting: true,
    looking: 'Third for 3v3, Diamond+',
    bio: 'Casual-serious trio chasing a first top-eight finish in the Solo Series team bracket.',
  },
  {
    tag: 'RGT',
    name: 'Rogue Static',
    game: 'Rocket League',
    captain: 'ilyes',
    members: 4,
    recruiting: true,
    looking: 'Anyone for scrim nights',
    bio: 'Built entirely out of the find-a-team channel in three weeks.',
  },
]
