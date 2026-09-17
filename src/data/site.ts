export const site = {
  name: 'Nexsus Gaming',
  tag: 'Nexsus',
  tagline: 'Compete. Climb. Belong.',
  blurb:
    'Nexsus Gaming is the tournament arm of the Nexsus Discord community. We run open brackets, scrim nights and seasonal cups — everything is organised in the server.',
  discordInvite: 'https://discord.gg/thenexus',
  discord: {
    members: 12480,
    online: 1937,
    boosts: 14,
  },
  socials: [
    { label: 'Discord', href: 'https://discord.gg/thenexus' },
    { label: 'X', href: 'https://x.com/nexsusgg' },
    { label: 'YouTube', href: 'https://youtube.com/@nexsusgg' },
    { label: 'TikTok', href: 'https://tiktok.com/@nexsusgg' },
  ],
  channels: [
    { name: 'announcements', purpose: 'Bracket drops, schedule changes, prize reveals.' },
    { name: 'find-a-team', purpose: 'Free agents and captains matching up before sign-ups close.' },
    { name: 'scrim-nights', purpose: 'Nightly practice lobbies hosted by staff.' },
    { name: 'match-results', purpose: 'Screenshot your result, staff verify it.' },
    { name: 'support-tickets', purpose: 'Disputes, no-shows and roster changes.' },
  ],
  roles: [
    { name: 'Founder', color: 'crimson' as const, desc: 'Runs Nexsus and signs off on every ruleset.' },
    { name: 'Tournament Admin', color: 'purple' as const, desc: 'Seeds brackets, verifies results, handles disputes.' },
    { name: 'Moderator', color: 'purple' as const, desc: 'Keeps the server clean and the lobbies on time.' },
    { name: 'Caster', color: 'white' as const, desc: 'Streams the finals and does the post-game breakdown.' },
    { name: 'Competitor', color: 'purple' as const, desc: 'Anyone signed to a squad for an active cup.' },
  ],
}

export type SiteConfig = typeof site
