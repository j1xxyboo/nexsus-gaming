# Nexsus Gaming

Tournament hub and community site for the **Nexsus** Discord community.
Mobile Legends: Bang Bang only. Purple / white / red theme, Discord-style layout.

## What is here

| Area | Notes |
| --- | --- |
| Tournaments | Listing, filters, detail page with ruleset, registered squads and bracket fixtures |
| Squads | Public directory, create-a-squad, invite codes, roster management |
| Accounts | Email + password sign-in, with MLBB account verification by in-game code |
| Staff | Volunteer applications (moderator / tournament admin / caster) |
| Community | Channel guide, roles and house rules |

There is no leaderboard, no site-wide ranking and no news section. Match scores
are stored per series for the bracket only — nothing aggregates into a ladder.

## Stack

Vite + React 18 + TypeScript, Tailwind CSS, React Router, Supabase (Postgres +
Auth + Storage), and four serverless functions in `api/` for the MLBB checks.
Deploys to Vercel as-is (`vercel.json` handles SPA rewrites).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Then apply the schema — either paste both files into the Supabase SQL editor in
order, or run:

```bash
supabase db push
```

- `supabase/migrations/0001_init.sql` — profiles, squads, rosters, tournaments,
  registrations, bracket matches, staff applications, RLS policies, the `logos`
  storage bucket.
- `supabase/migrations/0002_mlbb_arena_profile.sql` — verified MLBB columns
  (avatar, level, in-game rank) plus the stored Arena session token. The token
  is a credential, so this migration narrows `profiles` reads to the owner and
  exposes a `public_profiles` view for everything public-facing.

To make yourself an admin, after signing up once:

```sql
update public.profiles set role = 'admin' where id = '<your-auth-uid>';
```

## MLBB account verification

Players prove they own an account without ever giving a game password. The flow
lives in `src/components/MlbbVerify.tsx` and calls these endpoints:

| Endpoint | Purpose |
| --- | --- |
| `POST /api/mlbb-send-code` | Sends a 4-digit code to the player's in-game inbox |
| `POST /api/mlbb-verify` | Redeems the code for a session, returns their profile |
| `POST /api/mlbb-refresh` | Re-pulls a live profile with the stored session |
| `GET /api/nickname?id=&zone=` | Resolves an in-game name from ID + server |

The first three use the [Rone Arena API](https://arena.rone.dev/api/redoc); the
fourth uses `api.isan.eu.org`. Both are third-party and unofficial — they can
change or go down without notice. Stored sessions expire after about a day, so
`src/lib/auth.tsx` refreshes silently on sign-in and falls back to the last
saved snapshot rather than forcing a new code.

Neither service needs a key, so there are no MLBB secrets in `.env`. Keep it
that way: `.env.local` is gitignored and must stay uncommitted.

## Layout

```
api/                 serverless MLBB endpoints
src/components/      layout shell, sidebar, cards, verification widget
src/data/site.ts     community copy: invite link, channels, roles
src/lib/             Supabase client, types, queries, auth context, MLBB client
src/pages/           one file per route
supabase/migrations/ schema
```

Branding and community copy live in `src/data/site.ts`; the palette is in
`tailwind.config.js` (`brand` purple, `crimson` red, `ink` dark chrome).
